import apartmentModel from '../src/models/apartment.model.js';

/**
 * Script para poblar la base de datos con información histórica del grupo
 * Ejecuta: node scripts/seed-database.js
 * 
 * IMPORTANTE: Este script solo agrega datos, no elimina ni modifica datos existentes
 */

const properties = [
    // Imagen 1
    {
        type: "basement",
        bedrooms: 2,
        price: 1700,
        location: "89-11 91st Ave, Jamaica, Queens",
        description: "Basement, electricidad no incluida, 2-3 personas ok"
    },
    {
        type: "apartamento",
        bedrooms: 3,
        price: 3000,
        location: "108st 43ave Corona, Queens",
        description: "Apt 1, piso 3, 1 baño, calefacción incluida"
    },
    {
        type: "apartamento",
        bedrooms: 4,
        price: 0, // Precio no especificado
        location: "Corona, Queens",
        description: "Apartamento Flor, 2 baños"
    },
    {
        type: "apartamento",
        bedrooms: 3,
        price: 3300,
        location: "56-50 136th St, Flushing, Queens",
        description: "Renovado, 2 baños, No mascotas"
    },
    
    // Imagen 2
    {
        type: "apartamento",
        bedrooms: 3,
        price: 3500,
        location: "95-21 89th Street, Woodhaven, Queens",
        description: "Duplex, sala grande, 2 baños, balcón grande, todo nuevo"
    },
    {
        type: "apartamento",
        bedrooms: 2,
        price: 2500,
        location: "33-24 105 St, Corona, Queens",
        description: "1 baño, no hay sala, todo incluido, primer piso"
    },
    
    // Imagen 3
    {
        type: "apartamento",
        bedrooms: 2,
        price: 2750,
        location: "94-05 Alstyne Ave, Elmhurst, Queens",
        description: "1 baño, living room, cocina separada, calefacción y agua caliente incluidos, 4 personas ok"
    },
    
    // Imagen 4
    {
        type: "basement",
        bedrooms: 2,
        price: 2200,
        location: "150-45 17 Ave, Flushing, Queens",
        description: "Semi basement, 1 baño, todos los servicios incluidos"
    },
    {
        type: "apartamento",
        bedrooms: 3,
        price: 3300,
        location: "150-45 17 Ave, Flushing, Queens",
        description: "2 baños, todos los servicios incluidos, mascotas pequeñas ok"
    },
    {
        type: "apartamento",
        bedrooms: 3,
        price: 3100,
        location: "151-11 14th Avenue, Whitestone, Queens",
        description: "1 baño, calefacción, gas y agua caliente incluidos, mascotas pequeñas ok"
    },
    
    // Imagen 5
    {
        type: "apartamento",
        bedrooms: 3,
        price: 3200,
        location: "42-21 165st, Flushing, Queens",
        description: "2 baños, primer piso, agua incluida, mascotas pequeñas ok"
    },
    {
        type: "apartamento",
        bedrooms: 4,
        price: 4000,
        location: "37 y 83rd St, Jackson Heights, Queens",
        description: "Grande, 1 baño, segundo piso"
    },
    
    // Imagen 6
    {
        type: "apartamento",
        bedrooms: 3,
        price: 3300,
        location: "253-47 Pembroke Ave, Bayside, Queens",
        description: "Grande, 2 baños, sala grande, mascotas ok"
    },
    
    // Imagen 7
    {
        type: "cuarto",
        bedrooms: 1,
        price: 950,
        location: "55-08 102 St, Queens",
        description: "Cuarto individual, solo para mujeres"
    },
    {
        type: "apartamento",
        bedrooms: 3,
        price: 3300,
        location: "69st cerca 7 train, Queens Blvd & BQE, Queens",
        description: "Renovado, 1 baño, living room grande, cocina espaciosa, 2 cuadras del tren 7"
    },
    
    // Imagen 8
    {
        type: "apartamento",
        bedrooms: 3,
        price: 3000,
        location: "41-20 Gleane St, Elmhurst, Queens",
        description: "1 baño, 2do piso, mascotas pequeñas máximo"
    },
    {
        type: "apartamento",
        bedrooms: 3,
        price: 2900,
        location: "41-20 Gleane St, Elmhurst, Queens",
        description: "1 baño, 3er piso, mascotas pequeñas máximo"
    },
    {
        type: "apartamento",
        bedrooms: 3,
        price: 3600,
        location: "9521 89th St, Corona, Queens",
        description: "Apt 3, 2 baños, 2 salas, segundo piso, solo agua incluida"
    },
    
    // Imagen 9
    {
        type: "cuarto",
        bedrooms: 1,
        price: 1300,
        location: "Corona, Queens",
        description: "Cuarto con baño propio, laundry en apartamento, depósito $750, buen espacio, acceso a cocina"
    },
    {
        type: "apartamento",
        bedrooms: 2,
        price: 2300,
        location: "98-26 Alstyne Ave, Corona, Queens",
        description: "1 baño, 2do piso, renovado, no mascotas, 3 personas máximo, no necesita crédito, pruebas de ingresos"
    },
    {
        type: "basement",
        bedrooms: 2,
        price: 1900,
        location: "9728 50Ave, Corona, Queens",
        description: "1 baño, paga electricidad, techos altos, ventanas grandes"
    },
    
    // Imagen 10
    {
        type: "apartamento",
        bedrooms: 2,
        price: 2100,
        location: "58-38 43 Ave, Woodside, Queens",
        description: "Calefacción y agua caliente incluidos, mascotas pequeñas permitidas"
    },
    {
        type: "apartamento",
        bedrooms: 4,
        price: 3400,
        location: "115-07 14ave, College Point, Queens",
        description: "2 baños, primer piso, requiere ingresos y credit score"
    },
    {
        type: "apartamento",
        bedrooms: 2,
        price: 2000,
        location: "185-05 Booth Memorial Ave, Fresh Meadows, Queens",
        description: "Pequeño, 1 baño, primer piso, todo incluido, 2-3 personas ok"
    },
    
    // Imagen 11
    {
        type: "apartamento",
        bedrooms: 4,
        price: 4000,
        location: "Calle 90 y Avenida 85, Jackson Heights, Queens",
        description: "Nuevo, grande, 2 baños, 1 cocina, sala, 2 balcones, primer piso, 1200 sq ft, calefacción incluida"
    },
    {
        type: "apartamento",
        bedrooms: 3,
        price: 3700,
        location: "73-00 Utopia Parkway, Jackson Heights cerca Corona, Queens",
        description: "2 baños, cocina, sala, recientemente renovado, calefacción y agua incluida"
    },
    {
        type: "apartamento",
        bedrooms: 2,
        price: 2380,
        location: "Jackson Heights cerca Elmhurst, Queens",
        description: "1 baño, cocina, sala, balcón pequeño, segundo piso, 700 sq ft, calefacción incluida"
    },
    {
        type: "apartamento",
        bedrooms: 2,
        price: 0, // Precio no especificado
        location: "126-10 5th Avenue, College Point, Queens",
        description: "Duplex, segundo piso, 1 saco, 1 baño, cocina, sala, aire acondicionado central y split"
    },
    {
        type: "apartamento",
        bedrooms: 3,
        price: 2580,
        location: "Corona cerca Flushing, Queens",
        description: "Nuevo, 1 baño, cocina comedor, segundo piso, 600 sq ft, calefacción incluida"
    },
    {
        type: "apartamento",
        bedrooms: 3,
        price: 3200,
        location: "Maspeth cerca Mount Sinai y Woodhaven, Queens",
        description: "2 baños, cocina, sala, primer piso, agua incluida, disponible 01/01/2026"
    },
    {
        type: "apartamento",
        bedrooms: 3,
        price: 3300,
        location: "Calle 40 y Junction Ave cerca Elmhurst, Queens",
        description: "Bonito, grande, 1 baño, cocina, sala, lavandería en edificio, segundo piso, 1100 sq ft, agua incluida"
    },
    {
        type: "basement",
        bedrooms: 3,
        price: 0, // Precio no especificado
        location: "67-01 NW, Woodside, Queens",
        description: "Bonito, nuevo, 1 baño, cocina comedor, 4 aires acondicionados individuales, solo paga electricidad, disponible 1/1/2026"
    },
    {
        type: "apartamento",
        bedrooms: 3,
        price: 3300,
        location: "Elmhurst, Queens",
        description: "Amplio, 2 baños, cocina, comedor, sala, tercer piso, 1100 sq ft, agua incluida, disponible 01/1/26"
    },
    {
        type: "apartamento",
        bedrooms: 3,
        price: 2000,
        location: "108 St x Ave R, Ozone Park cerca Brooklyn, Queens",
        description: "1 baño, cocina, sala, segundo piso, 950 sq ft, agua incluida"
    },
    {
        type: "apartamento",
        bedrooms: 3,
        price: 2100,
        location: "97-50 Corona St, Corona, Queens",
        description: "1 baño, renovado, segundo piso, 1100 sq ft, agua incluida, disponible 1/1/26"
    },
    {
        type: "apartamento",
        bedrooms: 4,
        price: 4400,
        location: "94-10 St, East Elmhurst, Queens",
        description: "2 baños, cocina, comedor, sala, agua incluida, disponible 1/1/26"
    },
    {
        type: "apartamento",
        bedrooms: 3,
        price: 3600,
        location: "24-5-50 61 Ave, Little Neck, Queens",
        description: "Nuevo, lujoso, primer piso, 1 baño, cocina con comedor, terraza, sala, lavadora in unidad, 800 sq ft, agua incluida, disponible 1/1/26"
    },
    {
        type: "apartamento",
        bedrooms: 1,
        price: 2000,
        location: "80 St x 51 Ave cerca Corona y Woodside, Elmhurst, Queens",
        description: "Bonito, amplio, 1 baño, cocina, sala, segundo piso, 700 sq ft, agua incluida"
    }
];

