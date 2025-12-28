# 🎯 Referencia Rápida - Grupo LA RENTA #1000

## ✅ Configuración Específica

### 📱 Grupo Objetivo
**Nombre:** LA RENTA #1000 🍀🎁🏠

### 🎯 Propósito
- El bot lee mensajes de este grupo
- Extrae información de apartamentos automáticamente
- NO envía mensajes al grupo (solo lee)
- Usa la información para responder a clientes

---

## 🚀 Comando Especial Creado

```bash
node scripts/find-renta-group.js
```

Este script:
- ✅ Busca automáticamente "LA RENTA #1000"
- ✅ Te muestra el ID del grupo
- ✅ Te da instrucciones paso a paso
- ✅ Más fácil que buscar manualmente

---

## 📝 Pasos Exactos

### 1. Ejecutar Script
```bash
node scripts/find-renta-group.js
```

### 2. Escanear QR
- Abre WhatsApp > Dispositivos vinculados
- Escanea el código QR

### 3. Ver Resultado
El script mostrará:
```
🎉 ¡Grupo encontrado!

════════════════════════════════════════════════════════════════════
📱 Nombre: LA RENTA #1000🍀🎁🏠
🆔 ID: 120363123456789012@g.us  ← COPIAR ESTE
👥 Participantes: 25
════════════════════════════════════════════════════════════════════
```

### 4. Configurar .env
Abre `.env` y pega:
```env
GROUP_ID=120363123456789012@g.us
```

### 5. Iniciar Bot
```bash
npm start
```

---

## 🔍 Qué Detectará el Bot

### Ejemplo de Mensaje en el Grupo:
```
Apartamento 2 cuartos en Astoria
$1800 al mes
Renovado, cerca del metro
```

### El Bot Extraerá:
```json
{
  "bedrooms": 2,
  "price": 1800,
  "location": "Astoria, Queens",
  "description": "Renovado, cerca del metro"
}
```

### Guardará en:
`data/chats/apartments.json`

---

## 💬 Ejemplo de Uso con Cliente

### Cliente Pregunta:
```
Hola, busco apartamento
```

### Bot Responde:
```
¡Hola! Bienvenido a nuestro servicio de apartamentos.
Actualmente tenemos apartamentos disponibles en Queens, New York.
¿De cuántos cuartos necesitas el apartamento?
```

### Cliente:
```
2 cuartos
```

### Bot:
```
Perfecto! Tengo estas opciones de 2 cuartos disponibles:

1. 2 cuartos - $1,800/mes
   📍 Astoria, Queens
   ✨ Renovado, cerca del metro

Esta información fue extraída del grupo LA RENTA #1000.
¿Te interesa conocer más detalles?
```

---

## 📊 Verificación

### ✅ El bot está funcionando si ves:

```
🚀 Iniciando Bot de Bienes Raíces...
📋 Cargados X apartamentos
✅ Conectado a WhatsApp exitosamente!
```

### ✅ El bot detecta mensajes del grupo si ves:

```
📨 Mensaje del grupo: [contenido]
🏠 Nuevo apartamento detectado y guardado
```

### ✅ El bot responde a clientes si ves:

```
💬 Cliente 1234567890@s.whatsapp.net: Hola
✅ Respuesta enviada a 1234567890@s.whatsapp.net
```

---

## 🔧 Solución de Problemas

### ❌ No encuentra el grupo

**Causa:** El nombre del grupo cambió o no estás en ese grupo

**Solución:**
```bash
# Ver todos tus grupos
node scripts/get-group-id.js

# Busca "LA RENTA #1000" manualmente en la lista
```

### ❌ No detecta mensajes del grupo

**Verificar:**
1. El `GROUP_ID` en `.env` es correcto
2. Guardaste el archivo `.env`
3. Reiniciaste el bot después de configurar

### ❌ El bot responde en el grupo

**Tranquilo:** El bot está programado para:
- ✅ Leer el grupo (solo si es "LA RENTA #1000")
- ❌ NUNCA responder en el grupo
- ✅ Solo responder a mensajes directos

El código en `message.controller.js` diferencia claramente:
```javascript
if (isGroup && from === config.whatsapp.groupId) {
  // Solo leer y extraer
  await this.handleGroupMessage(message);
} else if (!isGroup) {
  // Responder solo a clientes directos
  await this.handleClientMessage(message);
}
```

---

## 📁 Archivos Relevantes

| Archivo | Qué Hace |
|---------|----------|
| `scripts/find-renta-group.js` | Busca el grupo LA RENTA #1000 |
| `.env` | Guarda el GROUP_ID |
| `src/controllers/message.controller.js` | Procesa mensajes del grupo |
| `data/chats/apartments.json` | Almacena apartamentos |
| `COMO_EMPEZAR.md` | Guía completa |

---

## 🎉 Resumen

1. **Script especial creado:** `find-renta-group.js`
2. **Busca automáticamente:** Grupo "LA RENTA #1000"
3. **Solo debes:** Copiar el ID y pegarlo en `.env`
4. **Listo para:** Extraer apartamentos y responder clientes

---

**Siguiente paso:** Ejecuta `node scripts/find-renta-group.js` 🚀
