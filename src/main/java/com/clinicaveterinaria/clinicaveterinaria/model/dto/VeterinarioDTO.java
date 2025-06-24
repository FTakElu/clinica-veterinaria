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
public class VeterinarioDTO extends UsuarioRegisterDTO {
    private Long id;
    @NotBlank(message = "Nome completo é obrigatório")
    private String nomeCompleto;
    @NotBlank(message = "CRMV é obrigatório")
    private String crmv;
    private String especialidade;

    public VeterinarioDTO(Long id, String email, String senha, String nomeCompleto, String crmv, String especialidade) {
        super(email, senha);
        this.id = id;
        this.nomeCompleto = nomeCompleto;
        this.crmv = crmv;
        this.especialidade = especialidade;
    }
}
