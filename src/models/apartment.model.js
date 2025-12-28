import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/config.js';

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
            console.log(`📋 Cargados ${this.apartments.length} apartamentos desde el grupo de WhatsApp`);
        } catch (error) {
            // Si el archivo no existe, inicializar con array vacío
            this.apartments = [];
            console.log('📋 Iniciando con base de datos vacía');
            console.log('⏳ Los apartamentos se cargarán automáticamente del grupo de WhatsApp cuando lleguen mensajes nuevos');
        }
    }

    /**
     * Guarda los apartamentos en el archivo JSON
     */
    async saveApartments() {
        try {
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
     */
    getApartmentsByBedrooms(bedrooms) {
        return this.apartments.filter(apt =>
            apt.bedrooms === parseInt(bedrooms)
        );
    }

    /**
     * Obtiene apartamentos disponibles (todos)
     */
    getAvailableApartments(limit = 50) {
        return this.apartments
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }
}

export default new ApartmentModel();
