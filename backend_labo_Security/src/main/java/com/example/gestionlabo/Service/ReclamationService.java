package com.example.gestionlabo.Service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.gestionlabo.Entites.Reclamation;
import com.example.gestionlabo.Enums.Etat;
import com.example.gestionlabo.Repositories.ReclamationRepository;

@Service
public class ReclamationService {
	@Autowired
    private ReclamationRepository reclamationRepository;

    // CREATE
    public Reclamation create(Reclamation r) {
        return reclamationRepository.save(r);
    }

    // READ ALL
    public List<Reclamation> findAll() {
        return reclamationRepository.findAll();
    }

    // READ BY ID
    public Reclamation findById(Long id) {
        return reclamationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réclamation introuvable"));
    }

    // UPDATE
    public Reclamation update(Long id, Reclamation newData) {
        Reclamation r = findById(id);
        r.setDescription(newData.getDescription());
        r.setEquipement(newData.getEquipement());
        r.setQuantite(newData.getQuantite());
        r.setEtat(newData.getEtat());
        return reclamationRepository.save(r);
    }

    // TRAITER
    public Reclamation traiter(Long id) {
        Reclamation r = findById(id);
        r.setEtat(Etat.TRAITEE);
        return reclamationRepository.save(r);
    }

    // DELETE
    public void delete(Long id) {
        reclamationRepository.deleteById(id);
    }

}
