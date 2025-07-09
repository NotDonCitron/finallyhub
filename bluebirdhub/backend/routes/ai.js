const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { verifyToken } = require('../middleware/auth');

// Apply authentication middleware to all AI routes
router.use(verifyToken);

// Summarize document content
router.post('/summarize', async (req, res) => {
  try {
    const { content, title = '' } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Content is required and cannot be empty' 
      });
    }

    const summary = await aiService.summarizeDocument(content, title);
    
    res.json({ 
      summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Summarize Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error.message 
    });
  }
});

// Get improvement suggestions
router.post('/suggest', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Content is required and cannot be empty' 
      });
    }

    const suggestions = await aiService.suggestImprovements(content);
    
    res.json({ 
      suggestions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Suggest Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate suggestions',
      details: error.message 
    });
  }
});

// Answer question about document
router.post('/question', async (req, res) => {
  try {
    const { content, question } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Content is required and cannot be empty' 
      });
    }

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Question is required and cannot be empty' 
      });
    }

    const answer = await aiService.answerQuestion(content, question);
    
    res.json({ 
      answer,
      question,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Question Error:', error);
    res.status(500).json({ 
      error: 'Failed to answer question',
      details: error.message 
    });
  }
});

// Generate document outline
router.post('/outline', async (req, res) => {
  try {
    const { topic, details = '' } = req.body;
    
    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Topic is required and cannot be empty' 
      });
    }

    const outline = await aiService.generateOutline(topic, details);
    
    res.json({ 
      outline,
      topic,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Outline Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate outline',
      details: error.message 
    });
  }
});

// Improve writing quality
router.post('/improve', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Content is required and cannot be empty' 
      });
    }

    const improvedContent = await aiService.improveWriting(content);
    
    res.json({ 
      improvedContent,
      originalContent: content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Improve Error:', error);
    res.status(500).json({ 
      error: 'Failed to improve writing',
      details: error.message 
    });
  }
});

// Generate content
router.post('/generate', async (req, res) => {
  try {
    const { topic, length = 'medium' } = req.body;
    
    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Topic is required and cannot be empty' 
      });
    }

    const validLengths = ['short', 'medium', 'long'];
    if (!validLengths.includes(length)) {
      return res.status(400).json({ 
        error: 'Length must be one of: short, medium, long' 
      });
    }

    const content = await aiService.generateContent(topic, length);
    
    res.json({ 
      content,
      topic,
      length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Generate Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      details: error.message 
    });
  }
});

// Health check for AI service
router.get('/status', (req, res) => {
  const hasApiKey = !!process.env.OPENROUTER_API_KEY;
  
  res.json({
    status: 'ok',
    aiEnabled: hasApiKey,
    message: hasApiKey ? 'AI service is configured' : 'AI service requires API key configuration',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;