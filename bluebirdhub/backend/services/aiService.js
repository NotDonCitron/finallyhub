const axios = require('axios');
const { OpenRouterConfig } = require('../config/openrouter');

class OpenRouterService {
  constructor(apiKey = process.env.OPENROUTER_API_KEY) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://openrouter.ai/api/v1';
    this.headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.DOMAIN_URL || 'http://localhost:3000',
      'X-Title': 'Bluebirdhub'
    };
  }

  async summarizeDocument(content, title = '') {
    const prompt = `
Please provide a concise summary of the following document:

Title: ${title}
Content: ${content}

Summary should be 2-3 sentences highlighting the main points.
    `;
    
    return await this._makeRequest(prompt, 150);
  }

  async suggestImprovements(content) {
    const prompt = `
Please analyze the following document and suggest 3-5 specific improvements:

Content: ${content}

Focus on:
- Clarity and readability
- Structure and organization
- Content gaps or areas that need expansion
- Grammar and style improvements

Provide actionable suggestions.
    `;
    
    return await this._makeRequest(prompt, 300);
  }

  async answerQuestion(content, question) {
    const prompt = `
Based on the following document content, please answer this question:

Document Content: ${content}

Question: ${question}

If the answer is not in the document, please say so clearly.
    `;
    
    return await this._makeRequest(prompt, 200);
  }

  async generateOutline(topic, details = '') {
    const prompt = `
Create a detailed outline for a document about: ${topic}

Additional context: ${details}

Provide a structured outline with main sections and subsections.
Use markdown formatting for the outline.
    `;
    
    return await this._makeRequest(prompt, 400);
  }

  async improveWriting(content) {
    const prompt = `
Please improve the writing quality of the following text while maintaining its meaning:

Content: ${content}

Focus on:
- Grammar and spelling corrections
- Sentence structure improvements
- Clarity and flow
- Professional tone

Return only the improved text.
    `;
    
    return await this._makeRequest(prompt, 500);
  }

  async generateContent(topic, length = 'medium') {
    const lengthMap = {
      'short': '2-3 paragraphs',
      'medium': '4-6 paragraphs',
      'long': '8-10 paragraphs'
    };

    const prompt = `
Generate ${lengthMap[length] || lengthMap['medium']} of high-quality content about: ${topic}

Requirements:
- Well-structured and informative
- Professional tone
- Clear and engaging writing
- Include relevant examples or details
- Use markdown formatting for headers and lists where appropriate
    `;
    
    return await this._makeRequest(prompt, 800);
  }

  async _makeRequest(prompt, maxTokens = 200) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'anthropic/claude-3-haiku', // Fast and cost-effective
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: maxTokens,
          temperature: 0.7
        },
        {
          headers: this.headers,
          timeout: 30000
        }
      );

      if (response.status !== 200) {
        throw new Error(`OpenRouter API error: ${response.data}`);
      }

      return response.data.choices[0].message.content;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('AI service timeout. Please try again.');
      }
      
      if (error.response) {
        throw new Error(`OpenRouter API error: ${error.response.data?.error?.message || error.response.statusText}`);
      }
      
      throw new Error(`AI service error: ${error.message}`);
    }
  }
}

module.exports = new OpenRouterService();