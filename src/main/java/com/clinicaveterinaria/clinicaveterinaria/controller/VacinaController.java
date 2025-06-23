package com.clinicaveterinaria.clinicaveterinaria.controller;

import com.clinicaveterinaria.clinicaveterinaria.model.Vacina;
import com.clinicaveterinaria.clinicaveterinaria.service.VacinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vacinas")
public class VacinaController {

    @Autowired
    private VacinaService vacinaService;

    // Veterinário ou Secretário podem registrar aplicação de vacina
    @PreAuthorize("hasAnyRole('VETERINARIO', 'SECRETARIO')")
    @PostMapping("/pet/{petId}/veterinario/{veterinarioId}")
    public ResponseEntity<Vacina> registrarAplicacaoVacina(@RequestBody Vacina vacina, @PathVariable Long petId, @PathVariable Long veterinarioId) {
        Vacina novaVacina = vacinaService.registrarAplicacaoVacina(vacina, petId, veterinarioId);
        return new ResponseEntity<>(novaVacina, HttpStatus.CREATED);
    }

    // Todos podem listar vacinas aplicadas aos seus pets ou todos os pets
    @PreAuthorize("hasAnyRole('COMUM', 'VETERINARIO', 'SECRETARIO', 'ADMINISTRADOR')")
    @GetMapping
    public ResponseEntity<List<Vacina>> listarTodasVacinasAplicadas() {
        // Lógica de segurança para filtrar por role
        List<Vacina> vacinas = vacinaService.listarTodasVacinasAplicadas();
        return new ResponseEntity<>(vacinas, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('COMUM', 'VETERINARIO', 'SECRETARIO', 'ADMINISTRADOR')")
    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<Vacina>> listarVacinasAplicadasPorPet(@PathVariable Long petId) {
        List<Vacina> vacinas = vacinaService.listarVacinasAplicadasPorPet(petId);
        return new ResponseEntity<>(vacinas, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('VETERINARIO', 'SECRETARIO', 'ADMINISTRADOR')")
    @GetMapping("/{id}")
    public ResponseEntity<Vacina> buscarVacinaAplicadaPorId(@PathVariable Long id) {
        return vacinaService.buscarVacinaAplicadaPorId(id)
                .map(vacina -> new ResponseEntity<>(vacina, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Secretário ou Veterinário podem atualizar
    @PreAuthorize("hasAnyRole('VETERINARIO', 'SECRETARIO')")
    @PutMapping("/{id}")
    public ResponseEntity<Vacina> atualizarVacinaAplicada(@PathVariable Long id, @RequestBody Vacina vacina) {
        Vacina vacinaAtualizada = vacinaService.atualizarVacinaAplicada(id, vacina);
        return new ResponseEntity<>(vacinaAtualizada, HttpStatus.OK);
    }

    // Secretário ou Administrador pode deletar (se for permitido remover um registro de aplicação)
    @PreAuthorize("hasAnyRole('SECRETARIO', 'ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarVacinaAplicada(@PathVariable Long id) {
        vacinaService.deletarVacinaAplicada(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}