import api from './api';

export const adminService = {
  async getDashboard() {
    const { data } = await api.get('/admin/dashboard');
    return data.data;
  },

  async getAllTickets(params = {}) {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
    );
    const { data } = await api.get('/admin/tickets', { params: cleanParams });
    return data;
  },

  async updateTicket(id, payload) {
    const { data } = await api.put(`/admin/tickets/${id}`, payload);
    return data.data;
  },

  async getActivity(params = {}) {
    const { data } = await api.get('/admin/activity', { params });
    return data;
  },

  async getUsers() {
    const { data } = await api.get('/admin/users');
    return data.data;
  },
};
