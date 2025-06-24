package com.clinicaveterinaria.clinicaveterinaria.repository;

import com.clinicaveterinaria.clinicaveterinaria.model.entity.AplicacaoVacina;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AplicacaoVacinaRepository extends JpaRepository<AplicacaoVacina, Long> {
    //List<AplicacaoVacina> findByPet(Pet pet);
    List<AplicacaoVacina> findByPetId(Long petId);
}
