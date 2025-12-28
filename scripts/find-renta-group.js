import baileysService from '../src/services/whatsapp/baileys.service.js';

/**
 * Script para encontrar el grupo "LA RENTA #1000" y obtener su ID
 * Ejecuta: node scripts/find-renta-group.js
 */

async function findRentaGroup() {
    console.log('🔍 Buscando el grupo "LA RENTA #1000"...\n');

    await baileysService.connect();

    // Esperar a que se conecte
    baileysService.ev.on('connection.update', async (update) => {
        if (update.connection === 'open') {
            console.log('✅ Conectado a WhatsApp\n');

            try {
                const sock = baileysService.getSocket();
                // Obtener todos los grupos
                const groups = await sock.groupFetchAllParticipating();

                // Buscar el grupo "LA RENTA #1000"
                let rentaGroup = null;

                Object.values(groups).forEach((group) => {
                    // Buscar grupos que contengan "RENTA" o "1000" en el nombre
                    if (group.subject.includes('RENTA') || group.subject.includes('1000')) {
                        rentaGroup = group;
                    }
                });

                if (rentaGroup) {
                    console.log('🎉 ¡Grupo encontrado!\n');
                    console.log('═'.repeat(80));
                    console.log(`📱 Nombre: ${rentaGroup.subject}`);
                    console.log(`🆔 ID: ${rentaGroup.id}`);
                    console.log(`👥 Participantes: ${rentaGroup.participants.length}`);
                    console.log('═'.repeat(80));
                    console.log('\n📝 INSTRUCCIONES:');
                    console.log('1. Copia el ID de arriba');
                    console.log('2. Abre el archivo .env en el editor');
                    console.log('3. Pega el ID en la línea GROUP_ID=');
                    console.log(`   Ejemplo: GROUP_ID=${rentaGroup.id}`);
                    console.log('4. Guarda el archivo .env');
                    console.log('5. Presiona Ctrl+C aquí y ejecuta: npm start');
                    console.log('\n✅ El bot comenzará a leer mensajes de "LA RENTA #1000"\n');
                } else {
                    console.log('❌ No se encontró el grupo "LA RENTA #1000"\n');
                    console.log('Mostrando todos tus grupos:\n');
                    console.log('═'.repeat(80));

                    Object.values(groups).forEach((group, index) => {
                        console.log(`${index + 1}. ${group.subject}`);
                        console.log(`   ID: ${group.id}`);
                        console.log('─'.repeat(80));
                    });

                    console.log('\n💡 Busca manualmente el grupo y copia su ID');
                }

                console.log('\n⌨️  Presiona Ctrl+C para salir');
            } catch (error) {
                console.error('❌ Error obteniendo grupos:', error);
            }
        }
    });
}

findRentaGroup().catch(console.error);
