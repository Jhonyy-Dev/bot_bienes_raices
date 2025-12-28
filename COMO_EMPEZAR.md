# 🚀 CÓMO EMPEZAR - Configuración Completa

## ⚡ Configuración Rápida (3 pasos)

### 1️⃣ Conectar WhatsApp y Encontrar el Grupo

```bash
node scripts/find-renta-group.js
```

- Escanea el código QR que aparece
- El script encontrará automáticamente "LA RENTA #1000"
- Copia el ID que muestra

### 2️⃣ Configurar el ID del Grupo

Abre el archivo `.env` y pega el ID:

```env
GROQ_API_KEY=tu_api_key_aqui
GROUP_ID=123456789-1234567890@g.us  ← Pega aquí el ID
BOT_NAME=Asistente de Bienes Raíces
LOCATION=Queens, New York
AI_MODEL=llama-3.3-70b-versatile
LOG_LEVEL=info
```

### 3️⃣ Iniciar el Bot

```bash
npm start
```

---

## ✅ ¡Listo! Tu Bot Está Funcionando

Ahora el bot:

✅ Lee mensajes del grupo **"LA RENTA #1000"**
✅ Extrae información de apartamentos automáticamente
✅ Responde a clientes que escriban directamente

---

## 🧪 Probar el Bot

### Prueba 1: Verificar que lee el grupo

1. Envía un mensaje de prueba en "LA RENTA #1000":
   ```
   Apartamento 2 cuartos en Astoria, $1800/mes
   ```

2. En la terminal del bot deberías ver:
   ```
   📨 Mensaje del grupo: Apartamento 2 cuartos en Astoria, $1800/mes
   🏠 Nuevo apartamento detectado y guardado
   ```

### Prueba 2: Probar respuesta a cliente

Desde otro teléfono, envía un WhatsApp al número donde conectaste el bot:

```
Hola
```

El bot debería responder:
```
¡Hola! Bienvenido a nuestro servicio de apartamentos. 
Actualmente tenemos apartamentos disponibles en Queens, 
New York. ¿De cuántos cuartos necesitas el apartamento?
```

---

## 📊 Dashboard Visual

Cuando el bot esté corriendo verás:

![Dashboard del Bot en la Terminal](C:/Users/yokar/.gemini/antigravity/brain/bc7aa2a7-beca-4e0d-97e0-a722d8b6cf71/uploaded_image_1766882392894.png)

---

## 🔧 Comandos Útiles

| Comando | Para qué sirve |
|---------|----------------|
| `npm start` | Inicia el bot |
| `node scripts/find-renta-group.js` | Encuentra el grupo LA RENTA #1000 |
| `node scripts/get-group-id.js` | Lista todos tus grupos |
| `Ctrl+C` | Detiene el bot |

---

## 📁 Archivos Importantes

### `.env` - Configuración
```env
GROQ_API_KEY=tu-api-key-aqui       ← Ya configurada ✅
GROUP_ID=id-del-grupo-aqui         ← Agregar después del paso 1
```

### `data/chats/apartments.json` - Base de datos
```json
[
  {
    "id": "1735339200000",
    "bedrooms": 2,
    "price": 1800,
    "location": "Astoria, Queens",
    "description": "Apartamento renovado"
  }
]
```

---

## 🎯 Flujo de Trabajo del Bot

### Cuando llega un mensaje al grupo "LA RENTA #1000":

```
1. Bot lee el mensaje
   ↓
2. Groq IA analiza el contenido
   ↓
3. Si contiene info de apartamento:
   - Extrae: cuartos, precio, ubicación
   - Guarda en apartments.json
   ↓
4. Queda disponible para recomendar
```

### Cuando un cliente escribe directo:

```
1. Bot lee el mensaje del cliente
   ↓
2. Obtiene historial de conversación
   ↓
3. Consulta apartamentos disponibles
   ↓
4. Groq IA genera respuesta personalizada
   ↓
5. Envía respuesta al cliente
```

---

## 💡 Tips Importantes

### ✅ Hacer
- Mantén el bot corriendo 24/7 para atención automática
- Revisa los logs para ver qué apartamentos detecta
- Prueba con diferentes preguntas de clientes
- Actualiza el grupo "LA RENTA #1000" con nuevos apartamentos

### ❌ Evitar
- No cierres el bot si quieres que responda automáticamente
- No compartas tu archivo `.env` (contiene tu API key)
- No modifies manualmente `apartments.json` (el bot lo gestiona)

---

## 🆘 Problemas Comunes

### "El bot no detecta apartamentos del grupo"

**Causas:**
1. El GROUP_ID no está configurado
2. El GROUP_ID es incorrecto
3. No reiniciaste el bot después de configurar

**Solución:**
```bash
# Volver a obtener el ID
node scripts/find-renta-group.js

# Verificar que esté en .env
# Reiniciar el bot
npm start
```

### "El bot no responde a clientes"

**Causas:**
1. No escaneaste el QR
2. WhatsApp se desconectó

**Solución:**
```bash
# Reiniciar y escanear QR nuevamente
npm start
```

---

## 📚 Más Ayuda

- **CONFIGURAR_GRUPO_RENTA.md** - Detalles sobre el grupo
- **RESUMEN_GROQ.md** - Info sobre la IA
- **README.md** - Documentación técnica completa

---

## 🎉 ¡Eso es Todo!

Con estos 3 comandos ya tienes tu bot funcionando:

```bash
# 1. Encontrar grupo
node scripts/find-renta-group.js

# 2. (Configurar .env con el ID)

# 3. Iniciar bot
npm start
```

**¡Tu asistente virtual está listo para trabajar! 🤖✨**
