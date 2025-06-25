// js/agendarConsulta.js
import { api } from './api.js';
import { displayMessage } from './common.js';

document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    const scheduleAppointmentForm = document.getElementById('scheduleAppointmentForm');
    const petSelect = document.getElementById('petSelect');
    const scheduleMessage = document.getElementById('scheduleMessage');

    async function loadClientPetsForSelect() {
        if (!userId) {
            displayMessage(scheduleMessage, 'ID do usuário não encontrado para carregar pets.', 'error');
            return;
        }
        try {
            const pets = await api.pets.getByOwnerId(userId);
            petSelect.innerHTML = '<option value="">Selecione um Pet</option>';
            if (pets && pets.length > 0) {
                pets.forEach(pet => {
                    const option = document.createElement('option');
                    option.value = pet.id;
                    option.textContent = pet.nome;
                    petSelect.appendChild(option);
                });
            } else {
                petSelect.innerHTML = '<option value="">Nenhum pet cadastrado.</option>';
                displayMessage(scheduleMessage, 'Por favor, cadastre um pet antes de agendar uma consulta.', 'info');
            }
        } catch (error) {
            console.error('Erro ao carregar pets para select:', error);
            displayMessage(scheduleMessage, error.message || 'Erro ao carregar seus pets para agendamento.', 'error');
        }
    }

    if (scheduleAppointmentForm) {
        scheduleAppointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const petId = petSelect.value;
            const dataConsulta = document.getElementById('dataConsulta').value;
            const horaConsulta = document.getElementById('horaConsulta').value;
            const motivo = document.getElementById('motivoConsulta').value;

            if (!petId) {
                displayMessage(scheduleMessage, 'Por favor, selecione um pet.', 'error');
                return;
            }

            const dataHora = new Date(`${dataConsulta}T${horaConsulta}`);

            try {
                const newConsulta = await api.consultas.create({
                    petId,
                    dataHora: dataHora.toISOString(), // Envia em formato ISO para o backend
                    motivo,
                    donoId: userId, // Garante que o cliente só agende para seus pets
                    status: 'Agendada'
                });
                displayMessage(scheduleMessage, 'Consulta agendada com sucesso!', 'success');
                scheduleAppointmentForm.reset();
                // Opcional: Redirecionar para a lista de minhas consultas
                setTimeout(() => {
                    window.location.href = 'minhas-consultas.html';
                }, 1000);
            } catch (error) {
                console.error('Erro ao agendar consulta:', error);
                displayMessage(scheduleMessage, error.message || 'Erro ao agendar consulta.', 'error');
            }
        });
    }

    if (userId) {
        loadClientPetsForSelect();
    }
});