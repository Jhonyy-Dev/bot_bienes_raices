import NodeCache from 'node-cache';

/**
 * Modelo para gestionar conversaciones con clientes
 * Usa caché en memoria para mantener el historial de cada conversación
 */
class ConversationModel {
    constructor() {
        // Cache con TTL de 24 horas (86400 segundos)
        this.cache = new NodeCache({ stdTTL: 86400 });
    }

    /**
     * Obtiene el historial de conversación de un usuario
     */
    getHistory(phoneNumber) {
        const history = this.cache.get(phoneNumber);
        return history || [];
    }

    /**
     * Agrega un mensaje al historial
     */
    addMessage(phoneNumber, role, content) {
        const history = this.getHistory(phoneNumber);
        history.push({ role, content });

        // Mantener solo los últimos 10 mensajes para no sobrecargar el contexto
        const trimmedHistory = history.slice(-10);

        this.cache.set(phoneNumber, trimmedHistory);
        return trimmedHistory;
    }

    /**
     * Limpia el historial de un usuario
     */
    clearHistory(phoneNumber) {
        this.cache.del(phoneNumber);
    }

    /**
     * Obtiene todas las conversaciones activas
     */
    getAllConversations() {
        const keys = this.cache.keys();
        return keys.map(key => ({
            phoneNumber: key,
            messages: this.cache.get(key)
        }));
    }
}

export default new ConversationModel();
