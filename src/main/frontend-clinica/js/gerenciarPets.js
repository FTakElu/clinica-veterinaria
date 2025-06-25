// js/gerenciarPets.js
import { api } from './api.js';
import { showModal, hideModal, displayMessage, formatDateForInput } from './common.js';

document.addEventListener('DOMContentLoaded', async () => {
    const addPetBtn = document.getElementById('addPetBtn');
    const petListDiv = document.getElementById('petList');
    const petSearchInput = document.getElementById('petSearch');

    const petModal = document.getElementById('petModal');
    const petModalTitle = document.getElementById('petModalTitle');
    const petForm = document.getElementById('petForm');
    const petIdHidden = document.getElementById('petIdHidden');
    const petNomeInput = document.getElementById('petNome');
    const petEspecieInput = document.getElementById('petEspecie');
    const petRacaInput = document.getElementById('petRaca');
    const petDataNascimentoInput = document.getElementById('petDataNascimento');
    const petSexoInput = document.getElementById('petSexo');
    const petDonoIdSelect = document.getElementById('petDonoId');
    const petSubmitBtn = petForm.querySelector('button[type="submit"]');
    const petMessageDiv = document.getElementById('petMessage');

    async function loadClientsForSelects() {
        try {
            const clients = await api.users.getClients();
            petDonoIdSelect.innerHTML = '<option value="">Selecione um Cliente</option>';
            if (clients && clients.length > 0) {
                clients.forEach(client => {
                    const option = document.createElement('option');
                    option.value = client.id;
                    option.textContent = client.nome;
                    petDonoIdSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar clientes para selects:', error);
            displayMessage(petMessageDiv, 'Erro ao carregar lista de clientes.', 'error');
        }
    }

    async function loadPets(searchQuery = '') {
        try {
            const pets = await api.pets.getAll();
            petListDiv.innerHTML = '';
            const filteredPets = pets.filter(pet =>
                (pet.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 pet.dono?.nome.toLowerCase().includes(searchQuery.toLowerCase()))
            );

            if (filteredPets && filteredPets.length > 0) {
                filteredPets.forEach(pet => {
                    const petCard = document.createElement('div');
                    petCard.className = 'data-card';
                    petCard.innerHTML = `
                        <h4>${pet.nome} (${pet.especie})</h4>
                        <p>Dono: ${pet.dono?.nome || 'N/A'}</p>
                        <p>Nascimento: ${pet.dataNascimento ? new Date(pet.dataNascimento).toLocaleDateString() : 'N/A'}</p>
                        <button class="btn btn-secondary edit-pet-btn" data-id="${pet.id}">Editar</button>
                        <button class="btn btn-danger delete-pet-btn" data-id="${pet.id}">Excluir</button>
                    `;
                    petListDiv.appendChild(petCard);
                });
            } else {
                petListDiv.innerHTML = '<p>Nenhum pet encontrado.</p>';
            }
        } catch (error) {
            console.error('Erro ao carregar pets:', error);
            displayMessage(petListDiv, error.message || 'Erro ao carregar pets.', 'error');
        }
    }

    if (addPetBtn) {
        addPetBtn.addEventListener('click', () => {
            petModalTitle.textContent = 'Cadastrar Novo Pet';
            petSubmitBtn.textContent = 'Cadastrar Pet';
            petIdHidden.value = '';
            petForm.reset();
            loadClientsForSelects();
            showModal(petModal);
        });
    }

    petListDiv.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-pet-btn')) {
            const petId = e.target.dataset.id;
            try {
                const pet = await api.pets.getById(petId);
                petModalTitle.textContent = 'Editar Pet';
                petSubmitBtn.textContent = 'Salvar Alterações';
                petIdHidden.value = pet.id;
                petNomeInput.value = pet.nome;
                petEspecieInput.value = pet.especie;
                petRacaInput.value = pet.raca || '';
                petDataNascimentoInput.value = formatDateForInput(pet.dataNascimento);
                petSexoInput.value = pet.sexo;
                await loadClientsForSelects();
                petDonoIdSelect.value = pet.donoId;
                showModal(petModal);
            } catch (error) {
                console.error('Erro ao buscar pet para edição:', error);
                displayMessage(petListDiv, error.message || 'Erro ao carregar dados do pet.', 'error');
            }
        } else if (e.target.classList.contains('delete-pet-btn')) {
            const petIdToDelete = e.target.dataset.id;
            if (confirm('Tem certeza que deseja excluir este pet?')) {
                try {
                    const response = await api.pets.remove(petIdToDelete);
                    displayMessage(petListDiv, response.message, 'success');
                    await loadPets();
                } catch (error) {
                    console.error('Erro ao excluir pet:', error);
                    displayMessage(petListDiv, error.message || 'Erro ao excluir pet.', 'error');
                }
            }
        }
    });

    if (petForm) {
        petForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = petIdHidden.value;
            const petData = {
                nome: petNomeInput.value,
                especie: petEspecieInput.value,
                raca: petRacaInput.value,
                dataNascimento: petDataNascimentoInput.value,
                sexo: petSexoInput.value,
                donoId: petDonoIdSelect.value,
            };

            try {
                let response;
                if (id) {
                    response = await api.pets.update(id, petData);
                } else {
                    response = await api.pets.create(petData);
                }
                displayMessage(petMessageDiv, response.message, 'success');
                petForm.reset();
                await loadPets();
                setTimeout(() => hideModal(petModal), 1000);
            } catch (error) {
                console.error('Erro ao salvar pet:', error);
                displayMessage(petMessageDiv, error.message || 'Erro ao salvar pet.', 'error');
            }
        });
    }

    if (petSearchInput) {
        petSearchInput.addEventListener('input', (e) => {
            loadPets(e.target.value);
        });
    }

    loadPets();
});