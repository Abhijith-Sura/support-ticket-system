import api from './api';

export const ticketService = {
  async getTickets(params = {}) {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
    );
    const { data } = await api.get('/tickets', { params: cleanParams });
    return data;
  },

  async getStats() {
    const { data } = await api.get('/tickets/stats');
    return data.data;
  },

  async getTicket(id) {
    const { data } = await api.get(`/tickets/${id}`);
    return data.data;
  },

  async createTicket(payload) {
    const { data } = await api.post('/tickets', payload);
    return data.data;
  },

  async updateTicket(id, payload) {
    const { data } = await api.put(`/tickets/${id}`, payload);
    return data.data;
  },

  async deleteTicket(id) {
    const { data } = await api.delete(`/tickets/${id}`);
    return data;
  },

  async getTicketActivity(id) {
    const { data } = await api.get(`/tickets/${id}/activity`);
    return data.data;
  },
};
