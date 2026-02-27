<template>
  <div>
    <!-- Header -->
    <section class="content-header">
      <div class="container-fluid">
        <h1>Gestion des Départements</h1>
      </div>
    </section>

    <!-- Content -->
    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <!-- Card Header -->
          <div class="card-header d-flex align-items-center">
            <h3 class="card-title mb-0">Liste des départements</h3>
            <button class="btn btn-success btn-sm ml-auto" @click="openModal()">Ajouter</button>
          </div>

          <!-- Card Body -->
          <div class="card-body table-responsive">
            <table class="table table-bordered table-hover">
              <thead class="thead-light">
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Description</th>
                  <th class="text-center" width="120">Consulter</th>
                  <th class="text-center" width="180">Gestion</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="dept in departements" :key="dept.id">
                  <td>{{ dept.id }}</td>
                  <td><strong>{{ dept.nom }}</strong></td>
                  <td>{{ dept.description || '—' }}</td>
                  <!-- Colonne Consulter -->
                  <td class="text-center">
                    <button class="btn btn-info btn-sm btn-block" @click="voirLaboratoires(dept)" title="Voir laboratoires">
                      <i class="fas fa-flask mr-1"></i> Labos
                    </button>
                  </td>
                  <!-- Colonne Gestion -->
                  <td class="text-center">
                    <div class="d-flex flex-column align-items-center">
                      <button class="btn btn-primary btn-sm btn-block mb-1" @click="openModal(dept)">
                        <i class="fas fa-edit mr-1"></i> Modifier
                      </button>
                      <button class="btn btn-danger btn-sm btn-block" @click="handleDelete(dept.id)">
                        <i class="fas fa-trash mr-1"></i> Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="departements.length === 0">
                  <td colspan="5" class="text-center text-muted">Aucun département trouvé</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal -->
    <div class="modal fade" :class="{ show: showModal }" :style="{ display: showModal ? 'block' : 'none' }">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="handleSubmit">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEdit ? 'Modifier le département' : 'Ajouter un département' }}</h5>
              <button type="button" class="close" @click="closeModal">×</button>
            </div>

            <div class="modal-body">
              <div class="form-group">
                <label>Nom</label>
                <input type="text" class="form-control" v-model="form.nom" required />
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea class="form-control" v-model="form.description" rows="3"></textarea>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Annuler</button>
              <button type="submit" class="btn btn-success">{{ isEdit ? 'Modifier' : 'Ajouter' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div class="modal-backdrop fade show" v-if="showModal"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Departement } from '@/types'
import { getDepartements, createDepartement, updateDepartement, deleteDepartement } from '@/Service/departementService'

const router = useRouter()
const departements = ref<Departement[]>([])
const showModal = ref(false)
const isEdit = ref(false)
const editId = ref<number | null>(null)

const form = reactive({ nom: '', description: '' })

onMounted(fetchDepartements)

async function fetchDepartements() {
  try {
    const res = await getDepartements()
    const data = Array.isArray(res.data) ? res.data : []
    // Trier par ID décroissant (les plus récents en premier)
    departements.value = data.sort((a: Departement, b: Departement) => b.id - a.id)
  } catch (e: any) {
    console.error('Erreur chargement départements', e)
    alert('Erreur chargement départements: ' + e.response?.data?.message || e.message)
  }
}

function openModal(dept?: Departement) {
  if (dept) {
    isEdit.value = true
    editId.value = dept.id
    form.nom = dept.nom
    form.description = dept.description || ''
  } else {
    isEdit.value = false
    editId.value = null
    form.nom = ''
    form.description = ''
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function handleSubmit() {
  try {
    if (isEdit.value && editId.value !== null) {
      await updateDepartement(editId.value, form)
    } else {
      await createDepartement(form)
    }
    await fetchDepartements()
    closeModal()
  } catch (e: any) {
    console.error('Erreur sauvegarde', e)
    alert('Impossible de sauvegarder : ' + e.response?.data?.message || e.message)
  }
}

async function handleDelete(id: number) {
  if (!confirm('Supprimer ce département ?')) return
  try {
    await deleteDepartement(id)
    await fetchDepartements()
  } catch (e: any) {
    console.error('Erreur suppression', e)
    // Message d'erreur plus clair
    const errorMsg = e.response?.data?.message || e.response?.data?.error || e.message
    if (errorMsg.toLowerCase().includes('laboratoire') || errorMsg.toLowerCase().includes('labo')) {
      alert('❌ Impossible de supprimer ce département car il contient des laboratoires.\n\n💡 Vous devez d\'abord supprimer ou déplacer les laboratoires de ce département.')
    } else {
      alert('Impossible de supprimer : ' + errorMsg)
    }
  }
}

// Navigation vers les laboratoires filtrés par département
function voirLaboratoires(dept: Departement) {
  router.push({ 
    path: '/technicien/laboratoires', 
    query: { departementId: dept.id, departementNom: dept.nom } 
  })
}
</script>

<style scoped>
.modal.show { background-color: rgba(0,0,0,0.5); }
</style>
