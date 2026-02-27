<template>
  <div>
    <!-- HEADER -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>
              <i class="fas fa-flask mr-2"></i>
              Gestion des Laboratoires
            </h1>
          </div>
          <div class="col-sm-6 text-right">
            <router-link to="/etudiant/nouvelle-reservation" class="btn btn-success">
              <i class="fas fa-plus mr-1"></i> Nouvelle réservation
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTENT -->
    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <div class="card-body table-responsive p-0">
            <table class="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th>Nom du laboratoire</th>
                  <th>Département</th>
                  <th>État</th>
                  <th>Disponibilité</th>
                  <th>Équipements</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="labo in laboratoires" :key="labo.id">
                  <td>{{ labo.nomLabo }}</td>
                  <td>
                    <span class="badge badge-info">
                      {{ labo.departement?.nom || 'N/A' }}
                    </span>
                  </td>
                  <td>
                    <span
                      class="badge"
                      :class="etatBadge(labo.etatLabo)"
                    >
                      {{ labo.etatLabo }}
                    </span>
                  </td>
                  <td>
                    <span 
                      class="badge" 
                      :class="getDisponibiliteBadge(labo)"
                    >
                      <i :class="getDisponibiliteIcon(labo)" class="mr-1"></i>
                      {{ getDisponibiliteText(labo) }}
                    </span>
                    <small v-if="getProchainCreneauDisponible(labo.id)" class="d-block text-muted mt-1">
                      {{ getProchainCreneauDisponible(labo.id) }}
                    </small>
                  </td>
                  <td>
                    <span class="badge badge-secondary">
                      {{ labo.equipements?.length || 0 }}
                    </span>
                  </td>
                  <td class="text-center">
                    <button 
                      class="btn btn-sm mr-1" 
                      :class="canReserveLabo(labo) ? 'btn-success' : 'btn-secondary'"
                      @click="goToReservation(labo)"
                      :disabled="!canReserveLabo(labo)"
                      :title="getReserveButtonTooltip(labo)"
                    >
                      <i class="fas fa-calendar-plus mr-1"></i> 
                      {{ canReserveLabo(labo) ? 'Réserver' : 'Non disponible' }}
                    </button>
                    <button 
                      class="btn btn-sm" 
                      :class="canReclamer(labo) ? 'btn-warning' : 'btn-secondary'"
                      @click="goToReclamation(labo)"
                      :disabled="!canReclamer(labo)"
                      :title="getReclamationTooltip(labo)"
                    >
                      <i class="fas fa-exclamation-triangle mr-1"></i> 
                      {{ canReclamer(labo) ? 'Réclamer' : 'Labo inactif' }}
                    </button>
                  </td>
                </tr>

                <tr v-if="laboratoires.length === 0">
                  <td colspan="6" class="text-center text-muted">
                    Aucun laboratoire trouvé
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMesLabos } from '@/Service/LaboratoireService'
import { getReservationsApprouveesParLabo } from '@/Service/ReservationService'

const router = useRouter()
const laboratoires = ref<any[]>([])
const reservationsParLabo = ref<Record<number, any[]>>({})

onMounted(async () => {
  try {
    const res = await getMesLabos()
    laboratoires.value = Array.isArray(res.data) ? res.data : []
    console.log('Mes laboratoires :', laboratoires.value)
    
    // Charger les réservations approuvées pour chaque labo
    for (const labo of laboratoires.value) {
      try {
        const reservations = await getReservationsApprouveesParLabo(labo.id)
        reservationsParLabo.value[labo.id] = reservations
      } catch (e) {
        console.warn(`Erreur chargement réservations labo ${labo.id}`, e)
        reservationsParLabo.value[labo.id] = []
      }
    }
  } catch (error) {
    console.error('Erreur chargement laboratoires', error)
    alert('Impossible de charger les laboratoires.')
  }
})

// Vérifie si le labo est réservé aujourd'hui
function isLaboReserveAujourdhui(laboId: number): boolean {
  const today = new Date().toISOString().split('T')[0]
  const reservations = reservationsParLabo.value[laboId] || []
  return reservations.some(r => r.dateReservation === today)
}

// Vérifie si le labo est actuellement réservé (pendant l'heure actuelle)
function isLaboReserveMaintenent(laboId: number): boolean {
  const today = new Date().toISOString().split('T')[0]
  const now = new Date().toTimeString().slice(0, 5) // HH:MM
  const reservations = reservationsParLabo.value[laboId] || []
  
  return reservations.some(r => 
    r.dateReservation === today &&
    r.heureDebut <= now &&
    r.heureFin > now
  )
}

