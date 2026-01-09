import NodeCache from 'node-cache';

/**
 * Modelo para gestionar el estado de las conversaciones
 * Controla si el bot está activo o si se requiere intervención humana
 */
class ConversationStateModel {
    constructor() {
        // Cache con TTL de 24 horas (86400 segundos)
        this.cache = new NodeCache({ stdTTL: 86400 });
    }

    /**
     * Estados posibles de una conversación
     */
    static STATES = {
        BOT_ACTIVE: 'bot_active',           // Bot responde automáticamente
        WAITING_MEDIA: 'waiting_media',     // Esperando que humano envíe fotos/videos
        HUMAN_TAKEOVER: 'human_takeover',   // Humano ha tomado control
        PROPERTY_OFFER: 'property_offer'    // Cliente quiere ofrecer propiedad
    };

    /**
     * Obtiene el estado actual de una conversación
     */
    getState(phoneNumber) {
        const state = this.cache.get(phoneNumber);
        return state || ConversationStateModel.STATES.BOT_ACTIVE;
    }

    /**
     * Establece el estado de una conversación
     */
    setState(phoneNumber, state, metadata = {}) {
        const stateData = {
            state,
            metadata,
            timestamp: new Date().toISOString()
        };
        this.cache.set(phoneNumber, stateData);
        console.log(`🔄 Estado de ${phoneNumber}: ${state}`);
        return stateData;
    }

    /**
     * Verifica si el bot debe responder
     */
    shouldBotRespond(phoneNumber) {
        const stateData = this.cache.get(phoneNumber);
        if (!stateData) return true;
        
        return stateData.state === ConversationStateModel.STATES.BOT_ACTIVE;
    }

    /**
     * Verifica si está esperando media del humano
     */
    isWaitingMedia(phoneNumber) {
        const stateData = this.cache.get(phoneNumber);
        return stateData?.state === ConversationStateModel.STATES.WAITING_MEDIA;
    }

    /**
     * Obtiene metadata del estado actual
     */
    getMetadata(phoneNumber) {
        const stateData = this.cache.get(phoneNumber);
        return stateData?.metadata || {};
    }

    /**
     * Resetea el estado a BOT_ACTIVE
     */
    resetToBot(phoneNumber) {
        this.setState(phoneNumber, ConversationStateModel.STATES.BOT_ACTIVE);
    }

    /**
     * Limpia el estado de un usuario
     */
    clearState(phoneNumber) {
        this.cache.del(phoneNumber);
    }

    /**
     * Obtiene todos los estados activos
     */
    getAllStates() {
        const keys = this.cache.keys();
        return keys.map(key => ({
            phoneNumber: key,
            ...this.cache.get(key)
        }));
    }
}

export default new ConversationStateModel();
