# 📱 Configurar el Grupo "LA RENTA #1000"

## 🎯 Objetivo

Configurar el bot para que lea y extraiga información de apartamentos del grupo de WhatsApp **"LA RENTA #1000"**.

---

## 🚀 Pasos Rápidos

### Paso 1: Iniciar el Script Especial

Ejecuta este comando que busca automáticamente tu grupo:

```bash
node scripts/find-renta-group.js
```

### Paso 2: Escanear QR

- Aparecerá un código QR en la terminal
- Abre WhatsApp en tu teléfono
- Ve a **Ajustes** > **Dispositivos vinculados**
- Toca **Vincular un dispositivo**
- Escanea el código QR

### Paso 3: Copiar el ID

El script encontrará automáticamente el grupo "LA RENTA #1000" y mostrará:

```
🎉 ¡Grupo encontrado!

════════════════════════════════════════════════════════════════════════════════
📱 Nombre: LA RENTA #1000🍀🎁🏠
🆔 ID: 123456789-1234567890@g.us
👥 Participantes: XX
════════════════════════════════════════════════════════════════════════════════
```

### Paso 4: Configurar en .env

1. Copia el ID completo (termina en `@g.us`)
2. Abre el archivo `.env` en tu editor
3. Busca la línea que dice `GROUP_ID=`
4. Pega el ID:

```env
GROUP_ID=123456789-1234567890@g.us
```

5. Guarda el archivo

### Paso 5: Iniciar el Bot

Presiona `Ctrl+C` para cerrar el script de búsqueda, luego ejecuta:

```bash
npm start
```

---

## ✅ Verificación

Cuando el bot esté corriendo, verás algo como:

```
🚀 Iniciando Bot de Bienes Raíces...

📋 Cargados 0 apartamentos
✅ Conectado a WhatsApp exitosamente!

✅ Bot iniciado correctamente
📱 Esperando mensajes...
```

Para probar que funciona:

1. Envía un mensaje de prueba en el grupo "LA RENTA #1000"
2. Deberías ver en la terminal:

```
📨 Mensaje del grupo: [tu mensaje]
```

---

## 🏠 Ejemplo de Mensaje que Detectará

Cuando alguien en "LA RENTA #1000" publique algo como:

```
Apartamento de 2 cuartos en Astoria
$1800 al mes
Cerca del metro
```

El bot:
1. ✅ Detectará el mensaje
2. ✅ Extraerá la información con IA
3. ✅ Guardará: 2 cuartos, $1800, Astoria
4. ✅ Lo tendrá disponible para recomendar a clientes

---

## 🔧 Solución de Problemas

### ❌ "No se encontró el grupo LA RENTA #1000"

**Solución:**
- Asegúrate de que estés en ese grupo en tu WhatsApp
- El script mostrará todos tus grupos, busca el correcto manualmente
- Copia su ID y ponlo en el archivo `.env`

### ❌ "El bot no detecta mensajes del grupo"

**Verificar:**
1. El `GROUP_ID` en `.env` está correcto (termina en `@g.us`)
2. El archivo `.env` está guardado
3. Reiniciaste el bot después de agregar el GROUP_ID

### ❌ "Error: Cannot find module"

**Solución:**
```bash
npm install
```

---

## 📊 Flujo Completo

```
┌─────────────────────────────────────────────┐
│   Grupo: LA RENTA #1000                     │
│   "2 cuartos en Astoria, $1800/mes"         │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │  Bot detecta    │
         │  el mensaje     │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │  Groq IA        │
         │  extrae:        │
         │  - 2 cuartos    │
         │  - $1800        │
         │  - Astoria      │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │  Guarda en      │
         │  apartments.json│
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │  Listo para     │
         │  recomendar a   │
         │  clientes       │
         └─────────────────┘
```

---

## 🎯 Resumen

**Ejecutar:**
```bash
node scripts/find-renta-group.js
```

**Copiar el ID y agregarlo a `.env`:**
```env
GROUP_ID=el-id-que-copiaste@g.us
```

**Iniciar el bot:**
```bash
npm start
```

**¡Listo!** El bot ahora lee "LA RENTA #1000" 🎉

---

## 💡 Nota Importante

- El bot **SOLO lee** el grupo, no envía mensajes ahí
- Los mensajes del bot se envían solo a clientes que escriben directamente
- El grupo "LA RENTA #1000" es la fuente de información de apartamentos
- Los clientes reciben recomendaciones basadas en lo que se publicó en el grupo
