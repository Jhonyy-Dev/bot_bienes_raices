# 🚀 Configuración de Groq para el Bot

## ✅ Migración Completada: OpenAI → Groq

Tu bot ahora usa **Groq** en lugar de OpenAI, lo que ofrece:

✨ **Ventajas de Groq:**
- ⚡ **Mucho más rápido** - Respuestas casi instantáneas
- 💰 **Más económico** - Hasta 10x más barato que OpenAI
- 🎯 **Excelente calidad** - Modelos potentes como Llama 3.3
- 🔓 **API gratuita** - Con límites generosos para empezar

---

## 🔑 Tu API Key Configurada

```env
GROQ_API_KEY=tu_api_key_aqui
```

✅ Ya está configurada en tu archivo `.env`

---

## 🤖 Modelos Disponibles en Groq

Tu bot está configurado para usar **llama-3.3-70b-versatile**, pero puedes cambiar a otros modelos:

### Opción 1: Llama 3.3 70B Versatile (Recomendado ⭐)
```env
AI_MODEL=llama-3.3-70b-versatile
```
- **Mejor para**: Conversaciones generales, atención al cliente
- **Velocidad**: Ultra rápido (~300 tokens/seg)
- **Calidad**: Excelente en español

### Opción 2: Llama 3.1 70B Versatile
```env
AI_MODEL=llama-3.1-70b-versatile
```
- **Mejor para**: Tareas complejas
- **Velocidad**: Muy rápido (~250 tokens/seg)
- **Calidad**: Alta precisión

### Opción 3: Mixtral 8x7B
```env
AI_MODEL=mixtral-8x7b-32768
```
- **Mejor para**: Contextos largos (32k tokens)
- **Velocidad**: Rápido (~200 tokens/seg)
- **Calidad**: Buena multilingüe

### Opción 4: Llama 3.1 8B (Más rápido)
```env
AI_MODEL=llama-3.1-8b-instant
```
- **Mejor para**: Respuestas ultra rápidas
- **Velocidad**: El más rápido (~500 tokens/seg)
- **Calidad**: Buena para tareas simples

---

## ⚙️ Cambiar de Modelo

Edita el archivo `.env` y cambia la línea:

```env
AI_MODEL=llama-3.3-70b-versatile
```

Por ejemplo, para usar el modelo más rápido:

```env
AI_MODEL=llama-3.1-8b-instant
```

Luego reinicia el bot.

---

## 📊 Comparación con OpenAI

| Característica | Groq (Llama 3.3) | OpenAI (GPT-4) |
|----------------|------------------|----------------|
| **Velocidad** | ⚡⚡⚡⚡⚡ | ⚡⚡ |
| **Precio** | 💰 | 💰💰💰💰 |
| **Calidad español** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Tokens gratis** | Generoso | Limitado |

---

## 🔗 Recursos

- **Dashboard de Groq**: https://console.groq.com
- **Documentación**: https://console.groq.com/docs
- **Límites de uso**: https://console.groq.com/settings/limits

---

## ✅ Archivos actualizados para usar Groq:

1. ✅ `package.json` - Cambiado a groq-sdk
2. ✅ `.env.example` - Variables actualizadas para Groq
3. ✅ `src/config/config.js` - Configuración de Groq
4. ✅ `src/services/ai/groq.service.js` - Nuevo servicio creado
5. ✅ `src/controllers/message.controller.js` - Usa Groq ahora
6. ✅ `src/index.js` - Validación de API key de Groq

---

## 🎯 Próximo Paso

¡Tu bot está listo! Simplemente ejecuta:

```bash
npm start
```

Y escanea el código QR para conectar WhatsApp.

---

**💡 Nota**: Groq es perfecto para este bot porque necesitas respuestas rápidas para atender clientes en tiempo real.
