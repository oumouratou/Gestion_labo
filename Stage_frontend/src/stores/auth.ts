import { defineStore } from 'pinia'
import AuthService from '@/stores/AuthService'
import api from '@/Service/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null as null | { 
      id: number; 
      nom: string; 
      prenom: string; 
      role: string;
      email?: string;
      cin?: string;
      dateCreation?: string;
      departement?: { id: number; nom: string };
      departementId?: number;
      departementNom?: string;
      isChefDepartement?: boolean;
      chefDepartement?: boolean;
    },
    token: null as string | null,
    isAuthenticated: false,
    isLoading: false,
    error: null as string | null
  }),
  getters: {
    userRole(state) {
      return state.currentUser?.role.toLowerCase() || null
    },
    isChefDepartement(state): boolean {
      const u = state.currentUser as any
      if (!u) return false
      return u.isChefDepartement === true || u.chefDepartement === true || u.chef_departement === true || u.estChefDepartement === true
    }
  },
  actions: {
    initAuth() {
      const user = AuthService.getCurrentUser()
      const token = AuthService.getToken()
      if (user && token) {
        // Normaliser le département si nécessaire
        if (user.departementId && user.departementNom && !user.departement) {
          user.departement = { id: user.departementId, nom: user.departementNom }
        }
        this.currentUser = user
        this.token = token
        this.isAuthenticated = true
        
        // Si le champ isChefDepartement n'est pas encore connu, enrichir le profil
        if (user.role?.toLowerCase() === 'enseignant' && 
            user.isChefDepartement === undefined && 
            user.chefDepartement === undefined) {
          this.enrichUserProfile()
        }
      } else {
        this.currentUser = null
        this.token = null
        this.isAuthenticated = false
      }
    },
    clearError() {
      this.error = null
    },
    async login(credentials: { email: string; password: string }) {
      this.isLoading = true
      this.error = null
      try {
        const res = await AuthService.login(credentials)
        this.initAuth()
        // Enrichir avec le profil complet du backend
        await this.enrichUserProfile()
        console.log('✅ Login réussi - isChefDepartement:', this.isChefDepartement)
        return true
      } catch (err: any) {
        console.error('Erreur login:', err)
        this.error = err.response?.data?.message || 'Email ou mot de passe incorrect'
        return false
      } finally {
        this.isLoading = false
      }
    },
    async register(userData: {
      nom: string;
      prenom: string;
      email: string;
      password: string;
      cin: string;
      role: 'ETUDIANT' | 'ENSEIGNANT' | 'TECHNICIEN';
      departementId?: number | null;
      isChefDepartement?: boolean;
    }) {
      this.isLoading = true
      this.error = null
      try {
        await AuthService.register(userData)
        // Après inscription, on connecte automatiquement
        const loginRes = await AuthService.login({ 
          email: userData.email, 
          password: userData.password 
        })
        this.initAuth()
        return true
      } catch (err: any) {
        console.error('Erreur register:', err)
        console.error('Détails erreur:', err.response?.data)
        // Afficher un message d'erreur plus détaillé
        const errorData = err.response?.data
        if (typeof errorData === 'string') {
          this.error = errorData
        } else if (errorData?.message) {
          // Traduire les messages d'erreur courants
          const msg = errorData.message
          if (msg.includes('Email déjà utilisé')) {
            this.error = 'Cette adresse email est déjà utilisée'
          } else if (msg.includes('CIN existe déjà') || msg.includes('cin')) {
            this.error = 'Ce numéro CIN est déjà utilisé par un autre compte'
          } else if (msg.includes('Département introuvable')) {
            this.error = 'Le département sélectionné n\'existe pas'
          } else {
            this.error = msg
          }
        } else if (errorData?.error) {
          this.error = errorData.error
        } else if (err.response?.status === 400) {
          this.error = 'Données invalides. Vérifiez tous les champs du formulaire.'
        } else {
          this.error = 'Erreur lors de l\'inscription. Vérifiez que tous les champs sont valides.'
        }
        return false
      } finally {
        this.isLoading = false
      }
    },
    logout() {
      AuthService.logout()
      this.initAuth()
    },
    async enrichUserProfile() {
      // Récupérer le profil complet pour obtenir isChefDepartement
      try {
        const res = await api.get('/users/profil')
        const profileData = res.data
        if (profileData && this.currentUser) {
          // Fusionner les données du profil avec le currentUser
          const merged = { ...this.currentUser }
          // Vérifier tous les noms possibles du champ chef de département
          if (profileData.isChefDepartement !== undefined) {
            merged.isChefDepartement = profileData.isChefDepartement
          }
          if (profileData.chefDepartement !== undefined) {
            merged.chefDepartement = profileData.chefDepartement
          }
          if (profileData.chef_departement !== undefined) {
            merged.isChefDepartement = profileData.chef_departement
          }
          if (profileData.estChefDepartement !== undefined) {
            merged.isChefDepartement = profileData.estChefDepartement
          }
          this.currentUser = merged
          // Mettre à jour le localStorage
          const stored = localStorage.getItem('user')
          if (stored) {
            const userData = JSON.parse(stored)
            Object.assign(userData, {
              isChefDepartement: merged.isChefDepartement,
              chefDepartement: merged.chefDepartement
            })
            localStorage.setItem('user', JSON.stringify(userData))
          }
          console.log('Profil enrichi - isChefDepartement:', this.isChefDepartement)
        }
      } catch (err: any) {
        console.warn('Impossible de récupérer le profil complet:', err.response?.status || err.message)
        // Fallback: essayer l'endpoint /auth/me
        try {
          const res2 = await api.get('/auth/me')
          const data = res2.data
          if (data && this.currentUser) {
            if (data.isChefDepartement !== undefined) {
              (this.currentUser as any).isChefDepartement = data.isChefDepartement
            }
            if (data.chefDepartement !== undefined) {
              (this.currentUser as any).chefDepartement = data.chefDepartement
            }
            // Mettre à jour localStorage
            const stored = localStorage.getItem('user')
            if (stored) {
              const userData = JSON.parse(stored)
              Object.assign(userData, { isChefDepartement: data.isChefDepartement ?? data.chefDepartement })
              localStorage.setItem('user', JSON.stringify(userData))
            }
            console.log('Profil enrichi via /auth/me - isChefDepartement:', this.isChefDepartement)
          }
        } catch {
          console.warn('Endpoint /auth/me non disponible non plus')
        }
      }
    }
  }
})
