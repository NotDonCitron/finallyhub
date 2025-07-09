import api from './api';

class AIService {
  async summarizeDocument(content, title = '') {
    try {
      const response = await api.post('/api/ai/summarize', {
        content,
        title
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to summarize document');
    }
  }

  async suggestImprovements(content) {
    try {
      const response = await api.post('/api/ai/suggest', {
        content
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get suggestions');
    }
  }

  async answerQuestion(content, question) {
    try {
      const response = await api.post('/api/ai/question', {
        content,
        question
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to answer question');
    }
  }

  async generateOutline(topic, details = '') {
    try {
      const response = await api.post('/api/ai/outline', {
        topic,
        details
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to generate outline');
    }
  }

  async improveWriting(content) {
    try {
      const response = await api.post('/api/ai/improve', {
        content
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to improve writing');
    }
  }

  async generateContent(topic, length = 'medium') {
    try {
      const response = await api.post('/api/ai/generate', {
        topic,
        length
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to generate content');
    }
  }

  async getStatus() {
    try {
      const response = await api.get('/api/ai/status');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to check AI status');
    }
  }
}

export default new AIService();