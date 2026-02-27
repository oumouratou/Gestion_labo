import axios from "axios";

const api = axios.create({
  baseURL: "/api",  // URL relative - passera par le proxy Vite
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000
});

const publicEndpoints = ['/auth/login', '/auth/register', '/departements'];

const isPublicEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;
  return publicEndpoints.some(endpoint => url.includes(endpoint));
};

// Ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !isPublicEndpoint(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (isPublicEndpoint(config.url)) {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gestion globale des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isPublicEndpoint(error.config?.url)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const clearInvalidTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default api;
