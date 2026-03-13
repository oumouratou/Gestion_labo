<template>
  <div>
    <!-- En-tête -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1><i class="fas fa-exclamation-triangle mr-2"></i> Mes Réclamations</h1>
            <small class="text-muted">Suivi des réclamations que vous avez envoyées</small>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">

        <!-- Stats -->
        <div class="row mb-3">
          <div class="col-lg-3 col-6">
            <div class="small-box bg-warning">
              <div class="inner">
                <h3>{{ pendingCount }}</h3>
                <p>Non traitées</p>
              </div>
              <div class="icon"><i class="fas fa-clock"></i></div>
            </div>
          </div>

          <div class="col-lg-3 col-6">
            <div class="small-box bg-success">
              <div class="inner">
                <h3>{{ treatedCount }}</h3>
                <p>Traitées</p>
              </div>
              <div class="icon"><i class="fas fa-check"></i></div>
            </div>
          </div>

          <div class="col-lg-3 col-6">
            <div class="small-box bg-danger">
              <div class="inner">
                <h3>{{ refusedCount }}</h3>
                <p>Refusées</p>
              </div>
              <div class="icon"><i class="fas fa-ban"></i></div>
            </div>
          </div>

          <div class="col-lg-3 col-6">
            <div class="small-box bg-secondary">
              <div class="inner">
                <h3>{{ cancelledCount }}</h3>
                <p>Annulées</p>
              </div>
              <div class="icon"><i class="fas fa-times"></i></div>
            </div>
          </div>
        </div>

        <!-- Tableau -->
        <div class="card card-outline card-primary">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-list mr-1"></i> Liste de mes réclamations
            </h3>
          </div>

          <div class="card-body table-responsive p-0">
            <table class="table table-hover text-nowrap" v-if="reclamations.length > 0">
              <thead class="thead-light">
                <tr>
                  <th>N°</th>
                  <th>Laboratoire</th>
                  <th>Équipement</th>
                  <th>Description</th>
                  <th>Identifiant Équipement</th>
                  <th>Priorité</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr 
                  v-for="(rec, index) in reclamations" 
                  :key="rec.id"
                  :class="{ 'highlight-row': highlightedId === rec.id }"
                  :ref="el => { if (highlightedId === rec.id) highlightedRow = el }"
                >
                  <td><strong>{{ index + 1 }}</strong></td>
                  <td>{{ rec.laboratoireNom || 'N/A' }}</td>
                  <td>{{ rec.equipementNom || 'N/A' }}</td>
                  <td>{{ truncateText(rec.description, 50) }}</td>
                  <td><code class="text-primary">{{ getEquipementIdentifiant(rec) }}</code></td>
                  <td>
                    <span :class="getPrioriteBadge(getPriorite(rec))">
                      {{ formatPriorite(getPriorite(rec)) }}
                    </span>
                  </td>
                  <td>{{ formatDate(rec.dateReclamation) }}</td>
                  <td>
                    <span :class="getEtatBadge(rec.etat)">
                      {{ formatEtat(rec.etat) }}
                    </span>
                  </td>
                  <td class="text-center">
                    <div class="btn-group">
                      <button class="btn btn-info btn-sm" @click="openModal(rec)" title="Modifier" :disabled="rec.etat !== 'NON_TRAITEE'">
                        <i class="fas fa-edit mr-1"></i> Modifier
                      </button>
                      <button class="btn btn-danger btn-sm" @click="annulerReclamation(rec.id)" title="Annuler" :disabled="rec.etat !== 'NON_TRAITEE'">
                        <i class="fas fa-times mr-1"></i> Annuler
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="text-center text-muted p-5">
              <i class="fas fa-inbox fa-3x mb-3"></i>
              <p>Aucune réclamation trouvée.</p>
            </div>
          </div>

          <div class="card-footer clearfix">
            <span class="float-left">Total: {{ reclamations.length }} réclamation(s)</span>
          </div>
        </div>
      </div>
    </section>

    <!-- MODAL MODIFICATION -->
    <div class="modal fade" :class="{ show: showModal }" :style="{ display: showModal ? 'block' : 'none' }">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="handleSubmit">
            <div class="modal-header bg-info">
              <h5 class="modal-title">Modifier la réclamation</h5>
              <button type="button" class="close" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>

            <div class="modal-body">
              <div class="form-group">
                <label>Description</label>
                <textarea class="form-control" v-model="form.description" rows="4" required></textarea>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Annuler</button>
              <button type="submit" class="btn btn-success">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showModal"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import ReclamationService from '@/Service/ReclamationService'
import { getEquipements } from '@/Service/EquipementService'

const route = useRoute()
const reclamations = ref<any[]>([])
const allEquipements = ref<any[]>([])
const showModal = ref(false)
const form = reactive({ id: 0, description: '', quantite: 1 })
const highlightedId = ref<number | null>(null)
const highlightedRow = ref<any>(null)

// Compteurs pour les stats
const pendingCount = computed(() => reclamations.value.filter(r => r.etat === 'NON_TRAITEE').length)
const treatedCount = computed(() => reclamations.value.filter(r => r.etat === 'TRAITEE').length)
const refusedCount = computed(() => reclamations.value.filter(r => r.etat === 'REFUSEE').length)
const cancelledCount = computed(() => reclamations.value.filter(r => r.etat === 'ANNULEE').length)

