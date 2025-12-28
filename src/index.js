import baileysService from './services/whatsapp/baileys.service.js';
import messageController from './controllers/message.controller.js';
import apartmentModel from './models/apartment.model.js';
import sessionCleanup from './utils/cleanup-sessions.js';
import { config } from './config/config.js';

/**
 * Bot de WhatsApp para Bienes Raíces
 * - Monitorea grupo de apartamentos
 * - Extrae información automáticamente
 * - Responde a clientes con IA
 */
class WhatsAppBot {
    async start() {
        console.log('🚀 Iniciando Bot de Bienes Raíces...\n');

        // Verificar configuración
        if (!config.groq.apiKey) {
            console.error('❌ ERROR: GROQ_API_KEY no está configurada');
            console.log('Por favor, verifica que tu archivo .env tenga la API key de Groq');
            process.exit(1);
        }

        // BORRAR sesiones al iniciar (forzar QR cada vez)
        console.log('🧹 Limpiando sesiones anteriores...');
        await baileysService.clearAuthInfo();
        console.log('✅ Sesiones eliminadas. Preparando QR...\n');

        // Cargar apartamentos desde la base de datos
        await apartmentModel.loadApartments();

        // Iniciar limpieza automática de sesiones (Railway-friendly)
        sessionCleanup.startAutoCleanup();

        // Conectar a WhatsApp
        await baileysService.connect();

        // Escuchar mensajes entrantes (captura en tiempo real)
        baileysService.ev.on('messages.upsert', async ({ messages, type }) => {
            if (type !== 'notify') return;

            for (const message of messages) {
                // Ignorar mensajes propios
                if (message.key.fromMe) continue;

                // Procesar mensaje
                await messageController.processIncomingMessage(message);
            }
        });

        console.log('\n✅ Bot iniciado correctamente');
        console.log('📱 Esperando mensajes...');

        if (!config.whatsapp.groupId) {
            console.log('⚠️  IMPORTANTE: Configura el GROUP_ID en tu archivo .env');
            console.log('Para obtener el ID del grupo:');
            console.log('1. Envía un mensaje a cualquier grupo desde tu WhatsApp');
            console.log('2. El ID aparecerá en los logs del bot');
            console.log('3. Copia ese ID y agrégalo a la variable GROUP_ID en .env\n');
        }

        // Limpiar sesiones al cerrar el bot
        const cleanup = async () => {
            console.log('\n👋 Cerrando bot...');
            console.log('🧹 Limpiando sesiones de WhatsApp...');
            await baileysService.clearAuthInfo();
            console.log('✅ Sesiones eliminadas. Al reiniciar deberás escanear el QR nuevamente.');
            process.exit(0);
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
    }
}

// Iniciar el bot
const bot = new WhatsAppBot();
bot.start().catch(error => {
    console.error('Error iniciando el bot:', error);
    process.exit(1);
});
