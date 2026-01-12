import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import { EventEmitter } from 'events';
import fs from 'fs/promises';
import path from 'path';
import pino from 'pino';
import { config } from '../../config/config.js';

class BaileysService {
    constructor() {
        this.sock = null;
        this.ev = new EventEmitter();
        this.lastQr = null;
        this.reconnectTimeout = null;
    }

    async clearAuthInfo() {
        try {
            const authPath = path.resolve(config.paths.authInfo);
            await fs.rm(authPath, { recursive: true, force: true });
            await fs.mkdir(authPath, { recursive: true });
        } catch (error) {
            console.error('Error limpiando credenciales de WhatsApp:', error);
        }
    }

    /**
     * Inicializa la conexión de WhatsApp con Baileys
     * @param {Function} onQR - Callback cuando se genera un nuevo QR
     * @param {Function} onConnected - Callback cuando se conecta exitosamente
     */
    async connect(onQR = null, onConnected = null) {
        // Guardar callbacks
        this.onQR = onQR;
        this.onConnected = onConnected;

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        const { state, saveCreds } = await useMultiFileAuthState(config.paths.authInfo);
        const { version } = await fetchLatestBaileysVersion();

        // Logger silencioso para evitar spam en terminal
        const logger = pino({
            level: 'silent' // Oculta logs internos de Baileys
        });

        this.sock = makeWASocket({
            version,
            logger,
            printQRInTerminal: false,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger),
            },
            getMessage: async (key) => {
                return { conversation: '' };
            }
        });

        this.sock.ev.on('messages.upsert', (payload) => {
            this.ev.emit('messages.upsert', payload);
        });

        // Manejar eventos de conexión
        this.sock.ev.on('connection.update', async (update) => {
            try {
                this.ev.emit('connection.update', update);
                const { connection, lastDisconnect, qr } = update;

                // Mostrar QR code (si cambia, lo imprimimos de nuevo)
                if (qr && qr !== this.lastQr) {
                    console.log('\n📱 Nuevo código QR generado');
                    console.log('🌐 Abre el navegador para escanear el QR\n');
                    this.lastQr = qr;
                    
                    // Llamar callback con el QR
                    if (this.onQR) {
                        this.onQR(qr);
                    }
                }

                // Conexión exitosa
                if (connection === 'open') {
                    console.log('✅ Conectado a WhatsApp exitosamente!');
                    this.lastQr = null;

                    // Llamar callback de conexión exitosa
                    if (this.onConnected) {
                        this.onConnected(true);
                    }

                    if (this.reconnectTimeout) {
                        clearTimeout(this.reconnectTimeout);
                        this.reconnectTimeout = null;
                    }
                }

                // Manejar desconexión
                if (connection === 'close') {
                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    const isLoggedOut = statusCode === DisconnectReason.loggedOut;

                    if (isLoggedOut) {
                        console.log('⚠️  La sesión de WhatsApp se cerró. Se requiere escanear el QR nuevamente.');
                        await this.clearAuthInfo();
                        this.lastQr = null;

                        this.reconnectTimeout = setTimeout(() => this.connect(), 2000);
                        return;
                    }

                    console.log('❌ Conexión cerrada. Reconectando...', true);
                    this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
                }
            } catch (error) {
                console.error('Error manejando connection.update:', error);
            }
        });

        // Guardar credenciales cuando se actualicen
        this.sock.ev.on('creds.update', saveCreds);

        return this.sock;
    }

    /**
     * Obtiene el socket de WhatsApp
     */
    getSocket() {
        return this.sock;
    }

    /**
     * Envía un mensaje a un número o grupo
     */
    async sendMessage(jid, text) {
        try {
            await this.sock.sendMessage(jid, { text });
            return true;
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            return false;
        }
    }

    /**
     * Envía un mensaje con botones usando templateButtons (formato que funciona)
     * @param {string} jid - ID del destinatario
     * @param {string} text - Texto del mensaje
     * @param {Array} buttons - Array de botones [{index: 1, quickReplyButton: {displayText: 'texto', id: 'id'}}]
     * @param {string} footer - Texto del footer (opcional)
     */
    async sendButtonMessage(jid, text, buttons, footer = '') {
        try {
            // Formato templateButtons - el único que funciona actualmente
            const templateButtons = buttons.map((btn, idx) => ({
                index: idx + 1,
                quickReplyButton: {
                    displayText: btn.buttonText?.displayText || btn.displayText,
                    id: btn.buttonId || btn.id
                }
            }));

            const templateMessage = {
                text: text,
                footer: footer,
                templateButtons: templateButtons,
                viewOnce: true
            };
            
            await this.sock.sendMessage(jid, templateMessage);
            console.log('✅ Template buttons enviados correctamente');
            return true;
        } catch (error) {
            console.error('Error enviando template buttons:', error);
            // Fallback a mensaje de texto simple
            const fallbackText = `${text}\n\n${buttons.map((b, i) => `${i + 1}. ${b.buttonText?.displayText || b.displayText}`).join('\n')}\n\n${footer}`;
            await this.sendMessage(jid, fallbackText);
            return false;
        }
    }

    /**
     * Obtiene mensajes de un grupo específico desde el historial
     * Nota: Esta función captura mensajes en tiempo real, no historial antiguo
     * Para historial completo, se necesita implementar un store persistente
     */
    async getGroupMessages(groupId, limit = 100) {
        try {
            console.log(`📚 Intentando obtener historial del grupo...`);
            console.log(`⚠️  Nota: Baileys no permite leer historial antiguo sin store persistente`);
            console.log(`🔄 El bot procesará mensajes nuevos del grupo en tiempo real\n`);
            
            // Baileys no tiene acceso directo al historial de mensajes antiguos
            // Solo puede procesar mensajes nuevos que lleguen después de conectar
            // Para obtener historial completo se necesitaría:
            // 1. Implementar un store persistente (base de datos)
            // 2. O usar la API oficial de WhatsApp Business
            
            return [];
            
        } catch (error) {
            console.error('❌ Error:', error.message);
            return [];
        }
    }
}

export default new BaileysService();
