package com.clinicaveterinaria.clinicaveterinaria.service;

import com.clinicaveterinaria.clinicaveterinaria.model.entity.Consulta;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Pet;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Veterinario;
import com.clinicaveterinaria.clinicaveterinaria.repository.ConsultaRepository;
import com.clinicaveterinaria.clinicaveterinaria.repository.PetRepository;
import com.clinicaveterinaria.clinicaveterinaria.repository.VeterinarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private VeterinarioRepository veterinarioRepository;

    public Consulta agendarConsulta(Consulta consulta, Long petId, Long veterinarioId) {
        Optional<Pet> petOptional = petRepository.findById(petId);
        Optional<Veterinario> vetOptional = veterinarioRepository.findById(veterinarioId);

        if (petOptional.isEmpty()) {
            throw new RuntimeException("Pet não encontrado!");
        }
        if (vetOptional.isEmpty()) {
            throw new RuntimeException("Veterinário não encontrado!");
        }

        consulta.setPet(petOptional.get());
        consulta.setVeterinario(vetOptional.get());
        consulta.setStatus("AGENDADA");
        return consultaRepository.save(consulta);
    }

    public List<Consulta> listarTodasConsultas() {
        return consultaRepository.findAll();
    }

    public List<Consulta> listarConsultasPorPet(Long petId) {
        return consultaRepository.findByPetId(petId);
    }

    public List<Consulta> listarConsultasPorVeterinario(Long veterinarioId) {
        return consultaRepository.findByVeterinarioId(veterinarioId);
    }

    public Consulta cancelarConsulta(Long id) {
        return consultaRepository.findById(id).map(consulta -> {
            consulta.setStatus("CANCELADA");
            return consultaRepository.save(consulta);
        }).orElseThrow(() -> new RuntimeException("Consulta não encontrada!"));
    }

    public Consulta atualizarStatusConsulta(Long id, String newStatus) {
        return consultaRepository.findById(id).map(consulta -> {
            consulta.setStatus(newStatus);
            return consultaRepository.save(consulta);
        }).orElseThrow(() -> new RuntimeException("Consulta não encontrada!"));
    }

    // Método para Veterinário: registrar atendimento (atualizar descrição e status)
    public Consulta registrarAtendimento(Long consultaId, String descricaoAtendimento) {
        return consultaRepository.findById(consultaId).map(consulta -> {
            consulta.setDescricao(descricaoAtendimento);
            consulta.setStatus("CONCLUIDA"); // Ou outro status apropriado
            return consultaRepository.save(consulta);
        }).orElseThrow(() -> new RuntimeException("Consulta não encontrada!"));
    }

    // Método para gerar relatório de consulta (lógica simples aqui, mais complexa em um sistema real)
    public String gerarRelatorioDeConsulta(Long consultaId) {
        Optional<Consulta> consultaOptional = consultaRepository.findById(consultaId);
        if (consultaOptional.isPresent()) {
            Consulta consulta = consultaOptional.get();
            return "Relatório da Consulta ID: " + consulta.getId() + "\n" +
                    "Data: " + consulta.getData() + " Horário: " + consulta.getHorario() + "\n" +
                    "Pet: " + consulta.getPet().getNome() + " (Dono: " + consulta.getPet().getCliente().getNome() + ")\n" +
                    "Veterinário: " + consulta.getVeterinario().getNome() + "\n" +
                    "Descrição do Atendimento: " + consulta.getDescricao() + "\n" +
                    "Status: " + consulta.getStatus();
        } else {
            throw new RuntimeException("Consulta não encontrada para gerar relatório!");
        }
    }
}