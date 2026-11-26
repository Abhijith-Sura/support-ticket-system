import api from './api';

export const commentService = {
  async getComments(ticketId) {
    const { data } = await api.get(`/tickets/${ticketId}/comments`);
    return data.data;
  },

  async addComment(ticketId, text) {
    const { data } = await api.post(`/tickets/${ticketId}/comments`, { text });
    return data.data;
  },
};
