package com.clinicaveterinaria.clinicaveterinaria.model.dto;

import com.clinicaveterinaria.clinicaveterinaria.model.enums.UsuarioRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

// DTO para o registro de usuários com role específica (usado por ADMIN)
@Data
public class UsuarioRegisterDTO {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String senha;

    @NotBlank
    private String nomeCompleto;

    @NotNull
    private UsuarioRole role;

    // Campos opcionais para Veterinario
    private String crmv;
    private String especialidade;

    // Campos opcionais para Cliente
    private String telefone;
    private String cpf;
}