package com.clinicaveterinaria.clinicaveterinaria.service;

import com.clinicaveterinaria.clinicaveterinaria.model.entity.Pet;
import com.clinicaveterinaria.clinicaveterinaria.model.Vacina;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Veterinario;
import com.clinicaveterinaria.clinicaveterinaria.repository.PetRepository;
import com.clinicaveterinaria.clinicaveterinaria.repository.VacinaRepository;
import com.clinicaveterinaria.clinicaveterinaria.repository.VeterinarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class VacinaService {

    @Autowired
    private VacinaRepository vacinaRepository;
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private VeterinarioRepository veterinarioRepository;

    // Secretário ou Veterinário registra a aplicação de uma vacina
    public Vacina registrarAplicacaoVacina(Vacina vacina, Long petId, Long veterinarioId) {
        Optional<Pet> petOptional = petRepository.findById(petId);
        Optional<Veterinario> vetOptional = veterinarioRepository.findById(veterinarioId);

        if (petOptional.isEmpty()) {
            throw new RuntimeException("Pet não encontrado!");
        }
        if (vetOptional.isEmpty()) {
            throw new RuntimeException("Veterinário não encontrado!");
        }

        vacina.setPet(petOptional.get());
        vacina.setVeterinario(vetOptional.get());
        // A data de aplicação pode ser definida aqui ou vir do DTO
        if (vacina.getDataAplicacao() == null) {
            vacina.setDataAplicacao(LocalDate.now());
        }
        return vacinaRepository.save(vacina);
    }

    public List<Vacina> listarTodasVacinasAplicadas() {
        return vacinaRepository.findAll();
    }

    public List<Vacina> listarVacinasAplicadasPorPet(Long petId) {
        return vacinaRepository.findByPetId(petId);
    }

    public Optional<Vacina> buscarVacinaAplicadaPorId(Long id) {
        return vacinaRepository.findById(id);
    }

    public Vacina atualizarVacinaAplicada(Long id, Vacina vacinaAtualizada) {
        return vacinaRepository.findById(id).map(vacina -> {
            vacina.setNome(vacinaAtualizada.getNome());
            vacina.setFabricante(vacinaAtualizada.getFabricante());
            vacina.setLote(vacinaAtualizada.getLote());
            vacina.setDataAplicacao(vacinaAtualizada.getDataAplicacao());
            vacina.setDataProximaDose(vacinaAtualizada.getDataProximaDose());
            vacina.setDescricao(vacinaAtualizada.getDescricao());
            // Não altere pet nem veterinário diretamente aqui
            return vacinaRepository.save(vacina);
        }).orElseThrow(() -> new RuntimeException("Vacina aplicada não encontrada!"));
    }

    public void deletarVacinaAplicada(Long id) {
        vacinaRepository.deleteById(id);
    }

    // Se houver uma entidade TipoVacina para gerenciar vacinas disponíveis na clínica,
    // os métodos de "Manter Vacina" (cadastrar/visualizar tipos) seriam lá.
    // Aqui são para APLICAÇÕES.
}