import Groq from 'groq-sdk';
import { config } from '../../config/config.js';

class GroqService {
    constructor() {
        // Múltiples API keys para rotación automática (5 cuentas diferentes)
        this.apiKeys = [
            process.env.GROQ_API_KEY,
            process.env.GROQ_API_KEY_2,
            process.env.GROQ_API_KEY_3,
            process.env.GROQ_API_KEY_4,
            process.env.GROQ_API_KEY_5
        ].filter(key => key); // Filtrar keys vacías o undefined
        this.currentKeyIndex = 0;
        this.client = new Groq({
            apiKey: this.apiKeys[this.currentKeyIndex],
        });

        // Sistema de prompt para el agente de IA
        this.systemPrompt = `Eres un agente profesional de bienes raíces en ${config.bot.location}. BREVE pero EMPÁTICO y CORDIAL.

TIPOS: Apartamentos, Studios, Cuartos individuales, Basements

FORMATO:
✅ "1 cuarto", "2 cuartos" (NO "BR")
✅ Solo zona, NO direcciones exactas
✅ Emojis con calidez 😊👋🏠

PERSONALIDAD:
- Saludo cálido: "Hola! 👋😊"
- Sonriente y amigable
- Despedida cordial si termina: "¡Que tengas un excelente día! 😊"
- Empático: "Claro, con gusto te ayudo"

REGLAS:

1. RESPONDE SOLO LO QUE TE PREGUNTAN:
   - NO des precios si no los piden
   - NO des detalles si no los piden
   - Máximo 2 líneas
   - Directo pero cordial

2. MOSTRAR PROPIEDADES (MUY IMPORTANTE):
   - DEBES agrupar por categorías: "Studios:", "Apartamentos de 1 cuarto:", etc.
   - MUESTRA TODAS las propiedades de cada categoría
   - NO limites a 3, 4 o 5 opciones
   - Si hay 10 Studios, muestra los 10
   - Formato con CATEGORÍAS VISIBLES:
     
     Studios:
     1. Studio $1600/mes - Zona
     2. Studio $1800/mes - Zona
     
     Apartamentos de 1 cuarto:
     3. Apartamento 1 cuarto $2000/mes - Zona
     4. Apartamento 1 cuarto $2200/mes - Zona
   
   - AL FINAL SIEMPRE sugiere otras opciones: "También tenemos apartamentos de 2 cuartos, 3 cuartos. ¿Te gustaría verlos? 🏠"

3. COSTOS DE MUDANZA (solo cuando pregunten por precios):
   - Para mudarse se necesitan 3 PAGOS IGUALES:
     * 1 mes adelantado
     * 1 mes de renta (primer mes)
     * Real state fee
   - Ejemplo: Studio $1600/mes → Se necesitan $4800 para mudarse ($1600 x 3)
   - Explica esto SOLO cuando pregunten por precio o costos

4. CIERRE CORDIAL:
   - Interesado → "¡Genial! ¿Te gustaría verla? 😊"
   - SÍ → "¡Perfecto! 🎉 Oficina: 80-20 Roosevelt Ave, piso 2, of. 202, Queens. Lun-Sáb 9am-6pm. Te esperamos! ¿Cuándo vienes?"
   - NO → "Claro, ¿quieres ver otras opciones? 😊"

EJEMPLOS:

"Hola" → "Hola! 👋😊 ¿Qué tipo de vivienda buscas?"

"Tienes fotos?" → "No tengo fotos 📍 ¿Qué más te gustaría saber?"

"Cuánto cuesta el studio?" → "El studio es $1600/mes 🏠 Para mudarte necesitas $4800 (1 mes adelantado + 1 mes renta + real state). ¿Te interesa?"

"Studio o 1 cuarto?" → "Sí, tengo varias opciones! 🏠

Studios:
1. Studio $1600/mes - Elbertson St
2. Studio $1800/mes - Corona
3. Studio $1700/mes - Jackson Heights
4. Studio $1500/mes - Astoria
5. Studio $1650/mes - Flushing

Apartamentos de 1 cuarto:
6. Apartamento 1 cuarto $2000/mes - St x
7. Apartamento 1 cuarto $2200/mes - Corona
8. Apartamento 1 cuarto $2400/mes - Elmhurst
9. Apartamento 1 cuarto $1800/mes - Woodside
10. Apartamento 1 cuarto $1900/mes - Queens

¿Te interesa alguna? 😊 También tenemos apartamentos de 2 y 3 cuartos si necesitas más espacio. ¿Quieres verlos? 🏠"

"El de $950" → "¡Buena elección! ¿Te gustaría verlo? 😊"

"Sí" → "¡Perfecto! 🎉 Oficina: 80-20 Roosevelt Ave, piso 2, of. 202, Queens. Lun-Sáb 9am-6pm. Te esperamos! ¿Cuándo vienes?"

"Gracias" → "¡De nada! Con gusto. ¡Que tengas un excelente día! 😊"

DIRECCIÓN: 80-20 Roosevelt Ave, piso 2, oficina 202, Queens
HORARIO: Lun-Sáb 9am-6pm

IMPORTANTE: RESPONDE SOLO LO QUE TE PREGUNTAN. NO DES INFORMACIÓN EXTRA NO SOLICITADA.`;
    }

