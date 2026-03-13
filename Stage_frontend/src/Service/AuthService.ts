import api from '@/Service/api'

const AUTH_BASE = '/auth'

export default {
  register(user: any) {
    return api.post(`${AUTH_BASE}/register`, user)
  },

  login(credentials: { email: string; password: string }) {
    const normalizedCredentials = {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password
    }

    return api.post(`${AUTH_BASE}/login`, normalizedCredentials).then(response => {
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
    return api.post(`${AUTH_BASE}/forgot-password`, { email: email.trim().toLowerCase() })
  },

  // Réinitialiser le mot de passe avec le token
  resetPassword(token: string, newPassword: string) {
    return api.post(`${AUTH_BASE}/reset-password`, { token, newPassword })
  },

  // Vérifier si le token de réinitialisation est valide
  verifyResetToken(token: string) {
    return api.get(`${AUTH_BASE}/verify-reset-token`, { params: { token } })
  }
}
