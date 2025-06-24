// js/cliente.js
import { api } from './api.js';
import { requireAuth, getUserRole } from './auth.js';
import { showLoadingSpinner, hideLoadingSpinner, formatDate, getUrlParam, openModal, closeModal } from './common.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth(['CLIENTE'])) {
        return;
    }

    const currentPage = window.location.pathname;

    if (currentPage.includes('cliente-dashboard.html')) {
        await loadClienteDashboard();
    } else if (currentPage.includes('meus-pets.html')) {
        await loadMeusPets();
        setupPetModal();
    } else if (currentPage.includes('detalhe-pet.html')) {
        const petId = getUrlParam('id');
        if (petId) {
            await loadPetDetails(petId);
            setupPetModal(); // Reutiliza o modal de pet para edição
        } else {
            alert('ID do pet não fornecido.');
            window.location.href = 'meus-pets.html';
        }
    }
});

async function loadClienteDashboard() {
    const clienteNomeSpan = document.getElementById('clienteNome');
    const proximasConsultasDiv = document.getElementById('proximasConsultas');
    const meusPetsDiv = document.getElementById('meusPets');

    showLoadingSpinner();
    try {
        // Carregar dados do cliente (ex: nome)
        const clienteInfo = await api.get('/clientes/me'); // Assumindo endpoint no ClienteController
        if (clienteNomeSpan) {
            clienteNomeSpan.textContent = clienteInfo.nome;
        }

        // Carregar próximas consultas do cliente
        const consultas = await api.get('/consultas/cliente'); // Assumindo endpoint no ConsultaController
        if (proximasConsultasDiv) {
            proximasConsultasDiv.innerHTML = '';
            if (consultas.length === 0) {
                proximasConsultasDiv.innerHTML = '<p>Nenhuma consulta agendada.</p>';
            } else {
                consultas.forEach(consulta => {
                    const consultaDiv = document.createElement('div');
                    consultaDiv.className = 'consulta-item';
                    consultaDiv.innerHTML = `
                        <p><strong>Pet:</strong> ${consulta.petNome}</p>
                        <p><strong>Veterinário:</strong> Dr(a). ${consulta.veterinarioNome}</p>
                        <p><strong>Data:</strong> ${formatDate(consulta.data)}</p>
                        <p><strong>Hora:</strong> ${consulta.hora}</p>
                        <p><strong>Status:</strong> ${consulta.status}</p>
                        <p><strong>Descrição:</strong> ${consulta.descricao || 'N/A'}</p>
                    `;
                    proximasConsultasDiv.appendChild(consultaDiv);
                });
            }
        }

        // Carregar alguns pets para o dashboard
        const pets = await api.get('/clientes/meus-pets');
        if (meusPetsDiv) {
            meusPetsDiv.innerHTML = '';
            if (pets.length === 0) {
                meusPetsDiv.innerHTML = '<p>Você ainda não tem pets cadastrados.</p>';
            } else {
                pets.slice(0, 3).forEach(pet => { // Mostrar os 3 primeiros
                    const petDiv = document.createElement('div');
                    petDiv.className = 'pet-card-small';
                    petDiv.innerHTML = `
                        <h3>${pet.nome}</h3>
                        <p>${pet.especie} - ${pet.raca || 'N/A'}</p>
                        <a href="detalhe-pet.html?id=${pet.id}" class="btn-small">Ver Detalhes</a>
                    `;
                    meusPetsDiv.appendChild(petDiv);
                });
            }
        }

    } catch (error) {
        console.error('Erro ao carregar dashboard do cliente:', error);
        if (proximasConsultasDiv) proximasConsultasDiv.innerHTML = '<p>Erro ao carregar dados.</p>';
        if (meusPetsDiv) meusPetsDiv.innerHTML = '<p>Erro ao carregar dados.</p>';
    } finally {
        hideLoadingSpinner();
    }
}

