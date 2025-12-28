# 🚀 Guía Rápida de Inicio

## Paso 1: Configurar tu API Key de OpenAI

1. Ve a https://platform.openai.com/api-keys
2. Crea una nueva API key
3. Abre el archivo `.env` en este proyecto
4. Reemplaza `sk-tu-api-key-aqui` con tu API key real

## Paso 2: Conectar WhatsApp

Ejecuta el bot:

```bash
npm start
```

Verás un código QR en la terminal. Escanéalo con WhatsApp:

1. Abre WhatsApp en tu teléfono
2. Ve a **Ajustes** > **Dispositivos vinculados**
3. Toca **Vincular un dispositivo**
4. Escanea el código QR

## Paso 3: Obtener el ID del grupo

Opción A - Usar el script automático:

```bash
node scripts/get-group-id.js
```

Esto mostrará todos tus grupos con sus IDs.

Opción B - Ver en los logs:

1. Con el bot corriendo, envía un mensaje en el grupo de apartamentos
2. El ID aparecerá en los logs como: `123456789-1234567890@g.us`

## Paso 4: Configurar el grupo

1. Copia el ID del grupo
2. Abre el archivo `.env`
3. Pega el ID en la variable `GROUP_ID`:

```env
GROUP_ID=123456789-1234567890@g.us
```

4. Reinicia el bot (Ctrl+C y luego `npm start`)

## ✅ ¡Listo!

Ahora el bot:
- Lee mensajes del grupo configurado
- Extrae información de apartamentos automáticamente
- Responde a clientes que escriban directamente

## 📝 Probar el bot

Desde otro número de WhatsApp, envía un mensaje al número donde conectaste el bot:

```
Hola
```

El bot debería responder con un saludo y preguntar sobre tus necesidades.

## 🏠 Agregar apartamentos manualmente

Si quieres agregar apartamentos de prueba, edita:
`data/chats/apartments.json`

Ejemplo:
```json
[
  {
    "id": "1",
    "timestamp": "2025-12-27T00:00:00.000Z",
    "bedrooms": 2,
    "price": 1800,
    "location": "Astoria, Queens",
    "description": "Apartamento renovado cerca del metro"
  }
]
```

## ❓ Problemas Comunes

**El QR no aparece**: Espera unos segundos, puede tardar en generar.

**Error de API Key**: Verifica que tu OpenAI API key sea válida y tenga créditos.

**No detecta apartamentos**: Asegúrate de que el GROUP_ID esté configurado correctamente.

## 📞 Comandos Útiles

- `npm start` - Iniciar el bot
- `npm run dev` - Modo desarrollo (auto-reload)
- `node scripts/get-group-id.js` - Ver IDs de grupos
