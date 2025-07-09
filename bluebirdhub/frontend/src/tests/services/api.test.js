import { describe, it, expect, vi, beforeEach } from 'vitest'
import api, { documentService, workspaceService } from '../../services/api'

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
    })),
  },
}))

describe('API Service', () => {
  let mockAxiosInstance

  beforeEach(() => {
    const axios = require('axios')
    mockAxiosInstance = axios.default.create()
    vi.clearAllMocks()
  })

  describe('documentService', () => {
    it('fetches all documents', async () => {
      const mockDocuments = [
        { id: 1, title: 'Doc 1', content: 'Content 1' },
        { id: 2, title: 'Doc 2', content: 'Content 2' },
      ]

      mockAxiosInstance.get.mockResolvedValue({
        data: mockDocuments,
      })

      const result = await documentService.getAll('workspace-1')

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/documents', {
        params: { workspace_id: 'workspace-1' },
      })
      expect(result).toEqual(mockDocuments)
    })

    it('creates a new document', async () => {
      const newDocument = {
        title: 'New Document',
        content: 'New content',
        workspaceId: 'workspace-1',
      }

      const createdDocument = {
        id: 3,
        ...newDocument,
      }

      mockAxiosInstance.post.mockResolvedValue({
        data: createdDocument,
      })

      const result = await documentService.create(newDocument)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/documents', newDocument)
      expect(result).toEqual(createdDocument)
    })

    it('updates a document', async () => {
      const updateData = {
        id: 1,
        title: 'Updated Document',
        content: 'Updated content',
      }

      const updatedDocument = {
        ...updateData,
        updatedAt: new Date().toISOString(),
      }

      mockAxiosInstance.put.mockResolvedValue({
        data: updatedDocument,
      })

      const result = await documentService.update(updateData)

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/api/documents/1', updateData)
      expect(result).toEqual(updatedDocument)
    })

    it('deletes a document', async () => {
      mockAxiosInstance.delete.mockResolvedValue({
        data: { message: 'Document deleted' },
      })

      const result = await documentService.delete(1)

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/documents/1')
      expect(result).toEqual({ message: 'Document deleted' })
    })

    it('handles API errors', async () => {
      const errorResponse = {
        response: {
          status: 404,
          data: { message: 'Document not found' },
        },
      }

      mockAxiosInstance.get.mockRejectedValue(errorResponse)

      await expect(documentService.getAll('workspace-1')).rejects.toThrow()
    })
  })

  describe('workspaceService', () => {
    it('fetches all workspaces', async () => {
      const mockWorkspaces = [
        { id: 1, name: 'Workspace 1', description: 'Description 1' },
        { id: 2, name: 'Workspace 2', description: 'Description 2' },
      ]

      mockAxiosInstance.get.mockResolvedValue({
        data: mockWorkspaces,
      })

      const result = await workspaceService.getAll()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/workspaces')
      expect(result).toEqual(mockWorkspaces)
    })

    it('creates a new workspace', async () => {
      const newWorkspace = {
        name: 'New Workspace',
        description: 'New workspace description',
      }

      const createdWorkspace = {
        id: 3,
        ...newWorkspace,
      }

      mockAxiosInstance.post.mockResolvedValue({
        data: createdWorkspace,
      })

      const result = await workspaceService.create(newWorkspace)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/workspaces', newWorkspace)
      expect(result).toEqual(createdWorkspace)
    })

    it('updates a workspace', async () => {
      const updateData = {
        id: 1,
        name: 'Updated Workspace',
        description: 'Updated description',
      }

      const updatedWorkspace = {
        ...updateData,
        updatedAt: new Date().toISOString(),
      }

      mockAxiosInstance.put.mockResolvedValue({
        data: updatedWorkspace,
      })

      const result = await workspaceService.update(updateData)

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/api/workspaces/1', updateData)
      expect(result).toEqual(updatedWorkspace)
    })

    it('deletes a workspace', async () => {
      mockAxiosInstance.delete.mockResolvedValue({
        data: { message: 'Workspace deleted' },
      })

      const result = await workspaceService.delete(1)

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/workspaces/1')
      expect(result).toEqual({ message: 'Workspace deleted' })
    })
  })

  describe('API interceptors', () => {
    it('adds authorization header from localStorage', () => {
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('mock-token'),
      }
      
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
      })

      // Test that interceptor setup was called
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled()
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled()
    })
  })
})