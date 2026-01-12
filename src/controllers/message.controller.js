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
            
            // Detectar si es respuesta de botón clickeable
            const buttonResponse = message.message?.buttonsResponseMessage?.selectedButtonId;
            
            const messageText = buttonResponse || 
                                message.message?.conversation ||
                                message.message?.extendedTextMessage?.text || '';
            const hasMedia = message.message?.imageMessage || message.message?.videoMessage;

            if (!messageText && !hasMedia) return;

            console.log(`💬 Cliente ${from}: ${messageText}`);
            if (buttonResponse) {
                console.log(`🔘 Botón presionado: ${buttonResponse}`);
            }

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

            // CASO ESPECIAL: Si está en estado de solicitud de media pendiente
            if (currentState === 'media_requested') {
                console.log('🔍 Cliente respondió después de solicitar media');
                
                // Detectar si el cliente confirma que esperará o quiere continuar
                const willWait = await groqService.detectWaitingAcknowledgment(messageText);
                
                if (willWait) {
                    console.log('⏸️  Cliente confirmó que esperará - Bot se pausa');
                    // Cliente dijo "ok", "te espero", etc - AHORA SÍ pausar
                    conversationStateModel.setState(from, 'waiting_media', {
                        propertyContext: stateData?.metadata?.propertyContext,
                        requestTime: new Date().toISOString()
                    });
                    
                    console.log(`⚠️  ESPERANDO MEDIA DEL HUMANO para ${from}`);
                    return; // Bot se detiene
                } else {
                    console.log('💬 Cliente quiere continuar conversación - Bot sigue activo');
                    // Cliente hizo otra pregunta - continuar conversación normal
                    conversationStateModel.resetToBot(from);
                    // Continuar con el flujo normal abajo
                }
            }

            // CASO 2: Verificar si el bot debe responder
            if (!conversationStateModel.shouldBotRespond(from)) {
                console.log(`⛔ Bot no debe responder a ${from} - Estado: ${currentState}`);
                return;
            }

            // Agregar mensaje del usuario al historial
            conversationModel.addMessage(from, 'user', messageText);

            // Incrementar contador de mensajes del usuario
            const messageCount = conversationModel.incrementMessageCount(from);
            console.log(`📊 Mensaje #${messageCount} de ${from}`);

            // PREGUNTA DE PREFERENCIA: Después del segundo mensaje, preguntar AI vs Humano
            if (messageCount === 2 && !conversationModel.hasAskedPreference(from)) {
                console.log(`❓ Preguntando preferencia AI vs Humano a ${from}`);
                
                const preferenceQuestion = '¡Genial! 😊 Antes de seguir, elige una opción:\n\n*1️⃣* = Seguir con IA 🤖\n*2️⃣* = Agente Humano 👤\n\n_Solo escribe 1 o 2_';
                
                conversationModel.addMessage(from, 'assistant', preferenceQuestion);
                await baileysService.sendMessage(from, preferenceQuestion);
                console.log(`✅ Opciones enviadas a ${from}`);
                
                conversationModel.setAskedPreference(from);
                return;
            }

            // DETECCIÓN: Cliente solicita atención humana (número, lista o texto)
            if (conversationModel.hasAskedPreference(from)) {
                const lowerText = messageText.toLowerCase().trim();
                
                // Detectar si escribió 2 para humano
                const isNumberHuman = lowerText === '2' || lowerText === '2️⃣';
                const isTextHuman = await groqService.detectHumanRequest(messageText);
                
                if (isNumberHuman || isTextHuman) {
                    console.log(`👤 Cliente ${from} solicitó atención humana`);
                    
                    conversationStateModel.setState(from, 'human_takeover');
                    
                    const humanResponse = '¡Perfecto! 😊 Un agente humano se pondrá en contacto contigo pronto. Visítanos en 80-20 Roosevelt Ave, piso 2, of. 202, Queens. Horario: Lun-Sáb 11am-8pm. ¡Gracias! 🙏';
                    
                    conversationModel.addMessage(from, 'assistant', humanResponse);
                    await baileysService.sendMessage(from, humanResponse);
                    console.log(`✅ Respuesta de humano enviada - Bot detenido para ${from}`);
                    return;
                }
                
                // Si escribió 1 para IA
                const isNumberAI = lowerText === '1' || lowerText === '1️⃣';
                const isTextAI = lowerText.includes('ia') || lowerText.includes('bot') || lowerText.includes('asistente');
                
                if (isNumberAI || isTextAI) {
                    console.log(`🤖 Cliente ${from} prefiere continuar con IA`);
                    const aiResponse = '¡Excelente! 😊 Seguimos juntos. ¿En qué más puedo ayudarte?';
                    conversationModel.addMessage(from, 'assistant', aiResponse);
                    await baileysService.sendMessage(from, aiResponse);
                    return;
                }
            }

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
                
                // NO pausar inmediatamente - marcar como "media_requested"
                conversationStateModel.setState(from, 'media_requested', {
                    propertyContext: lastMessages,
                    requestTime: new Date().toISOString()
                });
                
                const response = 'Claro! 📸 Déjame coordinar para tomarte fotos/video de esa propiedad y te las envío. 🏠';
                
                conversationModel.addMessage(from, 'assistant', response);
                await baileysService.sendMessage(from, response);
                
                console.log(`📸 Respuesta de media enviada a ${from}`);
                console.log(`📌 Propiedad solicitada: ${lastMessages}`);
                console.log(`⏳ Esperando respuesta del cliente (si dice ok/espero, bot se pausa)`);
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
