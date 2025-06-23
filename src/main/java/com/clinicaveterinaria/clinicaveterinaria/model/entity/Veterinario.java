package com.clinicaveterinaria.clinicaveterinaria.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "veterinarios")
@Data
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Veterinario extends Usuario {

    @Column(nullable = false)
    private String nome;

    private String sobrenome;

    private String especializacao; // Ex: Cardiologia, Dermatologia

    // Métodos atenderPet(), registrarVacina() seriam implementados no Service.
}