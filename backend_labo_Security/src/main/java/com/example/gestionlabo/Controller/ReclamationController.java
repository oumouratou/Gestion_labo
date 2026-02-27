package com.example.gestionlabo.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.gestionlabo.Entites.Reclamation;
import com.example.gestionlabo.Service.ReclamationService;

@RestController
@RequestMapping("/api/reclamations")
@CrossOrigin("*")
public class ReclamationController {

    @Autowired
    private ReclamationService reclamationService;
    
    // CREATE
    @PostMapping("/create")
    public Reclamation create(@RequestBody Reclamation r) {
        return reclamationService.create(r);
    }

    // READ ALL
    @GetMapping
    public List<Reclamation> findAll() {
        return reclamationService.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Reclamation findById(@PathVariable Long id) {
        return reclamationService.findById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Reclamation update(@PathVariable Long id, @RequestBody Reclamation r) {
        return reclamationService.update(id, r);
    }

    // TRAITER
    @PutMapping("/{id}/traiter")
    public Reclamation traiter(@PathVariable Long id) {
        return reclamationService.traiter(id);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        reclamationService.delete(id);
    }

}
