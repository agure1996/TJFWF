import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Use environment variable when set, otherwise use a relative path so Vite dev
// server proxy forwards requests to the backend (avoids CORS issues in dev).
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  let token: string | null = null;
  if (globalThis !== undefined && (globalThis as any).localStorage) {
    token = (globalThis as any).localStorage.getItem('auth_token');
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
