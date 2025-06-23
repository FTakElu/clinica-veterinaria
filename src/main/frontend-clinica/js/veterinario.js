// js/veterinario.js
document.addEventListener('DOMContentLoaded', async () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const welcomeUser = document.getElementById('welcomeUser');
    const myConsultasTableBody = document.querySelector('#myConsultasTable tbody');
    const addDescriptionFormContainer = document.getElementById('addDescriptionFormContainer');
    const descriptionForm = document.getElementById('descriptionForm');
    const cancelDescriptionBtn = document.getElementById('cancelDescriptionBtn');
    const descriptionMessage = document.getElementById('descriptionMessage');
    const allPetsTableVetBody = document.querySelector('#allPetsTableVet tbody');


    const currentUser = localStorage.getItem('currentUser');
    const roles = localStorage.getItem('userRoles');
    let currentUserId = null;

    async function getCurrentUserId() {
        try {
            const users = await callApi(`/usuarios`);
            const user = users.find(u => u.username === currentUser);
            if (user) {
                currentUserId = user.id;
            } else {
                alert('Usuário não encontrado no sistema.');
                logout();
            }
        } catch (error) {
            console.error('Erro ao obter ID do usuário:', error);
            alert('Erro ao carregar dados do usuário.');
            logout();
        }
    }

    if (!currentUser || !roles || !JSON.parse(roles).includes('ROLE_VETERINARIO')) {
        alert('Acesso não autorizado. Faça login como veterinário.');
        logout();
        return;
    } else {
        welcomeUser.textContent = `Bem-vindo, ${currentUser}!`;
        await getCurrentUserId();
    }

    function logout() {
        localStorage.clear();
        window.location.href = 'index.html';
    }
    logoutBtn.addEventListener('click', logout);

    // --- Funções de Carregamento ---

    async function loadMyConsultas() {
        if (!currentUserId) return;
        try {
            // Este endpoint deve retornar as consultas atribuídas ao veterinário
            const consultas = await callApi(`/consultas/veterinario/${currentUserId}`);
            myConsultasTableBody.innerHTML = '';
            if (consultas && consultas.length > 0) {
                consultas.forEach(consulta => {
                    const row = myConsultasTableBody.insertRow();
                    row.insertCell(0).textContent = consulta.id;
                    row.insertCell(1).textContent = consulta.pet ? consulta.pet.nome : 'N/A';
                    row.insertCell(2).textContent = new Date(consulta.dataHora).toLocaleString();
                    row.insertCell(3).textContent = consulta.pet && consulta.pet.dono ? consulta.pet.dono.username : 'N/A';
                    row.insertCell(4).textContent = consulta.status;

                    const actionsCell = row.insertCell(5);
                    const addDescBtn = document.createElement('button');
                    addDescBtn.textContent = 'Add Descrição';
                    addDescBtn.onclick = () => showDescriptionForm(consulta);
                    actionsCell.appendChild(addDescBtn);
                });
            } else {
                myConsultasTableBody.innerHTML = '<tr><td colspan="6">Nenhuma consulta atribuída.</td></tr>';
            }
        } catch (error) {
            console.error('Erro ao carregar minhas consultas:', error);
            myConsultasTableBody.innerHTML = '<tr><td colspan="6" style="color: red;">Erro ao carregar consultas.</td></tr>';
        }
    }

    async function loadAllPetsForVet() {
        try {
            const pets = await callApi('/pets'); // Veterinário pode ver todos os pets
            allPetsTableVetBody.innerHTML = '';
            if (pets && pets.length > 0) {
                pets.forEach(pet => {
                    const row = allPetsTableVetBody.insertRow();
                    row.insertCell(0).textContent = pet.id;
                    row.insertCell(1).textContent = pet.nome;
                    row.insertCell(2).textContent = pet.especie;
                    row.insertCell(3).textContent = pet.raca;
                    row.insertCell(4).textContent = pet.idade;
                    row.insertCell(5).textContent = pet.dono ? pet.dono.username : 'N/A';
                });
            } else {
                allPetsTableVetBody.innerHTML = '<tr><td colspan="6">Nenhum pet cadastrado.</td></tr>';
            }
        } catch (error) {
            console.error('Erro ao carregar todos os pets para veterinário:', error);
            allPetsTableVetBody.innerHTML = '<tr><td colspan="6" style="color: red;">Erro ao carregar pets.</td></tr>';
        }
    }

    // --- Lógica de Descrição de Consulta ---
    function showDescriptionForm(consulta) {
        addDescriptionFormContainer.style.display = 'block';
        descriptionForm.reset();
        document.getElementById('descriptionConsultaId').value = consulta.id;
        document.getElementById('descriptionText').value = consulta.descricao || '';
    }

    cancelDescriptionBtn.addEventListener('click', () => {
        addDescriptionFormContainer.style.display = 'none';
        descriptionMessage.textContent = '';
    });

    descriptionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const consultaId = document.getElementById('descriptionConsultaId').value;
        const descricao = document.getElementById('descriptionText').value;

        try {
            const response = await callApi(`/consultas/${consultaId}/descricao`, 'PUT', { descricao });
            descriptionMessage.textContent = 'Descrição salva com sucesso!';
            descriptionMessage.style.color = 'green';
            setTimeout(() => {
                addDescriptionFormContainer.style.display = 'none';
                descriptionMessage.textContent = '';
                loadMyConsultas(); // Recarrega as consultas
            }, 1000);
        } catch (error) {
            descriptionMessage.textContent = 'Erro ao salvar descrição: ' + error.message;
            descriptionMessage.style.color = 'red';
            console.error('Erro ao salvar descrição:', error);
        }
    });

    // Carrega os dados iniciais
    if (currentUserId) {
        loadMyConsultas();
        loadAllPetsForVet();
    }
});