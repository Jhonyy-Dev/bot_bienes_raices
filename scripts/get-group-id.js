import baileysService from '../src/services/whatsapp/baileys.service.js';

/**
 * Script de utilidad para obtener IDs de grupos
 * Ejecuta: node scripts/get-group-id.js
 */

async function getGroupIds() {
    console.log('🔍 Conectando a WhatsApp para obtener IDs de grupos...\n');

    await baileysService.connect();

    // Esperar a que se conecte
    baileysService.ev.on('connection.update', async (update) => {
        if (update.connection === 'open') {
            console.log('\n📋 Obteniendo lista de grupos...\n');

            try {
                const sock = baileysService.getSocket();
                // Obtener todos los grupos
                const groups = await sock.groupFetchAllParticipating();

                console.log('✅ Grupos encontrados:\n');
                console.log('═'.repeat(80));

                Object.values(groups).forEach((group, index) => {
                    console.log(`${index + 1}. ${group.subject}`);
                    console.log(`   ID: ${group.id}`);
                    console.log(`   Participantes: ${group.participants.length}`);
                    console.log('─'.repeat(80));
                });

                console.log('\n📝 Copia el ID del grupo que necesites y agrégalo a .env como GROUP_ID');
                console.log('\nPresiona Ctrl+C para salir');
            } catch (error) {
                console.error('Error obteniendo grupos:', error);
            }
        }
    });
}

getGroupIds().catch(console.error);
