import api from './api'

// ================== ETUDIANTS ==================

// Créer un étudiant
export const createEtudiant = (data: any) => api.post('/users/etudiants', data)

// Modifier un étudiant
export const updateEtudiant = (id: number, data: any) => api.put(`/users/etudiants/${id}`, data)

// Récupérer tous les étudiants
export const getEtudiants = () => api.get('/users/etudiants')

// ================== ENSEIGNANTS ==================

// Créer un enseignant
export const createEnseignant = (data: any) => api.post('/users/enseignants', data)

// Modifier un enseignant
export const updateEnseignant = (id: number, data: any) => api.put(`/users/enseignants/${id}`, data)

// Récupérer tous les enseignants
export const getEnseignants = () => api.get('/users/enseignants')

// ================== TOUS LES UTILISATEURS ==================
export const getUsers = () => api.get('/users')

// ================== SUPPRIMER ==================
export const deleteUser = (id: number) => api.delete(`/users/${id}`)
