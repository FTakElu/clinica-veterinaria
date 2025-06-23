package com.clinicaveterinaria.clinicaveterinaria.controller;

import com.clinicaveterinaria.clinicaveterinaria.model.entity.Consulta;
import com.clinicaveterinaria.clinicaveterinaria.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultas")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    // Dono do Pet (ROLE_COMUM) pode agendar
    // Secretário (ROLE_SECRETARIO) pode agendar
    @PreAuthorize("hasRole('COMUM') or hasRole('SECRETARIO')")
    @PostMapping("/pet/{petId}/veterinario/{veterinarioId}")
    public ResponseEntity<Consulta> agendarConsulta(@RequestBody Consulta consulta, @PathVariable Long petId, @PathVariable Long veterinarioId) {
        Consulta novaConsulta = consultaService.agendarConsulta(consulta, petId, veterinarioId);
        return new ResponseEntity<>(novaConsulta, HttpStatus.CREATED);
    }

    // Todos podem listar suas consultas ou consultas específicas
    @PreAuthorize("hasAnyRole('COMUM', 'VETERINARIO', 'SECRETARIO', 'ADMINISTRADOR')")
    @GetMapping
    public ResponseEntity<List<Consulta>> listarTodasConsultas() {
        // Lógica de segurança para filtrar por role (ex: COMUM só vê as suas)
        List<Consulta> consultas = consultaService.listarTodasConsultas();
        return new ResponseEntity<>(consultas, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('COMUM', 'VETERINARIO', 'SECRETARIO', 'ADMINISTRADOR')")
    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<Consulta>> listarConsultasPorPet(@PathVariable Long petId) {
        List<Consulta> consultas = consultaService.listarConsultasPorPet(petId);
        return new ResponseEntity<>(consultas, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('VETERINARIO', 'SECRETARIO', 'ADMINISTRADOR')")
    @GetMapping("/veterinario/{veterinarioId}")
    public ResponseEntity<List<Consulta>> listarConsultasPorVeterinario(@PathVariable Long veterinarioId) {
        List<Consulta> consultas = consultaService.listarConsultasPorVeterinario(veterinarioId);
        return new ResponseEntity<>(consultas, HttpStatus.OK);
    }

    // Dono do Pet pode cancelar a própria consulta
    // Secretário pode cancelar qualquer consulta
    @PreAuthorize("hasRole('COMUM') or hasRole('SECRETARIO')")
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Consulta> cancelarConsulta(@PathVariable Long id) {
        Consulta consultaCancelada = consultaService.cancelarConsulta(id);
        return new ResponseEntity<>(consultaCancelada, HttpStatus.OK);
    }

    // Veterinário ou Secretário pode atualizar status/descrição do atendimento
    @PreAuthorize("hasAnyRole('VETERINARIO', 'SECRETARIO')")
    @PutMapping("/{id}/status/{newStatus}")
    public ResponseEntity<Consulta> atualizarStatusConsulta(@PathVariable Long id, @PathVariable String newStatus) {
        Consulta consultaAtualizada = consultaService.atualizarStatusConsulta(id, newStatus);
        return new ResponseEntity<>(consultaAtualizada, HttpStatus.OK);
    }

    // Veterinário registra atendimento
    @PreAuthorize("hasRole('VETERINARIO')")
    @PutMapping("/{id}/registrar-atendimento")
    public ResponseEntity<Consulta> registrarAtendimento(@PathVariable Long id, @RequestBody String descricaoAtendimento) {
        Consulta consultaConcluida = consultaService.registrarAtendimento(id, descricaoAtendimento);
        return new ResponseEntity<>(consultaConcluida, HttpStatus.OK);
    }

    // Veterinário pode gerar relatório
    // Secretário/Admin também podem, se necessário
    @PreAuthorize("hasAnyRole('VETERINARIO', 'SECRETARIO', 'ADMINISTRADOR')")
    @GetMapping("/{id}/relatorio")
    public ResponseEntity<String> gerarRelatorioConsulta(@PathVariable Long id) {
        String relatorio = consultaService.gerarRelatorioDeConsulta(id);
        return new ResponseEntity<>(relatorio, HttpStatus.OK);
    }
}