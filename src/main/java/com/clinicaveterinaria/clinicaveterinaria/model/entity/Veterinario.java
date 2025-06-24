package com.clinicaveterinaria.clinicaveterinaria.model.entity;

import com.clinicaveterinaria.clinicaveterinaria.model.enums.UsuarioRole;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "veterinarios")
@PrimaryKeyJoinColumn(name = "id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Veterinario extends Usuario {

    private String nomeCompleto;
    private String crmv; // Registro no conselho de medicina veterinária
    private String especialidade;

    @OneToMany(mappedBy = "veterinario")
    private List<Consulta> consultas;

    @OneToMany(mappedBy = "veterinarioResponsavel")
    private List<AplicacaoVacina> aplicacoesVacinas;

    public Veterinario(String email, String senha, String nomeCompleto, String crmv, String especialidade) {
        super(email, senha, UsuarioRole.VETERINARIO);
        this.nomeCompleto = nomeCompleto;
        this.crmv = crmv;
        this.especialidade = especialidade;
    }
}


