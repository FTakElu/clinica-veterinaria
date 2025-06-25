// js/adminDashboard.js
import { api } from './api.js';
import { showModal, hideModal, displayMessage } from './common.js';

document.addEventListener('DOMContentLoaded', async () => {
    const userName = localStorage.getItem('userName');
    const adminNameDisplay = document.getElementById('adminNameDisplay');
    if (adminNameDisplay) {
        adminNameDisplay.textContent = userName;
    }

    const addSecretarioBtn = document.getElementById('addSecretarioBtn');
    const addOtherUserBtn = document.getElementById('addOtherUserBtn');
    const userListAdminDiv = document.getElementById('userListAdmin');
    const userSearchAdminInput = document.getElementById('userSearchAdmin');

    const adminUserModal = document.getElementById('adminUserModal');
    const adminUserModalTitle = document.getElementById('adminUserModalTitle');
    const adminUserForm = document.getElementById('adminUserForm');
    const adminUserIdHidden = document.getElementById('adminUserIdHidden');
    const adminUserNameInput = document.getElementById('adminUserName');
    const adminUserEmailInput = document.getElementById('adminUserEmail');
    const adminUserSenhaInput = document.getElementById('adminUserSenha');
    const adminUserRoleSelect = document.getElementById('adminUserRole');
    const adminUserTelefoneInput = document.getElementById('adminUserTelefone');
    const adminUserEnderecoInput = document.getElementById('adminUserEndereco');
    const adminUserSubmitBtn = adminUserForm.querySelector('button[type="submit"]');
    const adminUserMessageDiv = document.getElementById('adminUserMessage');

    async function loadAllUsers(searchQuery = '') {
        try {
            const users = await api.users.getAll(); // Admin pode ver todos os usuários
            userListAdminDiv.innerHTML = '';
            const filteredUsers = users.filter(user =>
                (user.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 user.role.toLowerCase().includes(searchQuery.toLowerCase()))
            );

            if (filteredUsers && filteredUsers.length > 0) {
                filteredUsers.forEach(user => {
                    const userCard = document.createElement('div');
                    userCard.className = 'data-card';
                    userCard.innerHTML = `
                        <h4>${user.nome} (${user.role})</h4>
                        <p>Email: ${user.email}</p>
                        <p>Telefone: ${user.telefone || 'N/A'}</p>
                        <button class="btn btn-secondary edit-user-admin-btn" data-id="${user.id}">Editar</button>
                        <button class="btn btn-danger delete-user-admin-btn" data-id="${user.id}" data-role="${user.role}">Excluir</button>
                    `;
                    userListAdminDiv.appendChild(userCard);
                });
            } else {
                userListAdminDiv.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
            }
        } catch (error) {
            console.error('Erro ao carregar todos os usuários:', error);
            displayMessage(userListAdminDiv, error.message || 'Erro ao carregar usuários.', 'error');
        }
    }

    if (addSecretarioBtn) {
        addSecretarioBtn.addEventListener('click', () => {
            adminUserModalTitle.textContent = 'Cadastrar Novo Secretário';
            adminUserSubmitBtn.textContent = 'Cadastrar Secretário';
            adminUserIdHidden.value = '';
            adminUserForm.reset();
            adminUserRoleSelect.value = 'secretario';
            adminUserRoleSelect.disabled = false; // Admin pode definir a role
            adminUserSenhaInput.required = true;
            showModal(adminUserModal);
        });
    }

    if (addOtherUserBtn) {
        addOtherUserBtn.addEventListener('click', () => {
            adminUserModalTitle.textContent = 'Cadastrar Novo Usuário';
            adminUserSubmitBtn.textContent = 'Cadastrar Usuário';
            adminUserIdHidden.value = '';
            adminUserForm.reset();
            adminUserRoleSelect.value = 'cliente'; // Default
            adminUserRoleSelect.disabled = false;
            adminUserSenhaInput.required = true;
            showModal(adminUserModal);
        });
    }

    userListAdminDiv.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-user-admin-btn')) {
            const userId = e.target.dataset.id;
            try {
                const user = await api.users.getById(userId);
                adminUserModalTitle.textContent = 'Editar Usuário';
                adminUserSubmitBtn.textContent = 'Salvar Alterações';
                adminUserIdHidden.value = user.id;
                adminUserNameInput.value = user.nome;
                adminUserEmailInput.value = user.email;
                adminUserTelefoneInput.value = user.telefone || '';
                adminUserEnderecoInput.value = user.endereco || '';
                adminUserRoleSelect.value = user.role;
                adminUserRoleSelect.disabled = false; // Admin pode mudar a role
                adminUserSenhaInput.value = '';
                adminUserSenhaInput.required = false;
                showModal(adminUserModal);
            } catch (error) {
                console.error('Erro ao buscar usuário para edição:', error);
                displayMessage(adminUserMessageDiv, error.message || 'Erro ao carregar dados do usuário.', 'error');
            }
        } else if (e.target.classList.contains('delete-user-admin-btn')) {
            const userIdToDelete = e.target.dataset.id;
            const userRoleToDelete = e.target.dataset.role;
            const currentLoggedInUserId = localStorage.getItem('userId');

            if (userIdToDelete === currentLoggedInUserId) {
                alert('Você não pode excluir a si mesmo.');
                return;
            }

            if (confirm(`Tem certeza que deseja excluir o usuário ${userRoleToDelete}?`)) {
                try {
                    const response = await api.users.remove(userIdToDelete);
                    displayMessage(userListAdminDiv, response.message, 'success');
                    await loadAllUsers();
                } catch (error) {
                    console.error('Erro ao excluir usuário:', error);
                    displayMessage(userListAdminDiv, error.message || 'Erro ao excluir usuário.', 'error');
                }
            }
        }
    });

    if (adminUserForm) {
        adminUserForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = adminUserIdHidden.value;
            const userData = {
                nome: adminUserNameInput.value,
                email: adminUserEmailInput.value,
                telefone: adminUserTelefoneInput.value,
                endereco: adminUserEnderecoInput.value,
                role: adminUserRoleSelect.value, // Admin pode definir a role
            };
            if (adminUserSenhaInput.value) {
                userData.senha = adminUserSenhaInput.value;
            }

            try {
                let response;
                if (id) {
                    response = await api.users.update(id, userData);
                } else {
                    // Usa a nova rota que permite ao admin registrar com role especificada
                    response = await api.auth.registerUserWithRole(userData);
                }
                displayMessage(adminUserMessageDiv, response.message, 'success');
                adminUserForm.reset();
                await loadAllUsers();
                setTimeout(() => hideModal(adminUserModal), 1000);
            } catch (error) {
                console.error('Erro ao salvar usuário:', error);
                displayMessage(adminUserMessageDiv, error.message || 'Erro ao salvar usuário.', 'error');
            }
        });
    }

    if (userSearchAdminInput) {
        userSearchAdminInput.addEventListener('input', (e) => {
            loadAllUsers(e.target.value);
        });
    }

    loadAllUsers();
});