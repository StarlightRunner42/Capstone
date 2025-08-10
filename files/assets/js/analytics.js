// Data structure with senior citizens count
const barangayData = {
    1: { name: "Barangay 1", barangay: ["Kamagong", "Narra", "Ipil-Ipil", "Akasya", "Flying-E"], seniorCount: 156 },
    2: { name: "Barangay 2", puroks: ["Gomez", "Katipunan", "Kahilwayan", "Sool Uno", "Sool Dos"], seniorCount: 124 },
    3: { name: "Barangay 3", puroks: ["Paghida.et A", "Paghida.et B", "Ilimnan", "Guintipunan", "Mahigugmaon"], seniorCount: 98 },
    4: { name: "Barangay 4", puroks: ["Antilla Subd", "Gomez Extension", "Bonifacio Extension", "Mckinley Bukid", "Zulueta Bukid"], seniorCount: 167 },
    5: { name: "Barangay 5", puroks: ["Elina subd", "Portuna", "St francis", "Carmilla paste 3", "Villa carmen"], seniorCount: 119 },
    6: { name: "Barangay Mambulac", puroks: ["Paghidaet", "Antoni Luna", "Swimming Pool", "Boulevard", "Barra"], seniorCount: 187 },
    7: { name: "Barangay Guinhalaran", puroks: ["Katilingban", "Sawmill", "Paghidait", "Mangingisda", "Baybayon"], seniorCount: 136 },
    8: { name: "Barangay E-Lopez", puroks: ["Sunshine", "Sunrise", "Sunset", "Sampaguita", "Newsite"], seniorCount: 145 },
    9: { name: "Barangay Bagtic", puroks: ["Proper", "New site", "Bactic uno", "Kalbaryo", "Defuigo"], seniorCount: 112 },
    10: { name: "Barangay Balaring", puroks: ["Camunsilan", "Proper", "Bungol", "Hda Balaring", "Pasil"], seniorCount: 158 },
    11: { name: "Barangay Hawaiian", puroks: ["Colisap", "Phison", "balas", "Lunot", "Sandiego"], seniorCount: 94 },
    12: { name: "Barangay Patag", puroks: ["Mahigugmaon", "Malipayun", "Mainabyanon", "Marka"], seniorCount: 127 },
    13: { name: "Barangay Kapt. Ramon", puroks: ["Hda.Adoracion", "Hda.Boac", "Hda.Progreso", "Hda.Banita jarra", "Hda.Violata"], seniorCount: 165 },
    14: { name: "Barangay Guimbalaon", puroks: ["Proper", "New Site", "Bactic Uno", "Kalbaryo", "Defuigo"], seniorCount: 129 },
    15: { name: "Barangay Rizal", puroks: ["Matagoy", "Paradise", "Kalubihan", "Baryo Rizal", "Hda Makina"], seniorCount: 173 },
    16: { name: "Barangay Lantad", puroks: ["Mapisanon", "Nami nami", "Bay-bay", "Paraiso", "Mainuswagon"], seniorCount: 108 }
};

// App state
const state = {
    currentPage: 1,
    itemsPerPage: 5,
    filteredBarangays: [],
    purokModalChart: null,
    barangayChart: null
};

// DOM Elements
const elements = {
    modal: document.getElementById('purokModal'),
    closeBtn: document.querySelector('.close'),
    searchInput: document.getElementById('searchInput'),
    prevPageBtn: document.getElementById('prevPage'),
    nextPageBtn: document.getElementById('nextPage'),
    itemsPerPageSelect: document.getElementById('itemsPerPage'),
    barangayViewBtn: document.getElementById('barangayView'),
    purokViewBtn: document.getElementById('purokView'),
    barangayTable: document.getElementById('barangayTable'),
    barangayChartContainer: document.getElementById('barangayChartContainer'),
    barangayTableBody: document.getElementById('barangayTableBody'),
    purokTableBody: document.getElementById('purokTableBody'),
    modalTitle: document.getElementById('modalTitle'),
    purokModalChart: document.getElementById('purokModalChart'),
    pageInfo: document.getElementById('pageInfo')
};

