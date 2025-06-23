package com.clinicaveterinaria.clinicaveterinaria.repository;

import com.clinicaveterinaria.clinicaveterinaria.model.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    // Listar todos os pets de um dono específico
    List<Pet> findByDonoDoPetId(Long donoId);

    // Buscar pets por nome e/ou dono
    List<Pet> findByNomeContainingIgnoreCase(String nome);
    List<Pet> findByNomeContainingIgnoreCaseAndDonoDoPetId(String nome, Long donoId);

    // Buscar pets por espécie ou raça
    List<Pet> findByEspecieIgnoreCase(String especie);
    List<Pet> findByRacaContainingIgnoreCase(String raca);
}