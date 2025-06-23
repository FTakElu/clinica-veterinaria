package com.clinicaveterinaria.clinicaveterinaria.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "secretarios")
@Data
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Secretario extends Usuario {

    @Column(nullable = false)
    private String nome;

    private String sobrenome;

    // Métodos gerenciarConsultas(), cadastrarUsuario(), etc., seriam implementados no Service.
}