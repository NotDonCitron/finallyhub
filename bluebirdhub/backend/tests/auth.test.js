const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Create a test user
      const testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('testuser');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should reject missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/verify', () => {
    it('should verify valid token', async () => {
      // Create user and login to get token
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });

    it('should reject missing token', async () => {
      const response = await request(app)
        .post('/api/auth/verify');

      expect(response.status).toBe(401);
    });
  });
});