// Utility Functions
const utils = {
    calculatePurokSeniorCounts: (barangayId) => {
        const data = barangayData[barangayId];
        const purokCount = data.puroks.length;
        const baseCount = Math.floor(data.seniorCount / purokCount);
        const remainder = data.seniorCount % purokCount;
        
        return data.puroks.map((purok, index) => ({
            name: purok,
            count: baseCount + (index < remainder ? 1 : 0)
        }));
    },

    calculateSummaryStats: () => {
        let totalSeniors = 0;
        let highestCount = 0;
        let highestBarangay = '';
        
        Object.entries(barangayData).forEach(([id, data]) => {
            totalSeniors += data.seniorCount;
            if (data.seniorCount > highestCount) {
                highestCount = data.seniorCount;
                highestBarangay = data.name;
            }
        });
        
        const barangayCount = Object.keys(barangayData).length;
        const avgSeniors = Math.round(totalSeniors / barangayCount);
        
        document.getElementById('total-barangays').textContent = barangayCount;
        document.getElementById('total-seniors').textContent = totalSeniors;
        document.getElementById('avg-seniors').textContent = avgSeniors;
        document.getElementById('highest-count').textContent = `${highestCount} (${highestBarangay})`;
        
        return { totalSeniors, barangayCount, avgSeniors, highestCount, highestBarangay };
    }
};