async function loadMeusPets() {
    const petsListDiv = document.getElementById('petsList');
    const addPetButton = document.getElementById('addPetButton');

    if (!petsListDiv) return;

    addPetButton.addEventListener('click', () => {
        resetPetForm();
        document.getElementById('modalTitle').textContent = 'Adicionar Novo Pet';
        openModal('petModal');
    });

    showLoadingSpinner();
    try {
        const pets = await api.get('/clientes/meus-pets'); // Assumindo endpoint no ClienteController
        petsListDiv.innerHTML = '';
        if (pets.length === 0) {
            petsListDiv.innerHTML = '<p>Você ainda não tem pets cadastrados. Clique em "Adicionar Novo Pet" para começar!</p>';
        } else {
            pets.forEach(pet => {
                const petCard = document.createElement('div');
                petCard.className = 'pet-card';
                petCard.innerHTML = `
                    <h3>${pet.nome}</h3>
                    <p><strong>Espécie:</strong> ${pet.especie}</p>
                    <p><strong>Raça:</strong> ${pet.raca || 'N/A'}</p>
                    <p><strong>Data Nasc.:</strong> ${formatDate(pet.dataNascimento)}</p>
                    <p><strong>Sexo:</strong> ${pet.sexo}</p>
                    <div class="pet-actions">
                        <a href="detalhe-pet.html?id=${pet.id}" class="btn-info btn-small">Detalhes</a>
                        <button class="btn-edit btn-small" data-id="${pet.id}">Editar</button>
                        <button class="btn-danger btn-small" data-id="${pet.id}">Excluir</button>
                    </div>
                `;
                petsListDiv.appendChild(petCard);
            });

            document.querySelectorAll('.btn-edit').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const petId = e.target.dataset.id;
                    await loadPetToForm(petId);
                    document.getElementById('modalTitle').textContent = 'Editar Pet';
                    openModal('petModal');
                });
            });

            document.querySelectorAll('.btn-danger').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const petId = e.target.dataset.id;
                    if (confirm('Tem certeza que deseja excluir este pet?')) {
                        await deletePet(petId);
                    }
                });
            });
        }
    } catch (error) {
        console.error('Erro ao carregar meus pets:', error);
        petsListDiv.innerHTML = '<p>Erro ao carregar seus pets.</p>';
    } finally {
        hideLoadingSpinner();
    }
}

async function loadPetDetails(petId) {
    const petNameDetail = document.getElementById('petNameDetail');
    const ownerNameDetail = document.getElementById('ownerNameDetail');
    const infoNome = document.getElementById('infoNome');
    const infoEspecie = document.getElementById('infoEspecie');
    const infoRaca = document.getElementById('infoRaca');
    const infoDataNascimento = document.getElementById('infoDataNascimento');
    const infoSexo = document.getElementById('infoSexo');
    const consultasHistoricoDiv = document.getElementById('consultasHistorico');
    const vacinasHistoricoDiv = document.getElementById('vacinasHistorico');
    const editPetButton = document.getElementById('editPetButton');
    const deletePetButton = document.getElementById('deletePetButton');

    showLoadingSpinner();
    try {
        const pet = await api.get(`/pets/${petId}`); // Assumindo endpoint no PetController
        if (petNameDetail) petNameDetail.textContent = pet.nome;
        if (ownerNameDetail) ownerNameDetail.textContent = pet.dono.nome; // Supondo que Pet retorne o dono
        if (infoNome) infoNome.textContent = pet.nome;
        if (infoEspecie) infoEspecie.textContent = pet.especie;
        if (infoRaca) infoRaca.textContent = pet.raca || 'N/A';
        if (infoDataNascimento) infoDataNascimento.textContent = formatDate(pet.dataNascimento);
        if (infoSexo) infoSexo.textContent = pet.sexo;

        // Carregar histórico de consultas do pet
        const consultas = await api.get(`/consultas/pet/${petId}`); // Assumindo endpoint no ConsultaController
        if (consultasHistoricoDiv) {
            consultasHistoricoDiv.innerHTML = '';
            if (consultas.length === 0) {
                consultasHistoricoDiv.innerHTML = '<p>Nenhuma consulta encontrada para este pet.</p>';
            } else {
                consultas.forEach(consulta => {
                    const consultaDiv = document.createElement('div');
                    consultaDiv.className = 'consulta-item';
                    consultaDiv.innerHTML = `
                        <p><strong>Data:</strong> ${formatDate(consulta.data)}</p>
                        <p><strong>Hora:</strong> ${consulta.hora}</p>
                        <p><strong>Veterinário:</strong> Dr(a). ${consulta.veterinarioNome}</p>
                        <p><strong>Status:</strong> ${consulta.status}</p>
                        <p><strong>Descrição:</strong> ${consulta.descricao || 'N/A'}</p>
                    `;
                    consultasHistoricoDiv.appendChild(consultaDiv);
                });
            }
        }

        // Carregar cartão de vacinação do pet
        const vacinas = await api.get(`/vacinas/pet/${petId}`); // Assumindo endpoint no VacinaController
        if (vacinasHistoricoDiv) {
            vacinasHistoricoDiv.innerHTML = '';
            if (vacinas.length === 0) {
                vacinasHistoricoDiv.innerHTML = '<p>Nenhuma vacina registrada para este pet.</p>';
            } else {
                vacinas.forEach(vacina => {
                    const vacinaDiv = document.createElement('div');
                    vacinaDiv.className = 'vacina-item';
                    vacinaDiv.innerHTML = `
                        <p><strong>Vacina:</strong> ${vacina.tipoVacinaNome}</p>
                        <p><strong>Data Aplicação:</strong> ${formatDate(vacina.dataAplicacao)}</p>
                        <p><strong>Fabricante:</strong> ${vacina.fabricante || 'N/A'}</p>
                        <p><strong>Veterinário:</strong> Dr(a). ${vacina.veterinarioNome}</p>
                    `;
                    vacinasHistoricoDiv.appendChild(vacinaDiv);
                });
            }
        }

        editPetButton.addEventListener('click', () => {
            loadPetToForm(petId);
            document.getElementById('modalTitle').textContent = 'Editar Pet';
            openModal('petModal');
        });

        deletePetButton.addEventListener('click', async () => {
            if (confirm('Tem certeza que deseja excluir este pet?')) {
                await deletePet(petId, true); // Passa true para redirecionar para meus-pets após exclusão
            }
        });

    } catch (error) {
        console.error('Erro ao carregar detalhes do pet:', error);
        alert('Erro ao carregar detalhes do pet.');
        window.location.href = 'meus-pets.html';
    } finally {
        hideLoadingSpinner();
    }
}

