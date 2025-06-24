// js/agendamento.js
import { api } from './api.js';
import { requireAuth, getUserRole } from './auth.js';
import { showLoadingSpinner, hideLoadingSpinner } from './common.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth(['CLIENTE', 'SECRETARIO'])) { // Apenas cliente e secretário podem agendar
        return;
    }

    const agendarConsultaForm = document.getElementById('agendarConsultaForm');
    const petSelect = document.getElementById('petSelect');
    const veterinarioSelect = document.getElementById('veterinarioSelect');

    async function loadPets() {
        try {
            showLoadingSpinner();
            const role = getUserRole();
            let pets = [];
            if (role === 'CLIENTE') {
                // Cliente só vê seus próprios pets
                pets = await api.get('/clientes/meus-pets'); // Assumindo endpoint no ClienteController
            } else if (role === 'SECRETARIO') {
                // Secretário pode ver todos ou pesquisar (simplificando para todos por agora)
                pets = await api.get('/pets'); // Assumindo endpoint no PetController para todos os pets
            }

            petSelect.innerHTML = '<option value="">Selecione um Pet</option>';
            pets.forEach(pet => {
                const option = document.createElement('option');
                option.value = pet.id;
                option.textContent = `${pet.nome} (${pet.especie})`;
                petSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar pets:', error);
            petSelect.innerHTML = '<option value="">Erro ao carregar pets</option>';
        } finally {
            hideLoadingSpinner();
        }
    }

    async function loadVeterinarios() {
        try {
            showLoadingSpinner();
            const veterinarios = await api.get('/veterinarios'); // Assumindo endpoint no VeterinarioService
            veterinarioSelect.innerHTML = '<option value="">Selecione um Veterinário</option>';
            veterinarios.forEach(vet => {
                const option = document.createElement('option');
                option.value = vet.id;
                option.textContent = `Dr(a). ${vet.nome}`;
                veterinarioSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar veterinários:', error);
            veterinarioSelect.innerHTML = '<option value="">Erro ao carregar veterinários</option>';
        } finally {
            hideLoadingSpinner();
        }
    }

    if (agendarConsultaForm) {
        await loadPets();
        await loadVeterinarios();

        agendarConsultaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoadingSpinner();

            const petId = petSelect.value;
            const veterinarioId = veterinarioSelect.value;
            const dataConsulta = document.getElementById('dataConsulta').value;
            const horaConsulta = document.getElementById('horaConsulta').value;
            const descricao = document.getElementById('descricao').value;

            try {
                const newConsulta = {
                    petId,
                    veterinarioId,
                    data: dataConsulta,
                    hora: horaConsulta,
                    descricao
                    // O status inicial provavelmente será "AGENDADA" e definido no backend
                };
                // Rota no ConsultaController do backend
                await api.post('/consultas', newConsulta);
                alert('Consulta agendada com sucesso!');
                agendarConsultaForm.reset();
                window.location.href = 'cliente-dashboard.html'; // Redireciona após o agendamento
            } catch (error) {
                alert('Erro ao agendar consulta: ' + error.message);
                console.error('Agendamento error:', error);
            } finally {
                hideLoadingSpinner();
            }
        });
    }
});