package com.clinicaveterinaria.clinicaveterinaria.service;

import com.clinicaveterinaria.clinicaveterinaria.model.entity.Cliente;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Pet;
import com.clinicaveterinaria.clinicaveterinaria.repository.ClienteRepository;
import com.clinicaveterinaria.clinicaveterinaria.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private ClienteRepository clienteRepository; // Para associar o pet ao dono

    public Pet cadastrarPet(Pet pet, Long donoId) {
        Optional<Cliente> donoOptional = clienteRepository.findById(donoId);
        if (donoOptional.isPresent()) {
            pet.setCliente(donoOptional.get());
            return petRepository.save(pet);
        } else {
            throw new RuntimeException("Dono do Pet não encontrado!");
        }
    }

    public Optional<Pet> buscarPetPorId(Long id) {
        return petRepository.findById(id);
    }

    public List<Pet> listarTodosPets() {
        return petRepository.findAll();
    }

    public List<Pet> listarPetsPorDono(Long donoId) {
        return petRepository.findByDonoDoPetId(donoId);
    }

    public Pet atualizarPet(Long id, Pet petAtualizado) {
        return petRepository.findById(id).map(pet -> {
            pet.setNome(petAtualizado.getNome());
            pet.setRaca(petAtualizado.getRaca());
            pet.setEspecie(petAtualizado.getEspecie());
            pet.setSexo(petAtualizado.getSexo());
            // Não altere o donoDoPet aqui diretamente. Se precisar transferir, crie um método específico.
            return petRepository.save(pet);
        }).orElseThrow(() -> new RuntimeException("Pet não encontrado!"));
    }

    public void deletarPet(Long id) {
        petRepository.deleteById(id);
    }
}