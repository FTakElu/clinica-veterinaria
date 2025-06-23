package com.clinicaveterinaria.clinicaveterinaria.repository;

import com.clinicaveterinaria.clinicaveterinaria.model.entity.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    // Listar consultas por ID do Pet
    List<Consulta> findByPetId(Long petId);

    // Listar consultas por ID do Veterinário
    List<Consulta> findByVeterinarioId(Long veterinarioId);

    // Listar consultas por data
    List<Consulta> findByData(LocalDate data);

    // Listar consultas por data e veterinário
    List<Consulta> findByDataAndVeterinarioId(LocalDate data, Long veterinarioId);

    // Listar consultas por status
    List<Consulta> findByStatusIgnoreCase(String status);

    // Listar próximas consultas (a partir de uma data específica)
    List<Consulta> findByDataAfterOrderByDataAscHorarioAsc(LocalDate data);

    // Listar consultas de um pet com um status específico
    List<Consulta> findByPetIdAndStatusIgnoreCase(Long petId, String status);

    // Listar consultas de um veterinário com um status específico
    List<Consulta> findByVeterinarioIdAndStatusIgnoreCase(Long veterinarioId, String status);
}