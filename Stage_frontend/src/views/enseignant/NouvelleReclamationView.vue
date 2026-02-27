<template>
  <div>
    <!-- En-tete -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1><i class="fas fa-exclamation-circle mr-2"></i> Nouvelle Reclamation</h1>
            <small class="text-muted">Creer une reclamation pour un equipement defectueux</small>
          </div>
          <div class="col-sm-6 text-right">
            <router-link to="/enseignant/reclamations" class="btn btn-secondary">
              <i class="fas fa-arrow-left mr-1"></i> Retour
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Formulaire -->
    <section class="content">
      <div class="container-fluid">
        <div class="card card-info">
          <div class="card-header">
            <h3 class="card-title">Formulaire de reclamation</h3>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="card-body">

              <!-- Département -->
              <div class="form-group">
                <label>Département *</label>
                <select class="form-control" v-model="form.departementId" @change="onDepartementChange" required>
                  <option value="">-- Sélectionner un département --</option>
                  <option v-for="dept in departements" :key="dept.id" :value="dept.id">
                    {{ dept.nom }}
                  </option>
                </select>
              </div>

              <!-- Laboratoire (ACTIFS uniquement) -->
              <div class="form-group">
                <label>Laboratoire *</label>
                <select class="form-control" v-model="form.laboratoireId" @change="onLaboChange" :disabled="!form.departementId" required>
                  <option value="">-- Selectionner un laboratoire --</option>
                  <option v-for="labo in filteredLaboratoires" :key="labo.id" :value="labo.id">
                    {{ labo.nom || labo.nomLabo }}
                  </option>
                </select>
                <small v-if="!form.departementId" class="text-muted">Sélectionnez d'abord un département</small>
                <small v-else-if="laboratoiresInactifs > 0" class="text-info">
                  <i class="fas fa-info-circle mr-1"></i>
                  {{ laboratoiresInactifs }} laboratoire(s) inactif(s) masqué(s)
                </small>
              </div>

              <!-- Equipement (tous les équipements du laboratoire) -->
              <div class="form-group">
                <label>Equipement *</label>
                <select class="form-control" v-model="form.equipementId" :disabled="!form.laboratoireId" required>
                  <option value="">-- Selectionner un equipement --</option>
                  <template v-if="equipements.length > 0">
                    <option v-for="eq in equipements" :key="eq.id" :value="eq.id">
                      {{ eq.nom }} ({{ formatEtat(eq.statut || eq.etat) }})
                    </option>
                  </template>
                  <option v-else disabled>Aucun équipement dans ce laboratoire</option>
                </select>
                <small v-if="!form.laboratoireId" class="text-muted">Sélectionnez d'abord un laboratoire</small>
              </div>

              <!-- Titre -->
              <div class="form-group">
                <label>Titre de la réclamation *</label>
                <input type="text" class="form-control" v-model="form.titre" placeholder="Ex: PC ne démarre plus" required />
              </div>

              <!-- Priorité -->
              <div class="form-group">
                <label>Priorité *</label>
                <select class="form-control" v-model="form.priorite" required>
                  <option value="BASSE">Basse</option>
                  <option value="MOYENNE">Moyenne</option>
                  <option value="HAUTE">Haute</option>
                </select>
              </div>

              <!-- Description / Motif -->
              <div class="form-group">
                <label>Description *</label>
                <textarea class="form-control" v-model="form.description" rows="3" placeholder="Decrire le probleme..." required></textarea>
              </div>

            </div>

            <div class="card-footer text-right">
              <button type="submit" class="btn btn-info" :disabled="loading">
                <i class="fas fa-paper-plane mr-1"></i> 
                {{ loading ? 'Envoi...' : 'Envoyer la reclamation' }}
              </button>
              <router-link to="/enseignant/reclamations" class="btn btn-secondary ml-2">
                Annuler
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ReclamationService from '@/Service/ReclamationService'
import { getLaboratoires } from '@/Service/LaboratoireService'
import { getEquipementsByLabo } from '@/Service/EquipementService'
import { getDepartements } from '@/Service/departementService'
import { useAuthStore } from '@/stores/auth'

// Stores & Router
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// Loading state
const loading = ref(false)

// Formulaire reactif
const form = reactive({
  departementId: '' as number | '',
  laboratoireId: '' as number | '',
  equipementId: '' as number | '',
  titre: '',
  priorite: 'MOYENNE',
  description: ''
})

// Données
const departements = ref<any[]>([])
const laboratoires = ref<any[]>([])
const equipements = ref<any[]>([])

// Équipements filtrés par état (seulement EN_PANNE ou EN_MAINTENANCE)
const equipementsEnPanne = computed(() => 
  equipements.value.filter(eq => eq.etat === 'EN_PANNE' || eq.etat === 'EN_MAINTENANCE' || eq.statut === 'EN_PANNE')
)

