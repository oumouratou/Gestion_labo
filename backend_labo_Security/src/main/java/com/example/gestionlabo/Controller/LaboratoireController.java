package com.example.gestionlabo.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.gestionlabo.Entites.Laboratoire;
import com.example.gestionlabo.Service.LaboratoireService;
import com.example.gestionlabo.Enums.Etat;
@RestController
@RequestMapping("/api/laboratoires")
@CrossOrigin("*")
public class LaboratoireController {
	@Autowired
    private LaboratoireService laboratoireService;

    // CREATE
    @PostMapping
    public Laboratoire create(@RequestBody Laboratoire labo) {
        return laboratoireService.create(labo);
    }

    // READ ALL
    @GetMapping
    public List<Laboratoire> findAll() {
        return laboratoireService.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Laboratoire findById(@PathVariable Long id) {
        return laboratoireService.findById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Laboratoire update(@PathVariable Long id, @RequestBody Laboratoire labo) {
        return laboratoireService.update(id, labo);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        laboratoireService.delete(id);
    }
    
 @GetMapping("/etats")
    public Etat[] getEtats() {
        return Etat.values(); // renvoie toutes les valeurs possibles de l'enum
    }

}
