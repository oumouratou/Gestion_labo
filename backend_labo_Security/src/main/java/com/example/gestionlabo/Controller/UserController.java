package com.example.gestionlabo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.gestionlabo.Entites.User;
import com.example.gestionlabo.Service.UserService;
import com.example.gestionlabo.DTO.EtudiantCreateRequest;
import com.example.gestionlabo.DTO.EtudiantUpdateRequest;
import org.springframework.http.ResponseEntity;
import com.example.gestionlabo.DTO.EnseignantCreateRequest;
import com.example.gestionlabo.DTO.EnseignantUpdateRequest;
@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")

public class UserController {

    @Autowired
    private UserService userService;

    // CREATE étudiant
    @PostMapping("/etudiants")
    public User createEtudiant(@RequestBody EtudiantCreateRequest dto) {
        return userService.createEtudiant(dto);
    }

    // READ ALL
    @GetMapping
    public List<User> findAll() {
        return userService.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public User findById(@PathVariable Long id) {
        return userService.findById(id);
    }
    //Update
    @PutMapping("/etudiants/{id}")
    public User updateEtudiant(@PathVariable Long id, @RequestBody EtudiantUpdateRequest dto) {
        return userService.updateEtudiant(id, dto);
    }


    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
    @PostMapping("/enseignants")
    public ResponseEntity<User> createEnseignant(@RequestBody EnseignantCreateRequest dto) {
        User u = userService.createEnseignant(dto);
        return ResponseEntity.ok(u);
    }
    @PutMapping("/enseignants/{id}")
    public User updateEnseignant(@PathVariable Long id, @RequestBody EnseignantUpdateRequest dto) {
        return userService.updateEnseignant(id, dto);
    }
    @DeleteMapping("/enseignants/{id}")
    public void deleteEnseignant(@PathVariable Long id) {
        userService.delete(id);
    }



}
