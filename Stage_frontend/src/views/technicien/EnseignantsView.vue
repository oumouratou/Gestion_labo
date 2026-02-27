<template>
  <div>
    <!-- Header -->
    <section class="content-header">
      <h1><i class="fas fa-chalkboard-teacher mr-2"></i> Gestion des Enseignants</h1>
    </section>

    <!-- Filtre par département -->
    <section class="content">
      <div class="card card-outline card-info mb-3">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-filter mr-2"></i>Filtrer par département</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <select class="form-control" v-model="selectedDepartement">
                <option value="">Tous les départements</option>
                <option v-for="dept in departements" :key="dept.id" :value="dept.id">
                  {{ dept.nom }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <input type="text" class="form-control" v-model="searchQuery" placeholder="Rechercher par nom, prénom ou CIN...">
            </div>
            <div class="col-md-4">
              <span class="badge badge-info p-2">
                <i class="fas fa-users mr-1"></i> {{ filteredEnseignants.length }} enseignant(s) trouvé(s)
              </span>
            </div>
          </div>
        </div>
      </div>

    <!-- Table -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Liste des enseignants</h3>
          <div class="card-tools">
            <button class="btn btn-success btn-sm" @click="openModal()">
              <i class="fas fa-plus mr-1"></i> Ajouter
            </button>
          </div>
        </div>

        <div class="card-body table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="bg-info">
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>CIN</th>
                <th>Département</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ens in filteredEnseignants" :key="ens.id">
                <td>{{ ens.id }}</td>
                <td>{{ ens.nom }}</td>
                <td>{{ ens.prenom }}</td>
                <td>{{ ens.email }}</td>
                <td>{{ ens.cin }}</td>
                <td>{{ ens.departement?.nom || 'N/A' }}</td>
                <td>{{ formatDate(ens.createdAt) }}</td>
                <td class="text-center">
                  <div class="d-flex justify-content-center gap-2">
                    <button class="btn btn-primary btn-sm" @click="openModal(ens)">
                      <i class="fas fa-edit mr-1"></i>Modifier
                    </button>
                    <button class="btn btn-danger btn-sm ml-1" @click="handleDelete(ens.id)">
                      <i class="fas fa-trash mr-1"></i>Supprimer
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredEnseignants.length === 0">
                <td colspan="8" class="text-center">Aucun enseignant trouvé</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Modal scrollable -->
    <div class="modal fade" :class="{ show: showModal }" :style="{ display: showModal ? 'block' : 'none' }">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-info">
            <h4 class="modal-title">{{ isEdit ? 'Modifier' : 'Ajouter' }} un enseignant</h4>
            <button type="button" class="close" @click="closeModal">&times;</button>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="modal-body">
              <div class="form-group">
                <label>Nom</label>
                <input type="text" v-model="form.nom" class="form-control" required />
              </div>
              <div class="form-group">
                <label>Prénom</label>
                <input type="text" v-model="form.prenom" class="form-control" required />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="form.email" class="form-control" required />
              </div>
              <div class="form-group">
                <label>Mot de passe</label>
                <input type="password" v-model="form.password" class="form-control" :required="!isEdit" />
              </div>
              <div class="form-group">
                <label>CIN</label>
                <input type="text" v-model="form.cin" class="form-control" required />
              </div>
              <div class="form-group">
                <label>Département</label>
                <select v-model="form.departementId" class="form-control" required>
                  <option value="">Sélectionner un département</option>
                  <option v-for="dept in departements" :key="dept.id" :value="dept.id">
                    {{ dept.nom }}
                  </option>
                </select>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Annuler</button>
              <button type="submit" class="btn btn-info">
                {{ isEdit ? 'Modifier' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show" v-if="showModal"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { getUsers, createEnseignant, updateEnseignant, deleteUser } from '@/Service/UserService';
import { getDepartements } from '@/Service/departementService';

const enseignants = ref([]);
const departements = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const editId = ref<number | null>(null);
const selectedDepartement = ref<number | ''>('');
const searchQuery = ref('');

// Filtrer les enseignants par département et recherche
const filteredEnseignants = computed(() => {
  let result = enseignants.value;
  
  // Filtre par département
  if (selectedDepartement.value) {
    result = result.filter((e: any) => e.departement?.id === selectedDepartement.value);
  }
  
  // Filtre par recherche textuelle
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter((e: any) => 
      e.nom?.toLowerCase().includes(query) ||
      e.prenom?.toLowerCase().includes(query) ||
      e.cin?.toLowerCase().includes(query) ||
      e.email?.toLowerCase().includes(query)
    );
  }
  
  return result;
});

const form = reactive({
  nom: '',
  prenom: '',
  email: '',
  password: '',
  cin: '',
  departementId: 0
});

async function loadEnseignants() {
  const res = await getUsers();
  const data = res.data.filter(u => u.role === 'ENSEIGNANT');
  // Trier par ID décroissant (les plus récents en premier)
  enseignants.value = data.sort((a: any, b: any) => b.id - a.id);
}

async function loadDepartements() {
  const res = await getDepartements();
  departements.value = res.data;
}

function openModal(ens?: any) {
  if (ens) {
    isEdit.value = true;
    editId.value = ens.id;
    form.nom = ens.nom;
    form.prenom = ens.prenom;
    form.email = ens.email;
    form.cin = ens.cin;
    form.departementId = ens.departement?.id || 0;
    form.password = '';
  } else {
    isEdit.value = false;
    editId.value = null;
    form.nom = '';
    form.prenom = '';
    form.email = '';
    form.password = '';
    form.cin = '';
    form.departementId = 0;
  }
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function handleSubmit() {
  const data = {
    nom: form.nom,
    prenom: form.prenom,
    email: form.email,
    password: form.password || undefined,
    cin: form.cin,
    departementId: form.departementId
  };

  if (isEdit.value && editId.value) {
    await updateEnseignant(editId.value, data);
  } else {
    await createEnseignant(data);
  }

  await loadEnseignants();
  closeModal();
}

async function handleDelete(id: number) {
  try {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) return;
    await deleteUser(id);
    await loadEnseignants();
  } catch (error: any) {
    console.error('Erreur suppression:', error);
    alert(
      error.response?.data?.message ||
      'Impossible de supprimer l’enseignant. Vérifie le backend.'
    );
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString();
}

onMounted(async () => {
  await loadDepartements();
  await loadEnseignants();
});
</script>

<style scoped>
.modal.show { display: block; background: rgba(0,0,0,0.5); }
.modal-dialog { max-width: 600px; }
.modal-body { max-height: 70vh; overflow-y: auto; }

/* ---------- BOUTONS ACTIONS TABLEAU ---------- */
td.text-center {
  text-align: center;
  vertical-align: middle;
}

.d-flex {
  display: flex !important;
}

.justify-content-center {
  justify-content: center !important;
}

.gap-2 {
  gap: 0.5rem !important;
}

.btn-sm {
  white-space: nowrap;
}
</style>
