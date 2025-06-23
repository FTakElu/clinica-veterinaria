// js/comum.js
document.addEventListener('DOMContentLoaded', async () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const petsTableBody = document.querySelector('#petsTable tbody');
    const consultasTableBody = document.querySelector('#consultasTable tbody');
    const addPetBtn = document.getElementById('addPetBtn');
    const petFormContainer = document.getElementById('petFormContainer');
    const petForm = document.getElementById('petForm');
    const cancelPetBtn = document.getElementById('cancelPetBtn');
    const petMessage = document.getElementById('petMessage');
    const welcomeUser = document.getElementById('welcomeUser');
    const addConsultaBtn = document.getElementById('addConsultaBtn');
    const consultaFormContainer = document.getElementById('consultaFormContainer');
    const consultaForm = document.getElementById('consultaForm');
    const cancelConsultaBtn = document.getElementById('cancelConsultaBtn');
    const consultaMessage = document.getElementById('consultaMessage');
    const consultaPetIdSelect = document.getElementById('consultaPetId');


    const currentUser = localStorage.getItem('currentUser');
    const roles = localStorage.getItem('userRoles');
    let currentUserId = null; // Vamos precisar do ID do usuário

    // *** SIMULAÇÃO: Como estamos sem JWT, não temos o ID do usuário diretamente do token.
    // Você precisará de uma forma de obter o ID do usuário logado.
    // Por enquanto, vamos buscar o usuário pelo nome de usuário no backend para obter o ID.
    // EM PRODUÇÃO: O ID viria do token JWT!
    async function getCurrentUserId() {
        try {
            // Este endpoint geralmente estaria protegido e retornaria o próprio usuário logado
            const users = await callApi(`/usuarios`); // Busca todos os usuários (apenas para DEV!)
            const user = users.find(u => u.username === currentUser);
            if (user) {
                currentUserId = user.id;
                console.log("ID do usuário logado:", currentUserId);
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


    if (!currentUser || !roles || !JSON.parse(roles).includes('ROLE_COMUM')) {
        alert('Acesso não autorizado. Faça login como usuário comum.');
        logout();
        return;
    } else {
        welcomeUser.textContent = `Bem-vindo, ${currentUser}!`;
        await getCurrentUserId(); // Obtém o ID do usuário após verificar a role
    }

    function logout() {
        localStorage.clear();
        window.location.href = 'index.html';
    }

    logoutBtn.addEventListener('click', logout);

    // Função para carregar os pets do usuário logado
    async function loadPets() {
        if (!currentUserId) return; // Garante que o ID do usuário foi carregado
        try {
            const pets = await callApi(`/pets/dono/${currentUserId}`); // Chama o endpoint específico para pets do dono
            petsTableBody.innerHTML = '';
            if (pets && pets.length > 0) {
                pets.forEach(pet => {
                    const row = petsTableBody.insertRow();
                    row.insertCell(0).textContent = pet.id;
                    row.insertCell(1).textContent = pet.nome;
                    row.insertCell(2).textContent = pet.especie;
                    row.insertCell(3).textContent = pet.raca;
                    row.insertCell(4).textContent = pet.idade;

                    const actionsCell = row.insertCell(5);
                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'Editar';
                    editBtn.onclick = () => editPet(pet);
                    actionsCell.appendChild(editBtn);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Excluir';
                    deleteBtn.onclick = () => deletePet(pet.id);
                    actionsCell.appendChild(deleteBtn);
                });
            } else {
                petsTableBody.innerHTML = '<tr><td colspan="6">Nenhum pet cadastrado.</td></tr>';
            }
            populatePetSelect(pets); // Preenche o select de pets para agendar consulta
        } catch (error) {
            console.error('Erro ao carregar pets:', error);
            petsTableBody.innerHTML = '<tr><td colspan="6" style="color: red;">Erro ao carregar pets.</td></tr>';
        }
    }

    // Função para carregar as consultas do usuário logado
    async function loadConsultas() {
        if (!currentUserId) return;
        try {
            const consultas = await callApi(`/consultas/meus?userId=${currentUserId}`); // Endpoint para minhas consultas
            consultasTableBody.innerHTML = '';
            if (consultas && consultas.length > 0) {
                consultas.forEach(consulta => {
                    const row = consultasTableBody.insertRow();
                    row.insertCell(0).textContent = consulta.id;
                    row.insertCell(1).textContent = consulta.pet ? consulta.pet.nome : 'N/A';
                    row.insertCell(2).textContent = new Date(consulta.dataHora).toLocaleString();
                    row.insertCell(3).textContent = consulta.veterinario ? consulta.veterinario.username : 'Aguardando';
                    row.insertCell(4).textContent = consulta.descricao || 'Nenhuma descrição';
                    row.insertCell(5).textContent = consulta.status;

                    const actionsCell = row.insertCell(6);
                    // Ações para consultas (ex: cancelar, reagendar)
                    // if (consulta.status === 'Agendada') {
                    //     const cancelBtn = document.createElement('button');
                    //     cancelBtn.textContent = 'Cancelar';
                    //     cancelBtn.onclick = () => cancelConsulta(consulta.id);
                    //     actionsCell.appendChild(cancelBtn);
                    // }
                });
            } else {
                consultasTableBody.innerHTML = '<tr><td colspan="7">Nenhuma consulta agendada.</td></tr>';
            }
        } catch (error) {
            console.error('Erro ao carregar consultas:', error);
            consultasTableBody.innerHTML = '<tr><td colspan="7" style="color: red;">Erro ao carregar consultas.</td></tr>';
        }
    }

    // Preenche o select de pets para agendar consulta
    function populatePetSelect(pets) {
        consultaPetIdSelect.innerHTML = '<option value="">Selecione um Pet</option>';
        pets.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.id;
            option.textContent = pet.nome;
            consultaPetIdSelect.appendChild(option);
        });
    }

    // Event listeners para Pets
    addPetBtn.addEventListener('click', () => {
        petFormContainer.style.display = 'block';
        petForm.reset();
        petForm.dataset.mode = 'add';
        document.getElementById('donoIdPet').value = currentUserId; // Define o dono ID
    });

    cancelPetBtn.addEventListener('click', () => {
        petFormContainer.style.display = 'none';
        petMessage.textContent = '';
    });

    petForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = e.target.nomePet.value;
        const especie = e.target.especiePet.value;
        const raca = e.target.racaPet.value;
        const idade = parseInt(e.target.idadePet.value, 10);
        const donoId = parseInt(e.target.donoIdPet.value, 10);

        const petData = {
            nome,
            especie,
            raca,
            idade,
            dono: { id: donoId } // Envia o objeto dono com o ID
        };

        try {
            let response;
            if (petForm.dataset.mode === 'add') {
                response = await callApi('/pets', 'POST', petData);
                petMessage.textContent = 'Pet cadastrado com sucesso!';
            } else {
                const petId = petForm.dataset.petId;
                response = await callApi(`/pets/${petId}`, 'PUT', petData);
                petMessage.textContent = 'Pet atualizado com sucesso!';
            }

            petMessage.style.color = 'green';
            setTimeout(() => {
                petFormContainer.style.display = 'none';
                petMessage.textContent = '';
                loadPets();
            }, 1000);

        } catch (error) {
            petMessage.textContent = 'Erro ao salvar pet: ' + error.message;
            petMessage.style.color = 'red';
            console.error('Erro ao salvar pet:', error);
        }
    });

    async function editPet(pet) {
        petFormContainer.style.display = 'block';
        petForm.dataset.mode = 'edit';
        petForm.dataset.petId = pet.id;

        petForm.nomePet.value = pet.nome;
        petForm.especiePet.value = pet.especie;
        petForm.racaPet.value = pet.raca;
        petForm.idadePet.value = pet.idade;
        document.getElementById('donoIdPet').value = pet.dono ? pet.dono.id : currentUserId; // Garante que o donoId esteja preenchido
    }

    async function deletePet(id) {
        if (confirm('Tem certeza que deseja excluir este pet?')) {
            try {
                await callApi(`/pets/${id}`, 'DELETE');
                alert('Pet excluído com sucesso!');
                loadPets();
            } catch (error) {
                alert('Erro ao excluir pet: ' + error.message);
                console.error('Erro ao excluir pet:', error);
            }
        }
    }

    // Event listeners para Consultas
    addConsultaBtn.addEventListener('click', () => {
        consultaFormContainer.style.display = 'block';
        consultaForm.reset();
        // O select de pets já deve estar populado por loadPets()
    });

    cancelConsultaBtn.addEventListener('click', () => {
        consultaFormContainer.style.display = 'none';
        consultaMessage.textContent = '';
    });

    consultaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const petId = parseInt(e.target.consultaPetId.value, 10);
        const dataHora = e.target.consultaDataHora.value; // Formato YYYY-MM-DDTHH:MM

        const consultaData = {
            petId,
            dataHora // O backend deve aceitar este formato ou você precisará converter
        };

        try {
            const response = await callApi('/consultas', 'POST', consultaData);
            consultaMessage.textContent = 'Consulta agendada com sucesso!';
            consultaMessage.style.color = 'green';
            setTimeout(() => {
                consultaFormContainer.style.display = 'none';
                consultaMessage.textContent = '';
                loadConsultas();
            }, 1000);
        } catch (error) {
            consultaMessage.textContent = 'Erro ao agendar consulta: ' + error.message;
            consultaMessage.style.color = 'red';
            console.error('Erro ao agendar consulta:', error);
        }
    });

    // Inicia o carregamento dos dados após o DOM e o ID do usuário estarem prontos
    if (currentUserId) {
        loadPets();
        loadConsultas();
    } else {
        // Se o currentUserId ainda não foi definido (ex: se o usuário não logou ainda)
        // os loads serão chamados após getCurrentUserId() ser concluído.
        // Isso é uma medida de segurança para garantir que o ID do usuário esteja disponível.
    }
});