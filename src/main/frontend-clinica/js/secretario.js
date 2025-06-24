// js/secretario.js
import { api } from './api.js';
import { requireAuth } from './auth.js';
import { showLoadingSpinner, hideLoadingSpinner, formatDate, openModal, closeModal } from './common.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth(['SECRETARIO'])) {
        return;
    }

    const currentPage = window.location.pathname;

    if (currentPage.includes('secretario-dashboard.html')) {
        await loadSecretarioDashboard();
    } else if (currentPage.includes('gerenciar-tipos-vacina.html')) {
        await loadTiposVacina();
        setupTipoVacinaModal();
    } else if (currentPage.includes('relatorio-consulta.html')) {
        setupRelatorioConsulta();
    }
});

async function loadSecretarioDashboard() {
    const proximosAgendamentosDiv = document.getElementById('proximosAgendamentosSecretario');
    const totalClientesSpan = document.getElementById('totalClientes');
    const totalPetsSpan = document.getElementById('totalPets');

    showLoadingSpinner();
    try {
        // Carregar agendamentos (talvez os próximos 5 ou os do dia)
        const agendamentos = await api.get('/consultas/proximos'); // Assumindo endpoint no ConsultaController
        if (proximosAgendamentosDiv) {
            proximosAgendamentosDiv.innerHTML = '';
            if (agendamentos.length === 0) {
                proximosAgendamentosDiv.innerHTML = '<p>Nenhum agendamento futuro.</p>';
            } else {
                agendamentos.forEach(agendamento => {
                    const agendamentoDiv = document.createElement('div');
                    agendamentoDiv.className = 'consulta-item';
                    agendamentoDiv.innerHTML = `
                        <p><strong>Pet:</strong> ${agendamento.petNome}</p>
                        <p><strong>Cliente:</strong> ${agendamento.clienteNome}</p>
                        <p><strong>Veterinário:</strong> Dr(a). ${agendamento.veterinarioNome}</p>
                        <p><strong>Data:</strong> ${formatDate(agendamento.data)}</p>
                        <p><strong>Hora:</strong> ${agendamento.hora}</p>
                        <p><strong>Status:</strong> ${agendamento.status}</p>
                    `;
                    proximosAgendamentosDiv.appendChild(agendamentoDiv);
                });
            }
        }

        // Carregar total de clientes e pets (assumindo endpoints simples)
        const clientesCount = await api.get('/clientes/count'); // Endpoint hipotético
        const petsCount = await api.get('/pets/count');       // Endpoint hipotético

        if (totalClientesSpan) totalClientesSpan.textContent = clientesCount.total;
        if (totalPetsSpan) totalPetsSpan.textContent = petsCount.total;

    } catch (error) {
        console.error('Erro ao carregar dashboard do secretário:', error);
        if (proximosAgendamentosDiv) proximosAgendamentosDiv.innerHTML = '<p>Erro ao carregar dados.</p>';
        if (totalClientesSpan) totalClientesSpan.textContent = 'Erro';
        if (totalPetsSpan) totalPetsSpan.textContent = 'Erro';
    } finally {
        hideLoadingSpinner();
    }
}

async function loadTiposVacina() {
    const tiposVacinaTableBody = document.querySelector('#tiposVacinaTable tbody');
    const addTipoVacinaButton = document.getElementById('addTipoVacinaButton');

    if (!tiposVacinaTableBody) return;

    addTipoVacinaButton.addEventListener('click', () => {
        resetTipoVacinaForm();
        document.getElementById('tipoVacinaModalTitle').textContent = 'Adicionar Tipo de Vacina';
        openModal('tipoVacinaModal');
    });

    showLoadingSpinner();
    try {
        const tiposVacina = await api.get('/tipos-vacina'); // Assumindo endpoint no TipoVacinaController
        tiposVacinaTableBody.innerHTML = '';
        if (tiposVacina.length === 0) {
            tiposVacinaTableBody.innerHTML = '<tr><td colspan="4">Nenhum tipo de vacina cadastrado.</td></tr>';
        } else {
            tiposVacina.forEach(tipo => {
                const row = tiposVacinaTableBody.insertRow();
                row.innerHTML = `
                    <td>${tipo.id}</td>
                    <td>${tipo.nome}</td>
                    <td>${tipo.descricao || 'N/A'}</td>
                    <td>
                        <button class="btn-edit btn-small" data-id="${tipo.id}">Editar</button>
                        <button class="btn-danger btn-small" data-id="${tipo.id}">Excluir</button>
                    </td>
                `;
            });

            document.querySelectorAll('#tiposVacinaTable .btn-edit').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const tipoId = e.target.dataset.id;
                    await loadTipoVacinaToForm(tipoId);
                    document.getElementById('tipoVacinaModalTitle').textContent = 'Editar Tipo de Vacina';
                    openModal('tipoVacinaModal');
                });
            });

            document.querySelectorAll('#tiposVacinaTable .btn-danger').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const tipoId = e.target.dataset.id;
                    if (confirm('Tem certeza que deseja excluir este tipo de vacina?')) {
                        await deleteTipoVacina(tipoId);
                    }
                });
            });
        }
    } catch (error) {
        console.error('Erro ao carregar tipos de vacina:', error);
        tiposVacinaTableBody.innerHTML = '<tr><td colspan="4">Erro ao carregar tipos de vacina.</td></tr>';
    } finally {
        hideLoadingSpinner();
    }
}

