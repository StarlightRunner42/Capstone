// Data structure with senior citizens count
const barangayData = {
    1: { 
        name: "Barangay 1",
        puroks: ["Kamagong", "Narra", "Ipil-Ipil", "Akasya", "Flying-E"], 
        seniorCount: 156
    },
    2: { 
        name: "Barangay 2",
        puroks: ["Gomez", "Katipunan", "Kahilwayan", "Sool Uno", "Sool Dos"], 
        seniorCount: 124
    },
    3: { 
        name: "Barangay 3",
        puroks: ["Paghida.et A", "Paghida.et B", "Ilimnan", "Guintipunan", "Mahigugmaon"], 
        seniorCount: 98
    },
    4: { 
        name: "Barangay 4",
        puroks: ["Antilla Subd", "Gomez Extension", "Bonifacio Extension", "Mckinley Bukid", "Zulueta Bukid"], 
        seniorCount: 167
    },
    5: { 
        name: "Barangay 5",
        puroks: ["Elina subd", "Portuna", "St francis", "Carmilla paste 3", "Villa carmen"], 
        seniorCount: 119
    },
    6: { 
        name: "Barangay Mambulac",
        puroks: ["Paghidaet", "Antoni Luna", "Swimming Pool", "Boulevard", "Barra"], 
        seniorCount: 187
    },
    7: { 
        name: "Barangay Guinhalaran",
        puroks: ["Katilingban", "Sawmill", "Paghidait", "Mangingisda", "Baybayon"], 
        seniorCount: 136
    },
    8: { 
        name: "Barangay E-Lopez",
        puroks: ["Sunshine", "Sunrise", "Sunset", "Sampaguita", "Newsite"], 
        seniorCount: 145
    },
    9: { 
        name: "Barangay Bagtic",
        puroks: ["Proper", "New site", "Bactic uno", "Kalbaryo", "Defuigo"], 
        seniorCount: 112
    },
    10: { 
        name: "Barangay Balaring",
        puroks: ["Camunsilan", "Proper", "Bungol", "Hda Balaring", "Pasil"], 
        seniorCount: 158
    },
    11: { 
        name: "Barangay Hawaiian",
        puroks: ["Colisap", "Phison", "balas", "Lunot", "Sandiego"], 
        seniorCount: 94
    },
    12: { 
        name: "Barangay Patag",
        puroks: ["Mahigugmaon", "Malipayun", "Mainabyanon", "Marka"], 
        seniorCount: 127
    },
    13: { 
        name: "Barangay Kapt. Ramon",
        puroks: ["Hda.Adoracion", "Hda.Boac", "Hda.Progreso", "Hda.Banita jarra", "Hda.Violata"], 
        seniorCount: 165
    },
    14: { 
        name: "Barangay Guimbalaon",
        puroks: ["Proper", "New Site", "Bactic Uno", "Kalbaryo", "Defuigo"], 
        seniorCount: 129
    },
    15: { 
        name: "Barangay Rizal",
        puroks: ["Matagoy", "Paradise", "Kalubihan", "Baryo Rizal", "Hda Makina"], 
        seniorCount: 173
    },
    16: { 
        name: "Barangay Lantad",
        puroks: ["Mapisanon", "Nami nami", "Bay-bay", "Paraiso", "Mainuswagon"], 
        seniorCount: 108
    }
};

// Pagination variables
let currentPage = 1;
let itemsPerPage = 5;
let filteredBarangays = [];
let purokModalChart = null;

// Calculate purok senior counts (distributing evenly among puroks with remainders going to first puroks)
function calculatePurokSeniorCounts(barangayId) {
    const data = barangayData[barangayId];
    const purokCount = data.puroks.length;
    const baseCount = Math.floor(data.seniorCount / purokCount);
    const remainder = data.seniorCount % purokCount;
    
    return data.puroks.map((purok, index) => {
        return {
            name: purok,
            count: baseCount + (index < remainder ? 1 : 0)
        };
    });
}

// Calculate summary statistics
function calculateSummaryStats() {
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
    
    return {
        totalSeniors,
        barangayCount,
        avgSeniors,
        highestCount,
        highestBarangay
    };
}

// Filter barangays based on search term
function filterBarangays(searchTerm = '') {
    filteredBarangays = Object.entries(barangayData)
        .filter(([id, data]) => 
            data.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => b[1].seniorCount - a[1].seniorCount);
    
    // Reset to first page when filtering
    currentPage = 1;
    updatePagination();
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredBarangays.length / itemsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Get current page data
function getCurrentPageData() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBarangays.slice(startIndex, endIndex);
}

// Populate barangay table with pagination
function populateBarangayTable() {
    const tableBody = document.getElementById('barangayTableBody');
    tableBody.innerHTML = '';
    
    const currentData = getCurrentPageData();
    
    currentData.forEach(([id, data]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.name}</td>
            <td>${data.puroks.length}</td>
            <td>${data.seniorCount}</td>
            <td>
                <button class="expand-btn" data-id="${id}">View Puroks</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners to expand buttons
    document.querySelectorAll('.expand-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            showPurokModal(id);
        });
    });
}

