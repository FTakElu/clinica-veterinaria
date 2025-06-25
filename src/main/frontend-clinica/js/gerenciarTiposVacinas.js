// js/gerenciarTiposVacina.js
import { api } from './api.js';
import { showModal, hideModal, displayMessage } from './common.js';

document.addEventListener('DOMContentLoaded', async () => {
    const addTipoVacinaBtn = document.getElementById('addTipoVacinaBtn');
    const tipoVacinaListDiv = document.getElementById('tipoVacinaList');
    const tipoVacinaSearchInput = document.getElementById('tipoVacinaSearch');

    const tipoVacinaModal = document.getElementById('tipoVacinaModal');
    const tipoVacinaModalTitle = document.getElementById('tipoVacinaModalTitle');
    const tipoVacinaForm = document.getElementById('tipoVacinaForm');
    const tipoVacinaIdHidden = document.getElementById('tipoVacinaIdHidden');
    const tipoVacinaNomeInput = document.getElementById('tipoVacinaNome');
    const tipoVacinaDescricaoInput = document.getElementById('tipoVacinaDescricao');
    const tipoVacinaSubmitBtn = tipoVacinaForm.querySelector('button[type="submit"]');
    const tipoVacinaMessageDiv = document.getElementById('tipoVacinaMessage');

    async function loadTiposVacina(searchQuery = '') {
        try {
            const tipos = await api.tiposVacina.getAll();
            tipoVacinaListDiv.innerHTML = '';
            const filteredTipos = tipos.filter(tipo =>
                tipo.nome.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredTipos && filteredTipos.length > 0) {
                filteredTipos.forEach(tipo => {
                    const tipoCard = document.createElement('div');
                    tipoCard.className = 'data-card';
                    tipoCard.innerHTML = `
                        <h4>${tipo.nome}</h4>
                        <p>${tipo.descricao || 'Sem descrição'}</p>
                        <button class="btn btn-secondary edit-tipo-vacina-btn" data-id="${tipo.id}">Editar</button>
                        <button class="btn btn-danger delete-tipo-vacina-btn" data-id="${tipo.id}">Excluir</button>
                    `;
                    tipoVacinaListDiv.appendChild(tipoCard);
                });
            } else {
                tipoVacinaListDiv.innerHTML = '<p>Nenhum tipo de vacina encontrado.</p>';
            }
        } catch (error) {
            console.error('Erro ao carregar tipos de vacina:', error);
            displayMessage(tipoVacinaListDiv, error.message || 'Erro ao carregar tipos de vacina.', 'error');
        }
    }

    if (addTipoVacinaBtn) {
        addTipoVacinaBtn.addEventListener('click', () => {
            tipoVacinaModalTitle.textContent = 'Cadastrar Novo Tipo de Vacina';
            tipoVacinaSubmitBtn.textContent = 'Cadastrar Tipo';
            tipoVacinaIdHidden.value = '';
            tipoVacinaForm.reset();
            showModal(tipoVacinaModal);
        });
    }

    tipoVacinaListDiv.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-tipo-vacina-btn')) {
            const tipoId = e.target.dataset.id;
            try {
                const tipo = await api.tiposVacina.getById(tipoId);
                tipoVacinaModalTitle.textContent = 'Editar Tipo de Vacina';
                tipoVacinaSubmitBtn.textContent = 'Salvar Alterações';
                tipoVacinaIdHidden.value = tipo.id;
                tipoVacinaNomeInput.value = tipo.nome;
                tipoVacinaDescricaoInput.value = tipo.descricao || '';
                showModal(tipoVacinaModal);
            } catch (error) {
                console.error('Erro ao buscar tipo de vacina para edição:', error);
                displayMessage(tipoVacinaListDiv, error.message || 'Erro ao carregar dados do tipo de vacina.', 'error');
            }
        } else if (e.target.classList.contains('delete-tipo-vacina-btn')) {
            const tipoIdToDelete = e.target.dataset.id;
            if (confirm('Tem certeza que deseja excluir este tipo de vacina? Isso afetará registros de vacinas aplicadas.')) {
                try {
                    const response = await api.tiposVacina.remove(tipoIdToDelete);
                    displayMessage(tipoVacinaListDiv, response.message, 'success');
                    await loadTiposVacina();
                } catch (error) {
                    console.error('Erro ao excluir tipo de vacina:', error);
                    displayMessage(tipoVacinaListDiv, error.message || 'Erro ao excluir tipo de vacina.', 'error');
                }
            }
        }
    });

    if (tipoVacinaForm) {
        tipoVacinaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = tipoVacinaIdHidden.value;
            const tipoData = {
                nome: tipoVacinaNomeInput.value,
                descricao: tipoVacinaDescricaoInput.value,
            };

            try {
                let response;
                if (id) {
                    response = await api.tiposVacina.update(id, tipoData);
                } else {
                    response = await api.tiposVacina.create(tipoData);
                }
                displayMessage(tipoVacinaMessageDiv, response.message, 'success');
                tipoVacinaForm.reset();
                await loadTiposVacina();
                setTimeout(() => hideModal(tipoVacinaModal), 1000);
            } catch (error) {
                console.error('Erro ao salvar tipo de vacina:', error);
                displayMessage(tipoVacinaMessageDiv, error.message || 'Erro ao salvar tipo de vacina.', 'error');
            }
        });
    }

    if (tipoVacinaSearchInput) {
        tipoVacinaSearchInput.addEventListener('input', (e) => {
            loadTiposVacina(e.target.value);
        });
    }

    loadTiposVacina();
});