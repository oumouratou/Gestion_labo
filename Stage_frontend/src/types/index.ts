// Types pour l'application de gestion des laboratoires

export type UserRole = 'technicien' | 'enseignant' | 'etudiant'
export type UserRoleAPI = 'TECHNICIEN' | 'ENSEIGNANT' | 'ETUDIANT'

export interface User {
  id: number
  nom: string
  prenom?: string
  email?: string
  cin?: string
  role: UserRoleAPI
  departement?: {
    id: number
    nom: string
    description?: string
  }
  laboratoire?: {
    id: number
    nom: string
  }
  departementId?: number
}


export interface Departement {
  id: number
  nom: string
  description?: string
}

export interface Laboratoire {
  id: number
  nom?: string
  nomLabo?: string
  etat?: 'DISPONIBLE' | 'OCCUPE' | 'EN_MAINTENANCE'
  etatLabo?: string
  capacite?: number
  departementId?: number
  departement?: Departement
  description?: string
  equipements?: Equipement[]
}

export interface Equipement {
  id: number
  identifiant?: string
  nom: string
  description?: string
  caracteristique?: string
  quantite?: number
  etat: 'disponible' | 'en_panne' | 'maintenance' | 'DISPONIBLE' | 'EN_PANNE' | 'MAINTENANCE' | 'EN_MAINTENANCE' | 'FONCTIONNEL'
  statut?: string
  dateAcquisition?: string
  imageUrl?: string
  laboratoireId?: number
  laboratoire?: Laboratoire
  nombreReclamations?: number
  hasReclamationEnCours?: boolean
}

export interface Reservation {
  id: number
  dateReservation: string
  heureDebut: string
  heureFin: string
  statut: 'EN_ATTENTE' | 'APPROUVEE' | 'REFUSEE'
  motif?: string
  etudiantId?: number
  etudiant?: User
  laboratoireId?: number
  laboratoire?: Laboratoire
}

export interface Reclamation {
  id: number
  titre: string
  description: string
  priorite: 'BASSE' | 'MOYENNE' | 'HAUTE'
  statut: 'NOUVELLE' | 'EN_COURS' | 'RESOLUE'
  dateCreation?: string
  enseignantId?: number
  enseignant?: User
  equipementId?: number
  equipement?: Equipement
}
