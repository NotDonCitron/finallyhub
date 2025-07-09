import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: (token) => api.get('/auth/verify'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Workspace API
export const workspaceService = {
  getAll: () => api.get('/workspaces'),
  getById: (id) => api.get(`/workspaces/${id}`),
  create: (data) => api.post('/workspaces', data),
  update: (id, data) => api.put(`/workspaces/${id}`, data),
  delete: (id) => api.delete(`/workspaces/${id}`),
  getStats: (id) => api.get(`/workspaces/${id}/stats`),
};

// Task API
export const taskService = {
  getAll: (params = {}) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  getCalendar: (year, month) => api.get(`/tasks/calendar/${year}/${month}`),
};

// File API
export const fileService = {
  getAll: (params = {}) => api.get('/files', { params }),
  getById: (id) => api.get(`/files/${id}`),
  upload: (formData, config = {}) => api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    ...config,
  }),
  update: (id, data) => api.put(`/files/${id}`, data),
  delete: (id) => api.delete(`/files/${id}`),
  download: (id) => `${API_BASE_URL}/api/files/${id}/download`,
};

// Comment API
export const commentService = {
  getAll: (params = {}) => api.get('/comments', { params }),
  create: (data) => api.post('/comments', data),
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
};

// Document API
export const documentService = {
  getAll: (params = {}) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  create: (data) => api.post('/documents', data),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
  search: (query, params = {}) => api.get(`/documents/search/${query}`, { params }),
};

// AI API
export const aiService = {
  generate: (data) => api.post('/ai/generate', data),
  suggestTasks: (data) => api.post('/ai/suggest-tasks', data),
  tagFile: (data) => api.post('/ai/tag-file', data),
  summarize: (data) => api.post('/ai/summarize', data),
  getStatus: () => api.get('/ai/status'),
};

export default api;