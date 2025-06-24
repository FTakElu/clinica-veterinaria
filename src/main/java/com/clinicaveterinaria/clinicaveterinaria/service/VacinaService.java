package com.clinicaveterinaria.clinicaveterinaria.service;

import com.clinicaveterinaria.clinicaveterinaria.exception.ResourceNotFoundException;
import com.clinicaveterinaria.clinicaveterinaria.model.dto.AplicacaoVacinaDTO;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.AplicacaoVacina;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Pet;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.TipoVacina;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Veterinario;
import com.clinicaveterinaria.clinicaveterinaria.repository.AplicacaoVacinaRepository;
import com.clinicaveterinaria.clinicaveterinaria.repository.PetRepository;
import com.clinicaveterinaria.clinicaveterinaria.repository.TipoVacinaRepository;
import com.clinicaveterinaria.clinicaveterinaria.repository.VeterinarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VacinaService { // Renomeado de 'VacinaService' para 'AplicacaoVacinaService' para clareza

    @Autowired
    private AplicacaoVacinaRepository aplicacaoVacinaRepository;
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private TipoVacinaRepository tipoVacinaRepository;
    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @Transactional(readOnly = true)
    public List<AplicacaoVacinaDTO> findAllAplicacoesVacina() {
        return aplicacaoVacinaRepository.findAll().stream()
                .map(this::convertToAplicacaoVacinaDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AplicacaoVacinaDTO findAplicacaoVacinaById(Long id) {
        AplicacaoVacina aplicacaoVacina = aplicacaoVacinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AplicacaoVacina", "ID", id));
        return convertToAplicacaoVacinaDTO(aplicacaoVacina);
    }

    @Transactional
    public AplicacaoVacinaDTO createAplicacaoVacina(AplicacaoVacinaDTO aplicacaoVacinaDTO) {
        Pet pet = petRepository.findById(aplicacaoVacinaDTO.getPetId())
                .orElseThrow(() -> new ResourceNotFoundException("Pet", "ID", aplicacaoVacinaDTO.getPetId()));
        TipoVacina tipoVacina = tipoVacinaRepository.findById(aplicacaoVacinaDTO.getTipoVacinaId())
                .orElseThrow(() -> new ResourceNotFoundException("TipoVacina", "ID", aplicacaoVacinaDTO.getTipoVacinaId()));
        Veterinario veterinarioResponsavel = null;
        if (aplicacaoVacinaDTO.getVeterinarioResponsavelId() != null) {
            veterinarioResponsavel = veterinarioRepository.findById(aplicacaoVacinaDTO.getVeterinarioResponsavelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Veterinário Responsável", "ID", aplicacaoVacinaDTO.getVeterinarioResponsavelId()));
        }

        AplicacaoVacina aplicacaoVacina = convertToAplicacaoVacinaEntity(aplicacaoVacinaDTO);
        aplicacaoVacina.setPet(pet);
        aplicacaoVacina.setTipoVacina(tipoVacina);
        aplicacaoVacina.setVeterinarioResponsavel(veterinarioResponsavel);

        // Calcula a data da próxima aplicação
        if (tipoVacina.getPeriodoReforcoEmMeses() > 0) {
            aplicacaoVacina.setDataProximaAplicacao(aplicacaoVacina.getDataAplicacao().plusMonths(tipoVacina.getPeriodoReforcoEmMeses()));
        }

        AplicacaoVacina savedAplicacao = aplicacaoVacinaRepository.save(aplicacaoVacina);
        return convertToAplicacaoVacinaDTO(savedAplicacao);
    }

    @Transactional
    public AplicacaoVacinaDTO updateAplicacaoVacina(Long id, AplicacaoVacinaDTO aplicacaoVacinaDTO) {
        AplicacaoVacina existingAplicacao = aplicacaoVacinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AplicacaoVacina", "ID", id));

        Pet pet = petRepository.findById(aplicacaoVacinaDTO.getPetId())
                .orElseThrow(() -> new ResourceNotFoundException("Pet", "ID", aplicacaoVacinaDTO.getPetId()));
        TipoVacina tipoVacina = tipoVacinaRepository.findById(aplicacaoVacinaDTO.getTipoVacinaId())
                .orElseThrow(() -> new ResourceNotFoundException("TipoVacina", "ID", aplicacaoVacinaDTO.getTipoVacinaId()));
        Veterinario veterinarioResponsavel = null;
        if (aplicacaoVacinaDTO.getVeterinarioResponsavelId() != null) {
            veterinarioResponsavel = veterinarioRepository.findById(aplicacaoVacinaDTO.getVeterinarioResponsavelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Veterinário Responsável", "ID", aplicacaoVacinaDTO.getVeterinarioResponsavelId()));
        }

        existingAplicacao.setPet(pet);
        existingAplicacao.setTipoVacina(tipoVacina);
        existingAplicacao.setVeterinarioResponsavel(veterinarioResponsavel);
        existingAplicacao.setDataAplicacao(aplicacaoVacinaDTO.getDataAplicacao());
        existingAplicacao.setLoteVacina(aplicacaoVacinaDTO.getLoteVacina());
        existingAplicacao.setObservacoes(aplicacaoVacinaDTO.getObservacoes());

        // Recalcula a data da próxima aplicação
        if (tipoVacina.getPeriodoReforcoEmMeses() > 0) {
            existingAplicacao.setDataProximaAplicacao(existingAplicacao.getDataAplicacao().plusMonths(tipoVacina.getPeriodoReforcoEmMeses()));
        } else {
            existingAplicacao.setDataProximaAplicacao(null);
        }

        AplicacaoVacina updatedAplicacao = aplicacaoVacinaRepository.save(existingAplicacao);
        return convertToAplicacaoVacinaDTO(updatedAplicacao);
    }

    @Transactional
    public void deleteAplicacaoVacina(Long id) {
        if (!aplicacaoVacinaRepository.existsById(id)) {
            throw new ResourceNotFoundException("AplicacaoVacina", "ID", id);
        }
        aplicacaoVacinaRepository.deleteById(id);
    }

    // Métodos de Conversão (repetidos)
    private AplicacaoVacinaDTO convertToAplicacaoVacinaDTO(AplicacaoVacina aplicacaoVacina) {
        AplicacaoVacinaDTO dto = new AplicacaoVacinaDTO();
        dto.setId(aplicacaoVacina.getId());
        dto.setPetId(aplicacaoVacina.getPet().getId());
        dto.setPetNome(aplicacaoVacina.getPet().getNome());
        dto.setTipoVacinaId(aplicacaoVacina.getTipoVacina().getId());
        dto.setTipoVacinaNome(aplicacaoVacina.getTipoVacina().getNome());
        if (aplicacaoVacina.getVeterinarioResponsavel() != null) {
            dto.setVeterinarioResponsavelId(aplicacaoVacina.getVeterinarioResponsavel().getId());
            dto.setVeterinarioResponsavelNome(aplicacaoVacina.getVeterinarioResponsavel().getNomeCompleto());
        }
        dto.setDataAplicacao(aplicacaoVacina.getDataAplicacao());
        dto.setDataProximaAplicacao(aplicacaoVacina.getDataProximaAplicacao());
        dto.setLoteVacina(aplicacaoVacina.getLoteVacina());
        dto.setObservacoes(aplicacaoVacina.getObservacoes());
        return dto;
    }

    private AplicacaoVacina convertToAplicacaoVacinaEntity(AplicacaoVacinaDTO dto) {
        AplicacaoVacina aplicacaoVacina = new AplicacaoVacina();
        aplicacaoVacina.setId(dto.getId());
        aplicacaoVacina.setDataAplicacao(dto.getDataAplicacao());
        aplicacaoVacina.setLoteVacina(dto.getLoteVacina());
        aplicacaoVacina.setObservacoes(dto.getObservacoes());
        return aplicacaoVacina;
    }
}
