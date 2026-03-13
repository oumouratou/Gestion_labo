<template>
  <div>
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1><i class="fas fa-plus-circle mr-2"></i> Nouvelle Réservation</h1>
          </div>
          <div class="col-sm-6">
            <router-link to="/etudiant/reservations" class="btn btn-secondary float-right">
              <i class="fas fa-arrow-left mr-1"></i> Retour
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-8 offset-md-2">
            <div class="card card-info">
              <div class="card-header">
                <h3 class="card-title">Formulaire de réservation</h3>
              </div>

              <form @submit.prevent="handleSubmit">
                <div class="card-body">
                  <!-- Département -->
                  <div class="form-group">
                    <label>Département *</label>
                    <select class="form-control" v-model="selectedDeptId" @change="onDepartementChange" required>
                      <option value="">Sélectionner un département</option>
                      <option v-for="dept in departements" :key="dept.id" :value="dept.id">
                        {{ dept.nom }}
                      </option>
                    </select>
                  </div>

                  <!-- Laboratoire (filtré par département, ACTIFS uniquement) -->
                  <div class="form-group">
                    <label>Laboratoire *</label>
                    <select class="form-control" v-model="form.laboratoireId" :disabled="!selectedDeptId" required>
                      <option value="">{{ !selectedDeptId ? 'Sélectionnez d\'abord un département' : 'Sélectionner un laboratoire' }}</option>
                      <option
                        v-for="labo in filteredLaboratoires"
                        :key="labo.id"
                        :value="labo.id"
                      >
                        {{ labo.nomLabo }}
                      </option>
                    </select>
                    <small class="text-muted" v-if="selectedDeptId && laboratoiresInactifs > 0">
                      <i class="fas fa-info-circle mr-1"></i>
                      {{ laboratoiresInactifs }} laboratoire(s) inactif(s) masqué(s)
                    </small>
                  </div>

                  <!-- Date -->
                  <div class="form-group">
                    <label>Date de réservation *</label>
                    <input type="date" class="form-control" v-model="form.dateReservation" :min="minDate" required>
                  </div>

                  <!-- Heures -->
                  <div class="row">
                    <div class="col-md-6">
                      <label>Heure de début *</label>
                      <input type="time" class="form-control" v-model="form.heureDebut" required>
                    </div>
                    <div class="col-md-6">
                      <label>Heure de fin *</label>
                      <input type="time" class="form-control" v-model="form.heureFin" required>
                    </div>
                  </div>

                  <!-- Motif -->
                  <div class="form-group mt-3">
                    <label>Motif *</label>
                    <textarea class="form-control" v-model="form.motif" rows="3" required></textarea>
                  </div>

                </div>

                <div class="card-footer">
                  <button type="submit" class="btn btn-info">
                    <i class="fas fa-calendar-check mr-1"></i> Créer la réservation
                  </button>
                  <router-link to="/etudiant/reservations" class="btn btn-secondary ml-2">
                    Annuler
                  </router-link>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/Service/api'
import { getActiveDepartements } from '@/Service/departementService'
import { getLaboratoires } from '@/Service/LaboratoireService'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const minDate = new Date().toISOString().split('T')[0]

const currentUser = computed(() => authStore.currentUser)
const departements = ref<any[]>([])
const laboratoires = ref<any[]>([])
const selectedDeptId = ref<number | ''>('')

// Laboratoires filtrés par département sélectionné (ACTIFS uniquement)
const filteredLaboratoires = computed(() => {
  if (!selectedDeptId.value) return []
  return laboratoires.value.filter(labo => {
    const matchDept = labo.departementId === selectedDeptId.value || labo.departement?.id === selectedDeptId.value
    const isActif = labo.etatLabo === 'ACTIF'
    return matchDept && isActif
  })
})

// Compter les labos inactifs masqués dans le département sélectionné
const laboratoiresInactifs = computed(() => {
  if (!selectedDeptId.value) return 0
  return laboratoires.value.filter(labo => {
    const matchDept = labo.departementId === selectedDeptId.value || labo.departement?.id === selectedDeptId.value
    const isInactif = labo.etatLabo !== 'ACTIF'
    return matchDept && isInactif
  }).length
})

function onDepartementChange() {
  form.laboratoireId = ''
}

const form = reactive({
  laboratoireId: '' as string | '',
  dateReservation: '',
  heureDebut: '08:00',
  heureFin: '10:00',
  motif: ''
})

// 🔹 On charge uniquement les labos du département de l'étudiant
onMounted(async () => {
  try {
    if (!authStore.isAuthenticated) {
      router.push('/')
      return
    }

    const [deptRes, laboRes] = await Promise.all([getActiveDepartements(), getLaboratoires()])
    departements.value = Array.isArray(deptRes.data) ? deptRes.data : []
    laboratoires.value = Array.isArray(laboRes.data) ? laboRes.data : []
    console.log('Départements:', departements.value)
    console.log('Laboratoires:', laboratoires.value)
    
    // Pré-sélectionner le labo si passé en paramètre
    if (route.query.laboratoireId) {
      const laboId = route.query.laboratoireId.toString()
      const labo = laboratoires.value.find(l => l.id.toString() === laboId && l.etatLabo === 'ACTIF')
      if (labo) {
        const deptId = labo.departementId || labo.departement?.id
        if (deptId) selectedDeptId.value = deptId
        form.laboratoireId = laboId
      }
    }
  } catch (e) {
    console.error('Erreur chargement laboratoires', e)
    alert("Erreur lors du chargement des laboratoires")
  }
})

async function handleSubmit() {
  if (form.heureDebut >= form.heureFin) {
    alert("Heure de fin invalide")
    return
  }

  if (!currentUser.value?.id) {
    alert("Vous devez être connecté pour faire une réservation")
    router.push('/')
    return
  }

  try {
    await api.post('/reservations', {
      laboratoireId: Number(form.laboratoireId),
      etudiantId: currentUser.value.id, // ✅ Ajout de l'ID étudiant
      dateReservation: form.dateReservation,
      heureDebut: form.heureDebut,
      heureFin: form.heureFin,
      motif: form.motif
    })

    

    alert("Réservation envoyée !")
    router.push('/etudiant/reservations')

  } catch (error: any) {
    console.error('Erreur réservation:', error)
    alert("Erreur lors de la réservation: " + (error.response?.data?.message || error.message))
  }
}
</script>
