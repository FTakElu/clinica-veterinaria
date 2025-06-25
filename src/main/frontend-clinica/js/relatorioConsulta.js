// js/veterinario.js
import { api } from './api.js';
import { requireAuth } from './auth.js';
import { showLoadingSpinner, hideLoadingSpinner, formatDate } from './common.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth(['VETERINARIO'])) {
        return;
    }

    const currentPage = window.location.pathname;

    if (currentPage.includes('veterinario-dashboard.html')) {
        await loadVeterinarioDashboard();
    } else if (currentPage.includes('registrar-vacina.html')) {
        await loadRegistrarVacinaPage();
    }
});

async function loadVeterinarioDashboard() {
    const veterinarioNomeSpan = document.getElementById('veterinarioNome');
    const consultasDoDiaDiv = document.getElementById('consultasDoDia');
    const meusPacientesDiv = document.getElementById('meusPacientes');

    showLoadingSpinner();
    try {
        // Carregar dados do veterinário (nome)
        const veterinarioInfo = await api.get('/veterinarios/me'); // Assumindo endpoint no VeterinarioService
        if (veterinarioNomeSpan) {
            veterinarioNomeSpan.textContent = veterinarioInfo.nome;
        }

        // Carregar consultas do dia do veterinário
        const hoje = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const consultasHoje = await api.get(`/consultas/veterinario/dia?data=${hoje}`); // Assumindo endpoint no ConsultaController
        if (consultasDoDiaDiv) {
            consultasDoDiaDiv.innerHTML = '';
            if (consultasHoje.length === 0) {
                consultasDoDiaDiv.innerHTML = '<p>Nenhuma consulta agendada para hoje.</p>';
            } else {
                consultasHoje.forEach(consulta => {
                    const consultaDiv = document.createElement('div');
                    consultaDiv.className = 'consulta-item';
                    consultaDiv.innerHTML = `
                        <p><strong>Pet:</strong> ${consulta.petNome} (Dono: ${consulta.clienteNome})</p>
                        <p><strong>Hora:</strong> ${consulta.hora}</p>
                        <p><strong>Status:</strong> ${consulta.status}</p>
                        <p><strong>Descrição:</strong> ${consulta.descricao || 'N/A'}</p>
                        <button class="btn-primary btn-small" onclick="alert('Funcionalidade de detalhe/edição da consulta')">Ver/Editar</button>
                    `;
                    consultasDoDiaDiv.appendChild(consultaDiv);
                });
            }
        }

        // Carregar alguns pacientes (pets) relacionados ao veterinário
        const petsVeterinario = await api.get('/pets/veterinario'); // Endpoint hipotético, talvez pets associados às consultas dele
        if (meusPacientesDiv) {
            meusPacientesDiv.innerHTML = '';
            if (petsVeterinario.length === 0) {
                meusPacientesDiv.innerHTML = '<p>Nenhum paciente atribuído.</p>';
            } else {
                petsVeterinario.slice(0, 3).forEach(pet => {
                    const petDiv = document.createElement('div');
                    petDiv.className = 'pet-card-small';
                    petDiv.innerHTML = `
                        <h3>${pet.nome}</h3>
                        <p>${pet.especie} - ${pet.raca || 'N/A'}</p>
                        <a href="detalhe-pet.html?id=${pet.id}" class="btn-small">Ver Detalhes</a>
                    `;
                    meusPacientesDiv.appendChild(petDiv);
                });
            }
        }

    } catch (error) {
        console.error('Erro ao carregar dashboard do veterinário:', error);
        if (consultasDoDiaDiv) consultasDoDiaDiv.innerHTML = '<p>Erro ao carregar dados.</p>';
        if (meusPacientesDiv) meusPacientesDiv.innerHTML = '<p>Erro ao carregar dados.</p>';
    } finally {
        hideLoadingSpinner();
    }
}

async function loadRegistrarVacinaPage() {
    const registrarVacinaForm = document.getElementById('registrarVacinaForm');
    const petIdVacinaSelect = document.getElementById('petIdVacina');
    const tipoVacinaIdSelect = document.getElementById('tipoVacinaId');

    if (!registrarVacinaForm) return;

    showLoadingSpinner();
    try {
        // Carregar pets que o veterinário pode registrar vacina (todos ou apenas seus pacientes)
        const pets = await api.get('/pets'); // Ou '/veterinarios/meus-pacientes/pets'
        petIdVacinaSelect.innerHTML = '<option value="">Selecione um Pet</option>';
        pets.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.id;
            option.textContent = `${pet.nome} (${pet.especie} - Dono: ${pet.donoNome})`; // Supondo donoNome
            petIdVacinaSelect.appendChild(option);
        });

        // Carregar tipos de vacina
        const tiposVacina = await api.get('/tipos-vacina'); // Do TipoVacinaController
        tipoVacinaIdSelect.innerHTML = '<option value="">Selecione o Tipo da Vacina</option>';
        tiposVacina.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.nome;
            tipoVacinaIdSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Erro ao carregar dados para registrar vacina:', error);
        petIdVacinaSelect.innerHTML = '<option value="">Erro ao carregar pets</option>';
        tipoVacinaIdSelect.innerHTML = '<option value="">Erro ao carregar tipos de vacina</option>';
    } finally {
        hideLoadingSpinner();
    }

    registrarVacinaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoadingSpinner();

        const vacinaData = {
            petId: petIdVacinaSelect.value,
            tipoVacinaId: tipoVacinaIdSelect.value,
            dataAplicacao: document.getElementById('dataAplicacao').value,
            fabricante: document.getElementById('fabricante').value,
            veterinarioId: await api.get('/veterinarios/me').then(vet => vet.id) // Pega o ID do veterinário logado
        };

        try {
            await api.post('/vacinas', vacinaData); // Assumindo endpoint no VacinaController
            alert('Vacina registrada com sucesso!');
            registrarVacinaForm.reset();
            // Opcional: redirecionar ou recarregar lista de vacinas do pet
        } catch (error) {
            alert('Erro ao registrar vacina: ' + error.message);
            console.error('Register vacina error:', error);
        } finally {
            hideLoadingSpinner();
        }
    });
}