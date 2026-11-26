import api from './api';

export const notificationService = {
  async getNotifications(limit = 15) {
    const { data } = await api.get('/notifications', { params: { limit } });
    return data.data;
  },

  async markAsRead(id) {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data.data;
  },

  async markAllAsRead() {
    const { data } = await api.put('/notifications/read-all');
    return data;
  },
};
