// js/login.js
import { api } from './api.js'; // Importa a api
import { displayMessage } from './common.js'; // Importa função de mensagem

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try {
                const data = await api.auth.login(email, senha); // Usa a função de login da api.js

                // Armazena o token e a role no localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.userRole);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('userName', data.userName);

                displayMessage(messageDiv, data.message, 'success');

                // Redireciona para o dashboard apropriado via auth.js (que já está carregado)
                // O auth.js fará o redirecionamento automático após o DOMContentLoaded se tiver token
                // Para garantir, podemos adicionar um pequeno delay ou redirecionar manualmente aqui
                setTimeout(() => {
                    const roleToDashboardMap = {
                        'admin': '/admin-dashboard.html',
                        'secretario': '/secretario-dashboard.html',
                        'veterinario': '/veterinario-dashboard.html',
                        'cliente': '/cliente-dashboard.html',
                    };
                    window.location.href = roleToDashboardMap[data.userRole];
                }, 500);

            } catch (error) {
                console.error('Erro ao fazer login:', error);
                displayMessage(messageDiv, error.message || 'Erro ao fazer login. Tente novamente.', 'error');
            }
        });
    }
});