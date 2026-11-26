import api from './api';

export const authService = {
  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    return data.data;
  },

  async register(userData) {
    const { data } = await api.post('/auth/register', userData);
    return data.data;
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data.data.user;
  },
};
