import OpenAI from 'openai';
import { config } from '../../config/config.js';

class OpenAIService {
    constructor() {
        this.client = new OpenAI({
            apiKey: config.openai.apiKey,
        });

        // Sistema de prompt para el agente de IA
        this.systemPrompt = `Eres un asistente virtual profesional de bienes raíces especializado en apartamentos en renta en ${config.bot.location}.

TU COMPORTAMIENTO:
1. Saluda cordialmente al cliente cuando te escriba por primera vez
2. Informa que actualmente solo tienes apartamentos disponibles en Queens, New York
3. Pregunta cuántos cuartos (habitaciones) necesita el cliente
4. Basándote en la información de apartamentos disponibles, recomienda las mejores opciones
5. Proporciona detalles claros: precio, ubicación exacta en Queens, número de cuartos, y características
6. Sé amable, profesional y conciso
7. Si no tienes información sobre lo que pide, sé honesto y ofrece alternativas

RECUERDA:
- Solo apartamentos en Queens, New York
- Responde en español
- Sé conversacional pero profesional
- Enfócate en ayudar al cliente a encontrar el apartamento ideal`;
    }

    /**
     * Genera una respuesta usando OpenAI basada en el contexto
     */
    async generateResponse(userMessage, apartmentData = [], conversationHistory = []) {
        try {
            // Crear contexto con información de apartamentos disponibles
            let apartmentContext = '';
            if (apartmentData.length > 0) {
                apartmentContext = '\n\nAPARTAMENTOS DISPONIBLES:\n' +
                    apartmentData.map((apt, idx) =>
                        `${idx + 1}. ${apt.bedrooms || 'N/A'} cuartos - $${apt.price || 'N/A'} - ${apt.location || 'Queens, NY'} - ${apt.description || ''}`
                    ).join('\n');
            } else {
                apartmentContext = '\n\nAPARTAMENTOS DISPONIBLES: No hay apartamentos registrados aún en el sistema.';
            }

            // Construir mensajes para la conversación
            const messages = [
                { role: 'system', content: this.systemPrompt + apartmentContext },
                ...conversationHistory,
                { role: 'user', content: userMessage }
            ];

            const response = await this.client.chat.completions.create({
                model: config.openai.model,
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error generando respuesta con OpenAI:', error);
            return 'Lo siento, estoy teniendo problemas técnicos. Por favor, intenta nuevamente en un momento.';
        }
    }

    /**
     * Extrae información de apartamentos de mensajes del grupo
     */
    async extractApartmentInfo(messageText) {
        try {
            const extractionPrompt = `Extrae información de apartamentos del siguiente mensaje. 
Si el mensaje contiene información sobre un apartamento en renta, devuelve un JSON con:
- bedrooms (número de cuartos/habitaciones)
- price (precio mensual en dólares, solo el número)
- location (ubicación específica en Queens)
- description (descripción breve)

Si NO es información de apartamento, devuelve null.

Mensaje: "${messageText}"

Responde SOLO con el JSON o null, sin explicaciones adicionales.`;

            const response = await this.client.chat.completions.create({
                model: config.openai.model,
                messages: [
                    { role: 'system', content: 'Eres un extractor de datos especializado en bienes raíces.' },
                    { role: 'user', content: extractionPrompt }
                ],
                temperature: 0.3,
                max_tokens: 200,
            });

            const result = response.choices[0].message.content.trim();

            // Intentar parsear el JSON
            if (result === 'null' || result === null) {
                return null;
            }

            try {
                return JSON.parse(result);
            } catch {
                return null;
            }
        } catch (error) {
            console.error('Error extrayendo información:', error);
            return null;
        }
    }
}

export default new OpenAIService();