// Core Functions
const core = {
    filterBarangays: (searchTerm = '') => {
        state.filteredBarangays = Object.entries(barangayData)
            .filter(([id, data]) => data.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => b[1].seniorCount - a[1].seniorCount);
        
        state.currentPage = 1;
        core.updatePagination();
    },

    updatePagination: () => {
        const totalPages = Math.ceil(state.filteredBarangays.length / state.itemsPerPage);
        elements.pageInfo.textContent = `Page ${state.currentPage} of ${totalPages}`;
        elements.prevPageBtn.disabled = state.currentPage === 1;
        elements.nextPageBtn.disabled = state.currentPage === totalPages || totalPages === 0;
    },

    getCurrentPageData: () => {
        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = startIndex + state.itemsPerPage;
        return state.filteredBarangays.slice(startIndex, endIndex);
    },

    populateBarangayTable: () => {
        elements.barangayTableBody.innerHTML = '';
        const currentData = core.getCurrentPageData();
        
        currentData.forEach(([id, data]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.name}</td>
                <td>${data.puroks.length}</td>
                <td>${data.seniorCount}</td>
                <td><button class="expand-btn" data-id="${id}">View Chart</button></td>
            `;
            elements.barangayTableBody.appendChild(row);
        });
        
        document.querySelectorAll('.expand-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                core.showPurokModal(id);
            });
        });
    },

    showPurokModal: (barangayId) => {
        const data = barangayData[barangayId];
        elements.modalTitle.textContent = `Purok Details for ${data.name}`;
        core.createPurokModalChart(barangayId);
        core.populatePurokTable(barangayId);
        elements.modal.style.display = 'block';
    },

    populatePurokTable: (barangayId) => {
        const purokData = utils.calculatePurokSeniorCounts(barangayId);
        elements.purokTableBody.innerHTML = '';
        
        const totalSeniors = purokData.reduce((sum, purok) => sum + purok.count, 0);
        
        purokData.forEach(purok => {
            const percentage = totalSeniors > 0 ? ((purok.count / totalSeniors) * 100).toFixed(1) : 0;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${purok.name}</td>
                <td>${purok.count}</td>
                <td>${percentage}%</td>
            `;
            elements.purokTableBody.appendChild(row);
        });
    },

  createPurokModalChart: (barangayId, chartType = 'line') => {
    const data = barangayData[barangayId];
    const purokData = utils.calculatePurokSeniorCounts(barangayId);
    const labels = purokData.map(p => p.name);
    const counts = purokData.map(p => p.count);
    
    if (state.purokModalChart) {
        state.purokModalChart.destroy();
    }
    
    // Premium styling
    const primaryColor = 'rgb(255, 0, 0)';
    const gradient = elements.purokModalChart.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgb(255, 0, 0)');
    gradient.addColorStop(1, 'rgb(0, 72, 255)');
    
    // Common dataset configuration
    const datasetConfig = {
        label: 'Senior Citizens',
        data: counts,
        borderColor: primaryColor,
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: primaryColor,
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#FFFFFF',
        pointHoverBorderColor: 'rgb(255, 0, 0)',
        pointHoverBorderWidth: 3
    };

    // Type-specific configurations
    if (chartType === 'bar') {
        datasetConfig.backgroundColor = gradient;
        datasetConfig.borderRadius = 4;
        datasetConfig.borderSkipped = false;
    } else { // line chart
        datasetConfig.backgroundColor = gradient;
        datasetConfig.fill = true;
    }

    state.purokModalChart = new Chart(elements.purokModalChart, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [datasetConfig]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: `Senior Citizens Distribution in ${data.name}`,
                    font: { size: 20, weight: 'bold' },
                    padding: { top: 10, bottom: 30 },
                    color: '#333333'
                },
                tooltip: {
                    backgroundColor: 'rgb(255, 0, 0)',
                    titleColor: '#333333',
                    bodyColor: '#333333',
                    padding: 15,
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 6,
                    displayColors: false,
                    callbacks: {
                        title: context => context[0].label,
                        label: context => {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `Senior Citizens: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: '#666666', padding: 10 }
                },
                y: {
                    beginAtZero: true,
                    grid: { 
                        color: 'rgba(200, 200, 200, 0.15)', 
                        drawBorder: false 
                    },
                    ticks: { color: '#666666', padding: 10 }
                }
            },
            animation: { 
                duration: 1000, 
                easing: chartType === 'bar' ? 'easeOutBounce' : 'easeOutQuart' 
            }
        }
    });
},
    createBarangayChart: () => {
        elements.barangayChartContainer.innerHTML = '';
        const ctx = document.createElement('canvas');
        elements.barangayChartContainer.appendChild(ctx);
        
        const sortedData = Object.entries(barangayData)
            .sort((a, b) => b[1].seniorCount - a[1].seniorCount);
        
        const labels = sortedData.map(([id, barangay]) => barangay.name);
        const data = sortedData.map(([id, barangay]) => barangay.seniorCount);
        const backgroundColors = sortedData.map(([id]) => {
            const hue = 200 + parseInt(id) * 10 % 160;
            return `hsla(${hue}, 70%, 60%, 0.7)`;
        });
        
        if (state.barangayChart) {
            state.barangayChart.destroy();
        }
        
        state.barangayChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Senior Citizens Count',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: true, text: 'Senior Citizens per Barangay', font: { size: 16 } },
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: context => `Senior Citizens: ${context.raw}`
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Number of Senior Citizens' } },
                    x: { title: { display: true, text: 'Barangay' } }
                }
            }
        });
    }
};

// Event Handlers
const handlers = {
    handleSearch: () => {
        core.filterBarangays(elements.searchInput.value);
        core.populateBarangayTable();
    },

    handlePrevPage: () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            core.populateBarangayTable();
            core.updatePagination();
        }
    },

    handleNextPage: () => {
        const totalPages = Math.ceil(state.filteredBarangays.length / state.itemsPerPage);
        if (state.currentPage < totalPages) {
            state.currentPage++;
            core.populateBarangayTable();
            core.updatePagination();
        }
    },

    handleItemsPerPageChange: () => {
        state.itemsPerPage = parseInt(elements.itemsPerPageSelect.value);
        state.currentPage = 1;
        core.populateBarangayTable();
        core.updatePagination();
    },

    handleViewToggle: () => {
        elements.barangayViewBtn.classList.add('active');
        elements.purokViewBtn.classList.remove('active');
        elements.barangayTable.style.display = 'table';
        elements.barangayChartContainer.style.display = 'block';
    },

    handleModalClose: () => {
        elements.modal.style.display = 'none';
    },

    handleOutsideClick: (event) => {
        if (event.target === elements.modal) {
            elements.modal.style.display = 'none';
        }
    }
};

// Initialize Dashboard
const initDashboard = () => {
    utils.calculateSummaryStats();
    core.filterBarangays();
    core.populateBarangayTable();
    core.createBarangayChart();
    
    // Event Listeners
    elements.searchInput.addEventListener('input', handlers.handleSearch);
    elements.prevPageBtn.addEventListener('click', handlers.handlePrevPage);
    elements.nextPageBtn.addEventListener('click', handlers.handleNextPage);
    elements.itemsPerPageSelect.addEventListener('change', handlers.handleItemsPerPageChange);
    elements.barangayViewBtn.addEventListener('click', handlers.handleViewToggle);
    elements.closeBtn.addEventListener('click', handlers.handleModalClose);
    window.addEventListener('click', handlers.handleOutsideClick);
};

// Run on page load
window.addEventListener('load', initDashboard);