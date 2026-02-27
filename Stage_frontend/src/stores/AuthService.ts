import axios from 'axios';

const API_URL = 'http://localhost:8085/api/auth/';

const AuthService = {
  register(user: any) {
    return axios.post(API_URL + 'register', user);
  },

  login(credentials: any) {
    return axios.post(API_URL + 'login', credentials).then(response => {
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