// Équipements fonctionnels (pour info)
const equipementsFonctionnels = computed(() => 
  equipements.value.filter(eq => eq.etat === 'FONCTIONNEL' || eq.statut === 'FONCTIONNEL')
)

// Format état
function formatEtat(etat?: string): string {
  if (!etat) return ''
  const labels: Record<string, string> = {
    FONCTIONNEL: 'Fonctionnel',
    EN_PANNE: 'En panne',
    EN_MAINTENANCE: 'En maintenance'
  }
  return labels[etat] || etat
}

// Laboratoires filtrés par département (ACTIFS uniquement)
const filteredLaboratoires = computed(() => {
  if (!form.departementId) return []
  return laboratoires.value.filter(labo => {
    const matchDept = labo.departementId === form.departementId || labo.departement?.id === form.departementId
    const isActif = labo.etatLabo === 'ACTIF'
    return matchDept && isActif
  })
})

// Compter les labos inactifs
const laboratoiresInactifs = computed(() => {
  if (!form.departementId) return 0
  return laboratoires.value.filter(labo => {
    const matchDept = labo.departementId === form.departementId || labo.departement?.id === form.departementId
    const isInactif = labo.etatLabo !== 'ACTIF'
    return matchDept && isInactif
  }).length
})

// Charger les départements
async function loadDepartements() {
  try {
    const res = await getDepartements()
    departements.value = Array.isArray(res.data) ? res.data : []
    console.log("Départements:", departements.value)
  } catch (err) {
    console.error("Erreur chargement départements:", err)
  }
}

// Charger tous les laboratoires
async function loadLaboratoires() {
  try {
    const res = await getLaboratoires()
    laboratoires.value = Array.isArray(res.data) ? res.data : []
    console.log("Laboratoires:", laboratoires.value)
  } catch (err) {
    console.error("Erreur chargement laboratoires:", err)
  }
}

// Charger les equipements du labo selectionne
async function loadEquipements() {
  if (!form.laboratoireId) {
    equipements.value = []
    return
  }
  try {
    const res = await getEquipementsByLabo(Number(form.laboratoireId))
    equipements.value = Array.isArray(res.data) ? res.data : []
    console.log("Equipements:", equipements.value)
  } catch (err) {
    console.error("Erreur chargement equipements:", err)
    equipements.value = []
  }
}

// Quand le département change
function onDepartementChange() {
  form.laboratoireId = ''
  form.equipementId = ''
  equipements.value = []
}

// Quand le labo change
function onLaboChange() {
  form.equipementId = ''
  loadEquipements()
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/')
    return
  }
  
  await loadDepartements()
  await loadLaboratoires()
  
  // Pré-sélection depuis les query params (venant de la page équipements)
  if (route.query.laboratoireId) {
    const laboId = Number(route.query.laboratoireId)
    
    // Trouver le laboratoire et son département
    const labo = laboratoires.value.find(l => l.id === laboId)
    if (labo) {
      const deptId = labo.departementId || labo.departement?.id
      if (deptId) {
        form.departementId = deptId
      }
      form.laboratoireId = laboId
      
      // Charger les équipements du labo
      await loadEquipements()
      
      // Pré-sélectionner l'équipement si fourni
      if (route.query.equipementId) {
        const eqId = Number(route.query.equipementId)
        // Vérifier que l'équipement est dans la liste des équipements en panne
        if (equipementsEnPanne.value.some(eq => eq.id === eqId)) {
          form.equipementId = eqId
        }
      }
    }
  }
})

// Soumission du formulaire
async function handleSubmit() {
  if (!form.laboratoireId || !form.equipementId || !form.description || !form.titre) {
    alert("Veuillez remplir tous les champs obligatoires !")
    return
  }

  loading.value = true
  try {
    // Récupérer l'ID de l'utilisateur connecté
    const userId = authStore.currentUser?.id

    const payload = {
      userId: userId,
      laboratoireId: Number(form.laboratoireId),
      equipementId: Number(form.equipementId),
      titre: form.titre,
      description: form.description,
      priorite: form.priorite,
      quantite: 1  // Valeur par défaut
    }

    console.log("Payload envoye :", payload)

    await ReclamationService.createReclamation(payload)

    alert("✅ Réclamation envoyée avec succès !")
    router.push('/enseignant/reclamations')

  } catch (err: any) {
    console.error("Erreur envoi reclamation", err)
    alert("Erreur lors de l'envoi de la reclamation: " + (err.response?.data?.message || err.message))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card-body {
  max-width: 600px;
  margin: auto;
}
</style>
