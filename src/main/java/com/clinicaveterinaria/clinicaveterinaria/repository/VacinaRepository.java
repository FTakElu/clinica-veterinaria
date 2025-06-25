/*package com.clinicaveterinaria.clinicaveterinaria.repository;

import com.clinicaveterinaria.clinicaveterinaria.model.Vacina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VacinaRepository extends JpaRepository<Vacina, Long> {
    // Listar vacinas aplicadas a um pet específico
    List<Vacina> findByPetId(Long petId);

    // Listar vacinas aplicadas por um veterinário específico
    List<Vacina> findByVeterinarioId(Long veterinarioId);

    // Listar vacinas pelo nome da vacina (ex: todas as "V8" aplicadas)
    List<Vacina> findByNomeContainingIgnoreCase(String nome);

    // Listar vacinas aplicadas dentro de um período
    List<Vacina> findByDataAplicacaoBetween(LocalDate startDate, LocalDate endDate);

    // Listar vacinas que precisam de próxima dose em breve
    List<Vacina> findByDataProximaDoseBetween(LocalDate startDate, LocalDate endDate);

    // Listar vacinas de um pet com um certo nome
    List<Vacina> findByPetIdAndNomeContainingIgnoreCase(Long petId, String nome);
}*/