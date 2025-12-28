# 🏠 Bot de WhatsApp para Bienes Raíces

Bot inteligente de WhatsApp con IA que gestiona apartamentos en renta en Queens, New York.

## ✨ Características

- 📱 **Conexión con WhatsApp** mediante Baileys (escaneo QR)
- 🤖 **Inteligencia Artificial** con Groq (Llama 3.3) para respuestas ultra rápidas
- 📊 **Extracción automática** de información de apartamentos desde grupo de WhatsApp
- 💬 **Respuestas personalizadas** a clientes según sus necesidades
- 🗄️ **Base de datos** en JSON para almacenar apartamentos
- 🔄 **Historial de conversaciones** para contexto continuo

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` copiando el ejemplo:

```bash
copy .env.example .env
```

Edita `.env` - tu API key de Groq ya está configurada:

```env
GROQ_API_KEY=tu_api_key_aqui
```

### 3. Iniciar el bot

```bash
npm start
```

## 📱 Configuración de WhatsApp

### Conectar y Encontrar el Grupo "LA RENTA #1000"

Usa el script especial que encuentra automáticamente tu grupo:

```bash
node scripts/find-renta-group.js
```

1. Escanea el código QR que aparece con tu WhatsApp
2. El script buscará automáticamente el grupo **"LA RENTA #1000"**
3. Copia el ID que muestra
4. Pega el ID en el archivo `.env`:

```env
GROUP_ID=123456789-1234567890@g.us
```

5. Reinicia el bot (`Ctrl+C` y luego `npm start`)

**Nota:** El bot leerá SOLO el grupo "LA RENTA #1000" para extraer información de apartamentos.

## 🏗️ Estructura del Proyecto

```
BOT_BIENES_RAICES/
├── src/
│   ├── config/              # Configuración
│   ├── controllers/         # Lógica de negocio
│   ├── services/
│   │   ├── whatsapp/       # Integración Baileys
│   │   └── ai/             # Integración OpenAI
│   ├── models/             # Modelos de datos
│   └── index.js            # Punto de entrada
├── data/
│   ├── chats/              # Apartamentos (JSON)
│   ├── logs/               # Logs del sistema
│   └── exports/            # Exportaciones
└── .env                    # Variables de entorno
```

## 🤖 Cómo Funciona

### 1. Monitoreo del Grupo
- El bot lee todos los mensajes del grupo configurado
- Usa IA para detectar información de apartamentos
- Extrae: número de cuartos, precio, ubicación, descripción
- Guarda automáticamente en `data/chats/apartments.json`

### 2. Respuestas a Clientes
- Los clientes escriben directamente al bot
- El bot saluda y pregunta por sus necesidades
- Informa que solo hay apartamentos en Queens, NY
- Pregunta cuántos cuartos necesita
- Recomienda apartamentos según lo disponible

### 3. Contexto de Conversación
- Mantiene historial de cada cliente
- Respuestas coherentes y contextuales
- Memoria de 10 mensajes recientes por cliente

## 📝 Ejemplo de Uso

**Cliente**: Hola  
**Bot**: ¡Hola! Bienvenido a nuestro servicio de apartamentos. Actualmente tenemos apartamentos disponibles en Queens, New York. ¿De cuántos cuartos necesitas el apartamento?

**Cliente**: 2 cuartos  
**Bot**: Perfecto! Tenemos las siguientes opciones de 2 cuartos disponibles en Queens:
- 2 cuartos - $1,800/mes - Astoria, Queens - Apartamento renovado, cerca del metro
- 2 cuartos - $1,950/mes - Jackson Heights - Incluye calefacción, balcón

¿Te interesa alguna de estas opciones?

## 🛠️ Scripts Disponibles

- `npm start` - Inicia el bot
- `npm run dev` - Modo desarrollo con auto-reload
- `npm test` - Ejecuta tests

## 🔧 Tecnologías

- **Baileys** - Cliente de WhatsApp Web
- **Groq (Llama 3.3)** - Inteligencia Artificial ultra rápida
- **Node.js** - Runtime
- **Node-Cache** - Caché en memoria para conversaciones

## 📄 Licencia

MIT

## 👨‍💻 Soporte

Para problemas o preguntas, crea un issue en el repositorio.
