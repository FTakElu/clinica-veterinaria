// js/auth.js (Antigo main.js, focado em autenticação)
import { api } from './api.js'; // Importa as funções da API

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const currentPath = window.location.pathname;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear(); // Limpa todos os dados de sessão
            window.location.href = '/login.html'; // Redireciona para a página de login
        });
    }

    // Define a mensagem de boas-vindas na barra de navegação (se os elementos existirem)
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage && userName) {
        welcomeMessage.textContent = `Olá, ${userName}!`;
    }

    // Função para verificar se o usuário tem a role necessária para a página atual
    function checkAccess() {
        const publicPages = ['/login.html', '/cadastro-cliente.html', '/', '/index.html', '/noticias.html', '/servicos.html', '/contato.html', '/html-template.html']; // Páginas que não exigem login
        
        // Verifica se a página atual é uma página pública
        const isPublicPage = publicPages.some(page => currentPath.includes(page));

        if (isPublicPage) {
            // Se o usuário está logado e tenta acessar uma página pública, redireciona para o dashboard
            if (token && userRole) {
                // Mapeamento de role para a página de dashboard
                const roleToDashboardMap = {
                    'admin': '/admin-dashboard.html',
                    'secretario': '/secretario-dashboard.html',
                    'veterinario': '/veterinario-dashboard.html',
                    'cliente': '/cliente-dashboard.html',
                };
                const expectedDashboard = roleToDashboardMap[userRole];

                if (expectedDashboard && !currentPath.includes(expectedDashboard.split('/')[1])) {
                    // Evita redirecionamento infinito se já estiver no dashboard
                    window.location.href = expectedDashboard;
                }
            }
            return; // Não precisa de mais verificações para páginas públicas
        }

        // Para páginas que exigem autenticação:
        if (!token || !userRole) {
            console.warn('Token ou role não encontrados. Redirecionando para login.');
            localStorage.clear();
            window.location.href = '/login.html';
            return;
        }

        // Mapeamento de páginas permitidas por role (adapte conforme sua estrutura)
        const allowedPagesByRole = {
            'admin': ['/admin-dashboard.html', '/gerenciar-usuarios.html', '/gerenciar-pets.html', '/gerenciar-consultas.html', '/gerenciar-tipos-vacina.html', '/registrar-vacina.html', '/relatorio-consulta.html'], // Admin pode acessar tudo do secretário
            'secretario': ['/secretario-dashboard.html', '/gerenciar-usuarios.html', '/gerenciar-pets.html', '/gerenciar-consultas.html', '/gerenciar-tipos-vacina.html', '/registrar-vacina.html', '/relatorio-consulta.html'],
            'veterinario': ['/veterinario-dashboard.html', '/minhas-consultas.html', '/registrar-vacina.html', '/relatorio-consulta.html'],
            'cliente': ['/cliente-dashboard.html', '/perfil-cliente.html', '/meus-pets.html', '/detalhe-pet.html', '/agendar-consulta.html', '/minhas-consultas.html'],
        };

        const isAllowed = allowedPagesByRole[userRole]?.some(page => currentPath.includes(page));

        if (!isAllowed) {
            console.warn(`Acesso negado para a role ${userRole} nesta página (${currentPath}). Redirecionando para o dashboard correto.`);
            // Redireciona para o dashboard principal da role se o acesso for negado
            const roleToDashboardMap = {
                'admin': '/admin-dashboard.html',
                'secretario': '/secretario-dashboard.html',
                'veterinario': '/veterinario-dashboard.html',
                'cliente': '/cliente-dashboard.html',
            };
            const expectedDashboard = roleToDashboardMap[userRole];
            if (expectedDashboard) {
                window.location.href = expectedDashboard;
            } else {
                // Caso não haja dashboard definido, apenas redireciona para o login
                localStorage.clear();
                window.location.href = '/login.html';
            }
        }
    }

    // Chama a função de verificação de acesso ao carregar a página
    checkAccess();

    // Exportar userId e userName para serem usados nos dashboards (se necessário)
    // Embora seja melhor acessar direto do localStorage nos outros módulos
});