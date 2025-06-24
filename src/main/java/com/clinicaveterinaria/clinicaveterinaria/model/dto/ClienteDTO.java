package com.clinicaveterinaria.clinicaveterinaria.model.dto;

import com.clinicaveterinaria.clinicaveterinaria.model.enums.UsuarioRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ClienteDTO extends UsuarioRegisterDTO { // Herda campos de registro
    private Long id;
    @NotBlank(message = "Nome completo é obrigatório")
    private String nomeCompleto;
    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;
    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

    public ClienteDTO(Long id, String email, String senha, String nomeCompleto, String telefone, String cpf) {
        super(email, senha);
        this.id = id;
        this.nomeCompleto = nomeCompleto;
        this.telefone = telefone;
        this.cpf = cpf;
    }
}
