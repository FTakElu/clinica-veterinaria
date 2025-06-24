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
public class SecretarioDTO extends UsuarioRegisterDTO {
    private Long id;
    @NotBlank(message = "Nome completo é obrigatório")
    private String nomeCompleto;

    public SecretarioDTO(Long id, String email, String senha, String nomeCompleto) {
        super(email, senha);
        this.id = id;
        this.nomeCompleto = nomeCompleto;
    }
}
