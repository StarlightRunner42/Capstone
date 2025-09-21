// ======= STATIC DATA (FALLBACK) =======
const staticBarangayData = [
  { id: 1, name: "Barangay 1", lydoCount: 0 },
  { id: 2, name: "Barangay 2", lydoCount: 0 },
  { id: 3, name: "Barangay 3", lydoCount: 0 },
  { id: 4, name: "Barangay 4", lydoCount: 0 },
  { id: 5, name: "Barangay 5", lydoCount: 0 },
  { id: 6, name: "Barangay Mambulac", lydoCount: 0 },
  { id: 7, name: "Barangay Guinhalaran", lydoCount: 0 },
  { id: 8, name: "Barangay E-Lopez", lydoCount: 0 },
  { id: 9, name: "Barangay Bagtic", lydoCount: 0 },
  { id: 10, name: "Barangay Balaring", lydoCount: 0 },
  { id: 11, name: "Barangay Hawaiian", lydoCount: 0 },
  { id: 12, name: "Barangay Patag", lydoCount: 0 },
  { id: 13, name: "Barangay Kapt. Ramon", lydoCount: 0 },
  { id: 14, name: "Barangay Guimbalaon", lydoCount: 0 },
  { id: 15, name: "Barangay Rizal", lydoCount: 0 },
  { id: 16, name: "Barangay Lantad", lydoCount: 0 },
];

// ======= VARIABLES =======
let barangayData = {};
let currentChart = null;
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [];
let allData = [];
let currentChartType = 'doughnut'; // Default chart type

let totalLYDO = 0;
let averageLYDO = 0;

// ======= INITIALIZE DATA =======
function initializeData() {
  const entries = Object.entries(barangayData);

  // Compute totals
  totalLYDO = entries.reduce((sum, [_, data]) => sum + data.lydoCount, 0);
  averageLYDO = entries.length ? Math.round(totalLYDO / entries.length) : 0;

  // Update statistics display
  document.getElementById('totalLYDO').textContent = totalLYDO.toLocaleString();
  document.getElementById('averageLYDO').textContent = averageLYDO;

  // Convert barangayData into array
  allData = entries.map(([id, data]) => ({
    id: parseInt(id),
    name: data.name,
    lydoCount: data.lydoCount,
    percentage: totalLYDO ? ((data.lydoCount / totalLYDO) * 100).toFixed(1) : '0.0'
  }));

  filteredData = [...allData];
}

// ======= LOAD DATA FROM API =======
async function loadLydoData() {
  try {
    console.log('🔄 Loading youth data from API...');
    
    // Show loading state
    showLoadingState();
    
    const response = await fetch('/api/analytics/youth');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      console.log('✅ Youth data loaded successfully:', result.data);
      
      // Update statistics
      document.getElementById('totalBarangays').textContent = result.data.totalBarangays;
      document.getElementById('totalLYDO').textContent = result.data.totalLYDO.toLocaleString();
      document.getElementById('averageLYDO').textContent = result.data.averageLYDO;
      
      // Process barangay data
      barangayData = {};
      result.data.barangays.forEach(item => {
        barangayData[item.id] = {
          name: item.name,
          lydoCount: item.lydoCount
        };
      });
      
      initializeData();
      renderTable();
      renderPagination();
      
      hideLoadingState();
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('❌ Error loading youth data:', error);
    
    // Fallback to static data
    console.log('🔄 Falling back to static data...');
    loadStaticData();
    hideLoadingState();
    
    // Show error message
    showErrorMessage('Failed to load youth data. Using fallback data.');
  }
}

// ======= LOAD STATIC DATA (FALLBACK) =======
function loadStaticData() {
  barangayData = {};

  staticBarangayData.forEach(item => {
    barangayData[item.id] = {
      name: item.name,
      lydoCount: item.lydoCount
    };
  });

  initializeData();
  renderTable();
  renderPagination();
}

