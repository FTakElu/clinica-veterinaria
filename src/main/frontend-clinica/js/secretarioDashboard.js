// js/secretarioDashboard.js
import { api } from './api.js';
import { displayMessage } from './common.js';

document.addEventListener('DOMContentLoaded', async () => {
    const userName = localStorage.getItem('userName');
    const secretaryNameDisplay = document.getElementById('secretaryNameDisplay');
    const systemActivitiesDiv = document.getElementById('systemActivities');

    if (secretaryNameDisplay) {
        secretaryNameDisplay.textContent = userName;
    }

    async function loadSystemActivities() {
        try {
            systemActivitiesDiv.innerHTML = '<p>Carregando...</p>';
            let contentHtml = '';

            // Últimas Consultas
            const consultas = await api.consultas.getAll(); // Secretário vê todas
            contentHtml += '<h4>Últimas Consultas Agendadas:</h4>';
            if (consultas && consultas.length > 0) {
                const sortedConsultas = consultas.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora)).slice(0, 5);
                sortedConsultas.forEach(consulta => {
                    const dataHora = new Date(consulta.dataHora).toLocaleString();
                    contentHtml += `<div class="data-card">
                        <p><strong>Pet:</strong> ${consulta.pet?.nome || 'N/A'} (Dono: ${consulta.dono?.nome || 'N/A'})</p>
                        <p><strong>Veterinário:</strong> ${consulta.veterinario?.nome || 'N/A'}</p>
                        <p><strong>Data/Hora:</strong> ${dataHora}</p>
                        <p><strong>Status:</strong> ${consulta.status}</p>
                    </div>`;
                });
            } else {
                contentHtml += '<p>Nenhuma consulta recente.</p>';
            }

            // Últimos Pets Cadastrados
            const pets = await api.pets.getAll();
            contentHtml += '<h4>Últimos Pets Cadastrados:</h4>';
            if (pets && pets.length > 0) {
                const sortedPets = pets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
                sortedPets.forEach(pet => {
                    contentHtml += `<div class="data-card">
                        <p><strong>Nome:</strong> ${pet.nome}</p>
                        <p><strong>Espécie:</strong> ${pet.especie}</p>
                        <p><strong>Dono:</strong> ${pet.dono?.nome || 'N/A'}</p>
                    </div>`;
                });
            } else {
                contentHtml += '<p>Nenhum pet recente.</p>';
            }

            systemActivitiesDiv.innerHTML = contentHtml;

        } catch (error) {
            console.error('Erro ao carregar atividades do sistema:', error);
            displayMessage(systemActivitiesDiv, error.message || 'Erro ao carregar atividades do sistema.', 'error');
        }
    }

    loadSystemActivities();
});