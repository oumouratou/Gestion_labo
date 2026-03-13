import api from '@/Service/api';

const AUTH_BASE = '/auth';

const AuthService = {
  register(user: any) {
    return api.post(`${AUTH_BASE}/register`, user);
  },

  login(credentials: any) {
    const normalizedCredentials = {
      email: typeof credentials?.email === 'string' ? credentials.email.trim().toLowerCase() : credentials?.email,
      password: credentials?.password
    };

    return api.post(`${AUTH_BASE}/login`, normalizedCredentials).then(response => {
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  }
};

export default AuthService; // <-- export par défaut
