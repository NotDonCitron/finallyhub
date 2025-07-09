const request = require('supertest');
const app = require('../app');
const { User, Workspace } = require('../models');

describe('Workspace Endpoints', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    await Workspace.destroy({ where: {} });
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

  describe('GET /api/workspaces', () => {
    it('should get user workspaces', async () => {
      // Create test workspaces
      await Workspace.create({
        name: 'Workspace 1',
        description: 'Description 1',
        ownerId: testUser.id
      });

      await Workspace.create({
        name: 'Workspace 2',
        description: 'Description 2',
        ownerId: testUser.id
      });

      const response = await request(app)
        .get('/api/workspaces')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('description');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/workspaces');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/workspaces', () => {
    it('should create new workspace', async () => {
      const workspaceData = {
        name: 'New Workspace',
        description: 'New workspace description'
      };

      const response = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workspaceData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(workspaceData.name);
      expect(response.body.description).toBe(workspaceData.description);
      expect(response.body.ownerId).toBe(testUser.id);
    });

    it('should require name', async () => {
      const workspaceData = {
        description: 'Description without name'
      };

      const response = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workspaceData);

      expect(response.status).toBe(400);
    });

    it('should require authentication', async () => {
      const workspaceData = {
        name: 'New Workspace',
        description: 'New workspace description'
      };

      const response = await request(app)
        .post('/api/workspaces')
        .send(workspaceData);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/workspaces/:id', () => {
    it('should update workspace', async () => {
      const workspace = await Workspace.create({
        name: 'Original Name',
        description: 'Original description',
        ownerId: testUser.id
      });

      const updateData = {
        name: 'Updated Name',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/workspaces/${workspace.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
    });

    it('should not update workspace owned by different user', async () => {
      // Create another user
      const anotherUser = await User.create({
        username: 'anotheruser',
        email: 'another@example.com',
        password: 'password123'
      });

      // Create workspace owned by another user
      const workspace = await Workspace.create({
        name: 'Another User Workspace',
        description: 'Not owned by test user',
        ownerId: anotherUser.id
      });

      const updateData = {
        name: 'Updated Name',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/workspaces/${workspace.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/workspaces/:id', () => {
    it('should delete workspace', async () => {
      const workspace = await Workspace.create({
        name: 'Workspace to Delete',
        description: 'This will be deleted',
        ownerId: testUser.id
      });

      const response = await request(app)
        .delete(`/api/workspaces/${workspace.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      // Verify workspace is deleted
      const deletedWorkspace = await Workspace.findByPk(workspace.id);
      expect(deletedWorkspace).toBeNull();
    });

    it('should not delete workspace owned by different user', async () => {
      // Create another user
      const anotherUser = await User.create({
        username: 'anotheruser',
        email: 'another@example.com',
        password: 'password123'
      });

      // Create workspace owned by another user
      const workspace = await Workspace.create({
        name: 'Another User Workspace',
        description: 'Not owned by test user',
        ownerId: anotherUser.id
      });

      const response = await request(app)
        .delete(`/api/workspaces/${workspace.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
    });
  });
});