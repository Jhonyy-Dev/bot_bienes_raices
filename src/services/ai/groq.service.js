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

        // Sistema de prompt para el agente de IA con psicología de ventas avanzada
        this.systemPrompt = `Eres un agente EXPERTO en bienes raíces en ${config.bot.location} con conocimientos avanzados en:
- Psicología de ventas inmobiliarias
- Ingeniería social ética
- Marketing persuasivo no invasivo
- Técnicas de cierre profesional

TIPOS: Apartamentos, Studios, Cuartos individuales, Basements

FORMATO:
✅ "1 cuarto", "2 cuartos" (NO "BR")
✅ Solo zona, NO direcciones exactas
✅ Emojis con calidez 😊👋🏠

PERSONALIDAD:
- Saludo cálido y profesional: "Hola! 👋😊"
- Empático y consultivo (no vendedor agresivo)
- Construyes confianza antes de vender
- Escuchas necesidades reales del cliente
- Despedida cordial: "¡Que tengas un excelente día! 😊"

🚨 DETECCIÓN CRÍTICA - CLIENTE OFRECE PROPIEDAD:
Si el cliente menciona que TIENE/OFRECE una propiedad para rentar:
- "Tengo un apartamento"
- "Quiero rentar mi casa"
- "Tengo un cuarto disponible"
- "Ofrezco un studio"

RESPONDE EXACTAMENTE:
"¡Excelente! 🏠 Nos interesa mucho. ¿Qué tipo de vivienda tienes disponible? (apartamento, studio, cuarto individual, basement, casa)"

Luego pregunta detalles:
- Número de cuartos/habitaciones
- Precio mensual
- Ubicación (zona en Queens)
- Características principales

🚨 DETECCIÓN CRÍTICA - SOLICITUD DE FOTOS/VIDEOS:
Si el cliente pide fotos, imágenes, videos, o ver la propiedad visualmente:
- "Tienes fotos?"
- "Puedo ver imágenes?"
- "Hay video?"
- "Mándame fotos"

RESPONDE EXACTAMENTE:
"Claro! 📸 Déjame coordinar para tomarte fotos/video de esa propiedad y te las envío. 🏠"

Después de esto, DEBES DEJAR DE RESPONDER hasta que el humano envíe las imágenes.

REGLAS DE CONVERSACIÓN:

1. RESPONDE SOLO LO QUE TE PREGUNTAN:
   - NO des precios si no los piden
   - NO des detalles si no los piden
   - Máximo 2-3 líneas
   - Directo pero cordial

2. MOSTRAR PROPIEDADES (FORMATO MEJORADO):
   - Agrupa por categorías: "Studios:", "Apartamentos de 1 cuarto:", etc.
   - MUESTRA TODAS las propiedades de cada categoría
   - NO limites opciones
   
   FORMATO VISUAL OBLIGATORIO:
   - Usa *negritas* para el nombre de la propiedad
   - Usa • (bullet) antes de la descripción
   - Deja línea en blanco entre cada propiedad
   - Deja línea en blanco entre categorías
   
   EJEMPLO CORRECTO:
   Studios:
   1. *Studio* - $1650/mes - Woodside
      • Semi basement renovado, utilidades incluidas
   
   2. *Studio* - $1800/mes - Woodside
      • Semi basement renovado, 2 personas máximo
   
   Cuartos individuales:
   3. *Cuarto* - $1000/mes - Corona
      • Habitación para hombre
   
   - AL FINAL sugiere otras opciones: "También tenemos apartamentos de 2 cuartos, 3 cuartos. ¿Te gustaría verlos? 🏠"

3. COSTOS DE MUDANZA (solo cuando pregunten):
   - 3 PAGOS IGUALES: 1 mes adelantado + 1 mes renta + Real state fee
   - Ejemplo: Studio $1600/mes → $4800 para mudarse

4. PSICOLOGÍA DE VENTAS - CIERRE PROFESIONAL:
   
   A) TÉCNICA DE ESCASEZ (sutil):
   "Esta propiedad tiene mucho interés. ¿Te gustaría agendarla pronto? 😊"
   
   B) TÉCNICA DE PRUEBA SOCIAL:
   "Muchos clientes han quedado encantados con esta zona. ¿Conoces el área?"
   
   C) TÉCNICA DE ALTERNATIVA:
   "¿Prefieres verla mañana o el fin de semana? 😊"
   
   D) MANEJO DE OBJECIONES:
   - Precio alto → "Entiendo. Esta incluye [beneficios]. ¿Cuál es tu presupuesto ideal?"
   - Necesita pensar → "Por supuesto! ¿Hay algo específico que te preocupa?"
   - Comparando → "Excelente que compares. ¿Qué características son más importantes para ti?"
   
   E) CIERRE SUAVE (nunca agresivo):
   - Interesado → "¡Genial! ¿Te gustaría verla? 😊"
   - SÍ → "¡Perfecto! 🎉 Oficina: 80-20 Roosevelt Ave, piso 2, of. 202, Queens. Lun-Sáb 9am-6pm. ¿Cuándo te viene mejor?"
   - NO → "Entiendo perfectamente. ¿Quieres que te muestre otras opciones que se ajusten mejor? 😊"

5. CONSTRUCCIÓN DE RAPPORT:
   - Usa el nombre si lo comparte
   - Haz preguntas abiertas sobre necesidades
   - Valida sus preocupaciones
   - Nunca presiones o hostigues

EJEMPLOS:

"Hola" → "Hola! 👋😊 ¿Qué tipo de vivienda estás buscando?"

"Tienes fotos?" → "Claro! 📸 Déjame coordinar para tomarte fotos/video de esa propiedad y te las envío. 🏠"

"Tengo un apartamento para rentar" → "¡Excelente! 🏠 Nos interesa mucho. ¿Qué tipo de vivienda tienes disponible? (apartamento, studio, cuarto individual, basement, casa)"

"Es muy caro" → "Entiendo tu preocupación. Esta propiedad incluye utilidades y está en excelente ubicación. ¿Cuál sería tu presupuesto ideal? Tengo más opciones 😊"

"Necesito pensarlo" → "Por supuesto, es una decisión importante. ¿Hay algo específico que te preocupa o te gustaría saber? Estoy aquí para ayudarte 😊"

DIRECCIÓN: 80-20 Roosevelt Ave, piso 2, oficina 202, Queens
HORARIO: Lun-Sáb 9am-6pm

PRINCIPIO FUNDAMENTAL: Sé consultivo, no vendedor. Ayuda genuinamente al cliente a encontrar su hogar ideal. La venta viene como consecuencia natural de la confianza.`;
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
                    
                    // LÓGICA MEJORADA: Evitar redundancia
                    let propertyName = '';
                    
                    if (type === 'cuarto') {
                        // Cuarto individual - NO mostrar "1 cuarto" (redundante)
                        propertyName = 'Cuarto';
                    } else if (type === 'studio') {
                        // Studio - NO mostrar "0 cuartos" (redundante)
                        propertyName = 'Studio';
                    } else if (type === 'basement') {
                        // Basement - Solo mostrar cuartos si son 2+
                        if (apt.bedrooms >= 2) {
                            propertyName = `Basement ${apt.bedrooms} cuartos`;
                        } else {
                            propertyName = 'Basement';
                        }
                    } else {
                        // Apartamentos - Siempre mostrar cuartos
                        if (apt.bedrooms === 1) {
                            propertyName = 'Apartamento 1 cuarto';
                        } else {
                            propertyName = `Apartamento ${apt.bedrooms} cuartos`;
                        }
                    }
                    
                    // Extraer solo la zona/área general (NO dirección exacta)
                    const location = apt.location || 'Queens';
                    const areaMatch = location.match(/(?:en\s+)?([A-Za-z\s]+)(?:,?\s*Queens)?/i);
                    const area = areaMatch ? areaMatch[1].trim() : location.split(',').pop().trim();
                    
                    // FORMATO MEJORADO con mejor espaciado
                    apartmentContext += `${globalIndex}. *${propertyName}* - $${apt.price}/mes - ${area}\n   • ${apt.description}\n\n`;
                    globalIndex++;
                });
                apartmentContext += '\n';
            });
            
            apartmentContext += '\n⚠️⚠️⚠️ INSTRUCCIONES CRÍTICAS DE FORMATO:\n';
            apartmentContext += '1. DEBES copiar las categorías exactamente como aparecen arriba\n';
            apartmentContext += '2. MUESTRA TODAS las propiedades sin omitir ninguna\n';
            apartmentContext += '3. RESPETA el formato con *negritas*, • bullets y líneas en blanco\n';
            apartmentContext += '4. Deja UNA línea en blanco entre cada propiedad\n';
            apartmentContext += '5. Deja UNA línea en blanco entre cada categoría\n';
            apartmentContext += '6. AL FINAL, SIEMPRE di: "También tenemos [otras categorías disponibles]. ¿Te gustaría verlas? 🏠"\n';
            apartmentContext += '7. NO inventes información, usa solo lo que está arriba\n';
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

    /**
     * Detecta si el cliente quiere OFRECER una propiedad
     */
    async detectPropertyOffer(messageText) {
        try {
            const detectionPrompt = `Analiza si el cliente está OFRECIENDO una propiedad para rentar.

Indicadores de que OFRECE propiedad:
- "Tengo un apartamento/studio/cuarto/basement"
- "Quiero rentar mi..."
- "Ofrezco un..."
- "Tengo disponible..."
- "Estoy rentando..."

Si el cliente OFRECE una propiedad, responde: YES
Si el cliente BUSCA una propiedad o habla de otra cosa, responde: NO

Mensaje: "${messageText}"

Responde SOLO con YES o NO.`;

            const response = await this.client.chat.completions.create({
                model: config.groq.model,
                messages: [
                    { role: 'system', content: 'Eres un detector de intenciones. Responde SOLO con YES o NO.' },
                    { role: 'user', content: detectionPrompt }
                ],
                temperature: 0.1,
                max_tokens: 10,
            });

            const result = response.choices[0].message.content.trim().toUpperCase();
            return result === 'YES';
        } catch (error) {
            console.error('Error detectando oferta de propiedad:', error);
            return false;
        }
    }

    /**
     * Detecta si el cliente solicita fotos/videos
     */
    async detectMediaRequest(messageText) {
        try {
            const detectionPrompt = `Analiza si el cliente está SOLICITANDO fotos, imágenes o videos de propiedades.

Indicadores de solicitud de media:
- "Tienes fotos?"
- "Puedo ver imágenes?"
- "Hay video?"
- "Mándame fotos"
- "Envíame imágenes"
- "Quiero ver fotos"
- "Puedes mandar fotos?"

Si el cliente SOLICITA fotos/videos, responde: YES
Si NO solicita media, responde: NO

Mensaje: "${messageText}"

Responde SOLO con YES o NO.`;

            const response = await this.client.chat.completions.create({
                model: config.groq.model,
                messages: [
                    { role: 'system', content: 'Eres un detector de intenciones. Responde SOLO con YES o NO.' },
                    { role: 'user', content: detectionPrompt }
                ],
                temperature: 0.1,
                max_tokens: 10,
            });

            const result = response.choices[0].message.content.trim().toUpperCase();
            return result === 'YES';
        } catch (error) {
            console.error('Error detectando solicitud de media:', error);
            return false;
        }
    }

    /**
     * Detecta si el cliente está confirmando que esperará (después de solicitar fotos)
     * vs si quiere continuar la conversación
     */
    async detectWaitingAcknowledgment(messageText) {
        try {
            const detectionPrompt = `Analiza si el cliente está CONFIRMANDO que esperará las fotos/videos.

Indicadores de que ACEPTA ESPERAR (responde YES):
- "ok"
- "okay"
- "vale"
- "te espero"
- "yo espero"
- "espero"
- "no hay problema"
- "perfecto"
- "está bien"
- "de acuerdo"
- "sí"
- "gracias"
- Solo emojis positivos (👍, 😊, etc)

Indicadores de que QUIERE CONTINUAR conversación (responde NO):
- Hace nuevas preguntas
- Pide más información
- Pregunta por otras propiedades
- Pregunta por precios, ubicaciones, detalles
- Cualquier pregunta que requiera respuesta

Mensaje: "${messageText}"

Responde SOLO con YES (si acepta esperar) o NO (si quiere continuar conversación).`;

            const response = await this.client.chat.completions.create({
                model: config.groq.model,
                messages: [
                    { role: 'system', content: 'Eres un detector de intenciones. Responde SOLO con YES o NO.' },
                    { role: 'user', content: detectionPrompt }
                ],
                temperature: 0.1,
                max_tokens: 10,
            });

            const result = response.choices[0].message.content.trim().toUpperCase();
            return result === 'YES';
        } catch (error) {
            console.error('Error detectando confirmación de espera:', error);
            // En caso de error, asumir que NO quiere esperar (continuar conversación)
            return false;
        }
    }

    /**
     * Genera respuesta de cierre de ventas después de que humano envió media
     * Usa psicología de ventas avanzada
     */
    async generateClosingResponse(userMessage, propertyContext, conversationHistory = []) {
        try {
            const closingPrompt = `Eres un EXPERTO en cierre de ventas inmobiliarias.

CONTEXTO: El cliente acaba de recibir fotos/videos de la propiedad que le interesa.

Propiedad mostrada: ${propertyContext}

TU OBJETIVO: Cerrar la venta de forma profesional usando psicología de ventas.

ESTRATEGIAS DE CIERRE:

1. VALIDACIÓN EMOCIONAL:
   "¿Qué te pareció? 😊" o "¿Te gustó lo que viste?"

2. MANEJO DE RESPUESTAS:
   - Si le gustó → "¡Excelente! Esta propiedad tiene mucho interés. ¿Te gustaría agendarla para verla en persona? 😊"
   - Si tiene dudas → "Entiendo. ¿Hay algo específico que te preocupa o te gustaría saber?"
   - Si pregunta más → Responde y luego: "¿Cuándo te vendría bien visitarla?"

3. TÉCNICA DE ALTERNATIVA:
   "¿Prefieres verla mañana o el fin de semana?"

4. ESCASEZ SUTIL:
   "Varios clientes han mostrado interés. ¿Te gustaría asegurar una cita pronto?"

5. CIERRE DIRECTO SUAVE:
   "¡Perfecto! 🎉 Oficina: 80-20 Roosevelt Ave, piso 2, of. 202, Queens. Lun-Sáb 9am-6pm. ¿Cuándo vienes?"

PRINCIPIOS:
- Sé empático, NO agresivo
- Construye urgencia sin presionar
- Ofrece valor, no solo ventas
- Escucha y adapta tu enfoque

Responde al cliente de forma natural y profesional.`;

            const messages = [
                { role: 'system', content: closingPrompt },
                ...conversationHistory,
                { role: 'user', content: userMessage }
            ];

            const response = await this.client.chat.completions.create({
                model: config.groq.model,
                messages: messages,
                temperature: 0.8,
                max_tokens: 500,
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error generando respuesta de cierre:', error);
            return '¿Qué te pareció la propiedad? 😊 ¿Te gustaría agendarla para verla en persona?';
        }
    }
}

export default new GroqService();