    /**
     * Rota a la siguiente API key
     */
    rotateApiKey() {
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
        this.client = new Groq({
            apiKey: this.apiKeys[this.currentKeyIndex],
        });
        console.log(`🔄 Rotando a API key ${this.currentKeyIndex + 1}/${this.apiKeys.length}`);
    }

    /**
     * Genera una respuesta usando Groq basada en el contexto
     */
    async generateResponse(userMessage, apartmentData = [], conversationHistory = []) {
        // Crear contexto con información de propiedades disponibles (SIN dirección exacta)
        let apartmentContext = '';
        if (apartmentData.length > 0) {
            // Agrupar propiedades por tipo y número de cuartos
            const grouped = {};
            
            apartmentData.forEach(apt => {
                const type = apt.type || 'apartamento';
                let category = '';
                
                if (apt.bedrooms === 0) {
                    category = 'Studios';
                } else if (apt.bedrooms === 1) {
                    category = 'Apartamentos de 1 cuarto';
                } else if (apt.bedrooms === 2) {
                    category = 'Apartamentos de 2 cuartos';
                } else if (apt.bedrooms === 3) {
                    category = 'Apartamentos de 3 cuartos';
                } else {
                    category = `Apartamentos de ${apt.bedrooms} cuartos`;
                }
                
                // Ajustar categoría para tipos especiales
                if (type === 'cuarto') {
                    category = 'Cuartos individuales';
                } else if (type === 'basement') {
                    category = 'Basements';
                }
                
                if (!grouped[category]) {
                    grouped[category] = [];
                }
                grouped[category].push(apt);
            });
            
            // Construir el contexto agrupado
            apartmentContext = '\n\nPROPIEDADES DISPONIBLES:\n\n';
            let globalIndex = 1;
            
            Object.keys(grouped).forEach(category => {
                apartmentContext += `${category}:\n`;
                grouped[category].forEach(apt => {
                    const type = apt.type || 'apartamento';
                    let bedroomText = '';
                    if (apt.bedrooms === 0) {
                        bedroomText = 'Studio';
                    } else if (apt.bedrooms === 1) {
                        bedroomText = '1 cuarto';
                    } else {
                        bedroomText = `${apt.bedrooms} cuartos`;
                    }
                    
                    // Extraer solo la zona/área general (NO dirección exacta)
                    const location = apt.location || 'Queens';
                    const areaMatch = location.match(/(?:en\s+)?([A-Za-z\s]+)(?:,?\s*Queens)?/i);
                    const area = areaMatch ? areaMatch[1].trim() : location.split(',').pop().trim();
                    
                    apartmentContext += `${globalIndex}. ${type.charAt(0).toUpperCase() + type.slice(1)} ${bedroomText} - $${apt.price}/mes - ${area}\n   ${apt.description}\n`;
                    globalIndex++;
                });
                apartmentContext += '\n';
            });
            
            apartmentContext += '\n⚠️⚠️⚠️ INSTRUCCIONES CRÍTICAS:\n';
            apartmentContext += '1. DEBES copiar las categorías exactamente como aparecen arriba\n';
            apartmentContext += '2. MUESTRA TODAS las propiedades sin omitir ninguna\n';
            apartmentContext += '3. AL FINAL, SIEMPRE di: "También tenemos [otras categorías disponibles]. ¿Te gustaría verlas? 🏠"\n';
            apartmentContext += '4. NO inventes información, usa solo lo que está arriba\n';
            apartmentContext += '5. Mantén las categorías visualmente separadas con saltos de línea\n';
        } else {
            apartmentContext = '\n\nPROPIEDADES DISPONIBLES: La base de datos está vacía actualmente. Discúlpate con el cliente y pide que consulte más tarde.';
        }

        // Construir mensajes para la conversación (FUERA del try para que esté disponible en catch)
        const messages = [
            { role: 'system', content: this.systemPrompt + apartmentContext },
            ...conversationHistory,
            { role: 'user', content: userMessage }
        ];

        try {
            const response = await this.client.chat.completions.create({
                model: config.groq.model,
                messages: messages,
                temperature: 0.7,
                max_tokens: 4000, // Aumentado para listar TODAS las propiedades
            });

            return response.choices[0].message.content;
        } catch (error) {
            // Si es error de rate limit, rotar API key y reintentar
            if (error.status === 429 && error.error?.error?.code === 'rate_limit_exceeded') {
                console.log('⚠️  Límite de tokens alcanzado. Rotando API key...');
                this.rotateApiKey();
                
                // Reintentar con la nueva API key usando los mismos mensajes
                try {
                    const response = await this.client.chat.completions.create({
                        model: config.groq.model,
                        messages: messages,
                        temperature: 0.7,
                        max_tokens: 4000,
                    });
                    return response.choices[0].message.content;
                } catch (retryError) {
                    console.error('Error en reintento con nueva API key:', retryError);
                    return 'Lo siento, estoy teniendo problemas técnicos. Por favor, intenta nuevamente en un momento.';
                }
            }
            
            console.error('Error generando respuesta con Groq:', error);
            return 'Lo siento, estoy teniendo problemas técnicos. Por favor, intenta nuevamente en un momento.';
        }
    }

