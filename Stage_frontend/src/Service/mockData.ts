import { ref } from 'vue'
import type { Departement, Laboratoire, Equipement, Reservation, Reclamation, User } from '@/types'

// ==================== DONNÉES EN MÉMOIRE ====================

export const departements = ref<Departement[]>([
  { id: 1, nom: 'Informatique', description: 'Département d\'informatique et de génie logiciel' },
  { id: 2, nom: 'Mathématiques', description: 'Département de mathématiques et statistiques' },
  { id: 3, nom: 'Physique', description: 'Département de physique et sciences appliquées' }
])

export const laboratoires = ref<Laboratoire[]>([
  { id: 1, nom: 'Labo Info A', departementId: 1, capacite: 30, description: 'Laboratoire principal d\'informatique' },
  { id: 2, nom: 'Labo Info B', departementId: 1, capacite: 25, description: 'Laboratoire secondaire' },
  { id: 3, nom: 'Labo Math', departementId: 2, capacite: 20, description: 'Laboratoire de calcul' },
  { id: 4, nom: 'Labo Physique', departementId: 3, capacite: 15, description: 'Laboratoire d\'expérimentation' }
])

export const equipements = ref<Equipement[]>([
  { id: 1, nom: 'PC Dell OptiPlex', laboratoireId: 1, etat: 'fonctionnel', description: 'Ordinateur de bureau', dateAcquisition: '2024-01-15' },
  { id: 2, nom: 'Projecteur Epson', laboratoireId: 1, etat: 'fonctionnel', description: 'Projecteur HD', dateAcquisition: '2024-02-20' },
  { id: 3, nom: 'PC HP ProDesk', laboratoireId: 2, etat: 'en_panne', description: 'Ordinateur de bureau', dateAcquisition: '2023-06-10' },
  { id: 4, nom: 'Oscilloscope', laboratoireId: 4, etat: 'fonctionnel', description: 'Oscilloscope numérique', dateAcquisition: '2023-09-05' }
])

export const etudiants = ref<User[]>([
  { id: 1, nom: 'Martin', prenom: 'Alice', email: 'alice.martin@univ.fr', role: 'etudiant', departementId: 1 },
  { id: 2, nom: 'Durand', prenom: 'Bob', email: 'bob.durand@univ.fr', role: 'etudiant', departementId: 1 },
  { id: 3, nom: 'Bernard', prenom: 'Claire', email: 'claire.bernard@univ.fr', role: 'etudiant', departementId: 2 }
])

