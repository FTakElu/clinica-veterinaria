package com.clinicaveterinaria.clinicaveterinaria.model.dto;

import com.clinicaveterinaria.clinicaveterinaria.model.enums.UsuarioRole;
import lombok.Data;

// DTO genérico para retorno de informações de usuário (sem senha)
@Data
public class UsuarioDTO {
    private Long id;
    private String email;
    private String nomeCompleto;
    private UsuarioRole role;
    // Adicione outros campos comuns que você deseja retornar, se houver
    private String telefone; // Para Cliente e outros que possam ter
    private String cpf; // Para Cliente
    private String crmv; // Para Veterinario
    private String especialidade; // Para Veterinario
}