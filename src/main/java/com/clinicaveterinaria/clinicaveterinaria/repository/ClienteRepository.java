package com.clinicaveterinaria.clinicaveterinaria.repository;

import com.clinicaveterinaria.clinicaveterinaria.model.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    // Buscar um DonoDoPet pelo ID do usuário associado
    Optional<Cliente> findByEmail(String email); // Se o email do DonoDoPet for o mesmo do Usuario
    Optional<Cliente> findByUsername(String username); // Se o username do DonoDoPet for o mesmo do Usuario

    // Pode adicionar métodos de busca por nome, telefone se necessário,
    // mas geralmente a busca inicial seria pelo ID do usuário ou pela lista de todos.
}