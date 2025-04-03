// Population Chart
const populationCtx = document.getElementById('populationChart').getContext('2d');
const populationChart = new Chart(populationCtx, {
    type: 'bar',
    data: {
        labels: ['San Antonio', 'Sto. Niño', 'Poblacion', 'San Isidro', 'San Jose', 'Santa Cruz', 'San Miguel', 'Santa Monica'],
        datasets: [{
            label: 'Population',
            data: [12547, 8932, 15623, 7521, 10823, 9754, 11235, 6842],
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Population by Barangay',
                font: {
                    size: 16
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Income Chart
const incomeCtx = document.getElementById('incomeChart').getContext('2d');
const incomeChart = new Chart(incomeCtx, {
    type: 'line',
    data: {
        labels: ['San Antonio', 'Sto. Niño', 'Poblacion', 'San Isidro', 'San Jose', 'Santa Cruz', 'San Miguel', 'Santa Monica'],
        datasets: [{
            label: 'Average Income (₱)',
            data: [35780, 29450, 41230, 24680, 32120, 30540, 33870, 26350],
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: '#10b981',
            borderWidth: 2,
            tension: 0.2,
            pointBackgroundColor: '#10b981'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Average Income by Barangay',
                font: {
                    size: 16
                }
            }
        }
    }
});
