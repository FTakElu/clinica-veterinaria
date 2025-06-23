// js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('login-modal');
    const closeButton = document.querySelector('.close-button');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const goToRegisterBtn = document.getElementById('goToRegisterBtn');
    const goToLoginBtn = document.getElementById('goToLoginBtn');
    const loginMessage = document.getElementById('loginMessage');
    const registerMessage = document.getElementById('registerMessage');

    loginBtn.onclick = () => loginModal.style.display = 'flex';
    closeButton.onclick = () => loginModal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
        }
    };

    goToRegisterBtn.onclick = () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginMessage.textContent = '';
    };

    goToLoginBtn.onclick = () => {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        registerMessage.textContent = '';
    };

    // Lógica de Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        try {
            const response = await callApi('/auth/login', 'POST', { username, password });

            if (response && response.username && response.roles) {
                localStorage.setItem('currentUser', response.username);
                localStorage.setItem('userRoles', JSON.stringify(response.roles));
                loginMessage.textContent = 'Login bem-sucedido!';
                loginMessage.style.color = 'green';
                setTimeout(() => {
                    redirectBasedOnRole(response.roles);
                }, 1000);
            } else {
                loginMessage.textContent = 'Erro no login: Resposta inesperada do servidor.';
                loginMessage.style.color = 'red';
            }
        } catch (error) {
            loginMessage.textContent = 'Erro ao conectar com o servidor ou credenciais incorretas.';
            loginMessage.style.color = 'red';
            console.error('Erro de login:', error);
        }
    });

    // Lógica de Cadastro
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = e.target.regUsername.value;
        const password = e.target.regPassword.value;
        const role = e.target.regRole.value;

        try {
            const newUser = { username, password, role };
            const response = await callApi('/usuarios', 'POST', newUser);

            if (response.id) {
                registerMessage.textContent = 'Usuário cadastrado com sucesso! Agora faça o login.';
                registerMessage.style.color = 'green';
                e.target.reset();
                setTimeout(() => {
                    goToLoginBtn.click();
                }, 1500);
            } else {
                registerMessage.textContent = 'Erro ao cadastrar usuário.';
                registerMessage.style.color = 'red';
            }
        } catch (error) {
            registerMessage.textContent = 'Erro ao cadastrar: Usuário já existe ou erro de conexão.';
            registerMessage.style.color = 'red';
            console.error('Erro de registro:', error);
        }
    });

    // Redirecionamento baseado no papel
    function redirectBasedOnRole(roles) {
        if (roles.includes('ROLE_ADMINISTRADOR')) {
            window.location.href = 'dashboard-admin.html';
        } else if (roles.includes('ROLE_VETERINARIO')) {
            window.location.href = 'dashboard-veterinario.html';
        } else if (roles.includes('ROLE_COMUM')) {
            window.location.href = 'dashboard-comum.html';
        } else {
            alert('Papel de usuário não reconhecido.');
            localStorage.clear();
            window.location.href = 'index.html';
        }
    }

    // Verifica se o usuário já está "logado" ao carregar a página
    const currentUser = localStorage.getItem('currentUser');
    const roles = localStorage.getItem('userRoles');
    if (currentUser && roles) {
        try {
            const parsedRoles = JSON.parse(roles);
            if (Array.isArray(parsedRoles) && parsedRoles.length > 0) {
                 if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                    redirectBasedOnRole(parsedRoles);
                }
            } else {
                console.log("Usuário logado mas sem papéis válidos. Limpando e redirecionando.");
                localStorage.clear();
            }
        } catch (e) {
            console.error("Erro ao fazer parse dos papéis do usuário:", e);
            localStorage.clear();
        }
    }
});