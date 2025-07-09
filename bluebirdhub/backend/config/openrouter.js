const OpenRouterConfig = {
  apiKey: process.env.OPENROUTER_API_KEY,
  baseUrl: 'https://openrouter.ai/api/v1',
  models: {
    fast: 'anthropic/claude-3-haiku',      // Fast and cost-effective
    balanced: 'anthropic/claude-3-sonnet',  // Balanced performance
    premium: 'anthropic/claude-3-opus'      // High-quality responses
  },
  defaultModel: 'anthropic/claude-3-haiku',
  timeout: 30000,
  maxTokens: {
    summary: 150,
    suggestions: 300,
    question: 200,
    outline: 400,
    improve: 500,
    generate: 800
  }
};

module.exports = { OpenRouterConfig };