// ====================================
// src/services/authService.js - Servicio de autenticación
// ====================================
import api, { handleApiError, getApiData } from './api';

class AuthService {
  // 🔐 Login del administrador
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const data = getApiData(response);
      const user = data.user || data.admin;
      
      // Guardar token y datos del usuario
      if (data.token && user) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(user));
      }
      
      return { ...data, user };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 👤 Obtener perfil del admin autenticado
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return getApiData(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 🔄 Validar token actual
  async validateToken() {
    try {
      const response = await api.get('/auth/validate-token');
      const data = getApiData(response);
      return data.user || data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 🚪 Logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Error en logout:', error);
    } finally {
      // Limpiar datos locales siempre
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
  }

  // 🔑 Cambiar contraseña
  async changePassword(passwordData) {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return getApiData(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // ✅ Verificar si está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('admin_token');
    return !!token;
  }

  // 👤 Obtener usuario actual del localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // 🎫 Obtener token actual
  getToken() {
    return localStorage.getItem('admin_token');
  }
}

export default new AuthService();