function setupTipoVacinaModal() {
    const tipoVacinaModal = document.getElementById('tipoVacinaModal');
    const tipoVacinaForm = document.getElementById('tipoVacinaForm');

    if (tipoVacinaModal) {
        tipoVacinaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoadingSpinner();

            const tipoVacinaId = document.getElementById('tipoVacinaIdEdit').value;
            const tipoVacinaData = {
                nome: document.getElementById('nomeTipoVacina').value,
                descricao: document.getElementById('descricaoTipoVacina').value,
            };

            try {
                if (tipoVacinaId) {
                    await api.put(`/tipos-vacina/${tipoVacinaId}`, tipoVacinaData); // Endpoint no TipoVacinaController
                    alert('Tipo de vacina atualizado com sucesso!');
                } else {
                    await api.post('/tipos-vacina', tipoVacinaData); // Endpoint no TipoVacinaController
                    alert('Tipo de vacina adicionado com sucesso!');
                }
                closeModal('tipoVacinaModal');
                loadTiposVacina(); // Recarrega a lista
            } catch (error) {
                alert('Erro ao salvar tipo de vacina: ' + error.message);
                console.error('Save tipo vacina error:', error);
            } finally {
                hideLoadingSpinner();
            }
        });
    }
}

async function loadTipoVacinaToForm(tipoId) {
    showLoadingSpinner();
    try {
        const tipo = await api.get(`/tipos-vacina/${tipoId}`);
        document.getElementById('tipoVacinaIdEdit').value = tipo.id;
        document.getElementById('nomeTipoVacina').value = tipo.nome;
        document.getElementById('descricaoTipoVacina').value = tipo.descricao;
    } catch (error) {
        console.error('Erro ao carregar tipo de vacina para o formulário:', error);
        alert('Erro ao carregar dados do tipo de vacina para edição.');
    } finally {
        hideLoadingSpinner();
    }
}

async function deleteTipoVacina(tipoId) {
    showLoadingSpinner();
    try {
        await api.delete(`/tipos-vacina/${tipoId}`);
        alert('Tipo de vacina excluído com sucesso!');
        loadTiposVacina();
    } catch (error) {
        alert('Erro ao excluir tipo de vacina: ' + error.message);
        console.error('Delete tipo vacina error:', error);
    } finally {
        hideLoadingSpinner();
    }
}

function resetTipoVacinaForm() {
    document.getElementById('tipoVacinaForm').reset();
    document.getElementById('tipoVacinaIdEdit').value = '';
}

function setupRelatorioConsulta() {
    const relatorioConsultaForm = document.getElementById('relatorioConsultaForm');
    const relatorioResultadosDiv = document.getElementById('relatorioResultados');

    if (!relatorioConsultaForm) return;

    relatorioConsultaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoadingSpinner();

        const dataInicio = document.getElementById('dataInicio').value;
        const dataFim = document.getElementById('dataFim').value;

        try {
            // Assumindo um endpoint no ConsultaController que recebe datas
            const relatorio = await api.get(`/consultas/relatorio?dataInicio=${dataInicio}&dataFim=${dataFim}`);
            
            relatorioResultadosDiv.innerHTML = '<h3>Resultados do Relatório</h3>';
            if (relatorio.length === 0) {
                relatorioResultadosDiv.innerHTML += '<p>Nenhuma consulta encontrada no período.</p>';
            } else {
                const ul = document.createElement('ul');
                relatorio.forEach(consulta => {
                    const li = document.createElement('li');
                    li.textContent = `Consulta ID: ${consulta.id} | Pet: ${consulta.petNome} | Vet: ${consulta.veterinarioNome} | Data: ${formatDate(consulta.data)} | Status: ${consulta.status}`;
                    ul.appendChild(li);
                });
                relatorioResultadosDiv.appendChild(ul);
            }

        } catch (error) {
            alert('Erro ao gerar relatório: ' + error.message);
            console.error('Relatório error:', error);
            relatorioResultadosDiv.innerHTML = '<h3>Resultados do Relatório</h3><p>Erro ao gerar relatório.</p>';
        } finally {
            hideLoadingSpinner();
        }
    });
}