// Show purok details in modal
function showPurokModal(barangayId) {
    const modal = document.getElementById('purokModal');
    const modalTitle = document.getElementById('modalTitle');
    const purokTableBody = document.getElementById('purokTableBody');
    const data = barangayData[barangayId];
    
    // Set modal title
    modalTitle.textContent = `Purok Details for ${data.name}`;
    
    // Clear previous table data
    purokTableBody.innerHTML = '';
    
    // Calculate purok-level data
    const purokData = calculatePurokSeniorCounts(barangayId);
    
    // Populate purok table
    purokData.forEach(purok => {
        const percentage = ((purok.count / data.seniorCount) * 100).toFixed(1);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${purok.name}</td>
            <td>${purok.count}</td>
            <td>${percentage}%</td>
        `;
        purokTableBody.appendChild(row);
    });
    
    // Create or update chart
    createPurokModalChart(barangayId);
    
    // Show modal
    modal.style.display = 'block';
}

// Create chart for purok modal
function createPurokModalChart(barangayId) {
    const data = barangayData[barangayId];
    const purokData = calculatePurokSeniorCounts(barangayId);
    
    // Format data for chart
    const labels = purokData.map(p => p.name);
    const counts = purokData.map(p => p.count);
    
    const ctx = document.getElementById('purokModalChart');
    
    // Destroy previous chart if exists
    if (purokModalChart) {
        purokModalChart.destroy();
    }
    
    purokModalChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: [
                    'rgba(255, 0, 55, 0.7)',
                    'rgba(0, 153, 255, 0.7)',
                    'rgba(255, 183, 0, 0.7)',
                    'rgba(0, 255, 255, 0.7)',
                    'rgba(85, 0, 255, 0.7)',
                    'rgba(255, 128, 0, 0.7)',
                    'rgba(255, 255, 255, 0.7)',
                    'rgba(0, 30, 255, 0.7)',
                    'rgba(0, 255, 51, 0.7)',
                    'rgba(255, 255, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)',
                    'rgba(40, 159, 64, 1)',
                    'rgba(210, 199, 199, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Senior Citizens Distribution in ${data.name}`,
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Create barangay chart
function createBarangayChart() {
    const chartContainer = document.getElementById('barangayChartContainer');
    
    // Format data for chart
    const labels = [];
    const data = [];
    const backgroundColors = [];
    
    Object.entries(barangayData)
        .sort((a, b) => b[1].seniorCount - a[1].seniorCount)
        .forEach(([id, barangay]) => {
            labels.push(barangay.name);
            data.push(barangay.seniorCount);
            
            // Generate a color based on the value
            const hue = 200 + parseInt(id) * 10 % 160; // Range from 200 to 360 (blue to purple)
            backgroundColors.push(`hsla(${hue}, 70%, 60%, 0.7)`);
        });
    
    // Create chart
    if (window.barangayChart) {
        window.barangayChart.destroy();
    }
    
    const ctx = document.createElement('canvas');
    chartContainer.innerHTML = '';
    chartContainer.appendChild(ctx);
    
    window.barangayChart = new Chart(ctx, {
        type: 'bar',
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
                title: {
                    display: true,
                    text: 'Senior Citizens per Barangay',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Senior Citizens: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Senior Citizens'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Barangay'
                    }
                }
            }
        }
    });
}

// Initialize dashboard
function initDashboard() {
    // Calculate stats
    calculateSummaryStats();
    
    // Initialize filtered barangays
    filterBarangays();
    
    // Populate table
    populateBarangayTable();
    
    // Create chart
    createBarangayChart();
    
    // Add search functionality
    document.getElementById('searchInput').addEventListener('input', function() {
        filterBarangays(this.value);
        populateBarangayTable();
    });
    
    // Add pagination event listeners
    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            populateBarangayTable();
            updatePagination();
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', function() {
        const totalPages = Math.ceil(filteredBarangays.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            populateBarangayTable();
            updatePagination();
        }
    });
    
    // Add items per page change listener
    document.getElementById('itemsPerPage').addEventListener('change', function() {
        itemsPerPage = parseInt(this.value);
        currentPage = 1;
        populateBarangayTable();
        updatePagination();
    });
    
    // Add view toggle functionality
    document.getElementById('barangayView').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('purokView').classList.remove('active');
        document.getElementById('barangayTable').style.display = 'table';
        document.getElementById('barangayChartContainer').style.display = 'block';
    });
    
    // Close modal when clicking X
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.getElementById('purokModal').style.display = 'none';
        });
    } else {
        console.error("Close button not found!");
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('purokModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Run on page load
window.addEventListener('load', initDashboard);