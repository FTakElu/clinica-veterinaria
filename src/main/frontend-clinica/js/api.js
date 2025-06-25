// js/api.js
const API_BASE_URL = 'http://localhost:3000/api'; // CONFIRA SE ESTA URL ESTÁ CORRETA

export async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    // Tratar erros de autenticação/autorização globalmente
    if (response.status === 401 || response.status === 403) {
        console.error('Erro de autenticação ou autorização. Redirecionando para o login.');
        localStorage.clear();
        // window.location.href = '/login.html'; // Ajuste se seu login.html não estiver na raiz
        window.location.href = '/pages/login.html'; // Ajustado para sua estrutura /pages
        throw new Error('Unauthorized or Forbidden');
    }

    // Tenta parsear JSON, mas permite respostas vazias
    const data = response.headers.get('content-type')?.includes('application/json')
        ? await response.json()
        : null;

    if (!response.ok) {
        throw new Error(data?.message || `Erro na requisição: ${response.status}`);
    }

    return data;
}

// Funções de API (MANTENHA ESTAS OU ADICIONE MAIS, CONFORME SEU BACKEND)
export const api = {
    auth: {
        login: (email, senha) => fetchWithAuth('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha }),
            headers: { 'Content-Type': 'application/json' }
        }),
        registerClient: (userData) => fetchWithAuth('/auth/register', { // Rota para cliente padrão
            method: 'POST',
            body: JSON.stringify(userData)
        }),
        // NOVA ROTA: Apenas Admin pode usar esta no backend
        registerUserWithRole: (userData) => fetchWithAuth('/auth/register-with-role', { // Ex: /auth/register para admin/secretario
            method: 'POST',
            body: JSON.stringify(userData)
        }),
    },
    users: {
        getAll: () => fetchWithAuth('/usuarios'),
        getById: (id) => fetchWithAuth(`/usuarios/${id}`),
        create: (userData) => fetchWithAuth('/usuarios', { method: 'POST', body: JSON.stringify(userData) }),
        update: (id, userData) => fetchWithAuth(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(userData) }),
        remove: (id) => fetchWithAuth(`/usuarios/${id}`, { method: 'DELETE' }),
        getClients: () => fetchWithAuth('/usuarios/clientes'),
        getVeterinarios: () => fetchWithAuth('/usuarios/veterinarios'),
    },
    pets: {
        getAll: () => fetchWithAuth('/pets'),
        getById: (id) => fetchWithAuth(`/pets/${id}`),
        getByOwnerId: (ownerId) => fetchWithAuth(`/clientes/${ownerId}/pets`),
        create: (petData) => fetchWithAuth('/pets', { method: 'POST', body: JSON.stringify(petData) }),
        update: (id, petData) => fetchWithAuth(`/pets/${id}`, { method: 'PUT', body: JSON.stringify(petData) }),
        remove: (id) => fetchWithAuth(`/pets/${id}`, { method: 'DELETE' }),
    },
    consultas: {
        getAll: () => fetchWithAuth('/consultas'),
        getById: (id) => fetchWithAuth(`/consultas/${id}`),
        getByOwnerId: (ownerId) => fetchWithAuth(`/clientes/${ownerId}/consultas`),
        getByVeterinarioId: (vetId) => fetchWithAuth(`/veterinarios/${vetId}/consultas`),
        create: (consultaData) => fetchWithAuth('/consultas', { method: 'POST', body: JSON.stringify(consultaData) }),
        update: (id, consultaData) => fetchWithAuth(`/consultas/${id}`, { method: 'PUT', body: JSON.stringify(consultaData) }),
        remove: (id) => fetchWithAuth(`/consultas/${id}`, { method: 'DELETE' }),
    },
    tiposVacina: {
        getAll: () => fetchWithAuth('/tipos-vacina'),
        create: (data) => fetchWithAuth('/tipos-vacina', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => fetchWithAuth(`/tipos-vacina/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        remove: (id) => fetchWithAuth(`/tipos-vacina/${id}`, { method: 'DELETE' }),
    },
    vacinasAplicadas: {
        getByPetId: (petId) => fetchWithAuth(`/pets/${petId}/vacinas-aplicadas`),
        create: (data) => fetchWithAuth('/vacinas-aplicadas', { method: 'POST', body: JSON.stringify(data) }),
    },
    relatoriosConsulta: {
        getByConsultaId: (consultaId) => fetchWithAuth(`/consultas/${consultaId}/relatorio`),
        create: (data) => fetchWithAuth('/relatorios-consulta', { method: 'POST', body: JSON.stringify(data) }),
        update: (consultaId, data) => fetchWithAuth(`/consultas/${consultaId}/relatorio`, { method: 'PUT', body: JSON.stringify(data) }),
    }
};