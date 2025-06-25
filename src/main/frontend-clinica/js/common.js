// js/common.js
export function showModal(modalElement) {
    if (modalElement) {
        modalElement.style.display = 'block';
    }
}

export function hideModal(modalElement) {
    if (modalElement) {
        modalElement.style.display = 'none';
    }
}

export function setupModalCloseButtons() {
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', (event) => {
            hideModal(event.target.closest('.modal'));
            // Opcional: Resetar formulários ao fechar
            const form = event.target.closest('.modal-content')?.querySelector('form');
            if (form) form.reset();
            const messageDiv = event.target.closest('.modal-content')?.querySelector('.message');
            if (messageDiv) messageDiv.textContent = '';
        });
    });

    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            hideModal(event.target);
            const form = event.target.querySelector('.modal-content')?.querySelector('form');
            if (form) form.reset();
            const messageDiv = event.target.querySelector('.modal-content')?.querySelector('.message');
            if (messageDiv) messageDiv.textContent = '';
        }
    };
}

export function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

export function formatTimeForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toTimeString().split(' ')[0].substring(0, 5); // HH:mm
}

export function displayMessage(element, message, type) {
    if (element) {
        element.textContent = message;
        element.className = `message ${type}`;
        setTimeout(() => {
            element.textContent = '';
            element.className = 'message';
        }, 3000); // Mensagem desaparece após 3 segundos
    }
}