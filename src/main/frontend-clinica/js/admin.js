// js/admin.js
document.addEventListener('DOMContentLoaded', async () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const welcomeUser = document.getElementById('welcomeUser');
    const usersTableBody = document.querySelector('#usersTable tbody');
    const addUserBtn = document.getElementById('addUserBtn');
    const userFormContainer = document.getElementById('userFormContainer');
    const userForm = document.getElementById('userForm');
    const cancelUserBtn = document.getElementById('cancelUserBtn');
    const userMessage = document.getElementById('userMessage');

    const allPetsTableBody = document.querySelector('#allPetsTable tbody');
    const allConsultasTableBody = document.querySelector('#allConsultasTable tbody');
    const allVacinasTableBody = document.querySelector('#allVacinasTable tbody');

    const currentUser = localStorage.getItem('currentUser');
    const roles = localStorage.getItem('userRoles');

    if (!currentUser || !roles || !JSON.parse(roles).includes('ROLE_ADMINISTRADOR')) {
        alert('Acesso não autorizado. Faça login como administrador.');
        logout();
        return;
    } else {
        welcomeUser.textContent = `Bem-vindo, ${currentUser}!`;
    }

    function logout() {
        localStorage.clear();
        window.location.href = 'index.html';
    }
    logoutBtn.addEventListener('click', logout);

    // --- Funções de Carregamento ---

    async function loadUsers() {
        try {
            const users = await callApi('/usuarios');
            usersTableBody.innerHTML = '';
            if (users && users.length > 0) {
                users.forEach(user => {
                    const row = usersTableBody.insertRow();
                    row.insertCell(0).textContent = user.id;
                    row.insertCell(1).textContent = user.username;
                    row.insertCell(2).textContent = user.role;

                    const actionsCell = row.insertCell(3);
                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'Editar';
                    editBtn.onclick = () => editUser(user);
                    actionsCell.appendChild(editBtn);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Excluir';
                    deleteBtn.onclick = () => deleteUser(user.id);
                    actionsCell.appendChild(deleteBtn);
                });
            } else {
                usersTableBody.innerHTML = '<tr><td colspan="4">Nenhum usuário cadastrado.</td></tr>';
            }
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            usersTableBody.innerHTML = '<tr><td colspan="4" style="color: red;">Erro ao carregar usuários.</td></tr>';
        }
    }

    async function loadAllPets() {
        try {
            const pets = await callApi('/pets'); // Busca todos os pets
            allPetsTableBody.innerHTML = '';
            if (pets && pets.length > 0) {
                pets.forEach(pet => {
                    const row = allPetsTableBody.insertRow();
                    row.insertCell(0).textContent = pet.id;
                    row.insertCell(1).textContent = pet.nome;
                    row.insertCell(2).textContent = pet.especie;
                    row.insertCell(3).textContent = pet.dono ? pet.dono.username : 'N/A';

                    const actionsCell = row.insertCell(4);
                    // Adicionar botões de ação se necessário (ex: ver detalhes)
                });
            } else {
                allPetsTableBody.innerHTML = '<tr><td colspan="5">Nenhum pet cadastrado.</td></tr>';
            }
        } catch (error) {
            console.error('Erro ao carregar todos os pets:', error);
            allPetsTableBody.innerHTML = '<tr><td colspan="5" style="color: red;">Erro ao carregar pets.</td></tr>';
        }
    }

    async function loadAllConsultas() {
        try {
            const consultas = await callApi('/consultas'); // Busca todas as consultas
            allConsultasTableBody.innerHTML = '';
            if (consultas && consultas.length > 0) {
                consultas.forEach(consulta => {
                    const row = allConsultasTableBody.insertRow();
                    row.insertCell(0).textContent = consulta.id;
                    row.insertCell(1).textContent = consulta.pet ? consulta.pet.nome : 'N/A';
                    row.insertCell(2).textContent = new Date(consulta.dataHora).toLocaleString();
                    row.insertCell(3).textContent = consulta.veterinario ? consulta.veterinario.username : 'Aguardando';
                    row.insertCell(4).textContent = consulta.status;
                    row.insertCell(5).textContent = consulta.descricao || '';

                    const actionsCell = row.insertCell(6);
                    // Botões de ação para consultas (editar, deletar)
                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'Editar';
                    editBtn.onclick = () => editConsulta(consulta); // Implementar editConsulta
                    actionsCell.appendChild(editBtn);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Excluir';
                    deleteBtn.onclick = () => deleteConsulta(consulta.id); // Implementar deleteConsulta
                    actionsCell.appendChild(deleteBtn);
                });
            } else {
                allConsultasTableBody.innerHTML = '<tr><td colspan="7">Nenhuma consulta cadastrada.</td></tr>';
            }
        } catch (error) {
            console.error('Erro ao carregar todas as consultas:', error);
            allConsultasTableBody.innerHTML = '<tr><td colspan="7" style="color: red;">Erro ao carregar consultas.</td></tr>';
        }
    }

    async function loadAllVacinas() {
        try {
            const vacinas = await callApi('/vacinas'); // Busca todas as vacinas
            allVacinasTableBody.innerHTML = '';
            if (vacinas && vacinas.length > 0) {
                vacinas.forEach(vacina => {
                    const row = allVacinasTableBody.insertRow();
                    row.insertCell(0).textContent = vacina.id;
                    row.insertCell(1).textContent = vacina.pet ? vacina.pet.nome : 'N/A';
                    row.insertCell(2).textContent = vacina.nomeVacina;
                    row.insertCell(3).textContent = vacina.dataAplicacao;
                    row.insertCell(4).textContent = vacina.proximaDose;

                    const actionsCell = row.insertCell(5);
                    // Botões de ação para vacinas (editar, deletar)
                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'Editar';
                    editBtn.onclick = () => editVacina(vacina); // Implementar editVacina
                    actionsCell.appendChild(editBtn);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Excluir';
                    deleteBtn.onclick = () => deleteVacina(vacina.id); // Implementar deleteVacina
                    actionsCell.appendChild(deleteBtn);
                });
            } else {
                allVacinasTableBody.innerHTML = '<tr><td colspan="6">Nenhuma vacina cadastrada.</td></tr>';
            }
        } catch (error) {
            console.error('Erro ao carregar todas as vacinas:', error);
            allVacinasTableBody.innerHTML = '<tr><td colspan="6" style="color: red;">Erro ao carregar vacinas.</td></tr>';
        }
    }

    // --- Lógica de CRUD de Usuários ---
    addUserBtn.addEventListener('click', () => {
        userFormContainer.style.display = 'block';
        userForm.reset();
        userForm.dataset.mode = 'add';
        document.getElementById('userPassword').required = true; // Senha é obrigatória ao adicionar
    });

    cancelUserBtn.addEventListener('click', () => {
        userFormContainer.style.display = 'none';
        userMessage.textContent = '';
    });

    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = e.target.userName.value;
        const password = e.target.userPassword.value;
        const role = e.target.userRole.value;

        const userData = { username, role };
        if (password) { // Inclui senha apenas se for preenchida (para adição ou atualização de senha)
            userData.password = password;
        }

        try {
            let response;
            if (userForm.dataset.mode === 'add') {
                response = await callApi('/usuarios', 'POST', userData);
                userMessage.textContent = 'Usuário cadastrado com sucesso!';
            } else {
                const userId = userForm.dataset.userId;
                response = await callApi(`/usuarios/${userId}`, 'PUT', userData);
                userMessage.textContent = 'Usuário atualizado com sucesso!';
            }

            userMessage.style.color = 'green';
            setTimeout(() => {
                userFormContainer.style.display = 'none';
                userMessage.textContent = '';
                loadUsers(); // Recarrega a lista
            }, 1000);

        } catch (error) {
            userMessage.textContent = 'Erro ao salvar usuário: ' + error.message;
            userMessage.style.color = 'red';
            console.error('Erro ao salvar usuário:', error);
        }
    });

    function editUser(user) {
        userFormContainer.style.display = 'block';
        userForm.dataset.mode = 'edit';
        userForm.dataset.userId = user.id;

        userForm.userName.value = user.username;
        userForm.userRole.value = user.role;
        document.getElementById('userPassword').value = ''; // Limpa a senha para não exibir a hash
        document.getElementById('userPassword').required = false; // Senha opcional para edição
    }

    async function deleteUser(id) {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                await callApi(`/usuarios/${id}`, 'DELETE');
                alert('Usuário excluído com sucesso!');
                loadUsers();
            } catch (error) {
                alert('Erro ao excluir usuário: ' + error.message);
                console.error('Erro ao excluir usuário:', error);
            }
        }
    }

    // --- Lógica de CRUD de Consultas (para admin) ---
    // Você implementaria aqui as funções editConsulta e deleteConsulta
    async function editConsulta(consulta) {
        alert('Funcionalidade de edição de consulta (Admin) ainda não implementada.');
        // Implementar form para editar consulta, preencher com dados da consulta, e enviar PUT
    }

    async function deleteConsulta(id) {
        if (confirm('Tem certeza que deseja excluir esta consulta?')) {
            try {
                await callApi(`/consultas/${id}`, 'DELETE');
                alert('Consulta excluída com sucesso!');
                loadAllConsultas();
            } catch (error) {
                alert('Erro ao excluir consulta: ' + error.message);
                console.error('Erro ao excluir consulta:', error);
            }
        }
    }

    // --- Lógica de CRUD de Vacinas (para admin) ---
    // Você implementaria aqui as funções editVacina e deleteVacina
    async function editVacina(vacina) {
        alert('Funcionalidade de edição de vacina (Admin) ainda não implementada.');
        // Implementar form para editar vacina, preencher com dados da vacina, e enviar PUT
    }

    async function deleteVacina(id) {
        if (confirm('Tem certeza que deseja excluir esta vacina?')) {
            try {
                await callApi(`/vacinas/${id}`, 'DELETE');
                alert('Vacina excluída com sucesso!');
                loadAllVacinas();
            } catch (error) {
                alert('Erro ao excluir vacina: ' + error.message);
                console.error('Erro ao excluir vacina:', error);
            }
        }
    }


    // Carrega os dados iniciais
    loadUsers();
    loadAllPets();
    loadAllConsultas();
    loadAllVacinas();
});