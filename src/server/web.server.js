import express from 'express';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WebServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.qrCode = null;
        this.isConnected = false;
        
        this.setupRoutes();
    }

    setupRoutes() {
        // Ruta principal - Página HTML
        this.app.get('/', (req, res) => {
            res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bot Bienes Raíces - WhatsApp QR</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 16px;
        }
        
        .status {
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 600;
            margin-bottom: 30px;
            display: inline-block;
        }
        
        .status.waiting {
            background: #fef3c7;
            color: #92400e;
        }
        
        .status.connected {
            background: #d1fae5;
            color: #065f46;
        }
        
        .qr-container {
            background: #f9fafb;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 20px;
        }
        
        #qr-image {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
        }
        
        .loading {
            color: #666;
            font-size: 18px;
        }
        
        .instructions {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
            text-align: left;
        }
        
        .instructions h3 {
            color: #1e40af;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .instructions ol {
            color: #374151;
            line-height: 1.8;
            padding-left: 20px;
        }
        
        .instructions li {
            margin-bottom: 8px;
        }
        
        .success-message {
            display: none;
            background: #d1fae5;
            color: #065f46;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
            font-size: 18px;
            font-weight: 600;
        }
        
        .success-message.show {
            display: block;
        }
        
        .emoji {
            font-size: 48px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏠 Bot Bienes Raíces</h1>
        <p class="subtitle">Conecta tu WhatsApp</p>
        
        <div class="status waiting" id="status">
            ⏳ Esperando escaneo...
        </div>
        
        <div class="qr-container">
            <div id="qr-loading" class="loading">
                <div class="emoji">📱</div>
                <p>Generando código QR...</p>
            </div>
            <img id="qr-image" style="display: none;" alt="QR Code">
        </div>
        
        <div class="instructions">
            <h3>📋 Instrucciones:</h3>
            <ol>
                <li>Abre WhatsApp en tu teléfono</li>
                <li>Ve a <strong>Configuración > Dispositivos vinculados</strong></li>
                <li>Toca <strong>"Vincular un dispositivo"</strong></li>
                <li>Escanea este código QR</li>
            </ol>
        </div>
        
        <div class="success-message" id="success-message">
            ✅ ¡Bot conectado y activo!
        </div>
    </div>
    
    <script>
        let checkInterval;
        
        // Verificar QR cada 2 segundos
        async function checkQR() {
            try {
                const response = await fetch('/api/qr');
                const data = await response.json();
                
                if (data.qr && !data.connected) {
                    document.getElementById('qr-loading').style.display = 'none';
                    document.getElementById('qr-image').src = data.qr;
                    document.getElementById('qr-image').style.display = 'block';
                }
                
                if (data.connected) {
                    document.getElementById('status').innerHTML = '✅ Conectado';
                    document.getElementById('status').className = 'status connected';
                    document.getElementById('qr-container').style.display = 'none';
                    document.getElementById('success-message').classList.add('show');
                    document.querySelector('.instructions').style.display = 'none';
                    clearInterval(checkInterval);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        
        // Iniciar verificación
        checkQR();
        checkInterval = setInterval(checkQR, 2000);
    </script>
</body>
</html>
            `);
        });

        // API para obtener el QR
        this.app.get('/api/qr', async (req, res) => {
            try {
                if (this.isConnected) {
                    return res.json({ 
                        connected: true,
                        qr: null 
                    });
                }

                if (!this.qrCode) {
                    return res.json({ 
                        connected: false,
                        qr: null 
                    });
                }

                // Generar imagen QR como Data URL
                const qrImage = await QRCode.toDataURL(this.qrCode, {
                    width: 400,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });

                res.json({ 
                    connected: false,
                    qr: qrImage 
                });
            } catch (error) {
                console.error('Error generando QR:', error);
                res.status(500).json({ error: 'Error generando QR' });
            }
        });

        // Health check para Railway
        this.app.get('/health', (req, res) => {
            res.json({ 
                status: 'ok',
                connected: this.isConnected,
                hasQR: !!this.qrCode
            });
        });
    }

    setQR(qr) {
        this.qrCode = qr;
        console.log('🌐 QR disponible en: http://localhost:' + this.port);
    }

    setConnected(connected) {
        this.isConnected = connected;
        if (connected) {
            console.log('✅ WhatsApp conectado exitosamente!');
        }
    }

    start() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log(`🌐 Servidor web iniciado en: http://localhost:${this.port}`);
            console.log(`📱 Abre esta URL para escanear el QR`);
        });
    }
}

export default WebServer;
