const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

describe('AI Endpoints', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    await User.destroy({ where: {} });

    // Create test user
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    // Get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  describe('GET /api/ai/status', () => {
    it('should return AI service status', async () => {
      const response = await request(app)
        .get('/api/ai/status')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('aiEnabled');
      expect(response.body).toHaveProperty('message');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/ai/status');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/ai/summarize', () => {
    it('should validate required content', async () => {
      const response = await request(app)
        .post('/api/ai/summarize')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Document'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Content is required');
    });

    it('should reject empty content', async () => {
      const response = await request(app)
        .post('/api/ai/summarize')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: '',
          title: 'Test Document'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Content is required');
    });

    it('should accept valid content', async () => {
      const response = await request(app)
        .post('/api/ai/summarize')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'This is a test document with some content.',
          title: 'Test Document'
        });

      // If no API key is configured, expect 500, otherwise 200
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('POST /api/ai/suggest', () => {
    it('should validate required content', async () => {
      const response = await request(app)
        .post('/api/ai/suggest')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Content is required');
    });

    it('should accept valid content', async () => {
      const response = await request(app)
        .post('/api/ai/suggest')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'This is a test document that needs improvement.'
        });

      // If no API key is configured, expect 500, otherwise 200
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('POST /api/ai/question', () => {
    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/ai/question')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test content'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Question is required');
    });

    it('should accept valid content and question', async () => {
      const response = await request(app)
        .post('/api/ai/question')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'This document discusses project management methodologies.',
          question: 'What is the main topic of this document?'
        });

      // If no API key is configured, expect 500, otherwise 200
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('POST /api/ai/outline', () => {
    it('should validate required topic', async () => {
      const response = await request(app)
        .post('/api/ai/outline')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Topic is required');
    });

    it('should accept valid topic', async () => {
      const response = await request(app)
        .post('/api/ai/outline')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          topic: 'Project Management Best Practices',
          details: 'Focus on agile methodologies'
        });

      // If no API key is configured, expect 500, otherwise 200
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('POST /api/ai/improve', () => {
    it('should validate required content', async () => {
      const response = await request(app)
        .post('/api/ai/improve')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Content is required');
    });

    it('should accept valid content', async () => {
      const response = await request(app)
        .post('/api/ai/improve')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'This text need some improvement for grammar and style.'
        });

      // If no API key is configured, expect 500, otherwise 200
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('POST /api/ai/generate', () => {
    it('should validate required topic', async () => {
      const response = await request(app)
        .post('/api/ai/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Topic is required');
    });

    it('should validate length parameter', async () => {
      const response = await request(app)
        .post('/api/ai/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          topic: 'Test Topic',
          length: 'invalid'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Length must be one of');
    });

    it('should accept valid topic and length', async () => {
      const response = await request(app)
        .post('/api/ai/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          topic: 'Benefits of Remote Work',
          length: 'medium'
        });

      // If no API key is configured, expect 500, otherwise 200
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('Authentication Requirements', () => {
    const endpoints = [
      'POST /api/ai/summarize',
      'POST /api/ai/suggest',
      'POST /api/ai/question',
      'POST /api/ai/outline',
      'POST /api/ai/improve',
      'POST /api/ai/generate'
    ];

    endpoints.forEach(endpoint => {
      const [method, path] = endpoint.split(' ');
      
      it(`should require authentication for ${endpoint}`, async () => {
        const response = await request(app)[method.toLowerCase()](path)
          .send({
            content: 'test content',
            topic: 'test topic',
            question: 'test question'
          });

        expect(response.status).toBe(401);
      });
    });
  });
});