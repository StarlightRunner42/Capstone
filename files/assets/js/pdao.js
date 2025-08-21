// Data structure with PDAO count and gender breakdown
const barangayData = {
    1: { name: "Barangay 1", pdaoCount: 156, maleCount: 89, femaleCount: 67 },
    2: { name: "Barangay 2", pdaoCount: 124, maleCount: 71, femaleCount: 53 },
    3: { name: "Barangay 3", pdaoCount: 98, maleCount: 56, femaleCount: 42 },
    4: { name: "Barangay 4", pdaoCount: 167, maleCount: 95, femaleCount: 72 },
    5: { name: "Barangay 5", pdaoCount: 119, maleCount: 68, femaleCount: 51 },
    6: { name: "Barangay Mambulac", pdaoCount: 187, maleCount: 107, femaleCount: 80 },
    7: { name: "Barangay Guinhalaran", pdaoCount: 136, maleCount: 78, femaleCount: 58 },
    8: { name: "Barangay E-Lopez", pdaoCount: 145, maleCount: 83, femaleCount: 62 },
    9: { name: "Barangay Bagtic", pdaoCount: 112, maleCount: 64, femaleCount: 48 },
    10: { name: "Barangay Balaring", pdaoCount: 158, maleCount: 90, femaleCount: 68 },
    11: { name: "Barangay Hawaiian", pdaoCount: 94, maleCount: 54, femaleCount: 40 },
    12: { name: "Barangay Patag", pdaoCount: 127, maleCount: 73, femaleCount: 54 },
    13: { name: "Barangay Kapt. Ramon", pdaoCount: 165, maleCount: 94, femaleCount: 71 },
    14: { name: "Barangay Guimbalaon", pdaoCount: 129, maleCount: 74, femaleCount: 55 },
    15: { name: "Barangay Rizal", pdaoCount: 173, maleCount: 99, femaleCount: 74 },
    16: { name: "Barangay Lantad", pdaoCount: 108, maleCount: 62, femaleCount: 46 }
};

let currentChart = null;
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [];
let allData = [];
let currentChartType = 'doughnut'; // Default chart type

// Calculate statistics
const totalPDAO = Object.values(barangayData).reduce((sum, barangay) => sum + barangay.pdaoCount, 0);
const totalMale = Object.values(barangayData).reduce((sum, barangay) => sum + barangay.maleCount, 0);
const totalFemale = Object.values(barangayData).reduce((sum, barangay) => sum + barangay.femaleCount, 0);
const averagePDAO = Math.round(totalPDAO / Object.keys(barangayData).length);
const averageMalePercentage = ((totalMale / totalPDAO) * 100).toFixed(1);
const averageFemalePercentage = ((totalFemale / totalPDAO) * 100).toFixed(1);

// Update stats display
document.getElementById('totalPDAO').textContent = totalPDAO.toLocaleString();
document.getElementById('averagePDAO').textContent = averagePDAO;

// Initialize data
function initializeData() {
    allData = Object.entries(barangayData).map(([id, data]) => ({
        id: parseInt(id),
        name: data.name,
        pdaoCount: data.pdaoCount,
        maleCount: data.maleCount,
        femaleCount: data.femaleCount,
        malePercentage: ((data.maleCount / data.pdaoCount) * 100).toFixed(1),
        femalePercentage: ((data.femaleCount / data.pdaoCount) * 100).toFixed(1),
        percentage: ((data.pdaoCount / totalPDAO) * 100).toFixed(1)
    }));
    filteredData = [...allData];
}

// Render table rows
function renderTable() {
    const tbody = document.getElementById('tableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    tbody.innerHTML = '';

    if (pageData.length === 0) {
        document.getElementById('noResults').style.display = 'block';
        document.getElementById('dataTable').style.display = 'none';
        document.getElementById('pagination').style.display = 'none';
        return;
    }

    document.getElementById('noResults').style.display = 'none';
    document.getElementById('dataTable').style.display = 'table';
    document.getElementById('pagination').style.display = 'flex';

    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="barangay-name">${item.name}</td>
            <td class="pdao-count">${item.pdaoCount.toLocaleString()}</td>
            <td>
                <button class="view-chart-btn" onclick="showChart(${item.id})">
                     View Chart
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginationControls = document.getElementById('paginationControls');
    const paginationInfo = document.getElementById('paginationInfo');

    // Update info
    const startItem = filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);
    paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredData.length} entries`;

    // Clear previous buttons
    paginationControls.innerHTML = '';

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '◀';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => changePage(currentPage - 1);
    paginationControls.appendChild(prevBtn);

    // Page number buttons
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => changePage(i);
        paginationControls.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '▶';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => changePage(currentPage + 1);
    paginationControls.appendChild(nextBtn);
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderTable();
        renderPagination();
    }
}

// Search functionality
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm === '') {
        filteredData = [...allData];
    } else {
        filteredData = allData.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    renderTable();
    renderPagination();
}

// Switch chart type
function switchChartType(type) {
    currentChartType = type;
    const chartContainer = document.getElementById('chartContainer');
    const tableContainer = document.getElementById('tableContainer');
    const chartTypeButtons = document.querySelectorAll('.chart-type-btn');
    
    // Update button states
    chartTypeButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="switchChartType('${type}')"]`).classList.add('active');
    
    if (type === 'table') {
        chartContainer.style.display = 'none';
        tableContainer.style.display = 'block';
        renderChartTable();
    } else {
        chartContainer.style.display = 'block';
        tableContainer.style.display = 'none';
        updateChart();
    }
}

