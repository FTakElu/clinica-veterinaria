document.addEventListener('DOMContentLoaded', () => {
    // Lógica para secretario-dashboard.html
    if (document.getElementById('secretario-dashboard.html')) { // Isso é uma simplificação, você pode verificar o URL ou um elemento específico
        console.log('Secretário Dashboard carregado.');
        // Aqui você carregaria as estatísticas do backend e preencheria os cards
        // common.getDashboardStats().then(stats => {
        //     document.getElementById('total-appointments').textContent = stats.totalAppointments;
        //     document.getElementById('active-patients').textContent = stats.activePatients;
        //     document.getElementById('total-revenue').textContent = stats.revenue;
        //     document.getElementById('new-clients').textContent = stats.newClients;
        // });

        // Lógica para o calendário (simulação)
        const calendar = document.getElementById('calendar');
        const currentMonthYear = document.getElementById('current-month-year');
        const prevMonthBtn = document.getElementById('prev-month-btn');
        const nextMonthBtn = document.getElementById('next-month-btn');

        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();

        function renderCalendar(month, year) {
            calendar.innerHTML = `
                <div class="day-header">Dom</div>
                <div class="day-header">Seg</div>
                <div class="day-header">Ter</div>
                <div class="day-header">Qua</div>
                <div class="day-header">Qui</div>
                <div class="day-header">Sex</div>
                <div class="day-header">Sáb</div>
            `;
            currentMonthYear.textContent = new Date(year, month).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

            const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 6 for Saturday
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const daysInPrevMonth = new Date(year, month, 0).getDate();

            // Fill leading empty days from previous month
            for (let i = firstDayOfMonth; i > 0; i--) {
                const day = document.createElement('div');
                day.classList.add('day', 'other-month');
                day.textContent = daysInPrevMonth - i + 1;
                calendar.appendChild(day);
            }

            // Fill current month days
            for (let i = 1; i <= daysInMonth; i++) {
                const day = document.createElement('div');
                day.classList.add('day', 'current-month');
                day.textContent = i;
                if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                    day.classList.add('selected'); // Highlight current day
                }
                calendar.appendChild(day);
            }

            // Fill trailing empty days from next month (optional, for full week rows)
            const totalDaysDisplayed = firstDayOfMonth + daysInMonth;
            const remainingDays = 42 - totalDaysDisplayed; // Max 6 weeks * 7 days
            for (let i = 1; i <= remainingDays; i++) {
                const day = document.createElement('div');
                day.classList.add('day', 'other-month');
                day.textContent = i;
                calendar.appendChild(day);
            }
        }

        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        });

        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        });

        renderCalendar(currentMonth, currentYear);

        // Lógica de filtro da tabela de agendamentos (simulação)
        const doctorFilter = document.getElementById('doctor-filter');
        doctorFilter.addEventListener('change', () => {
            const selectedDoctor = doctorFilter.value;
            console.log('Filtrando por Dr(a).', selectedDoctor);
            // common.getAppointmentsByDoctor(selectedDoctor).then(data => { /* atualizar tabela */ });
        });
    }

    // Lógica para registrar-vacina.html
    if (document.getElementById('registroVacinaForm')) {
        const registroVacinaForm = document.getElementById('registroVacinaForm');
        registroVacinaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const cliente = document.getElementById('cliente').value;
            const animal = document.getElementById('animal').value;
            const tipoVacina = document.getElementById('tipoVacina').value;
            // ... coletar outros dados
            console.log('Registro de Vacina:', { cliente, animal, tipoVacina });
            alert('Lógica de registro de vacina simulada.');
            // common.registerVaccine({ cliente, animal, tipoVacina, ... });
        });
    }

    // Lógica para gerenciar-tipos-vacina.html
    if (document.getElementById('tipoVacinaForm')) {
        const tipoVacinaForm = document.getElementById('tipoVacinaForm');
        tipoVacinaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nomeTipoVacina = document.getElementById('nomeTipoVacina').value;
            const intervaloDias = document.getElementById('intervaloDias').value;
            console.log('Novo Tipo de Vacina:', { nomeTipoVacina, intervaloDias });
            alert('Lógica de adicionar tipo de vacina simulada.');
            // common.addVaccineType({ nomeTipoVacina, intervaloDias, ... });
        });
    }
});