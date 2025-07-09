import { authService } from './api';

export const login = async (username, password) => {
  try {
    const response = await authService.login({ username, password });
    const { token, user } = response.data;
    
    localStorage.setItem('authToken', token);
    return { user, token };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login fehlgeschlagen');
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
};

export const verifyToken = async (token) => {
  try {
    const response = await authService.verify(token);
    return response.data.user;
  } catch (error) {
    localStorage.removeItem('authToken');
    throw new Error('Token ungültig');
  }
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('authToken');
  return token;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};