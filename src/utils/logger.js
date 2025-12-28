import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/config.js';

class Logger {
    constructor() {
        this.logFile = path.join(config.paths.logs, 'bot.log');
    }

    async log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            ...(data && { data })
        };

        const logLine = JSON.stringify(logEntry) + '\n';

        try {
            await fs.appendFile(this.logFile, logLine, 'utf-8');
        } catch (error) {
            console.error('Error escribiendo en log:', error);
        }

        // También mostrar en consola
        console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
        if (data) {
            console.log(data);
        }
    }

    info(message, data) {
        return this.log('info', message, data);
    }

    error(message, data) {
        return this.log('error', message, data);
    }

    warn(message, data) {
        return this.log('warn', message, data);
    }
}

export default new Logger();
