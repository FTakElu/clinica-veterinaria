// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    // Exemplo: Adicionar um efeito de rolagem suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Exemplo: Manipulação do formulário de contato (contato.html)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
            contactForm.reset();
            // Em uma aplicação real, você enviaria estes dados para um backend (API de contato)
            // ou para um serviço de e-mail.
        });
    }

    // Outras interações gerais da página...
});