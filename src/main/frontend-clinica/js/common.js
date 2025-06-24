// js/common.js
export function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

export function formatTime(timeString) {
    if (!timeString) return '';
    // Assumindo timeString no formato "HH:MM:SS" ou "HH:MM"
    return timeString.substring(0, 5);
}

export function showLoadingSpinner() {
    // Implementar lógica para mostrar um spinner de carregamento
    console.log('Mostrando spinner de carregamento...');
}

export function hideLoadingSpinner() {
    // Implementar lógica para esconder o spinner de carregamento
    console.log('Escondendo spinner de carregamento...');
}

export function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Função para exibir um modal genérico (útil para adicionar/editar pets, tipos de vacina)
export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// Adicionar eventos para fechar modais ao clicar no 'x' ou fora
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal .close-button').forEach(button => {
        button.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal').id);
        });
    });

    window.addEventListener('click', (e) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
});