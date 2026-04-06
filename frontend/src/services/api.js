import axios from 'axios';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  const { hostname } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://${hostname}:5000`;
  }
  return 'http://localhost:5000';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
});

export const getMessages = () => api.get('/messages');
export const createMessage = (data) => api.post('/messages', data);
export const deleteMessage = (id, data) => api.delete(`/messages/${id}`, { data });
export const togglePin = (id) => api.patch(`/messages/${id}/pin`);

export default api;