function setupPetModal() {
    const petModal = document.getElementById('petModal');
    const petForm = document.getElementById('petForm');

    if (petModal) {
        petForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoadingSpinner();

            const petId = document.getElementById('petId').value;
            const petData = {
                nome: document.getElementById('nomePet').value,
                especie: document.getElementById('especiePet').value,
                raca: document.getElementById('racaPet').value,
                dataNascimento: document.getElementById('dataNascimentoPet').value,
                sexo: document.getElementById('sexoPet').value,
            };

            try {
                if (petId) {
                    await api.put(`/pets/${petId}`, petData); // Assumindo endpoint no PetController
                    alert('Pet atualizado com sucesso!');
                } else {
                    await api.post('/pets', petData); // Assumindo endpoint no PetController
                    alert('Pet adicionado com sucesso!');
                }
                closeModal('petModal');
                loadMeusPets(); // Recarrega a lista de pets
                if (window.location.pathname.includes('detalhe-pet.html')) {
                    loadPetDetails(petId); // Recarrega detalhes se estiver na página de detalhes
                }
            } catch (error) {
                alert('Erro ao salvar pet: ' + error.message);
                console.error('Save pet error:', error);
            } finally {
                hideLoadingSpinner();
            }
        });
    }
}

async function loadPetToForm(petId) {
    showLoadingSpinner();
    try {
        const pet = await api.get(`/pets/${petId}`);
        document.getElementById('petId').value = pet.id;
        document.getElementById('nomePet').value = pet.nome;
        document.getElementById('especiePet').value = pet.especie;
        document.getElementById('racaPet').value = pet.raca;
        document.getElementById('dataNascimentoPet').value = pet.dataNascimento;
        document.getElementById('sexoPet').value = pet.sexo;
    } catch (error) {
        console.error('Erro ao carregar pet para o formulário:', error);
        alert('Erro ao carregar dados do pet para edição.');
    } finally {
        hideLoadingSpinner();
    }
}

async function deletePet(petId, redirect = false) {
    showLoadingSpinner();
    try {
        await api.delete(`/pets/${petId}`); // Assumindo endpoint no PetController
        alert('Pet excluído com sucesso!');
        if (redirect) {
            window.location.href = 'meus-pets.html';
        } else {
            loadMeusPets(); // Recarrega a lista
        }
    } catch (error) {
        alert('Erro ao excluir pet: ' + error.message);
        console.error('Delete pet error:', error);
    } finally {
        hideLoadingSpinner();
    }
}

function resetPetForm() {
    document.getElementById('petForm').reset();
    document.getElementById('petId').value = '';
}