// Render chart table - now shows male/female breakdown
function renderChartTable() {
    const tableBody = document.getElementById('chartTableBody');
    const currentBarangay = allData.find(item => item.id === parseInt(document.getElementById('modalTitle').dataset.barangayId));
    
    if (!currentBarangay) return;
    
    const data = [
        { name: 'Male', percentage: currentBarangay.malePercentage, count: currentBarangay.maleCount },
        { name: 'Female', percentage: currentBarangay.femalePercentage, count: currentBarangay.femaleCount }
    ];
    
    tableBody.innerHTML = '';
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="display: flex; align-items: center;">
                <div style="width: 20px; height: 20px; background-color: ${index === 0 ? '#061727' : '#415E72'}; margin-right: 10px; border-radius: 4px;"></div>
                ${item.name}
            </td>
            <td><strong>${item.percentage}% (${item.count})</strong></td>
        `;
        tableBody.appendChild(row);
    });
}

// Update chart - now shows male/female distribution
function updateChart() {
    const barangayId = parseInt(document.getElementById('modalTitle').dataset.barangayId);
    const barangay = allData.find(item => item.id === barangayId);
    
    if (!barangay) return;
    
    const malePercentage = parseFloat(barangay.malePercentage);
    const femalePercentage = parseFloat(barangay.femalePercentage);

    // Destroy existing chart
    if (currentChart) {
        currentChart.destroy();
    }

    // Create new chart
    const ctx = document.getElementById('pieChart').getContext('2d');
    currentChart = new Chart(ctx, {
        type: currentChartType,
        data: {
            labels: ['Male', 'Female'],
            datasets: [{
                data: [malePercentage, femalePercentage],
                backgroundColor: [
                    '#061727',
                    '#415E72'
                ],
                borderColor: [
                    '#061727',
                    '#FDFAF6'
                ],
                borderWidth: 2,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const barangayData = allData.find(item => item.id === barangayId);
                            const count = label === 'Male' ? barangayData.maleCount : barangayData.femaleCount;
                            return `${label}: ${value.toFixed(1)}% (${count})`;
                        }
                    },
                    titleFont: {
                        size: 16
                    },
                    bodyFont: {
                        size: 14
                    },
                    padding: 12
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1000
            }
        }
    });
}

// Show chart modal - updated to show gender statistics
function showChart(barangayId) {
    const barangay = allData.find(item => item.id === barangayId);
    const modal = document.getElementById('chartModal');
    const modalTitle = document.getElementById('modalTitle');
    const chartInfo = document.getElementById('chartInfo');
    
    modalTitle.textContent = `${barangay.name} - PDAO`;
    modalTitle.dataset.barangayId = barangayId; // Store for reference
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Update chart info with gender breakdown
    chartInfo.innerHTML = `
        <h3>${barangay.name} Gender Statistics</h3>
        <p><strong>Total PDAO Count:</strong> ${barangay.pdaoCount.toLocaleString()}</p>
        <p><strong>Male:</strong> ${barangay.maleCount} (${barangay.malePercentage}%)</p>
        <p><strong>Female:</strong> ${barangay.femaleCount} (${barangay.femalePercentage}%)</p>
        <hr style="margin: 15px 0;">
    `;

    // Reset to default chart type
    currentChartType = 'doughnut';
    document.querySelectorAll('.chart-type-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[onclick="switchChartType(\'doughnut\')"]').classList.add('active');
    
    // Show chart container, hide table container
    document.getElementById('chartContainer').style.display = 'block';
    document.getElementById('tableContainer').style.display = 'none';

    updateChart();
}

// Close modal functionality
function closeModal() {
    const modal = document.getElementById('chartModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
}

// Event listeners
document.querySelector('.close').onclick = closeModal;
document.getElementById('searchInput').oninput = handleSearch;

window.onclick = function(event) {
    const modal = document.getElementById('chartModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Initialize the application
initializeData();
renderTable();
renderPagination();