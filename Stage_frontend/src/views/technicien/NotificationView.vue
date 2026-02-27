<template>
  <div>
    <section class="content-header">
      <div class="container-fluid">
        <h1><i class="fas fa-bell mr-2"></i> Notifications</h1>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <!-- Onglets pour filtrer -->
        <div class="tabs-container mb-3">
          <button 
            class="btn mr-2" 
            :class="activeFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'"
            @click="activeFilter = 'all'"
          >
            <i class="fas fa-list mr-1"></i> Toutes
          </button>
          <button 
            class="btn" 
            :class="activeFilter === 'RECLAMATION' ? 'btn-warning' : 'btn-outline-warning'"
            @click="activeFilter = 'RECLAMATION'"
          >
            <i class="fas fa-exclamation-triangle mr-1"></i> Réclamations
          </button>
        </div>

        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3 class="card-title">Liste des notifications</h3>
            <button class="btn btn-sm btn-primary" @click="fetchNotifications">
              <i class="fas fa-sync-alt mr-1"></i> Rafraîchir
            </button>
          </div>

          <div class="card-body table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Demandeur</th>
                  <th>CIN</th>
                  <th>Laboratoire</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="notif in filteredNotifications" :key="notif.id" :class="{ 'table-light': notif.read }">
                  <td>
                    <span :class="typeBadge(notif.type)">
                      <i :class="typeIcon(notif.type)" class="mr-1"></i>
                      {{ notif.type === 'RESERVATION' ? 'Réservation' : 'Réclamation' }}
                    </span>
                  </td>
                  <td>
                    {{ getDemandeurNom(notif) }}
                  </td>
                  <td>{{ getDemandeurCin(notif) }}</td>
                  <td>{{ notif.laboName || notif.laboratoireNom || '—' }}</td>
                  <td>{{ truncateText(notif.message, 50) }}</td>
                  <td>{{ formatDate(notif.createdAt) }}</td>
                  <td>
                    <span :class="notif.read ? 'badge badge-secondary' : 'badge badge-primary'">
                      {{ notif.read ? 'Lu' : 'Non lu' }}
                    </span>
                  </td>
                  <td>
                    <button 
                      class="btn btn-success btn-sm mr-1"
                      @click="openNotification(notif)"
                      :disabled="notif.read"
                    >
                      <i class="fas fa-eye mr-1"></i> {{ notif.read ? 'Vu' : 'Voir' }}
                    </button>
                  </td>
                </tr>

                <tr v-if="filteredNotifications.length === 0">
                  <td colspan="8" class="text-center text-muted py-4">
                    <i class="fas fa-bell-slash fa-2x mb-2"></i>
                    <p class="mb-0">Aucune notification</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllNotifications, markNotificationAsRead } from '@/Service/NotificationService'
import api from '@/Service/api'

interface NotificationDTO {
  id: number
  message: string
  read: boolean
  createdAt: string
  reservationId: number | null
  reclamationId?: number | null
  laboName?: string
  laboratoireNom?: string
  type: string
  motifRefus?: string
  // Données enrichies du demandeur
  demandeurNom?: string
  demandeurPrenom?: string
  demandeurCin?: string
  etudiantNom?: string
  etudiantPrenom?: string
  etudiantCin?: string
  auteurNom?: string
  auteurPrenom?: string
  auteurCin?: string
  reservation?: {
    etudiant?: { nom: string; prenom: string; cin?: string }
  }
  reclamation?: {
    auteur?: { nom: string; prenom: string; cin?: string }
  }
}

const router = useRouter()
const notifications = ref<NotificationDTO[]>([])
const activeFilter = ref<'all' | 'RESERVATION' | 'RECLAMATION'>('all')

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') return notifications.value
  return notifications.value.filter(n => n.type === activeFilter.value)
})

// Extraire le nom du demandeur
function getDemandeurNom(notif: NotificationDTO): string {
  // Essayer plusieurs sources possibles
  if (notif.demandeurPrenom && notif.demandeurNom) {
    return `${notif.demandeurPrenom} ${notif.demandeurNom}`
  }
  if (notif.etudiantPrenom && notif.etudiantNom) {
    return `${notif.etudiantPrenom} ${notif.etudiantNom}`
  }
  if (notif.auteurPrenom && notif.auteurNom) {
    return `${notif.auteurPrenom} ${notif.auteurNom}`
  }
  if (notif.reservation?.etudiant) {
    return `${notif.reservation.etudiant.prenom || ''} ${notif.reservation.etudiant.nom || ''}`
  }
  if (notif.reclamation?.auteur) {
    return `${notif.reclamation.auteur.prenom || ''} ${notif.reclamation.auteur.nom || ''}`
  }
  return 'N/A'
}

// Extraire le CIN du demandeur
function getDemandeurCin(notif: NotificationDTO): string {
  return notif.demandeurCin || notif.etudiantCin || notif.auteurCin || 
         notif.reservation?.etudiant?.cin || notif.reclamation?.auteur?.cin || 'N/A'
}

// Tronquer le texte
function truncateText(text: string, maxLength: number): string {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

async function fetchNotifications() {
  try {
    console.log("Chargement des notifications...")
    // Récupérer TOUTES les notifications du technicien (lues + non lues)
    let res;
    try {
      res = await api.get('/notifications/technicien/all', { withCredentials: true })
    } catch (e) {
      // Fallback sur l'endpoint classique
      res = await getAllNotifications()
    }
    console.log("Réponse brute notifications:", res)
    
    // Gérer les différents formats de réponse
    if (res && res.data) {
      notifications.value = Array.isArray(res.data) ? res.data : []
    } else if (Array.isArray(res)) {
      notifications.value = res
    } else {
      notifications.value = []
    }
    
    // Trier par date décroissante
    notifications.value.sort((a: NotificationDTO, b: NotificationDTO) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    console.log("Notifications chargées:", notifications.value.length, "notifications")
  } catch (err) {
    console.error('Erreur chargement notifications', err)
    notifications.value = []
  }
}

async function openNotification(notif: NotificationDTO) {
  if (!notif.read) {
    await markNotificationAsRead(notif.id)
    notif.read = true
  }

  // Redirection vers les réclamations
  if (notif.type === 'RECLAMATION') {
    router.push('/technicien/reclamations')
  }
}

function typeBadge(type: string) {
  switch (type) {
    case 'RESERVATION': return 'badge badge-success'
    case 'RECLAMATION': return 'badge badge-warning'
    default: return 'badge badge-secondary'
  }
}

function typeIcon(type: string) {
  switch (type) {
    case 'RESERVATION': return 'fas fa-calendar-check'
    case 'RECLAMATION': return 'fas fa-exclamation-triangle'
    default: return 'fas fa-bell'
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(fetchNotifications)
</script>

<style scoped>
.tabs-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
