<template>
  <div class="page-container">
    <section class="content-header">
      <div class="container-fluid">
        <h1><i class="fas fa-chalkboard-teacher mr-2"></i> Reclamations Enseignants</h1>
        <p>Suivi des reclamations des enseignants de votre departement</p>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Liste des reclamations</h3>
          </div>

          <div class="card-body table-responsive">
            <table class="table table-bordered table-striped table-hover" v-if="reclamations.length">
              <thead class="bg-success text-white">
                <tr>
                  <th>ID</th>
                  <th>Enseignant</th>
                  <th>CIN</th>
                  <th>Laboratoire</th>
                  <th>Equipement</th>
                  <th>Description</th>
                  <th>Quantite</th>
                  <th>Etat</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rec in reclamations" :key="rec.id">
                  <td>{{ rec.id }}</td>
                  <td>{{ rec.prenomAuteur }} {{ rec.nomAuteur }}</td>
                  <td>{{ rec.cinAuteur || rec.cin || 'N/A' }}</td>
                  <td>{{ rec.laboratoireNom || 'N/A' }}</td>
                  <td>{{ rec.equipementNom || 'N/A' }}</td>
                  <td>{{ truncateText(rec.description, 40) }}</td>
                  <td>{{ rec.quantite }}</td>
                  <td>
                    <span :class="getEtatBadge(rec.etat)">
                      {{ formatEtat(rec.etat) }}
                    </span>
                  </td>
                  <td>{{ formatDate(rec.dateReclamation) }}</td>
                  <td class="d-flex gap-1">
                    <button
                      class="btn btn-success btn-sm"
                      @click="traiterReclamation(rec.id)"
                      v-if="rec.etat === 'NON_TRAITEE'"
                    >
                      <i class="fas fa-check mr-1"></i> Traiter
                    </button>
                    <button
                      class="btn btn-danger btn-sm"
                      @click="annulerReclamation(rec.id)"
                      v-if="rec.etat === 'NON_TRAITEE'"
                    >
                      <i class="fas fa-times mr-1"></i> Annuler
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="text-center text-muted p-4">
              <i class="fas fa-inbox fa-3x mb-3"></i>
              <p>Aucune reclamation pour le moment</p>
            </div>
          </div>

          <div class="card-footer">
            <span>{{ reclamations.length }} reclamation(s)</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ReclamationService from '@/Service/ReclamationService'

interface Reclamation {
  id: number
  description: string
  quantite: number
  etat: string
  dateReclamation: string
  laboratoireNom?: string
  equipementNom?: string
  nomAuteur?: string
  prenomAuteur?: string
  roleAuteur?: string
  cinAuteur?: string
  cin?: string
}

const reclamations = ref<Reclamation[]>([])

// Charger les reclamations des enseignants du departement du technicien
async function fetchReclamations() {
  try {
    const res = await ReclamationService.getReclamationsPourTechnicien()
    const data = Array.isArray(res.data) ? res.data : []
    // Filtrer uniquement les reclamations des enseignants
    reclamations.value = data.filter((r: any) => r.roleAuteur === 'ENSEIGNANT')
  } catch (error) {
    console.error('Erreur chargement reclamations:', error)
    reclamations.value = []
  }
}

// Traiter une reclamation (Approuver)
async function traiterReclamation(id: number) {
  try {
    console.log(`Traitement réclamation #${id}...`);
    const response = await ReclamationService.traiterReclamation(id);
    console.log("Réponse traitement:", response.data);
    alert("✅ Réclamation approuvée avec succès ! Une notification a été envoyée à l'enseignant.");
    await fetchReclamations();
  } catch (error: any) {
    console.error('Erreur traitement:', error);
    console.error('Détails:', error.response?.data || error.message);
    alert("❌ Erreur: " + (error.response?.data?.message || error.response?.data || error.message));
  }
}

// Annuler une reclamation (Refuser)
async function annulerReclamation(id: number) {
  // Demander le motif de refus (obligatoire)
  const motif = prompt("Veuillez indiquer le motif de refus (obligatoire) :");
  
  if (motif === null) {
    // L'utilisateur a annulé
    return;
  }
  
  if (!motif || motif.trim() === '') {
    alert("❌ Le motif de refus est obligatoire pour refuser une réclamation.");
    return;
  }
  
  if (!confirm(`Voulez-vous vraiment refuser cette réclamation ?\n\nMotif: ${motif}`)) return;
  
  try {
    console.log(`Refus réclamation #${id} avec motif: ${motif}`);
    const response = await ReclamationService.refuserReclamationAvecMotif(id, motif.trim());
    console.log("Réponse refus:", response.data);
    alert("✅ Réclamation refusée. Une notification a été envoyée à l'enseignant.");
    await fetchReclamations();
  } catch (error: any) {
    console.error('Erreur refus:', error);
    console.error('Détails:', error.response?.data || error.message);
    alert("❌ Erreur: " + (error.response?.data?.message || error.response?.data || error.message));
  }
}

// Badge couleur selon l'etat
function getEtatBadge(etat: string) {
  return {
    NON_TRAITEE: 'badge badge-warning',
    TRAITEE: 'badge badge-success',
    ANNULEE: 'badge badge-danger'
  }[etat] || 'badge badge-secondary'
}

// Texte lisible pour l'etat
function formatEtat(etat: string) {
  return {
    NON_TRAITEE: 'Non traitee',
    TRAITEE: 'Traitee',
    ANNULEE: 'Annulee'
  }[etat] || etat
}

// Format date
function formatDate(date: string) {
  return date ? date.split('T')[0] : 'N/A'
}

// Tronquer le texte
function truncateText(text: string, maxLength: number) {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

onMounted(fetchReclamations)
</script>

<style scoped>
.page-container { max-width: 1400px; margin: 0 auto; padding: 20px; }
.card { background: #fff; border-radius: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); overflow: hidden; margin-bottom: 20px; }
.card-header { padding: 20px; font-weight: 600; font-size: 18px; }
.table th, .table td { vertical-align: middle; }
.badge { padding: 5px 10px; border-radius: 4px; font-size: 12px; text-transform: uppercase; }
.d-flex.gap-1 button { margin-right: 4px; }
.card-footer { font-size: 14px; color: #64748b; padding: 12px 20px; }
</style>
