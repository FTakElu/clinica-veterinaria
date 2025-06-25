// js/gerenciarUsuarios.js
import { api } from './api.js';
import { showModal, hideModal, displayMessage } from './common.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Botões para abrir modais de adição
    const addClientBtn = document.getElementById('addClientBtn');
    const addVeterinarioBtn = document.getElementById('addVeterinarioBtn');

    // Seções de listagem
    const userListDiv = document.getElementById('userList');
    const userSearchInput = document.getElementById('userSearch');

    // Modais e Formulários
    const userModal = document.getElementById('userModal');
    const userModalTitle = document.getElementById('userModalTitle');
    const userForm = document.getElementById('userForm');
    const userIdHidden = document.getElementById('userIdHidden');
    const userNameInput = document.getElementById('userName');
    const userEmailInput = document.getElementById('userEmail');
    const userSenhaInput = document.getElementById('userSenha');
    const userRoleSelect = document.getElementById('userRole');
    const userTelefoneInput = document.getElementById('userTelefone');
    const userEnderecoInput = document.getElementById('userEndereco');
    const userSubmitBtn = userForm.querySelector('button[type="submit"]');
    const userMessageDiv = document.getElementById('userMessage');

    // --- Funções de Carregamento de Dados ---
    async function loadUsers(searchQuery = '') {
        try {
            const users = await api.users.getAll(); // Backend já filtra para secretario/admin
            userListDiv.innerHTML = '';
            const filteredUsers = users.filter(user =>
                (user.role === 'cliente' || user.role === 'veterinario') && // Secretário só vê clientes e veterinários
                (user.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 user.email.toLowerCase().includes(searchQuery.toLowerCase()))
            );

            if (filteredUsers && filteredUsers.length > 0) {
                filteredUsers.forEach(user => {
                    const userCard = document.createElement('div');
                    userCard.className = 'data-card';
                    userCard.innerHTML = `
                        <h4>${user.nome} (${user.role})</h4>
                        <p>Email: ${user.email}</p>
                        <p>Telefone: ${user.telefone || 'N/A'}</p>
                        <button class="btn btn-secondary edit-user-btn" data-id="${user.id}">Editar</button>
                        <button class="btn btn-danger delete-user-btn" data-id="${user.id}" data-role="${user.role}">Excluir</button>
                    `;
                    userListDiv.appendChild(userCard);
                });
            } else {
                userListDiv.innerHTML = '<p>Nenhum usuário (cliente/veterinário) encontrado.</p>';
            }
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            displayMessage(userListDiv, error.message || 'Erro ao carregar usuários.', 'error');
        }
    }

    // --- Lógica de CRUD para Usuários (Clientes e Veterinários) ---

    if (addClientBtn) {
        addClientBtn.addEventListener('click', () => {
            userModalTitle.textContent = 'Cadastrar Novo Cliente';
            userSubmitBtn.textContent = 'Cadastrar Cliente';
            userIdHidden.value = '';
            userForm.reset();
            userRoleSelect.value = 'cliente';
            userRoleSelect.disabled = true; // Secretário só pode criar cliente/veterinário
            userSenhaInput.required = true; // Senha é obrigatória na criação
            showModal(userModal);
        });
    }

    if (addVeterinarioBtn) {
        addVeterinarioBtn.addEventListener('click', () => {
            userModalTitle.textContent = 'Cadastrar Novo Veterinário';
            userSubmitBtn.textContent = 'Cadastrar Veterinário';
            userIdHidden.value = '';
            userForm.reset();
            userRoleSelect.value = 'veterinario';
            userRoleSelect.disabled = true; // Secretário só pode criar cliente/veterinário
            userSenhaInput.required = true;
            showModal(userModal);
        });
    }

    // Eventos de clique para editar/excluir usuários (delegação)
    userListDiv.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-user-btn')) {
            const userId = e.target.dataset.id;
            try {
                const user = await api.users.getById(userId);
                userModalTitle.textContent = 'Editar Usuário';
                userSubmitBtn.textContent = 'Salvar Alterações';
                userIdHidden.value = user.id;
                userNameInput.value = user.nome;
                userEmailInput.value = user.email;
                userTelefoneInput.value = user.telefone || '';
                userEnderecoInput.value = user.endereco || '';
                userRoleSelect.value = user.role;
                userRoleSelect.disabled = true; // Secretário não pode mudar a role de um usuário existente
                userSenhaInput.value = '';
                userSenhaInput.required = false; // Senha opcional na edição
                showModal(userModal);
            } catch (error) {
                console.error('Erro ao buscar usuário para edição:', error);
                displayMessage(userMessageDiv, error.message || 'Erro ao carregar dados do usuário.', 'error');
            }
        } else if (e.target.classList.contains('delete-user-btn')) {
            const userIdToDelete = e.target.dataset.id;
            const userRoleToDelete = e.target.dataset.role;

            if (confirm(`Tem certeza que deseja excluir o usuário ${userRoleToDelete}?`)) {
                try {
                    const response = await api.users.remove(userIdToDelete);
                    displayMessage(userListDiv, response.message, 'success');
                    await loadUsers();
                } catch (error) {
                    console.error('Erro ao excluir usuário:', error);
                    displayMessage(userListDiv, error.message || 'Erro ao excluir usuário.', 'error');
                }
            }
        }
    });

    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = userIdHidden.value;
            const userData = {
                nome: userNameInput.value,
                email: userEmailInput.value,
                telefone: userTelefoneInput.value,
                endereco: userEnderecoInput.value,
            };
            if (userSenhaInput.value) {
                userData.senha = userSenhaInput.value;
            }
            userData.role = userRoleSelect.value; // Pega a role do select (que estará disabled mas com o valor correto)

            try {
                let response;
                if (id) {
                    response = await api.users.update(id, userData);
                } else {
                    // Para criar, o backend deve ter uma rota que permite ao secretário criar users com 'cliente' ou 'veterinario' role
                    response = await api.users.create(userData);
                }
                displayMessage(userMessageDiv, response.message, 'success');
                userForm.reset();
                await loadUsers();
                setTimeout(() => hideModal(userModal), 1000);
            } catch (error) {
                console.error('Erro ao salvar usuário:', error);
                displayMessage(userMessageDiv, error.message || 'Erro ao salvar usuário.', 'error');
            }
        });
    }

    if (userSearchInput) {
        userSearchInput.addEventListener('input', (e) => {
            loadUsers(e.target.value);
        });
    }

    // --- Carregar dados iniciais ---
    loadUsers();
});