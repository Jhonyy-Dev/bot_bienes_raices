import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/config.js';

/**
 * Limpia sesiones antiguas de WhatsApp para evitar acumulación de archivos
 * Se ejecuta automáticamente cada 24 horas
 */
class SessionCleanup {
    constructor() {
        this.cleanupInterval = null;
        this.MAX_PREKEYS = 20; // Mantener solo 20 pre-keys más recientes
    }

    /**
     * Inicia la limpieza automática cada 24 horas
     */
    startAutoCleanup() {
        // Limpiar al iniciar
        this.cleanupOldSessions();
        
        // Limpiar cada 24 horas
        this.cleanupInterval = setInterval(() => {
            this.cleanupOldSessions();
        }, 24 * 60 * 60 * 1000); // 24 horas
    }

    /**
     * Limpia archivos de sesión antiguos
     */
    async cleanupOldSessions() {
        try {
            const authPath = path.resolve(config.paths.authInfo);
            
            // Verificar si existe el directorio
            try {
                await fs.access(authPath);
            } catch {
                return; // Directorio no existe, no hacer nada
            }

            const files = await fs.readdir(authPath);
            
            // Filtrar solo archivos pre-key
            const preKeyFiles = files.filter(file => file.startsWith('pre-key-') && file.endsWith('.json'));
            
            // Si hay más de MAX_PREKEYS, eliminar los más antiguos
            if (preKeyFiles.length > this.MAX_PREKEYS) {
                // Obtener stats de cada archivo
                const fileStats = await Promise.all(
                    preKeyFiles.map(async (file) => {
                        const filePath = path.join(authPath, file);
                        const stats = await fs.stat(filePath);
                        return {
                            name: file,
                            path: filePath,
                            mtime: stats.mtime
                        };
                    })
                );

                // Ordenar por fecha (más antiguos primero)
                fileStats.sort((a, b) => a.mtime - b.mtime);

                // Eliminar los más antiguos, mantener solo MAX_PREKEYS
                const filesToDelete = fileStats.slice(0, preKeyFiles.length - this.MAX_PREKEYS);

                for (const file of filesToDelete) {
                    await fs.unlink(file.path);
                }

                if (filesToDelete.length > 0) {
                    console.log(`🧹 Limpieza: Eliminados ${filesToDelete.length} archivos de sesión antiguos`);
                }
            }

        } catch (error) {
            // Error silencioso, no afectar funcionamiento
            console.error('Error en limpieza de sesiones:', error.message);
        }
    }

    /**
     * Detiene la limpieza automática
     */
    stopAutoCleanup() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
}

export default new SessionCleanup();
