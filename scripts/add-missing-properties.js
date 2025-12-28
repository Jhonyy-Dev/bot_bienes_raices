import apartmentModel from '../src/models/apartment.model.js';

/**
 * Script para agregar propiedades faltantes de las nuevas imágenes
 */

const missingProperties = [
    // Imagen 1: Dos cuartos para mujeres
    {
        type: "cuarto",
        bedrooms: 1,
        price: 950,
        location: "55-08 102 St, Queens",
        description: "Cuarto individual, solo para mujeres"
    },
    {
        type: "cuarto",
        bedrooms: 1,
        price: 950,
        location: "55-08 102 St, Queens",
        description: "Cuarto individual, solo para mujeres"
    },
    
    // Imagen 2: Mini studio
    {
        type: "studio",
        bedrooms: 0,
        price: 1600,
        location: "41-31 Elbertson St, Elmhurst, Queens",
        description: "Mini studio, basement"
    },
    
    // Imagen 3: Habitación para hombre
    {
        type: "cuarto",
        bedrooms: 1,
        price: 1000,
        location: "96-02 57Ave, Corona, Queens",
        description: "Habitación individual, solo para hombres"
    },
    
    // Imagen 4: Basement 1 habitación
    {
        type: "basement",
        bedrooms: 1,
        price: 1800,
        location: "151-17 14 Ave, Flushing, Queens",
        description: "Basement, todo incluido, sala grande"
    },
    
    // Imagen 5: Cuartos en casa privada Flushing
    {
        type: "cuarto",
        bedrooms: 1,
        price: 1100,
        location: "137-80 70 Rd, Flushing, Queens",
        description: "Cuarto con baño privado, casa privada, parking $70, 1 persona, listo ya"
    },
    {
        type: "cuarto",
        bedrooms: 1,
        price: 1200,
        location: "137-80 70 Rd, Flushing, Queens",
        description: "Cuarto con baño privado, casa privada, parking $70, pareja, listo ya"
    },
    {
        type: "cuarto",
        bedrooms: 1,
        price: 800,
        location: "137-80 70 Rd, Flushing, Queens",
        description: "Cuarto, casa privada, parking $70, 1 persona, listo ya"
    }
];

async function addMissingProperties() {
    try {
        console.log('📥 Agregando propiedades faltantes...\n');
        
        await apartmentModel.loadApartments();
        const initialCount = apartmentModel.getAllApartments().length;
        console.log(`📋 Propiedades actuales: ${initialCount}\n`);
        
        let added = 0;
        
        for (const property of missingProperties) {
            await apartmentModel.addApartment(property);
            added++;
            console.log(`✅ [${added}/${missingProperties.length}] ${property.type.toUpperCase()} - $${property.price} - ${property.location}`);
        }
        
        const finalCount = apartmentModel.getAllApartments().length;
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ PROPIEDADES AGREGADAS');
        console.log('='.repeat(60));
        console.log(`📊 Nuevas propiedades: ${added}`);
        console.log(`💾 Total en base de datos: ${finalCount}`);
        console.log('='.repeat(60) + '\n');
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

addMissingProperties().catch(console.error);