// ======= LOADING STATE FUNCTIONS =======
function showLoadingState() {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = `
    <tr>
      <td colspan="3" style="text-align: center; padding: 40px;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
          <div class="spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p style="margin: 0; color: #666;">Loading youth data...</p>
        </div>
      </td>
    </tr>
  `;
  
  // Add spinner animation
  if (!document.querySelector('#spinner-style')) {
    const style = document.createElement('style');
    style.id = 'spinner-style';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

function hideLoadingState() {
  // Loading state will be replaced by renderTable()
}

function showErrorMessage(message) {
  // Create a temporary notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff6b6b;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    font-family: Arial, sans-serif;
    max-width: 300px;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

// ======= RENDER TABLE =======
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
      <td class="lydo-count">${item.lydoCount.toLocaleString()}</td>
      <td>
        <button class="view-chart-btn" onclick="showChart(${item.id})">
          View Chart
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ======= PAGINATION =======
function renderPagination() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginationControls = document.getElementById('paginationControls');
  const paginationInfo = document.getElementById('paginationInfo');

  const startItem = filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);
  paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredData.length} entries`;

  paginationControls.innerHTML = '';

  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.innerHTML = '◀';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => changePage(currentPage - 1);
  paginationControls.appendChild(prevBtn);

  // Page buttons
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

function changePage(page) {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderTable();
    renderPagination();
  }
}

// ======= SEARCH FUNCTION =======
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

// ======= SHOW CHART MODAL =======
function showChart(barangayId) {
  const barangay = allData.find(item => item.id === barangayId);
  const modal = document.getElementById('chartModal');
  const modalTitle = document.getElementById('modalTitle');
  const chartInfo = document.getElementById('chartInfo');

  modalTitle.textContent = `${barangay.name} - LYDO`;
  modalTitle.dataset.barangayId = barangayId;
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';

  // Update modal info
  const othersPercentage = (100 - parseFloat(barangay.percentage)).toFixed(1);
  chartInfo.innerHTML = `
    <h3>${barangay.name} Statistics</h3>
    <p><strong>LYDO Count:</strong> ${barangay.lydoCount.toLocaleString()}</p>
    <p><strong>Percentage of Total:</strong> ${barangay.percentage}%</p>
    <p><strong>Other Barangays:</strong> ${othersPercentage}%</p>
  `;

  // Reset to default chart
  currentChartType = 'doughnut';
  document.querySelectorAll('.chart-type-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector('[onclick="switchChartType(\'doughnut\')"]').classList.add('active');

  document.getElementById('chartContainer').style.display = 'block';
  document.getElementById('tableContainer').style.display = 'none';

  updateChart();
}

// ======= UPDATE CHART =======
function updateChart() {
  const barangayId = parseInt(document.getElementById('modalTitle').dataset.barangayId);
  const barangay = allData.find(item => item.id === barangayId);

  if (!barangay) return;

  const selectedPercentage = parseFloat(barangay.percentage);
  const othersPercentage = 100 - selectedPercentage;

  if (currentChart) {
    currentChart.destroy();
  }

  const ctx = document.getElementById('pieChart').getContext('2d');
  currentChart = new Chart(ctx, {
    type: currentChartType,
    data: {
      labels: [barangay.name, 'Other Barangays'],
      datasets: [{
        data: [selectedPercentage, othersPercentage],
        backgroundColor: ['#061727', '#415E72'],
        borderColor: ['#061727', '#FDFAF6'],
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
            font: { size: 14, weight: 'bold' }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              return `${label}: ${value.toFixed(1)}%`;
            }
          },
          titleFont: { size: 16 },
          bodyFont: { size: 14 },
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

// ======= SWITCH CHART TYPE =======
function switchChartType(type) {
  currentChartType = type;
  const chartContainer = document.getElementById('chartContainer');
  const tableContainer = document.getElementById('tableContainer');
  const chartTypeButtons = document.querySelectorAll('.chart-type-btn');

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

// ======= RENDER CHART TABLE =======
function renderChartTable() {
  const tableBody = document.getElementById('chartTableBody');
  const currentBarangay = allData.find(item => item.id === parseInt(document.getElementById('modalTitle').dataset.barangayId));

  if (!currentBarangay) return;

  const data = [
    { name: currentBarangay.name, percentage: currentBarangay.percentage },
    { name: 'Other Barangays', percentage: (100 - parseFloat(currentBarangay.percentage)).toFixed(1) }
  ];

  tableBody.innerHTML = '';
  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="display: flex; align-items: center;">
        <div style="width: 20px; height: 20px; background-color: ${index === 0 ? 'rgba(102, 126, 234, 0.8)' : 'rgba(118, 75, 162, 0.8)'}; margin-right: 10px; border-radius: 4px;"></div>
        ${item.name}
      </td>
      <td><strong>${item.percentage}%</strong></td>
    `;
    tableBody.appendChild(row);
  });
}

// ======= CLOSE MODAL =======
function closeModal() {
  const modal = document.getElementById('chartModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';

  if (currentChart) {
    currentChart.destroy();
    currentChart = null;
  }
}

// ======= EVENT LISTENERS =======
document.querySelector('.close').onclick = closeModal;
document.getElementById('searchInput').oninput = handleSearch;

window.onclick = function(event) {
  const modal = document.getElementById('chartModal');
  if (event.target === modal) {
    closeModal();
  }
};

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});

// ======= START APP =======
loadLydoData();
