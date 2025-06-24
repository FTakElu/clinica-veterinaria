document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const toggleLink = document.getElementById('toggle-link');
    const formTitle = document.getElementById('form-title');
    const authButton = document.getElementById('authButton');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const roleSelectGroup = document.getElementById('role-select-group');
    const toggleText = document.getElementById('toggle-text');

    let isLogin = true; // Estado inicial: formulário de login

    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        isLogin = !isLogin;
        if (isLogin) {
            formTitle.textContent = 'Login';
            authButton.textContent = 'Entrar';
            confirmPasswordGroup.style.display = 'none';
            roleSelectGroup.style.display = 'none';
            toggleText.textContent = 'Não tem uma conta?';
            toggleLink.textContent = 'Cadastre-se';
        } else {
            formTitle.textContent = 'Cadastro';
            authButton.textContent = 'Registrar';
            confirmPasswordGroup.style.display = 'block';
            roleSelectGroup.style.display = 'block';
            toggleText.textContent = 'Já tem uma conta?';
            toggleLink.textContent = 'Faça Login';
        }
    });

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (isLogin) {
            // Lógica de Login
            console.log('Tentativa de Login:', { email, password });
            // Aqui você faria a chamada fetch() para sua API de login
            // Ex: common.js.loginUser(email, password);
            alert('Lógica de login simulada. Verifique o console.');
            // Após o login bem-sucedido, redirecione para o dashboard apropriado
            // window.location.href = 'cliente-dashboard.html'; // Exemplo
        } else {
            // Lógica de Cadastro
            const confirmPassword = document.getElementById('confirm-password').value;
            const role = document.getElementById('role').value;

            if (password !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }
            console.log('Tentativa de Cadastro:', { email, password, role });
            // Aqui você faria a chamada fetch() para sua API de registro
            // Ex: common.js.registerUser(email, password, role);
            alert('Lógica de cadastro simulada. Verifique o console.');
            // Após o cadastro, você pode redirecionar para a tela de login ou para um dashboard inicial
            // window.location.href = 'index.html'; // Redireciona para login
        }
    });
});