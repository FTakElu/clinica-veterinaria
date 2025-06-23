package com.clinicaveterinaria.clinicaveterinaria.controller;

import com.clinicaveterinaria.clinicaveterinaria.model.entity.Pet;
import com.clinicaveterinaria.clinicaveterinaria.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    @Autowired
    private PetService petService;

    // Dono do Pet (ROLE_COMUM) pode cadastrar seu próprio pet
    // Secretário (ROLE_SECRETARIO) pode cadastrar pet para qualquer dono
    @PreAuthorize("hasRole('COMUM') or hasRole('SECRETARIO')")
    @PostMapping("/dono/{donoId}") // Ou ajuste para pegar o donoId do usuário logado se for ROLE_COMUM
    public ResponseEntity<Pet> criarPet(@RequestBody Pet pet, @PathVariable Long donoId) {
        Pet novoPet = petService.cadastrarPet(pet, donoId);
        return new ResponseEntity<>(novoPet, HttpStatus.CREATED);
    }

    // Dono do Pet pode listar seus próprios pets
    // Veterinário/Secretário podem listar todos os pets ou pets específicos
    @PreAuthorize("hasAnyRole('COMUM', 'VETERINARIO', 'SECRETARIO', 'ADMINISTRADOR')")
    @GetMapping
    public ResponseEntity<List<Pet>> listarTodosPets() {
        // Implementar lógica de segurança: se for COMUM, listar apenas seus próprios pets
        List<Pet> pets = petService.listarTodosPets();
        return new ResponseEntity<>(pets, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('COMUM', 'VETERINARIO', 'SECRETARIO', 'ADMINISTRADOR')")
    @GetMapping("/dono/{donoId}") // Para Secretário/Veterinário verem pets de um dono específico
    public ResponseEntity<List<Pet>> listarPetsPorDono(@PathVariable Long donoId) {
        // Lógica de segurança: garantir que o COMUM só veja os próprios pets
        List<Pet> pets = petService.listarPetsPorDono(donoId);
        return new ResponseEntity<>(pets, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('COMUM', 'VETERINARIO', 'SECRETARIO', 'ADMINISTRADOR')")
    @GetMapping("/{id}")
    public ResponseEntity<Pet> buscarPetPorId(@PathVariable Long id) {
        // Lógica de segurança: garantir que o COMUM só veja o próprio pet
        return petService.buscarPetPorId(id)
                .map(pet -> new ResponseEntity<>(pet, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Dono do Pet ou Secretário pode atualizar
    @PreAuthorize("hasRole('COMUM') or hasRole('SECRETARIO')")
    @PutMapping("/{id}")
    public ResponseEntity<Pet> atualizarPet(@PathVariable Long id, @RequestBody Pet pet) {
        Pet petAtualizado = petService.atualizarPet(id, pet);
        return new ResponseEntity<>(petAtualizado, HttpStatus.OK);
    }

    // Somente Secretário pode deletar
    @PreAuthorize("hasRole('SECRETARIO') or hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPet(@PathVariable Long id) {
        petService.deletarPet(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}