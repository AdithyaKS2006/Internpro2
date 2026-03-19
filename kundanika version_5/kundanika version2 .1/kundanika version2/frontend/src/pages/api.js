// Use ngrok URL if available, otherwise fall back to local URL
export const BACKEND_URL = process.env.REACT_APP_BACKEND_NGROK_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
export const API = `${BACKEND_URL}/api`;

export const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});