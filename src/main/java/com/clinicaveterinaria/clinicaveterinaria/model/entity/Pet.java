package com.clinicaveterinaria.clinicaveterinaria.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "pets")
@Data
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String raca;

    @Column(nullable = false)
    private String especie; // Ex: Cão, Gato

    private String sexo; // Ex: Macho, Fêmea

    @ManyToOne
    @JoinColumn(name = "dono_do_pet_id", nullable = false)
    private Cliente cliente;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Consulta> consultas;

    // Método atualizarDados() seria implementado no Service.
}