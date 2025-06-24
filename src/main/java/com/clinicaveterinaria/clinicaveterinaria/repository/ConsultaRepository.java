package com.clinicaveterinaria.clinicaveterinaria.repository;

import com.clinicaveterinaria.clinicaveterinaria.model.entity.Cliente;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Consulta;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Veterinario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    //List<Consulta> findByCliente(Cliente cliente);
    //List<Consulta> findByVeterinario(Veterinario veterinario);
    List<Consulta> findByVeterinarioId(Long veterinarioId);
    List<Consulta> findByClienteId(Long clienteId);
    boolean existsByVeterinarioAndDataHora(Veterinario veterinario, LocalDateTime dataHora); // Para verificar disponibilidade
}