export const enseignants = ref<User[]>([
  { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@univ.fr', role: 'enseignant', departementId: 1 },
  { id: 2, nom: 'Moreau', prenom: 'Marie', email: 'marie.moreau@univ.fr', role: 'enseignant', departementId: 2 }
])

export const reservations = ref<Reservation[]>([
  { id: 1, etudiantId: 1, laboratoireId: 1, dateReservation: '2026-01-20', heureDebut: '08:00', heureFin: '10:00', statut: 'confirmee', motif: 'TP Programmation' },
  { id: 2, etudiantId: 2, laboratoireId: 2, dateReservation: '2026-01-21', heureDebut: '14:00', heureFin: '16:00', statut: 'en_attente', motif: 'Projet personnel' }
])

export const reclamations = ref<Reclamation[]>([
  { id: 1, enseignantId: 1, equipementId: 3, description: 'Ordinateur ne démarre plus', dateReclamation: '2026-01-15', statut: 'en_cours', priorite: 'haute' }
])

// ID counters
let nextDepartementId = 4
let nextLaboratoireId = 5
let nextEquipementId = 5
let nextEtudiantId = 4
let nextEnseignantId = 3
let nextReservationId = 3
let nextReclamationId = 2

// ==================== HELPER POUR SIMULER RÉPONSE API ====================

function mockResponse<T>(data: T): Promise<{ data: T }> {
  return Promise.resolve({ data })
}

// ==================== DÉPARTEMENT SERVICE ====================

export const getDepartements = () => mockResponse([...departements.value])

export const getDepartementById = (id: number) => {
  const dept = departements.value.find(d => d.id === id)
  return mockResponse(dept)
}

export const createDepartement = (data: Omit<Departement, 'id'>) => {
  const newDept: Departement = { id: nextDepartementId++, nom: data.nom, description: data.description }
  departements.value.push(newDept)
  return mockResponse(newDept)
}

export const updateDepartement = (id: number, data: Partial<Departement>) => {
  const item = departements.value.find(d => d.id === id)
  if (item) {
    if (data.nom !== undefined) item.nom = data.nom
    if (data.description !== undefined) item.description = data.description
    return mockResponse(item)
  }
  return Promise.reject(new Error('Département non trouvé'))
}

export const deleteDepartement = (id: number) => {
  departements.value = departements.value.filter(d => d.id !== id)
  return mockResponse(null)
}

// ==================== LABORATOIRE SERVICE ====================

export const getLaboratoires = () => mockResponse([...laboratoires.value])

export const getLaboratoireById = (id: number) => {
  const labo = laboratoires.value.find(l => l.id === id)
  return mockResponse(labo)
}

export const createLaboratoire = (data: Omit<Laboratoire, 'id'>) => {
  const newLabo: Laboratoire = { 
    id: nextLaboratoireId++, 
    nom: data.nom, 
    departementId: data.departementId, 
    capacite: data.capacite, 
    description: data.description 
  }
  laboratoires.value.push(newLabo)
  return mockResponse(newLabo)
}

export const updateLaboratoire = (id: number, data: Partial<Laboratoire>) => {
  const item = laboratoires.value.find(l => l.id === id)
  if (item) {
    if (data.nom !== undefined) item.nom = data.nom
    if (data.departementId !== undefined) item.departementId = data.departementId
    if (data.capacite !== undefined) item.capacite = data.capacite
    if (data.description !== undefined) item.description = data.description
    return mockResponse(item)
  }
  return Promise.reject(new Error('Laboratoire non trouvé'))
}

export const deleteLaboratoire = (id: number) => {
  laboratoires.value = laboratoires.value.filter(l => l.id !== id)
  return mockResponse(null)
}

// ==================== ÉQUIPEMENT SERVICE ====================

export const getEquipements = () => mockResponse([...equipements.value])

export const getEquipementById = (id: number) => {
  const equip = equipements.value.find(e => e.id === id)
  return mockResponse(equip)
}

export const getEquipementsByLaboratoire = (laboratoireId: number) => {
  const filtered = equipements.value.filter(e => e.laboratoireId === laboratoireId)
  return mockResponse(filtered)
}

export const createEquipement = (data: Omit<Equipement, 'id'>) => {
  const newEquip: Equipement = { 
    id: nextEquipementId++, 
    nom: data.nom, 
    description: data.description, 
    laboratoireId: data.laboratoireId, 
    etat: data.etat, 
    dateAcquisition: data.dateAcquisition 
  }
  equipements.value.push(newEquip)
  return mockResponse(newEquip)
}

export const updateEquipement = (id: number, data: Partial<Equipement>) => {
  const item = equipements.value.find(e => e.id === id)
  if (item) {
    if (data.nom !== undefined) item.nom = data.nom
    if (data.description !== undefined) item.description = data.description
    if (data.laboratoireId !== undefined) item.laboratoireId = data.laboratoireId
    if (data.etat !== undefined) item.etat = data.etat
    if (data.dateAcquisition !== undefined) item.dateAcquisition = data.dateAcquisition
    return mockResponse(item)
  }
  return Promise.reject(new Error('Équipement non trouvé'))
}

export const deleteEquipement = (id: number) => {
  equipements.value = equipements.value.filter(e => e.id !== id)
  return mockResponse(null)
}

// ==================== RÉSERVATION SERVICE ====================

export const getReservations = () => mockResponse([...reservations.value])

export const getReservationById = (id: number) => {
  const res = reservations.value.find(r => r.id === id)
  return mockResponse(res)
}

export const getReservationsByEtudiant = (etudiantId: number) => {
  const filtered = reservations.value.filter(r => r.etudiantId === etudiantId)
  return mockResponse(filtered)
}

export const createReservation = (data: Omit<Reservation, 'id'>) => {
  const newRes: Reservation = { 
    id: nextReservationId++, 
    etudiantId: data.etudiantId,
    laboratoireId: data.laboratoireId,
    dateReservation: data.dateReservation,
    heureDebut: data.heureDebut,
    heureFin: data.heureFin,
    statut: 'en_attente',
    motif: data.motif
  }
  reservations.value.push(newRes)
  return mockResponse(newRes)
}

export const updateReservation = (id: number, data: Partial<Reservation>) => {
  const item = reservations.value.find(r => r.id === id)
  if (item) {
    if (data.dateReservation !== undefined) item.dateReservation = data.dateReservation
    if (data.heureDebut !== undefined) item.heureDebut = data.heureDebut
    if (data.heureFin !== undefined) item.heureFin = data.heureFin
    if (data.statut !== undefined) item.statut = data.statut
    if (data.motif !== undefined) item.motif = data.motif
    return mockResponse(item)
  }
  return Promise.reject(new Error('Réservation non trouvée'))
}

export const cancelReservation = (id: number) => {
  return updateReservation(id, { statut: 'annulee' })
}

export const deleteReservation = (id: number) => {
  reservations.value = reservations.value.filter(r => r.id !== id)
  return mockResponse(null)
}

// ==================== RÉCLAMATION SERVICE ====================

export const getReclamations = () => mockResponse([...reclamations.value])

export const getReclamationById = (id: number) => {
  const rec = reclamations.value.find(r => r.id === id)
  return mockResponse(rec)
}

export const getReclamationsByEnseignant = (enseignantId: number) => {
  const filtered = reclamations.value.filter(r => r.enseignantId === enseignantId)
  return mockResponse(filtered)
}

export const createReclamation = (data: { enseignantId: number; equipementId: number; description: string; priorite: 'basse' | 'moyenne' | 'haute' | 'urgente' }) => {
  const newRec: Reclamation = { 
    id: nextReclamationId++, 
    enseignantId: data.enseignantId,
    equipementId: data.equipementId,
    description: data.description,
    dateReclamation: new Date().toISOString().split('T')[0] as string,
    statut: 'en_attente',
    priorite: data.priorite
  }
  reclamations.value.push(newRec)
  return mockResponse(newRec)
}

export const updateReclamation = (id: number, data: Partial<Reclamation>) => {
  const item = reclamations.value.find(r => r.id === id)
  if (item) {
    if (data.description !== undefined) item.description = data.description
    if (data.statut !== undefined) item.statut = data.statut
    if (data.priorite !== undefined) item.priorite = data.priorite
    return mockResponse(item)
  }
  return Promise.reject(new Error('Réclamation non trouvée'))
}

export const deleteReclamation = (id: number) => {
  reclamations.value = reclamations.value.filter(r => r.id !== id)
  return mockResponse(null)
}

// ==================== USER SERVICE ====================

export const getEtudiants = () => mockResponse([...etudiants.value])

export const getEtudiantById = (id: number) => {
  const etud = etudiants.value.find(e => e.id === id)
  return mockResponse(etud)
}

export const createEtudiant = (data: Omit<User, 'id'>) => {
  const newEtud: User = { 
    id: nextEtudiantId++, 
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    role: 'etudiant',
    departementId: data.departementId
  }
  etudiants.value.push(newEtud)
  return mockResponse(newEtud)
}

export const updateEtudiant = (id: number, data: Partial<User>) => {
  const item = etudiants.value.find(e => e.id === id)
  if (item) {
    if (data.nom !== undefined) item.nom = data.nom
    if (data.prenom !== undefined) item.prenom = data.prenom
    if (data.email !== undefined) item.email = data.email
    if (data.departementId !== undefined) item.departementId = data.departementId
    return mockResponse(item)
  }
  return Promise.reject(new Error('Étudiant non trouvé'))
}

export const deleteEtudiant = (id: number) => {
  etudiants.value = etudiants.value.filter(e => e.id !== id)
  return mockResponse(null)
}

export const getEnseignants = () => mockResponse([...enseignants.value])

export const getEnseignantById = (id: number) => {
  const ens = enseignants.value.find(e => e.id === id)
  return mockResponse(ens)
}

export const createEnseignant = (data: Omit<User, 'id'>) => {
  const newEns: User = { 
    id: nextEnseignantId++, 
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    role: 'enseignant',
    departementId: data.departementId
  }
  enseignants.value.push(newEns)
  return mockResponse(newEns)
}

export const updateEnseignant = (id: number, data: Partial<User>) => {
  const item = enseignants.value.find(e => e.id === id)
  if (item) {
    if (data.nom !== undefined) item.nom = data.nom
    if (data.prenom !== undefined) item.prenom = data.prenom
    if (data.email !== undefined) item.email = data.email
    if (data.departementId !== undefined) item.departementId = data.departementId
    return mockResponse(item)
  }
  return Promise.reject(new Error('Enseignant non trouvé'))
}

export const deleteEnseignant = (id: number) => {
  enseignants.value = enseignants.value.filter(e => e.id !== id)
  return mockResponse(null)
}

// ==================== STATS ====================

export const getStats = () => mockResponse({
  totalDepartements: departements.value.length,
  totalLaboratoires: laboratoires.value.length,
  totalEquipements: equipements.value.length,
  totalEtudiants: etudiants.value.length,
  totalEnseignants: enseignants.value.length,
  totalReservations: reservations.value.length,
  totalReclamations: reclamations.value.length,
  equipementsDisponibles: equipements.value.filter(e => e.etat === 'fonctionnel').length,
  equipementsEnPanne: equipements.value.filter(e => e.etat === 'en_panne').length,
  reservationsEnAttente: reservations.value.filter(r => r.statut === 'en_attente').length,
  reclamationsOuvertes: reclamations.value.filter(r => r.statut === 'en_attente' || r.statut === 'en_cours').length
})
