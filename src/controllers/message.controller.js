import baileysService from '../services/whatsapp/baileys.service.js';
import groqService from '../services/ai/groq.service.js';
import apartmentModel from '../models/apartment.model.js';
import conversationModel from '../models/conversation.model.js';
import { config } from '../config/config.js';

class MessageController {
    /**
     * Procesa mensajes del grupo de apartamentos
     * Extrae información y la almacena en la base de datos
     */
    async handleGroupMessage(message) {
        try {
            const messageText = message.message?.conversation ||
                message.message?.extendedTextMessage?.text || '';

            if (!messageText) return;

            console.log('📨 Mensaje del grupo:', messageText);

            // Extraer información de apartamento usando IA
            const apartmentInfo = await groqService.extractApartmentInfo(messageText);

            if (apartmentInfo) {
                // Guardar apartamento en la base de datos
                await apartmentModel.addApartment(apartmentInfo);
                console.log('🏠 Nuevo apartamento detectado y guardado');
            }
        } catch (error) {
            console.error('Error procesando mensaje del grupo:', error);
        }
    }

    /**
     * Procesa mensajes directos de clientes
     * Genera respuestas automáticas usando IA
     */
    async handleClientMessage(message) {
        try {
            const from = message.key.remoteJid;
            const messageText = message.message?.conversation ||
                message.message?.extendedTextMessage?.text || '';

            if (!messageText) return;

            console.log(`💬 Cliente ${from}: ${messageText}`);

            // Obtener historial de conversación
            const history = conversationModel.getHistory(from);

            // Agregar mensaje del usuario al historial
            conversationModel.addMessage(from, 'user', messageText);

            // Obtener apartamentos disponibles
            const apartments = apartmentModel.getAvailableApartments();

            // Generar respuesta con IA
            const response = await groqService.generateResponse(
                messageText,
                apartments,
                history
            );

            // Agregar respuesta del asistente al historial
            conversationModel.addMessage(from, 'assistant', response);

            // Enviar respuesta al cliente
            await baileysService.sendMessage(from, response);

            console.log(`✅ Respuesta enviada a ${from}`);
        } catch (error) {
            console.error('Error procesando mensaje del cliente:', error);
        }
    }

    /**
     * Determina si un mensaje viene del grupo de apartamentos o de un cliente
     */
    async processIncomingMessage(message) {
        try {
            const from = message.key.remoteJid;
            const isGroup = from.endsWith('@g.us');

            if (isGroup && from === config.whatsapp.groupId) {
                // Mensaje del grupo de apartamentos
                await this.handleGroupMessage(message);
            } else if (!isGroup) {
                // Mensaje directo de un cliente
                await this.handleClientMessage(message);
            }
        } catch (error) {
            console.error('Error procesando mensaje:', error);
        }
    }
}

export default new MessageController();
