/*package com.clinicaveterinaria.clinicaveterinaria.model;

import com.clinicaveterinaria.clinicaveterinaria.model.entity.Pet;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Veterinario;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "vacinas")
@Data
public class Vacina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome; // Ex: "V8", "Antirrábica"

    private String fabricante;

    private String lote;

    private LocalDate dataAplicacao;

    private LocalDate dataProximaDose;

    @Column(columnDefinition = "TEXT")
    private String descricao; // Detalhes sobre a vacina

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet; // A qual pet a vacina foi aplicada

    @ManyToOne
    @JoinColumn(name = "veterinario_id") // Quem aplicou a vacina
    private Veterinario veterinario;

    // Métodos cadastrarVacina(), visualizarVacina() seriam implementados no Service,
    // podendo ser cadastro de TIPOS de vacina ou registro de APLICAÇÕES de vacina.
    // Pelo diagrama, parece mais ser cadastro de tipos de vacina. Se for registro de aplicação,
    // a entidade Vacina precisaria do pet e do veterinário que aplicou.
    // Ajustei a Vacina para ser uma APLICAÇÃO de vacina em um pet.
    // Se quiser gerenciar TIPOS de vacina (Pfizer, MSD, etc.), precisaria de outra entidade (TipoVacina).
}*/