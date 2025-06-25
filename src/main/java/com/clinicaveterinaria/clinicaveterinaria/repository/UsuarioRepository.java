package com.clinicaveterinaria.clinicaveterinaria.repository;

import com.clinicaveterinaria.clinicaveterinaria.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails; // Pode remover se loadUserByUsername usa Optional<Usuario>
import java.util.Optional; // Importar Optional

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Retorna um Optional, que é a forma idiomática do Spring Data JPA
    Optional<Usuario> findByEmail(String email);
}