async function seedDatabase() {
    try {
        console.log('🌱 Iniciando población de base de datos...\n');
        console.log(`📊 Total de propiedades a insertar: ${properties.length}\n`);
        
        // Cargar apartamentos existentes
        await apartmentModel.loadApartments();
        const initialCount = apartmentModel.getAllApartments().length;
        console.log(`📋 Propiedades existentes en base de datos: ${initialCount}\n`);
        
        let insertedCount = 0;
        let skippedCount = 0;
        
        console.log('⚙️  Insertando propiedades...\n');
        
        for (let i = 0; i < properties.length; i++) {
            const property = properties[i];
            
            try {
                // Solo insertar si tiene precio válido
                if (property.price > 0) {
                    await apartmentModel.addApartment(property);
                    insertedCount++;
                    
                    const type = property.type.toUpperCase();
                    const bedrooms = property.bedrooms === 0 ? 'Studio' : `${property.bedrooms}BR`;
                    console.log(`  ✅ [${i + 1}/${properties.length}] ${type} ${bedrooms} - $${property.price} - ${property.location.substring(0, 40)}...`);
                } else {
                    skippedCount++;
                    console.log(`  ⏭️  [${i + 1}/${properties.length}] Omitida (sin precio): ${property.location.substring(0, 40)}...`);
                }
                
                // Pequeña pausa para no saturar
                await new Promise(resolve => setTimeout(resolve, 50));
                
            } catch (error) {
                console.log(`  ❌ Error insertando propiedad ${i + 1}: ${error.message}`);
            }
        }
        
        const finalCount = apartmentModel.getAllApartments().length;
        const newProperties = finalCount - initialCount;
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ POBLACIÓN DE BASE DE DATOS COMPLETADA');
        console.log('='.repeat(60));
        console.log(`📊 Propiedades procesadas: ${properties.length}`);
        console.log(`✅ Propiedades insertadas: ${insertedCount}`);
        console.log(`⏭️  Propiedades omitidas: ${skippedCount}`);
        console.log(`📈 Nuevas en base de datos: ${newProperties}`);
        console.log(`💾 Total en base de datos: ${finalCount}`);
        console.log('='.repeat(60) + '\n');
        
        if (insertedCount > 0) {
            console.log('🎉 ¡Excelente! La base de datos ha sido poblada exitosamente');
            console.log('💬 El bot ahora puede responder a clientes con estas propiedades');
            console.log('🔄 El bot seguirá capturando mensajes nuevos del grupo automáticamente\n');
        }
        
    } catch (error) {
        console.error('❌ Error en población de base de datos:', error);
    }
}

seedDatabase().catch(console.error);