// Vérifie si on peut réserver le labo
function canReserveLabo(labo: any): boolean {
  // Labo inactif ou en maintenance = non réservable
  if (labo.etatLabo === 'INACTIF' || labo.etatLabo === 'EN_MAINTENANCE') {
    return false
  }
  // Labo actuellement occupé (pendant une réservation approuvée) = non réservable maintenant
  if (isLaboReserveMaintenent(labo.id)) {
    return false
  }
  return true
}

// Tooltip pour le bouton réserver
function getReserveButtonTooltip(labo: any): string {
  if (labo.etatLabo === 'INACTIF') return 'Ce laboratoire est inactif'
  if (labo.etatLabo === 'EN_MAINTENANCE') return 'Ce laboratoire est en maintenance'
  if (isLaboReserveMaintenent(labo.id)) return 'Ce laboratoire est actuellement occupé jusqu\'à ' + getFinReservationActuelle(labo.id)
  return 'Réserver ce laboratoire'
}

// Obtient l'heure de fin de la réservation actuelle
function getFinReservationActuelle(laboId: number): string {
  const today = new Date().toISOString().split('T')[0]
  const now = new Date().toTimeString().slice(0, 5)
  const reservations = reservationsParLabo.value[laboId] || []
  const currentReservation = reservations.find(r => 
    r.dateReservation === today && r.heureDebut <= now && r.heureFin > now
  )
  return currentReservation?.heureFin || ''
}

// Obtient le prochain créneau disponible
function getProchainCreneauDisponible(laboId: number): string | null {
  if (isLaboReserveMaintenent(laboId)) {
    const today = new Date().toISOString().split('T')[0]
    const reservations = reservationsParLabo.value[laboId] || []
    const currentReservation = reservations.find(r => {
      const now = new Date().toTimeString().slice(0, 5)
      return r.dateReservation === today && r.heureDebut <= now && r.heureFin > now
    })
    if (currentReservation) {
      return `Disponible à partir de ${currentReservation.heureFin}`
    }
  }
  return null
}

// Rediriger vers le formulaire de réservation avec le labo pré-sélectionné
function goToReservation(labo: any) {
  router.push({ 
    path: '/etudiant/nouvelle-reservation', 
    query: { laboratoireId: labo.id, laboratoireNom: labo.nomLabo } 
  })
}

// Rediriger vers le formulaire de réclamation avec le labo pré-sélectionné
function goToReclamation(labo: any) {
  router.push({ 
    path: '/etudiant/nouvelle-reclamation', 
    query: { laboratoireId: labo.id, laboratoireNom: labo.nomLabo } 
  })
}

// Vérifie si on peut réclamer sur ce labo
function canReclamer(labo: any): boolean {
  return labo.etatLabo !== 'INACTIF' && labo.etatLabo !== 'EN_MAINTENANCE'
}

// Tooltip pour le bouton réclamer
function getReclamationTooltip(labo: any): string {
  if (labo.etatLabo === 'INACTIF') return 'Ce laboratoire est inactif'
  if (labo.etatLabo === 'EN_MAINTENANCE') return 'Ce laboratoire est en maintenance'
  return 'Signaler un problème'
}

// Obtenir le badge de disponibilité (prend en compte l'état du labo)
function getDisponibiliteBadge(labo: any): string {
  if (labo.etatLabo === 'INACTIF' || labo.etatLabo === 'EN_MAINTENANCE') {
    return 'badge-danger'
  }
  if (isLaboReserveAujourdhui(labo.id)) {
    return 'badge-warning'
  }
  return 'badge-success'
}

// Obtenir l'icône de disponibilité
function getDisponibiliteIcon(labo: any): string {
  if (labo.etatLabo === 'INACTIF' || labo.etatLabo === 'EN_MAINTENANCE') {
    return 'fas fa-ban'
  }
  if (isLaboReserveAujourdhui(labo.id)) {
    return 'fas fa-clock'
  }
  return 'fas fa-check'
}

// Obtenir le texte de disponibilité
function getDisponibiliteText(labo: any): string {
  if (labo.etatLabo === 'INACTIF') {
    return 'Non disponible'
  }
  if (labo.etatLabo === 'EN_MAINTENANCE') {
    return 'En maintenance'
  }
  if (isLaboReserveAujourdhui(labo.id)) {
    return 'Réservé'
  }
  return 'Disponible'
}

/* COLORATION ACTIF / INACTIF */
function etatBadge(etat: string) {
  switch (etat) {
    case 'ACTIF':
      return 'badge-primary'   // bleu
    case 'INACTIF':
      return 'badge-danger'    // rouge
    case 'DISPONIBLE':
      return 'badge-success'   // vert
    case 'OCCUPE':
      return 'badge-warning'   // orange
    case 'EN_MAINTENANCE':
      return 'badge-danger'    // rouge
    default:
      return 'badge-secondary'
  }
}
</script>

<style scoped>
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