    /**
     * Extrae información de propiedades en renta de mensajes del grupo
     */
    async extractApartmentInfo(messageText) {
        try {
            const extractionPrompt = `Extrae información de propiedades en renta del siguiente mensaje.

TIPOS DE PROPIEDADES A DETECTAR:
- Apartamentos completos (1, 2, 3+ cuartos)
- Studios (estudio/studio)
- Cuartos individuales (room/cuarto solo)
- Basements (sótano)
- Casas

Si el mensaje contiene información de renta, devuelve un JSON con:
- type: tipo de propiedad ("apartamento", "studio", "cuarto", "basement", "casa")
- bedrooms: número de cuartos (0 para studio, 1 para cuarto individual)
- price: precio mensual en dólares (solo número, sin símbolos)
- location: ubicación específica (ciudad, barrio, calle si está disponible)
- description: descripción completa y detallada de características, amenidades, condiciones

EJEMPLOS:
- "Studio $1500 Astoria" → {"type":"studio","bedrooms":0,"price":1500,"location":"Astoria, Queens","description":"Studio disponible"}
- "Cuarto $800 Jackson Heights" → {"type":"cuarto","bedrooms":1,"price":800,"location":"Jackson Heights, Queens","description":"Cuarto individual"}
- "2BR $2000 Elmhurst" → {"type":"apartamento","bedrooms":2,"price":2000,"location":"Elmhurst, Queens","description":"Apartamento 2 cuartos"}

Si NO es información de renta, devuelve null.

Mensaje: "${messageText}"

Responde SOLO con el JSON o null, sin explicaciones.`;

            const response = await this.client.chat.completions.create({
                model: config.groq.model,
                messages: [
                    { role: 'system', content: 'Eres un extractor de datos especializado en bienes raíces en Queens, New York. Extrae información de TODO tipo de propiedad en renta: apartamentos, studios, cuartos, basements, casas. Responde SOLO con JSON válido o la palabra null.' },
                    { role: 'user', content: extractionPrompt }
                ],
                temperature: 0.2,
                max_tokens: 300,
            });

            const result = response.choices[0].message.content.trim();

            // Intentar parsear el JSON
            if (result === 'null' || result === null || result.toLowerCase().includes('null')) {
                return null;
            }

            try {
                // Limpiar el resultado para obtener solo el JSON
                const jsonMatch = result.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
                return null;
            } catch {
                return null;
            }
        } catch (error) {
            // Si es error de rate limit, rotar API key y reintentar
            if (error.status === 429 && error.error?.error?.code === 'rate_limit_exceeded') {
                console.log('⚠️  Límite de tokens alcanzado en extracción. Rotando API key...');
                this.rotateApiKey();
                
                // Reintentar con la nueva API key
                try {
                    const response = await this.client.chat.completions.create({
                        model: config.groq.model,
                        messages: [
                            { role: 'system', content: 'Eres un extractor de datos especializado en bienes raíces en Queens, New York. Extrae información de TODO tipo de propiedad en renta: apartamentos, studios, cuartos, basements, casas. Responde SOLO con JSON válido o la palabra null.' },
                            { role: 'user', content: extractionPrompt }
                        ],
                        temperature: 0.2,
                        max_tokens: 300,
                    });

                    const result = response.choices[0].message.content.trim();

                    if (result === 'null' || result === null || result.toLowerCase().includes('null')) {
                        return null;
                    }

                    try {
                        const jsonMatch = result.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            return JSON.parse(jsonMatch[0]);
                        }
                        return null;
                    } catch {
                        return null;
                    }
                } catch (retryError) {
                    console.error('Error en reintento de extracción:', retryError);
                    return null;
                }
            }
            
            console.error('Error extrayendo información:', error);
            return null;
        }
    }
}

export default new GroqService();
