package com.clinicaveterinaria.clinicaveterinaria.repository;

import com.clinicaveterinaria.clinicaveterinaria.model.entity.Veterinario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface VeterinarioRepository extends JpaRepository<Veterinario, Long> {
    // Buscar um Veterinário pelo ID do usuário associado
    Optional<Veterinario> findByEmail(String email);
    Optional<Veterinario> findByUsername(String username);

    // Buscar veterinários por especialização
    List<Veterinario> findByEspecializacaoContainingIgnoreCase(String especializacao);

    // Pode adicionar métodos de busca por nome, etc.
}