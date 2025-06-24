// js/api.js

const API_BASE_URL = 'http://localhost:8080'; // **ATENÇÃO: Mude esta URL se sua API estiver em outro local**

/**
 * Função genérica para fazer requisições à API.
 * Adiciona automaticamente o token JWT se disponível no localStorage.
 * @param {string} endpoint - O caminho do endpoint (ex: '/auth/login', '/clientes/meus-pets').
 * @param {string} method - O método HTTP (GET, POST, PUT, DELETE).
 * @param {object} [body=null] - O corpo da requisição para métodos POST/PUT.
 * @param {boolean} [requiresAuth=true] - Define se a requisição requer autenticação.
 * @returns {Promise<object>} - Uma promessa que resolve para os dados JSON da resposta.
 * @throws {Error} - Lança um erro se a requisição falhar ou a resposta não for OK.
 */
async function fetchData(endpoint, method = 'GET', body = null, requiresAuth = true) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
    };

    if (requiresAuth) {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            console.error('Nenhum token JWT encontrado. Redirecionando para login.');
            window.location.href = 'login.html'; // Redireciona para login se o token não existir
            throw new Error('Não autenticado.');
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method: method,
        headers: headers,
        body: body ? JSON.stringify(body) : null
    };

    try {
        const response = await fetch(url, options);

        if (response.status === 401 && requiresAuth) { // Token expirado ou inválido
            console.warn('Token de autenticação expirado ou inválido. Redirecionando para login.');
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user_role');
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = 'login.html';
            throw new Error('Sessão expirada.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor.' }));
            console.error(`Erro ${response.status} na requisição para ${url}:`, errorData);
            throw new Error(errorData.message || `Erro do servidor: ${response.status}`);
        }

        // Se a resposta for 204 No Content, retorne um objeto vazio para evitar erro de parsing JSON
        if (response.status === 204) {
            return {};
        }

        return await response.json();

    } catch (error) {
        console.error('Erro de rede ou na requisição:', error);
        throw error; // Propagar o erro para quem chamou
    }
}