// js/api.js
const API_BASE_URL = 'http://localhost:8080/api'; // URL do seu backend Spring Boot

// Função para fazer requisições à API
async function callApi(endpoint, method = 'GET', data = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    const options = {
        method: method,
        headers: headers,
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `Erro na requisição da API: ${response.status}` }));
            throw new Error(errorData.message || `Erro na requisição da API: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return {}; // Retorna um objeto vazio para respostas sem conteúdo JSON (ex: DELETE)
        }

    } catch (error) {
        console.error('Erro na chamada da API:', error);
        throw error;
    }
}