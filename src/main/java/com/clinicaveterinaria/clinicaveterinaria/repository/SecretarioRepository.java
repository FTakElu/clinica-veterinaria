package com.clinicaveterinaria.clinicaveterinaria.repository;

import com.clinicaveterinaria.clinicaveterinaria.model.entity.Secretario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SecretarioRepository extends JpaRepository<Secretario, Long> {
    // Buscar um Secretário pelo ID do usuário associado
    Optional<Secretario> findByEmail(String email);
    Optional<Secretario> findByUsername(String username);

    // Geralmente não há muitos secretários para precisar de buscas complexas.
}