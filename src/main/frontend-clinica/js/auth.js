// js/auth.js
import { api } from './api.js';

const loginForm = document.getElementById('loginForm');
const logoutButton = document.getElementById('logoutButton');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const data = await api.post('/auth/login', { email, password }); // Adapte a rota do seu AuthController
            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('userRole', data.role); // Supondo que o backend retorne o papel do usuário

            redirectToDashboard(data.role); // Redireciona com base no papel
        } catch (error) {
            alert('Erro no login: ' + error.message);
            console.error('Login error:', error);
        }
    });
}

if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        logout();
    });
}

export function logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    window.location.href = 'login.html';
}

export function isLoggedIn() {
    return localStorage.getItem('jwtToken') !== null;
}

export function getUserRole() {
    return localStorage.getItem('userRole');
}

export function redirectToDashboard(role = getUserRole()) {
    if (!role) {
        window.location.href = 'login.html'; // Se não tiver papel, força login
        return;
    }
    switch (role) {
        case 'CLIENTE': // Adapte os nomes dos papéis conforme seus enums no backend
            window.location.href = 'cliente-dashboard.html';
            break;
        case 'SECRETARIO':
            window.location.href = 'secretario-dashboard.html';
            break;
        case 'VETERINARIO':
            window.location.href = 'veterinario-dashboard.html';
            break;
        default:
            window.location.href = 'login.html';
    }
}

// Função para ser chamada em páginas protegidas para verificar autenticação
export function requireAuth(allowedRoles = []) {
    if (!isLoggedIn()) {
        redirectToDashboard(); // Redireciona para login se não estiver logado
        return false;
    }
    const userRole = getUserRole();
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        alert('Você não tem permissão para acessar esta página.');
        redirectToDashboard(userRole); // Redireciona para o dashboard do papel atual
        return false;
    }
    return true;
}

// Chama requireAuth em páginas protegidas (no DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    // Exemplo: se for uma dashboard, verifica
    const isDashboardPage = window.location.pathname.includes('-dashboard.html');
    const isProtectedPage = window.location.pathname.includes('agendar-consulta.html') ||
                            window.location.pathname.includes('meus-pets.html') ||
                            window.location.pathname.includes('detalhe-pet.html') ||
                            window.location.pathname.includes('registrar-vacina.html') ||
                            window.location.pathname.includes('gerenciar-tipos-vacina.html') ||
                            window.location.pathname.includes('relatorio-consulta.html');

    if (isDashboardPage || isProtectedPage) {
        // Define as roles permitidas para cada página, ou chame em cada script específico
        let allowedRoles = [];
        if (window.location.pathname.includes('cliente-dashboard.html') || window.location.pathname.includes('agendar-consulta.html') || window.location.pathname.includes('meus-pets.html') || window.location.pathname.includes('detalhe-pet.html')) {
            allowedRoles = ['CLIENTE'];
        } else if (window.location.pathname.includes('secretario-dashboard.html') || window.location.pathname.includes('gerenciar-tipos-vacina.html') || window.location.pathname.includes('relatorio-consulta.html')) {
            allowedRoles = ['SECRETARIO'];
        } else if (window.location.pathname.includes('veterinario-dashboard.html') || window.location.pathname.includes('registrar-vacina.html')) {
            allowedRoles = ['VETERINARIO'];
        }

        if (!requireAuth(allowedRoles)) {
            // Já redirecionou
        }
    }
});