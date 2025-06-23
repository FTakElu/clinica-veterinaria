package com.clinicaveterinaria.clinicaveterinaria.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "consultas")
@Data
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate data;

    @Column(nullable = false)
    private LocalTime horario;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne
    @JoinColumn(name = "veterinario_id") // Pode ser nulo no agendamento inicial
    private Veterinario veterinario;

    @Column(columnDefinition = "TEXT") // Para descrições mais longas
    private String descricao; // Descrição do problema ou do atendimento

    private String status; // Ex: "AGENDADA", "CONFIRMADA", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"

    // Métodos agendarConsulta(), cancelarConsulta() seriam implementados no Service.
}