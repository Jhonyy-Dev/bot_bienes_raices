import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/config.js';
import { apartmentsSeed } from '../data/apartments.seed.js';

class ApartmentModel {
    constructor() {
        this.apartments = [];
        this.dataFile = path.join(config.paths.chatsData, 'apartments.json');
    }

    /**
     * Carga los apartamentos desde el archivo JSON
     */
    async loadApartments() {
        try {
            const data = await fs.readFile(this.dataFile, 'utf-8');
            this.apartments = JSON.parse(data);
            
            // Si está vacío o no hay datos, cargar seed
            if (!this.apartments || this.apartments.length === 0) {
                console.log('📋 Base de datos vacía. Cargando propiedades desde seed...');
                this.apartments = apartmentsSeed;
                await this.saveApartments();
                console.log(`✅ Cargadas ${this.apartments.length} propiedades desde seed`);
            } else {
                console.log(`📋 Cargados ${this.apartments.length} apartamentos desde archivo`);
            }
        } catch (error) {
            // Si el archivo no existe, cargar seed
            console.log('📋 Archivo no existe. Cargando propiedades desde seed...');
            this.apartments = apartmentsSeed;
            await this.saveApartments();
            console.log(`✅ Cargadas ${this.apartments.length} propiedades desde seed`);
        }
    }

    /**
     * Guarda los apartamentos en el archivo JSON
     */
    async saveApartments() {
        try {
            // Crear directorio si no existe
            const dir = path.dirname(this.dataFile);
            await fs.mkdir(dir, { recursive: true });
            
            await fs.writeFile(
                this.dataFile,
                JSON.stringify(this.apartments, null, 2),
                'utf-8'
            );
            console.log(`💾 Guardados ${this.apartments.length} apartamentos`);
        } catch (error) {
            console.error('Error guardando apartamentos:', error);
        }
    }

    /**
     * Agrega un nuevo apartamento
     */
    async addApartment(apartmentData) {
        const apartment = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...apartmentData
        };

        this.apartments.push(apartment);
        await this.saveApartments();
        console.log('✅ Nuevo apartamento agregado:', apartment);
        return apartment;
    }

    /**
     * Obtiene todos los apartamentos
     */
    getAllApartments() {
        return this.apartments;
    }

    /**
     * Filtra apartamentos por número de cuartos
     * Excluye propiedades con precio 0 o inválido
     */
    getApartmentsByBedrooms(bedrooms) {
        return this.apartments.filter(apt =>
            apt.bedrooms === parseInt(bedrooms) && apt.price && apt.price > 0
        );
    }

    /**
     * Obtiene apartamentos disponibles (todos)
     * Filtra propiedades con precio 0 o inválido
     */
    getAvailableApartments(limit = 50) {
        return this.apartments
            .filter(apt => apt.price && apt.price > 0)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }
}

export default new ApartmentModel();
