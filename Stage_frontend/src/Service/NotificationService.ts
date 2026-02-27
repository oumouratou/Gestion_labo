// src/Service/NotificationService.ts
import api from './api'

// ----------------- DTO -----------------
export interface NotificationDTO {
  id: number
  message: string
  read: boolean
  createdAt: string
  reservationId: number | null
  reclamationId?: number | null
  laboName?: string
  laboratoireNom?: string
  type: 'RESERVATION' | 'RECLAMATION'
  // Motif de refus (si applicable)
  motifRefus?: string
  // Données enrichies du demandeur
  demandeurNom?: string
  demandeurPrenom?: string
  demandeurCin?: string
  etudiantNom?: string
  etudiantPrenom?: string
  etudiantCin?: string
}

// ----------------- Technicien -----------------
export async function getNotificationsTechnicien(): Promise<{ data: NotificationDTO[] }> {
  try {
    const result = await api.get<NotificationDTO[]>('/notifications/technicien', { withCredentials: true })
    console.log('Notifications technicien:', result.data)
    return result
  } catch (error) {
    console.error('Erreur getNotificationsTechnicien:', error)
    return { data: [] }
  }
}

// ----------------- Toutes les notifications (pour technicien global) -----------------
export async function getAllNotifications(): Promise<{ data: NotificationDTO[] }> {
  // Essayer d'abord l'endpoint technicien
  try {
    const result = await api.get<NotificationDTO[]>('/notifications/technicien', { withCredentials: true })
    console.log(`Notifications chargées via /notifications/technicien:`, result.data)
    return result
  } catch (error: any) {
    console.warn(`Endpoint /notifications/technicien échoué:`, error.response?.status)
  }
  
  // Fallback sur /notifications/all
  try {
    const result = await api.get<NotificationDTO[]>('/notifications/all', { withCredentials: true })
    console.log(`Notifications chargées via /notifications/all:`, result.data)
    return result
  } catch (error: any) {
    console.warn(`Endpoint /notifications/all échoué:`, error.response?.status)
  }
  
  // Dernier fallback
  try {
    const result = await api.get<NotificationDTO[]>('/notifications', { withCredentials: true })
    console.log(`Notifications chargées via /notifications:`, result.data)
    return result
  } catch (error: any) {
    console.warn(`Endpoint /notifications échoué:`, error.response?.status)
  }
  
  console.warn('Aucun endpoint de notifications disponible')
  return { data: [] }
}

// ----------------- Étudiant -----------------
export async function getNotificationsEtudiant(): Promise<{ data: NotificationDTO[] }> {
  try {
    // Essayer d'abord l'endpoint pour toutes les notifications
    const result = await api.get<NotificationDTO[]>('/notifications/etudiant/all', { withCredentials: true })
    console.log('Notifications étudiant (toutes):', result.data)
    return result
  } catch (error: any) {
    console.warn('Endpoint /etudiant/all non disponible, essai /etudiant:', error.response?.status)
  }
  
  try {
    const result = await api.get<NotificationDTO[]>('/notifications/etudiant', { withCredentials: true })
    console.log('Notifications étudiant:', result.data)
    return result
  } catch (error) {
    console.error('Erreur getNotificationsEtudiant:', error)
    return { data: [] }
  }
}

// ----------------- Enseignant -----------------
export async function getNotificationsEnseignant(): Promise<{ data: NotificationDTO[] }> {
  try {
    // Essayer d'abord l'endpoint pour toutes les notifications
    const result = await api.get<NotificationDTO[]>('/notifications/enseignant/all', { withCredentials: true })
    console.log('Notifications enseignant (toutes):', result.data)
    return result
  } catch (error: any) {
    console.warn('Endpoint /enseignant/all non disponible, essai /enseignant:', error.response?.status)
  }
  
  try {
    const result = await api.get<NotificationDTO[]>('/notifications/enseignant', { withCredentials: true })
    console.log('Notifications enseignant:', result.data)
    return result
  } catch (error) {
    console.error('Erreur getNotificationsEnseignant:', error)
    return { data: [] }
  }
}

// ----------------- Marquer comme lue -----------------
export async function markNotificationAsRead(id: number): Promise<void> {
  return api.put(`/notifications/read/${id}`, {}, { withCredentials: true })
}

// ----------------- Marquer toutes comme lues -----------------
export async function markAllNotificationsAsRead(): Promise<void> {
  return api.put('/notifications/read-all', {}, { withCredentials: true })
}

// ----------------- Supprimer une notification -----------------
export async function deleteNotification(id: number): Promise<void> {
  return api.delete(`/notifications/${id}`, { withCredentials: true })
}
