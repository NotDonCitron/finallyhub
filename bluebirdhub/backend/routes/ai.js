const express = require('express');
const axios = require('axios');
const { verifyToken } = require('../middleware/auth');
const OPENROUTER_CONFIG = require('../config/openrouter');
const router = express.Router();

// AI Text Generation
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { prompt, model = OPENROUTER_CONFIG.models.default, maxTokens = 500 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt ist erforderlich' });
    }

    if (!OPENROUTER_CONFIG.apiKey) {
      return res.status(503).json({ error: 'KI-Service nicht konfiguriert' });
    }

    const response = await axios.post(OPENROUTER_CONFIG.apiUrl, {
      model,
      messages: [
        {
          role: 'system',
          content: 'Du bist ein hilfreicher Assistent für Projektmanagement und Aufgabenorganisation.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': OPENROUTER_CONFIG.headers['HTTP-Referer'],
        'X-Title': OPENROUTER_CONFIG.headers['X-Title']
      }
    });

    res.json({
      success: true,
      text: response.data.choices[0].message.content,
      model: model,
      usage: response.data.usage
    });

  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'KI-Service nicht verfügbar',
      details: error.response?.data?.error || error.message
    });
  }
});

// AI Task Suggestions
router.post('/suggest-tasks', verifyToken, async (req, res) => {
  try {
    const { projectDescription, workspaceContext } = req.body;
    
    if (!OPENROUTER_CONFIG.apiKey) {
      return res.status(503).json({ error: 'KI-Service nicht konfiguriert' });
    }

    const prompt = `
    Basierend auf der folgenden Projektbeschreibung, erstelle 5-8 konkrete Aufgaben:
    
    Projekt: ${projectDescription}
    Kontext: ${workspaceContext || 'Allgemeines Projekt'}
    
    Bitte gib die Aufgaben als JSON-Array zurück mit folgender Struktur:
    [
      {
        "title": "Aufgabentitel",
        "description": "Kurze Beschreibung",
        "priority": "medium",
        "estimatedHours": 2
      }
    ]
    `;

    const response = await axios.post(OPENROUTER_CONFIG.apiUrl, {
      model: OPENROUTER_CONFIG.models.default,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.5
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': OPENROUTER_CONFIG.headers['HTTP-Referer'],
        'X-Title': OPENROUTER_CONFIG.headers['X-Title']
      }
    });

    const aiResponse = response.data.choices[0].message.content;
    
    // Try to parse JSON from AI response
    let tasks = [];
    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        tasks = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
    }

    res.json({
      success: true,
      tasks: tasks,
      rawResponse: aiResponse
    });

  } catch (error) {
    console.error('AI Task Suggestion Error:', error);
    res.status(500).json({ error: 'Fehler bei der Aufgabenerstellung' });
  }
});

// AI File Auto-Tagging
router.post('/tag-file', verifyToken, async (req, res) => {
  try {
    const { fileName, fileType, fileContent } = req.body;
    
    if (!OPENROUTER_CONFIG.apiKey) {
      return res.status(503).json({ error: 'KI-Service nicht konfiguriert' });
    }

    const prompt = `
    Analysiere diese Datei und erstelle passende Tags:
    
    Dateiname: ${fileName}
    Dateityp: ${fileType}
    ${fileContent ? `Inhalt: ${fileContent.substring(0, 500)}...` : ''}
    
    Erstelle 3-5 relevante Tags für bessere Organisation.
    Antworte nur mit den Tags, getrennt durch Kommas.
    `;

    const response = await axios.post(OPENROUTER_CONFIG.apiUrl, {
      model: OPENROUTER_CONFIG.models.default,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.3
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': OPENROUTER_CONFIG.headers['HTTP-Referer'],
        'X-Title': OPENROUTER_CONFIG.headers['X-Title']
      }
    });

    const tagsText = response.data.choices[0].message.content.trim();
    const tags = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    res.json({
      success: true,
      tags: tags
    });

  } catch (error) {
    console.error('AI Tagging Error:', error);
    res.status(500).json({ error: 'Fehler beim Auto-Tagging' });
  }
});

// AI Content Summary
router.post('/summarize', verifyToken, async (req, res) => {
  try {
    const { content, maxLength = 200 } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Inhalt ist erforderlich' });
    }

    if (!OPENROUTER_CONFIG.apiKey) {
      return res.status(503).json({ error: 'KI-Service nicht konfiguriert' });
    }

    const prompt = `
    Fasse den folgenden Inhalt in maximal ${maxLength} Zeichen zusammen:
    
    ${content}
    
    Erstelle eine prägnante, aussagekräftige Zusammenfassung.
    `;

    const response = await axios.post(OPENROUTER_CONFIG.apiUrl, {
      model: OPENROUTER_CONFIG.models.fast,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: Math.ceil(maxLength / 3),
      temperature: 0.3
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': OPENROUTER_CONFIG.headers['HTTP-Referer'],
        'X-Title': OPENROUTER_CONFIG.headers['X-Title']
      }
    });

    const summary = response.data.choices[0].message.content.trim();

    res.json({
      success: true,
      summary: summary,
      originalLength: content.length,
      summaryLength: summary.length
    });

  } catch (error) {
    console.error('AI Summary Error:', error);
    res.status(500).json({ error: 'Fehler bei der Zusammenfassung' });
  }
});

// Check AI service status
router.get('/status', verifyToken, (req, res) => {
  res.json({
    available: !!OPENROUTER_CONFIG.apiKey,
    models: OPENROUTER_CONFIG.models,
    configured: !!OPENROUTER_CONFIG.apiKey
  });
});

module.exports = router;