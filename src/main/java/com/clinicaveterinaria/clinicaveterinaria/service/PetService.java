package com.clinicaveterinaria.clinicaveterinaria.service;

import com.clinicaveterinaria.clinicaveterinaria.exception.ResourceNotFoundException;
import com.clinicaveterinaria.clinicaveterinaria.model.dto.PetDTO;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Cliente;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Pet;
import com.clinicaveterinaria.clinicaveterinaria.repository.ClienteRepository;
import com.clinicaveterinaria.clinicaveterinaria.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;
    @Autowired
    private ClienteRepository clienteRepository;

    @Transactional(readOnly = true)
    public List<PetDTO> findAllPets() {
        return petRepository.findAll().stream()
                .map(this::convertToPetDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PetDTO findPetById(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet", "ID", id));
        return convertToPetDTO(pet);
    }

    // Este método é mais genérico, o clienteService ou secretarioService fará a chamada
    @Transactional
    public PetDTO savePet(PetDTO petDTO) {
        Cliente dono = clienteRepository.findById(petDTO.getDonoId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente (Dono do Pet)", "ID", petDTO.getDonoId()));
        Pet pet = convertToPetEntity(petDTO);
        pet.setDono(dono);
        Pet savedPet = petRepository.save(pet);
        return convertToPetDTO(savedPet);
    }

    @Transactional
    public PetDTO updatePet(Long id, PetDTO petDTO) {
        Pet existingPet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet", "ID", id));

        Cliente novoDono = clienteRepository.findById(petDTO.getDonoId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente (Dono do Pet)", "ID", petDTO.getDonoId()));

        existingPet.setNome(petDTO.getNome());
        existingPet.setEspecie(petDTO.getEspecie());
        existingPet.setRaca(petDTO.getRaca());
        existingPet.setDataNascimento(petDTO.getDataNascimento());
        existingPet.setCor(petDTO.getCor());
        existingPet.setObservacoes(petDTO.getObservacoes());
        existingPet.setDono(novoDono); // Pode mudar o dono

        Pet updatedPet = petRepository.save(existingPet);
        return convertToPetDTO(updatedPet);
    }

    @Transactional
    public void deletePet(Long id) {
        if (!petRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pet", "ID", id);
        }
        petRepository.deleteById(id);
    }

    // Métodos de Conversão (repetidos)
    private PetDTO convertToPetDTO(Pet pet) {
        PetDTO dto = new PetDTO();
        dto.setId(pet.getId());
        dto.setNome(pet.getNome());
        dto.setEspecie(pet.getEspecie());
        dto.setRaca(pet.getRaca());
        dto.setDataNascimento(pet.getDataNascimento());
        dto.setCor(pet.getCor());
        dto.setObservacoes(pet.getObservacoes());
        dto.setDonoId(pet.getDono().getId());
        return dto;
    }

    private Pet convertToPetEntity(PetDTO dto) {
        Pet pet = new Pet();
        pet.setId(dto.getId()); // Pode ser null para nova entidade
        pet.setNome(dto.getNome());
        pet.setEspecie(dto.getEspecie());
        pet.setRaca(dto.getRaca());
        pet.setDataNascimento(dto.getDataNascimento());
        pet.setCor(dto.getCor());
        pet.setObservacoes(dto.getObservacoes());
        return pet;
    }
}
