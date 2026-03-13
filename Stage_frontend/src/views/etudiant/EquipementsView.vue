<template>
  <div>
    <!-- En-tête -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1><i class="fas fa-cogs mr-2"></i> Équipements</h1>
          </div>
        </div>
      </div>
    </section>

    <!-- Contenu -->
    <section class="content">
      <div class="container-fluid">

        <!-- Filtres par département et laboratoire -->
        <div class="card card-outline card-info mb-3">
          <div class="card-header">
            <h3 class="card-title"><i class="fas fa-filter mr-2"></i>Filtres</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- Filtre Département -->
              <div class="col-md-4">
                <div class="form-group">
                  <label>Département</label>
                  <select class="form-control" v-model="selectedDepartement" @change="onDepartementChange">
                    <option value="">-- Sélectionner un département --</option>
                    <option v-for="dept in departements" :key="dept.id" :value="dept.id">
                      {{ dept.nom }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Filtre Laboratoire -->
              <div class="col-md-4">
                <div class="form-group">
                  <label>Laboratoire</label>
                  <select class="form-control" v-model="selectedLaboratoire" :disabled="!selectedDepartement">
                    <option value="">-- Tous les laboratoires --</option>
                    <option v-for="labo in filteredLaboratoires" :key="labo.id" :value="labo.id">
                      {{ labo.nomLabo || labo.nom }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Info -->
              <div class="col-md-4 d-flex align-items-end">
                <div class="form-group w-100">
                  <span class="badge badge-info p-2">
                    <i class="fas fa-cog mr-1"></i> {{ filteredEquipements.length }} équipement(s) trouvé(s)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Message si aucun département sélectionné -->
        <div v-if="!selectedDepartement" class="alert alert-info">
          <i class="fas fa-info-circle mr-2"></i>
          Veuillez sélectionner un département pour afficher les laboratoires et équipements.
        </div>

        <!-- Loading -->
        <div v-else-if="loading" class="text-center p-5">
          <i class="fas fa-spinner fa-spin fa-2x"></i>
          <p class="mt-2">Chargement des équipements...</p>
        </div>

        <!-- Liste des équipements -->
        <div class="row" v-else>
          <div class="col-md-4 mb-3" v-for="equip in filteredEquipements" :key="equip.id">
            <div class="card" :class="getCardClass(equip.etat)">
              <div class="card-header">
                <h3 class="card-title">{{ equip.nom }}</h3>
                <div class="card-tools">
                  <span :class="getEtatBadge(equip.etat)">{{ formatEtat(equip.etat) }}</span>
                </div>
              </div>

              <div class="card-body text-center">
                <div v-if="equip.imageUrl" class="mb-2">
                  <img 
                    :src="equip.imageUrl" 
                    alt="Image équipement" 
                    class="equip-image" 
                    @error="handleImageError($event)"
                  />
                </div>
                <div v-else class="mb-2">
                  <div class="equip-image-placeholder">
                    <i class="fas fa-image fa-2x text-muted"></i>
                  </div>
                </div>

                <p><strong>Identifiant:</strong> <code class="text-primary">{{ equip.identifiant || generateIdentifiant(equip) }}</code></p>
                <p><strong>Description:</strong> {{ equip.caracteristique }}</p>
                <p><strong>Laboratoire:</strong> {{ getLaboNom(equip.laboratoire?.id) }}</p>
                <p><strong>Date acquisition:</strong> {{ equip.dateAcquisition }}</p>
              </div>

              <div class="card-footer text-center">
                <button class="btn btn-info btn-sm mr-1" @click="showDetails(equip)">
                  <i class="fas fa-eye mr-1"></i> Détails
                </button>
                <button 
                  class="btn btn-sm" 
                  :class="canReclamer(equip) ? 'btn-warning' : 'btn-secondary'"
                  @click="goToReclamation(equip)"
                  :disabled="!canReclamer(equip)"
                  :title="getReclamationTooltip(equip)"
                >
                  <i class="fas fa-exclamation-triangle mr-1"></i> 
                  {{ getReclamationButtonText(equip) }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredEquipements.length === 0" class="col-12 text-center text-muted">
            Aucun équipement trouvé pour ce laboratoire.
          </div>
        </div>
      </div>
    </section>

    <!-- Modal Détails -->
    <div class="modal fade" :class="{ show: showDetailsModal }" :style="{ display: showDetailsModal ? 'block' : 'none' }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-info">
            <h4 class="modal-title">Détails de l'équipement</h4>
            <button type="button" class="close" @click="showDetailsModal = false">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body" v-if="selectedEquip">
            <dl class="row">
              <dt class="col-sm-4">Nom:</dt>
              <dd class="col-sm-8">{{ selectedEquip.nom }}</dd>
               
              <dt class="col-sm-4">Description:</dt>
              <dd class="col-sm-8">{{ selectedEquip.caracteristique }}</dd>

              <dt class="col-sm-4">Laboratoire:</dt>
              <dd class="col-sm-8">{{ getLaboNom(selectedEquip.laboratoire?.id) }}</dd>

              <dt class="col-sm-4">État:</dt>
              <dd class="col-sm-8">
                <span :class="getEtatBadge(selectedEquip.etat)">{{ formatEtat(selectedEquip.etat) }}</span>
              </dd>

              <dt class="col-sm-4">Date acquisition:</dt>
              <dd class="col-sm-8">{{ selectedEquip.dateAcquisition }}</dd>

              <dt class="col-sm-4" v-if="selectedEquip.imageUrl">Image:</dt>
              <dd class="col-sm-8" v-if="selectedEquip.imageUrl">
                <img :src="selectedEquip.imageUrl" alt="Image équipement" class="equip-image" />
              </dd>
            </dl>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDetailsModal = false">Fermer</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showDetailsModal"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLaboratoires } from '@/Service/LaboratoireService'
import { getEquipementsByLabo } from '@/Service/EquipementService'
import { getActiveDepartements } from '@/Service/departementService'
import ReclamationService from '@/Service/ReclamationService'
import type { Equipement, Laboratoire, Departement } from '@/types'

const router = useRouter()
const equipements = ref<Equipement[]>([])
const laboratoires = ref<Laboratoire[]>([])
const departements = ref<Departement[]>([])
const reclamationsEnCours = ref<any[]>([])
const selectedDepartement = ref<number | ''>('')
const selectedLaboratoire = ref<number | ''>('')
const showDetailsModal = ref(false)
const selectedEquip = ref<Equipement | null>(null)
const loading = ref(false)

onMounted(async () => {
  try {
    // Charger tous les départements
    const resDepts = await getActiveDepartements()
    departements.value = Array.isArray(resDepts.data) ? resDepts.data : []

    // Charger tous les laboratoires
    const resLabos = await getLaboratoires()
    laboratoires.value = Array.isArray(resLabos.data) ? resLabos.data : []

    // Charger les réclamations en cours de l'étudiant
    try {
      const resRec = await ReclamationService.getReclamationsEtudiantConnecte()
      reclamationsEnCours.value = (resRec.data || []).filter((r: any) => 
        r.etat === 'NON_TRAITEE' || r.statut === 'NON_TRAITEE' || r.statut === 'EN_COURS'
      )
    } catch (e) {
      console.warn('Erreur chargement réclamations:', e)
      reclamationsEnCours.value = []
    }
  } catch (err) {
    console.error(err)
    alert('Impossible de charger les données.')
  }
})

// Laboratoires filtrés par département sélectionné
const filteredLaboratoires = computed(() => {
  if (!selectedDepartement.value) return []
  return laboratoires.value.filter(labo => 
    labo.departement?.id === selectedDepartement.value || 
    (labo as any).departementId === selectedDepartement.value
  )
})

// Équipements filtrés par laboratoire sélectionné (ou tous les labos du département)
const filteredEquipements = computed(() => {
  if (!selectedDepartement.value) return []
  
  if (selectedLaboratoire.value) {
    return equipements.value.filter(e => 
      (e.laboratoire?.id === selectedLaboratoire.value) || 
      ((e as any).laboratoireId === selectedLaboratoire.value)
    )
  }
  
  return equipements.value
})

// Quand le département change
async function onDepartementChange() {
  selectedLaboratoire.value = ''
  equipements.value = []
  
  if (!selectedDepartement.value) return
  
  await loadEquipementsForDepartement()
}

// Charger tous les équipements des labos du département
async function loadEquipementsForDepartement() {
  loading.value = true
  equipements.value = []
  
  const labosOfDept = filteredLaboratoires.value
  
  for (const labo of labosOfDept) {
    try {
      const resEquip = await getEquipementsByLabo(labo.id)
      if (Array.isArray(resEquip.data)) {
        const normalized = resEquip.data.map((e: any) => {
          let imgUrl = e.imageUrl || e.image_url || e.imageURL || e.img || null
          if (imgUrl && !imgUrl.startsWith('http')) {
            imgUrl = 'http://localhost:8085' + (imgUrl.startsWith('/') ? '' : '/') + imgUrl
          }
          return { ...e, imageUrl: imgUrl }
        })
        equipements.value.push(...normalized)
      }
    } catch (e) {
      console.warn(`Erreur chargement equipements labo ${labo.id}`, e)
    }
  }
  
  loading.value = false
}

function getLaboNom(id?: number) {
  if (!id) return 'N/A'
  const labo = laboratoires.value.find(l => l.id === id)
  return labo ? labo.nomLabo : 'N/A'
}

// Générer un identifiant pour l'équipement
function generateIdentifiant(equip: Equipement): string {
  const prefix = (equip.nom || 'EQ').substring(0, 3).toUpperCase()
  return `${prefix}-${String(equip.id).padStart(4, '0')}`
}

// Gérer les erreurs de chargement d'image
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  console.warn('Erreur chargement image:', img.src)
  // Cacher l'image cassée
  img.style.display = 'none'
}

function getCardClass(etat: string) {
  const classes: Record<string, string> = {
    FONCTIONNEL: 'card-outline card-success',
    EN_PANNE: 'card-outline card-danger',
    EN_MAINTENANCE: 'card-outline card-warning'
  }
  return classes[etat] || 'card-outline card-secondary'
}

function getEtatBadge(etat: string) {
  const badges: Record<string, string> = {
    FONCTIONNEL: 'badge badge-success',
    EN_PANNE: 'badge badge-danger',
    EN_MAINTENANCE: 'badge badge-warning'
  }
  return badges[etat] || 'badge badge-secondary'
}

function formatEtat(etat: string) {
  const labels: Record<string, string> = {
    FONCTIONNEL: 'Fonctionnel',
    EN_PANNE: 'En panne',
    EN_MAINTENANCE: 'En maintenance'
  }
  return labels[etat] || etat
                                                                                                                                                                                                                                                                                          
}

function showDetails(equip: Equipement) {
  selectedEquip.value = equip
  showDetailsModal.value = true
}

// Vérifie si l'équipement a déjà une réclamation en cours
function hasReclamationEnCours(equip: Equipement): boolean {
  return reclamationsEnCours.value.some((r: any) => 
    r.equipementId === equip.id || r.equipement?.id === equip.id
  )
}

// Vérifie si on peut réclamer cet équipement
function canReclamer(equip: Equipement): boolean {
  // Ne peut pas réclamer si une réclamation est déjà en cours
  if (hasReclamationEnCours(equip)) return false
  return true
}

// Tooltip pour le bouton réclamer
function getReclamationTooltip(equip: Equipement): string {
  if (hasReclamationEnCours(equip)) return 'Une réclamation est déjà en cours pour cet équipement'
  return 'Signaler un problème avec cet équipement'
}

// Texte du bouton réclamer
function getReclamationButtonText(equip: Equipement): string {
  if (hasReclamationEnCours(equip)) return 'Réclamation en cours'
  return 'Réclamer'
}

// Rediriger vers le formulaire de réclamation avec l'équipement pré-sélectionné
function goToReclamation(equip: Equipement) {
  const labo = laboratoires.value.find(l => l.id === equip.laboratoire?.id)
  router.push({ 
    path: '/etudiant/nouvelle-reclamation', 
    query: { 
      equipementId: equip.id, 
      equipementNom: equip.nom,
      laboratoireId: equip.laboratoire?.id,
      laboratoireNom: labo?.nomLabo || ''
    } 
  })
}
</script>

<style scoped>
.modal.show {
  background: rgba(0, 0, 0, 0.5);
}
.equip-image {
  max-width: 100px;
  max-height: 110px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}
.equip-image-placeholder {
  width: 100px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 5px;
  margin: 0 auto 10px auto;
}
.card-title, 
.modal-body dt {
  font-weight: bold;
}
</style>
