// js/api.js
const BASE_URL = 'http://localhost:8080/api'; // Adapte para a URL real do seu backend

function getAuthToken() {
    // Recupera o token JWT do localStorage ou de outro lugar
    return localStorage.getItem('jwtToken');
}

function getHeaders(contentType = 'application/json') {
    const headers = {
        'Content-Type': contentType,
    };
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

export async function apiFetch(url, options = {}) {
    try {
        const fullUrl = `${BASE_URL}${url}`;
        const defaultOptions = {
            headers: getHeaders(),
        };

        const mergedOptions = { ...defaultOptions, ...options };
        mergedOptions.headers = { ...defaultOptions.headers, ...options.headers };

        const response = await fetch(fullUrl, mergedOptions);

        if (response.status === 401 || response.status === 403) {
            // Se não autorizado, redireciona para o login
            console.warn('Unauthorized or Forbidden access. Redirecting to login.');
            localStorage.removeItem('jwtToken'); // Limpa token inválido
            localStorage.removeItem('userRole');
            window.location.href = 'login.html';
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro na requisição: ${response.statusText}`);
        }

        // Se a resposta for 204 No Content, não tenta parsear JSON
        if (response.status === 204) {
            return null;
        }

        return response.json();
    } catch (error) {
        console.error("Erro na API Fetch:", error);
        throw error;
    }
}

// Funções específicas para cada tipo de requisição
export const api = {
    get: (url) => apiFetch(url, { method: 'GET' }),
    post: (url, body) => apiFetch(url, { method: 'POST', body: JSON.stringify(body) }),
    put: (url, body) => apiFetch(url, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (url) => apiFetch(url, { method: 'DELETE' }),
};