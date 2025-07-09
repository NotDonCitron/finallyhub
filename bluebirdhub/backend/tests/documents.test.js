const request = require('supertest');
const app = require('../app');
const { User, Workspace, Document } = require('../models');

describe('Document Endpoints', () => {
  let testUser;
  let testWorkspace;
  let authToken;

  beforeEach(async () => {
    await Document.destroy({ where: {} });
    await Workspace.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Create test user
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    // Create test workspace
    testWorkspace = await Workspace.create({
      name: 'Test Workspace',
      description: 'Test workspace for documents',
      ownerId: testUser.id
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

  describe('GET /api/documents', () => {
    it('should get documents for workspace', async () => {
      // Create test documents
      await Document.create({
        title: 'Test Document 1',
        content: 'Content 1',
        workspaceId: testWorkspace.id,
        createdBy: testUser.id
      });

      await Document.create({
        title: 'Test Document 2',
        content: 'Content 2',
        workspaceId: testWorkspace.id,
        createdBy: testUser.id
      });

      const response = await request(app)
        .get(`/api/documents?workspace_id=${testWorkspace.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('content');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/api/documents?workspace_id=${testWorkspace.id}`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/documents', () => {
    it('should create new document', async () => {
      const documentData = {
        title: 'New Document',
        content: 'New document content',
        workspaceId: testWorkspace.id
      };

      const response = await request(app)
        .post('/api/documents')
        .set('Authorization', `Bearer ${authToken}`)
        .send(documentData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(documentData.title);
      expect(response.body.content).toBe(documentData.content);
    });

    it('should require title', async () => {
      const documentData = {
        content: 'Content without title',
        workspaceId: testWorkspace.id
      };

      const response = await request(app)
        .post('/api/documents')
        .set('Authorization', `Bearer ${authToken}`)
        .send(documentData);

      expect(response.status).toBe(400);
    });

    it('should require authentication', async () => {
      const documentData = {
        title: 'New Document',
        content: 'New document content',
        workspaceId: testWorkspace.id
      };

      const response = await request(app)
        .post('/api/documents')
        .send(documentData);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/documents/:id', () => {
    it('should update document', async () => {
      const document = await Document.create({
        title: 'Original Title',
        content: 'Original content',
        workspaceId: testWorkspace.id,
        createdBy: testUser.id
      });

      const updateData = {
        title: 'Updated Title',
        content: 'Updated content'
      };

      const response = await request(app)
        .put(`/api/documents/${document.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.content).toBe(updateData.content);
    });

    it('should not update non-existent document', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content'
      };

      const response = await request(app)
        .put('/api/documents/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/documents/:id', () => {
    it('should delete document', async () => {
      const document = await Document.create({
        title: 'Document to Delete',
        content: 'Content to delete',
        workspaceId: testWorkspace.id,
        createdBy: testUser.id
      });

      const response = await request(app)
        .delete(`/api/documents/${document.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      // Verify document is deleted
      const deletedDocument = await Document.findByPk(document.id);
      expect(deletedDocument).toBeNull();
    });

    it('should not delete non-existent document', async () => {
      const response = await request(app)
        .delete('/api/documents/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});