import dotenv from 'dotenv';

dotenv.config();

export const config = {
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
  },
  whatsapp: {
    groupId: process.env.GROUP_ID || '',
  },
  bot: {
    name: process.env.BOT_NAME || 'Asistente de Bienes Raíces',
    location: process.env.LOCATION || 'Queens, New York',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  paths: {
    authInfo: './auth_info_baileys',
    chatsData: './data/chats',
    exports: './data/exports',
    logs: './data/logs',
  }
};
