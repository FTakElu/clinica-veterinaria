package com.clinicaveterinaria.clinicaveterinaria.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "clientes")
@PrimaryKeyJoinColumn(name = "id") // Coluna de junção com a tabela 'users'
@Data
@EqualsAndHashCode(callSuper = true) // Importante para herança com Lombok
@NoArgsConstructor
public class Cliente extends Usuario {
    private String nomeCompleto;
    private String telefone;
    // Outros campos específicos do cliente

    @OneToMany(mappedBy = "dono")
    private List<Pet> pets;

    @OneToMany(mappedBy = "cliente")
    private List<Consulta> consultas;

    public Cliente(String email, String password, String nomeCompleto, String telefone) {
        super(null, email, password,  com.clinicaveterinaria.clinicaveterinaria.model.enums.UsuarioRole.CLIENTE);
        this.nomeCompleto = nomeCompleto;
        this.telefone = telefone;
    }
}