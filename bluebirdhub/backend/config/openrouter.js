require('dotenv').config();

const OPENROUTER_CONFIG = {
  apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  apiKey: process.env.OPENROUTER_API_KEY,
  models: {
    default: 'mistralai/mistral-7b-instruct',
    fast: 'openai/gpt-3.5-turbo',
    smart: 'openai/gpt-4'
  },
  headers: {
    'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
    'X-Title': 'Bluebirdhub'
  }
};

module.exports = OPENROUTER_CONFIG;