async function fetchEquipements() {
  try {
    const res = await getEquipements()
    allEquipements.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    console.error('Erreur chargement équipements:', err)
    allEquipements.value = []
  }
}

function getEquipementIdentifiant(rec: any): string {
  const equipId = rec.equipementId || rec.equipement?.id
  if (rec.equipementIdentifiant || rec.identifiantEquipement) {
    return rec.equipementIdentifiant || rec.identifiantEquipement
  }
  if (equipId) {
    const equip = allEquipements.value.find((e: any) => e.id === equipId)
    if (equip?.identifiant) return equip.identifiant
    if (equip) {
      const prefix = (equip.nom || 'EQ').substring(0, 3).toUpperCase()
      return `${prefix}-${String(equip.id).padStart(4, '0')}`
    }
  }
  return 'N/A'
}

async function fetchReclamations() {
  try {
    const res = await ReclamationService.getReclamationsEnseignantConnecte()
    const data = Array.isArray(res.data) ? res.data : []
    // Trier par date décroissante (plus récent en premier)
    reclamations.value = data.sort((a: any, b: any) => {
      const dateA = new Date(a.dateReclamation || 0).getTime()
      const dateB = new Date(b.dateReclamation || 0).getTime()
      return dateB - dateA
    })
  } catch (error) {
    console.error('Erreur chargement réclamations:', error)
    reclamations.value = []
  }
}

function openModal(rec: any) {
  form.id = rec.id
  form.description = rec.description
  form.quantite = rec.quantite
  showModal.value = true
}

function closeModal() { showModal.value = false }

async function handleSubmit() {
  try {
    console.log(`Modification réclamation #${form.id}...`);
    await ReclamationService.updateReclamation(form.id, {
      description: form.description
    });
    alert("✅ Réclamation modifiée avec succès !");
    await fetchReclamations();
    closeModal();
  } catch (error: any) {
    console.error("Erreur modification :", error);
    alert("❌ Erreur: " + (error.response?.data?.message || error.response?.data || error.message));
  }
}

async function annulerReclamation(id: number) {
  if (!confirm("Voulez-vous annuler cette réclamation ?")) return
  try {
    await ReclamationService.autoAnnulerReclamation(id)
    alert('✅ Réclamation annulée avec succès.')
    await fetchReclamations()
  } catch (error: any) {
    console.error('Erreur annulation:', error)
    alert('❌ Erreur: ' + (error.response?.data?.message || error.response?.data || error.message))
  }
}

// 🔹 Récupérer la priorité (gérer différents noms de champs)
function getPriorite(rec: any): string {
  const priorite = rec.priorite || rec.priority || rec.prioriteReclamation
  if (priorite) {
    const upper = String(priorite).toUpperCase()
    if (['HAUTE', 'HIGH', 'URGENTE'].includes(upper)) return 'HAUTE'
    if (['BASSE', 'LOW', 'FAIBLE'].includes(upper)) return 'BASSE'
    return 'MOYENNE'
  }
  return 'MOYENNE'
}

// 🔹 Styles badge pour priorité
function getPrioriteBadge(priorite?: string) {
  return {
    HAUTE: 'badge badge-danger',
    MOYENNE: 'badge badge-warning',
    BASSE: 'badge badge-info'
  }[priorite || 'MOYENNE'] || 'badge badge-secondary'
}

// 🔹 Texte lisible pour la priorité
function formatPriorite(priorite?: string) {
  return {
    HAUTE: 'Haute',
    MOYENNE: 'Moyenne',
    BASSE: 'Basse'
  }[priorite || 'MOYENNE'] || priorite || 'Moyenne'
}

function getEtatBadge(etat: string) {
  return {
    NON_TRAITEE: 'badge badge-warning',
    TRAITEE: 'badge badge-success',
    ANNULEE: 'badge badge-secondary',
    REFUSEE: 'badge badge-danger'
  }[etat] || 'badge badge-secondary'
}

function formatEtat(etat: string) {
  return {
    NON_TRAITEE: 'Non traitée',
    TRAITEE: 'Traitée',
    ANNULEE: 'Annulée',
    REFUSEE: 'Refusée'
  }[etat] || etat
}

function formatDate(date: string) {
  return date ? date.split('T')[0] : ''
}

function truncateText(text: string, maxLength: number) {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

onMounted(async () => {
  await fetchEquipements()
  await fetchReclamations()
  
  // Vérifier si on doit highlight une réclamation (venant d'une notification)
  if (route.query.highlight) {
    highlightedId.value = Number(route.query.highlight)
    
    // Attendre le rendu puis scroller vers l'élément
    await nextTick()
    setTimeout(() => {
      if (highlightedRow.value) {
        (highlightedRow.value as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      // Retirer le highlight après 3 secondes
      setTimeout(() => {
        highlightedId.value = null
      }, 3000)
    }, 100)
  }
})
</script>

<style scoped>
.modal.show { background: rgba(0, 0, 0, 0.5); }
.table th, .table td { vertical-align: middle; }
.badge { padding: 5px 10px; font-size: 12px; }

/* Highlight animation pour la ligne venant d'une notification */
.highlight-row {
  animation: highlightPulse 1s ease-in-out 3;
  background-color: #fff3cd !important;
}

@keyframes highlightPulse {
  0%, 100% { background-color: #fff3cd; }
  50% { background-color: #ffeeba; }
}
</style>
