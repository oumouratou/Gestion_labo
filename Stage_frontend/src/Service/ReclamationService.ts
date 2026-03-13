// src/Service/ReclamationService.ts
import axios from "axios"

// ✅ Créer une instance Axios vers le backend
const api = axios.create({
  baseURL: "http://localhost:8085/api/reclamations",
  headers: { "Content-Type": "application/json" }
})

// ✅ Instance générale pour les autres endpoints
const apiGeneral = axios.create({
  baseURL: "http://localhost:8085/api",
  headers: { "Content-Type": "application/json" }
})

// 🔹 Intercepteur pour ajouter automatiquement le token JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) config.headers!["Authorization"] = `Bearer ${token}`
  return config
})

apiGeneral.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) config.headers!["Authorization"] = `Bearer ${token}`
  return config
})

// ================= Export du service =================
const ReclamationService = {
  // 🔹 Mes réclamations (étudiant / enseignant)
  getMesReclamations: () => api.get("/mes"),

  // 🔹 Réclamations de l'étudiant connecté
  getReclamationsEtudiantConnecte: () => api.get("/etudiant"),

  // 🔹 Réclamations pour le technicien (essaie /all puis /pour-technicien)
  getReclamationsTechnicienConnecte: async () => {
    try {
      return await api.get("/all")
    } catch {
      return api.get("/technicien")
    }
  },
  
  getReclamationsPourTechnicien: async () => {
    try {
      return await api.get("/all")
    } catch {
      return api.get("/pour-technicien")
    }
  },
  
  // 🔹 Réclamations pour l'enseignant connecté
  getReclamationsEnseignantConnecte: () => api.get("/pour-enseignant"),

  // 🔹 Créer une nouvelle réclamation
  createReclamation: (data: any) => api.post("/create", data),

  // 🔹 Traiter une réclamation (approuver)
  traiterReclamation: (id: number) =>
    api.put(`/${id}/traiter-json`, { action: "TRAITEE" }),

  // 🔹 Annuler / Refuser une réclamation (par technicien - avec notification)
  annulerReclamation: (id: number, motif?: string) =>
    api.put(`/${id}/traiter-json`, { action: "REFUSEE", motifRefus: motif || "" }),

  // 🔹 Refuser une réclamation avec motif détaillé (OBLIGATOIRE)
  refuserReclamationAvecMotif: (id: number, motif: string) =>
    api.put(`/${id}/traiter-json`, { action: "REFUSEE", motifRefus: motif }),

  // 🔹 Mettre à jour le statut d'une réclamation (avec action personnalisée)
  updateReclamationStatus: (id: number, action: string, motifRefus?: string) =>
    api.put(`/${id}/traiter-json`, { action, motifRefus: motifRefus || "" }),

  // 🔹 Laboratoires par département de l'utilisateur connecté
  getLaboratoiresByDepartement: () => api.get("/laboratoires/by-departement"),

  // 🔹 Équipements par laboratoire
  getEquipementsByLaboReclamation: (laboId: number) => api.get(`/by-labo/${laboId}`),

  // 🔹 Toutes les réclamations
  getAllReclamations: async () => {
    try {
      return await api.get("/all")
    } catch {
      return api.get("/pour-technicien")
    }
  },

  // 🔹 Modifier une réclamation
  updateReclamation: (id: number, data: { description: string; quantite?: number }) =>
    api.put(`/${id}`, data),

  // 🔹 Auto-annuler (par l'auteur lui-même, sans notification)
  autoAnnulerReclamation: (id: number) =>
    api.put(`/${id}/auto-annuler`)
}

export default ReclamationService
