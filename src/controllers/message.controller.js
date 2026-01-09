import baileysService from '../services/whatsapp/baileys.service.js';
import groqService from '../services/ai/groq.service.js';
import apartmentModel from '../models/apartment.model.js';
import conversationModel from '../models/conversation.model.js';
import conversationStateModel from '../models/conversation-state.model.js';
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
     * Genera respuestas automáticas usando IA con detección inteligente
     */
    async handleClientMessage(message) {
        try {
            const from = message.key.remoteJid;
            const messageText = message.message?.conversation ||
                message.message?.extendedTextMessage?.text || '';
            const hasMedia = message.message?.imageMessage || message.message?.videoMessage;

            if (!messageText && !hasMedia) return;

            console.log(`💬 Cliente ${from}: ${messageText}`);

            // Obtener estado actual de la conversación
            const currentState = conversationStateModel.getState(from);
            const stateData = conversationStateModel.cache.get(from);

            // CASO 1: Si está esperando que el humano envíe media
            if (currentState === 'waiting_media') {
                // Si el mensaje viene del humano (admin) con media
                if (hasMedia) {
                    console.log('📸 Humano envió media al cliente');
                    // El mensaje ya fue enviado por el humano, no hacemos nada
                    // Resetear estado para que bot pueda responder después
                    conversationStateModel.resetToBot(from);
                    return;
                }
                
                // Si el cliente responde mientras esperamos media
                if (messageText) {
                    console.log('🔄 Cliente respondió mientras esperaba media');
                    
                    // Obtener historial
                    const history = conversationModel.getHistory(from);
                    conversationModel.addMessage(from, 'user', messageText);
                    
                    // Obtener contexto de la propiedad que se mostró
                    const propertyContext = stateData?.metadata?.propertyContext || 'la propiedad mostrada';
                    
                    // Generar respuesta de cierre de ventas
                    const response = await groqService.generateClosingResponse(
                        messageText,
                        propertyContext,
                        history
                    );
                    
                    conversationModel.addMessage(from, 'assistant', response);
                    await baileysService.sendMessage(from, response);
                    
                    console.log(`✅ Respuesta de cierre enviada a ${from}`);
                    return;
                }
            }

            // CASO 2: Verificar si el bot debe responder
            if (!conversationStateModel.shouldBotRespond(from)) {
                console.log(`⛔ Bot no debe responder a ${from} - Estado: ${currentState}`);
                return;
            }

            // Agregar mensaje del usuario al historial
            conversationModel.addMessage(from, 'user', messageText);

            // DETECCIÓN 1: Cliente quiere OFRECER una propiedad
            const isPropertyOffer = await groqService.detectPropertyOffer(messageText);
            if (isPropertyOffer) {
                console.log('🏠 Cliente quiere ofrecer una propiedad');
                conversationStateModel.setState(from, 'property_offer');
                
                const response = '¡Excelente! 🏠 Nos interesa mucho. ¿Qué tipo de vivienda tienes disponible? (apartamento, studio, cuarto individual, basement, casa)';
                
                conversationModel.addMessage(from, 'assistant', response);
                await baileysService.sendMessage(from, response);
                
                console.log(`✅ Respuesta de oferta enviada a ${from}`);
                return;
            }

            // DETECCIÓN 2: Cliente solicita fotos/videos
            const isMediaRequest = await groqService.detectMediaRequest(messageText);
            if (isMediaRequest) {
                console.log('📸 Cliente solicita fotos/videos');
                
                // Obtener contexto de la propiedad que está preguntando
                const history = conversationModel.getHistory(from);
                const lastMessages = history.slice(-3).map(m => m.content).join(' ');
                
                conversationStateModel.setState(from, 'waiting_media', {
                    propertyContext: lastMessages,
                    requestTime: new Date().toISOString()
                });
                
                const response = 'Claro! 📸 Déjame coordinar para tomarte fotos/video de esa propiedad y te las envío. 🏠';
                
                conversationModel.addMessage(from, 'assistant', response);
                await baileysService.sendMessage(from, response);
                
                console.log(`⚠️  ESPERANDO MEDIA DEL HUMANO para ${from}`);
                console.log(`📌 Propiedad solicitada: ${lastMessages}`);
                return;
            }

            // CASO 3: Conversación normal - Bot responde
            const history = conversationModel.getHistory(from);
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
