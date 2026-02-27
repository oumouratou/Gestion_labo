import axios from 'axios'

const API_URL = 'http://localhost:8085/api/auth/'

export default {
  register(user: any) {
    return axios.post(API_URL + 'register', user)
  },

  login(credentials: { email: string; password: string }) {
    return axios.post(API_URL + 'login', credentials).then(response => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data))
        localStorage.setItem('token', response.data.token)
      }
      return response.data
    })
  },

  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  },

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  getToken() {
    return localStorage.getItem('token')
  },

  // Demander la réinitialisation du mot de passe
  forgotPassword(email: string) {
    return axios.post(API_URL + 'forgot-password', { email })
  },

  // Réinitialiser le mot de passe avec le token
  resetPassword(token: string, newPassword: string) {
    return axios.post(API_URL + 'reset-password', { token, newPassword })
  },

  // Vérifier si le token de réinitialisation est valide
  verifyResetToken(token: string) {
    return axios.get(API_URL + 'verify-reset-token', { params: { token } })
  }
}
