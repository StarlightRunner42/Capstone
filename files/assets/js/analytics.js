// Updated data structure with PWD and Senior Citizens
const barangayData = {
    1: { 
        name: "Barangay 1",
        puroks: ["Kamagong", "Narra", "Ipil-Ipil", "Akasya", "Flying-E"], 
        pwdCount: 42,
        seniorCount: 156
    },
    2: { 
        name: "Barangay 2",
        puroks: ["Gomez", "Katipunan", "Kahilwayan", "Sool Uno", "Sool Dos"], 
        pwdCount: 38,
        seniorCount: 124
    },
    3: { 
        name: "Barangay 3",
        puroks: ["Paghida.et A", "Paghida.et B", "Ilimnan", "Guintipunan", "Mahigugmaon"], 
        pwdCount: 29,
        seniorCount: 98
    },
    4: { 
        name: "Barangay 4",
        puroks: ["Antilla Subd", "Gomez Extension", "Bonifacio Extension", "Mckinley Bukid", "Zulueta Bukid"], 
        pwdCount: 45,
        seniorCount: 167
    },
    5: { 
        name: "Barangay 5",
        puroks: ["Elina subd", "Portuna", "St francis", "Carmilla paste 3", "Villa carmen"], 
        pwdCount: 31,
        seniorCount: 119
    },
    6: { 
        name: "Barangay Mambulac",
        puroks: ["Paghidaet", "Antoni Luna", "Swimming Pool", "Boulevard", "Barra"], 
        pwdCount: 53,
        seniorCount: 187
    },
    7: { 
        name: "Barangay Guinhalaran",
        puroks: ["Katilingban", "Sawmill", "Paghidait", "Mangingisda", "Baybayon"], 
        pwdCount: 47,
        seniorCount: 136
    },
    8: { 
        name: "Barangay E-Lopez",
        puroks: ["Sunshine", "Sunrise", "Sunset", "Sampaguita", "Newsite"], 
        pwdCount: 35,
        seniorCount: 145
    },
    9: { 
        name: "Barangay Bagtic",
        puroks: ["Proper", "New site", "Bactic uno", "Kalbaryo", "Defuigo"], 
        pwdCount: 41,
        seniorCount: 112
    },
    10: { 
        name: "Barangay Balaring",
        puroks: ["Camunsilan", "Proper", "Bungol", "Hda Balaring", "Pasil"], 
        pwdCount: 38,
        seniorCount: 158
    },
    11: { 
        name: "Barangay Hawaiian",
        puroks: ["Colisap", "Phison", "balas", "Lunot", "Sandiego"], 
        pwdCount: 26,
        seniorCount: 94
    },
    12: { 
        name: "Barangay Patag",
        puroks: ["Mahigugmaon", "Malipayun", "Mainabyanon", "Marka"], 
        pwdCount: 33,
        seniorCount: 127
    },
    13: { 
        name: "Barangay Kapt. Ramon",
        puroks: ["Hda.Adoracion", "Hda.Boac", "Hda.Progreso", "Hda.Banita jarra", "Hda.Violata"], 
        pwdCount: 44,
        seniorCount: 165
    },
    14: { 
        name: "Barangay Guimbalaon",
        puroks: ["Proper", "New Site", "Bactic Uno", "Kalbaryo", "Defuigo"], 
        pwdCount: 37,
        seniorCount: 129
    },
    15: { 
        name: "Barangay Rizal",
        puroks: ["Matagoy", "Paradise", "Kalubihan", "Baryo Rizal", "Hda Makina"], 
        pwdCount: 51,
        seniorCount: 173
    },
    16: { 
        name: "Barangay Lantad",
        puroks: ["Mapisanon", "Nami nami", "Bay-bay", "Paraiso", "Mainuswagon"], 
        pwdCount: 34,
        seniorCount: 108
    }
};

// Function to populate the table
function populateTable(data = barangayData) {
    const tableBody = document.querySelector('#directoryTable tbody');
    tableBody.innerHTML = '';
    
    Object.keys(data).forEach(key => {
        const barangay = data[key];
        
        const row = document.createElement('tr');
        
        // Barangay Name with badge
        const nameCell = document.createElement('td');
        const barangayName = document.createElement('div');
        barangayName.className = 'barangay-name';
        
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = key;
        badge.style.backgroundColor = getColorForBadge(parseInt(key));
        
        const name = document.createElement('span');
        name.textContent = barangay.name;
        
        barangayName.appendChild(badge);
        barangayName.appendChild(name);
        nameCell.appendChild(barangayName);
        row.appendChild(nameCell);
        
        // Puroks as dropdown
        const puroksCell = document.createElement('td');
        const purokSelect = document.createElement('select');
        purokSelect.className = 'custom-select';
        
        const defaultPurokOption = document.createElement('option');
        defaultPurokOption.value = '';
        defaultPurokOption.textContent = 'Select Purok';
        defaultPurokOption.selected = true;
        purokSelect.appendChild(defaultPurokOption);
        
        barangay.puroks.forEach(purok => {
            const option = document.createElement('option');
            option.value = purok;
            option.textContent = purok;
            purokSelect.appendChild(option);
        });
        
        purokSelect.addEventListener('change', function() {
            if (this.value) {
                showNotification(`Selected Purok: ${this.value} in ${barangay.name}`);
            }
        });
        
        puroksCell.appendChild(purokSelect);
        row.appendChild(puroksCell);
        
        // PWD Count
        const pwdCell = document.createElement('td');
        pwdCell.className = 'stat-cell';
        
        const pwdWrapper = document.createElement('div');
        pwdWrapper.className = 'stat-wrapper';
        
        const pwdIcon = document.createElement('i');
        pwdIcon.className = 'fas fa-wheelchair';
        
        const pwdCount = document.createElement('span');
        pwdCount.className = 'stat-count';
        pwdCount.textContent = barangay.pwdCount;
        
        pwdWrapper.appendChild(pwdIcon);
        pwdWrapper.appendChild(pwdCount);
        pwdCell.appendChild(pwdWrapper);
        row.appendChild(pwdCell);
        
        // Senior Count
        const seniorCell = document.createElement('td');
        seniorCell.className = 'stat-cell';
        
        const seniorWrapper = document.createElement('div');
        seniorWrapper.className = 'stat-wrapper';
        
        const seniorIcon = document.createElement('i');
        seniorIcon.className = 'fas fa-user-friends';
        
        const seniorCount = document.createElement('span');
        seniorCount.className = 'stat-count';
        seniorCount.textContent = barangay.seniorCount;
        
        seniorWrapper.appendChild(seniorIcon);
        seniorWrapper.appendChild(seniorCount);
        seniorCell.appendChild(seniorWrapper);
        row.appendChild(seniorCell);
        
        // Actions
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        
        const viewBtn = document.createElement('button');
        viewBtn.className = 'btn btn-view';
        viewBtn.innerHTML = '<i class="fas fa-eye"></i> View';
        viewBtn.onclick = () => showBarangayDetails(barangay);
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-edit';
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
        editBtn.onclick = () => editBarangayData(key, barangay);
        
        actionsCell.appendChild(viewBtn);
        actionsCell.appendChild(editBtn);
        row.appendChild(actionsCell);
        
        tableBody.appendChild(row);
    });
}

// Function to show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Function to populate the filter dropdown
function populateFilter() {
    const filterSelect = document.getElementById('filterBarangay');
    
    // Add All option
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All Barangays';
    filterSelect.appendChild(allOption);
    
    Object.keys(barangayData).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = barangayData[key].name;
        filterSelect.appendChild(option);
    });
    
    // Add event listener
    filterSelect.addEventListener('change', function() {
        const selectedBarangay = this.value;
        if (selectedBarangay === '') {
            populateTable();
        } else {
            const filteredData = {};
            filteredData[selectedBarangay] = barangayData[selectedBarangay];
            populateTable(filteredData);
        }
    });
}

// Function to implement search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        if (searchTerm === '') {
            populateTable();
            return;
        }
        
        const filteredData = {};
        
        Object.keys(barangayData).forEach(key => {
            const barangay = barangayData[key];
            
            // Check if barangay name contains search term
            if (barangay.name.toLowerCase().includes(searchTerm)) {
                filteredData[key] = barangay;
                return;
            }
            
            // Check if any purok contains search term
            const matchingPuroks = barangay.puroks.filter(purok => 
                purok.toLowerCase().includes(searchTerm)
            );
            
            if (matchingPuroks.length > 0) {
                filteredData[key] = barangay;
            }
        });
        
        populateTable(filteredData);
    });
}

// Function to show barangay details in a modal
function showBarangayDetails(barangay) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = barangay.name;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    };
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    
    // Create modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    // Statistics
    const statsSection = document.createElement('div');
    statsSection.className = 'stats-section';
    
    const pwdStat = document.createElement('div');
    pwdStat.className = 'stat-box';
    pwdStat.innerHTML = `
        <div class="stat-icon"><i class="fas fa-wheelchair"></i></div>
        <div class="stat-info">
            <div class="stat-value">${barangay.pwdCount}</div>
            <div class="stat-label">PWD Residents</div>
        </div>
    `;
    
    const seniorStat = document.createElement('div');
    seniorStat.className = 'stat-box';
    seniorStat.innerHTML = `
        <div class="stat-icon"><i class="fas fa-user-friends"></i></div>
        <div class="stat-info">
            <div class="stat-value">${barangay.seniorCount}</div>
            <div class="stat-label">Senior Citizens</div>
        </div>
    `;
    
    const totalStat = document.createElement('div');
    totalStat.className = 'stat-box';
    totalStat.innerHTML = `
        <div class="stat-icon"><i class="fas fa-users"></i></div>
        <div class="stat-info">
            <div class="stat-value">${barangay.pwdCount + barangay.seniorCount}</div>
            <div class="stat-label">Total Priority</div>
        </div>
    `;
    
    statsSection.appendChild(pwdStat);
    statsSection.appendChild(seniorStat);
    statsSection.appendChild(totalStat);
    
    // Puroks list
    const puroksSection = document.createElement('div');
    puroksSection.className = 'puroks-section';
    
    const puroksTitle = document.createElement('h3');
    puroksTitle.textContent = 'Puroks';
    
    const puroksList = document.createElement('div');
    puroksList.className = 'puroks-list';
    
    barangay.puroks.forEach(purok => {
        const purokTag = document.createElement('span');
        purokTag.className = 'purok-tag';
        purokTag.textContent = purok;
        puroksList.appendChild(purokTag);
    });
    
    puroksSection.appendChild(puroksTitle);
    puroksSection.appendChild(puroksList);
    
    // Add sections to body
    modalBody.appendChild(statsSection);
    modalBody.appendChild(puroksSection);
    
    // Add buttons
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-primary';
    exportBtn.innerHTML = '<i class="fas fa-file-export"></i> Export Data';
    exportBtn.onclick = () => alert(`Exporting data for ${barangay.name}`);
    
    const printBtn = document.createElement('button');
    printBtn.className = 'btn btn-secondary';
    printBtn.innerHTML = '<i class="fas fa-print"></i> Print Report';
    printBtn.onclick = () => alert(`Printing report for ${barangay.name}`);
    
    modalFooter.appendChild(exportBtn);
    modalFooter.appendChild(printBtn);
    
    // Assemble modal
    modal.appendChild(modalHeader);
    modal.appendChild(modalBody);
    modal.appendChild(modalFooter);
    overlay.appendChild(modal);
    
    // Add to DOM and animate
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 10);
}

// Function to edit barangay data
function editBarangayData(id, barangay) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = `Edit ${barangay.name}`;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    };
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    
    // Create modal body with form
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    const form = document.createElement('form');
    form.className = 'edit-form';
    
    // PWD count input
    const pwdGroup = document.createElement('div');
    pwdGroup.className = 'form-group';
    
    const pwdLabel = document.createElement('label');
    pwdLabel.htmlFor = 'pwdCount';
    pwdLabel.textContent = 'PWD Count';
    
    const pwdInput = document.createElement('input');
    pwdInput.type = 'number';
    pwdInput.id = 'pwdCount';
    pwdInput.value = barangay.pwdCount;
    pwdInput.min = 0;
    
    pwdGroup.appendChild(pwdLabel);
    pwdGroup.appendChild(pwdInput);
    
    // Senior count input
    const seniorGroup = document.createElement('div');
    seniorGroup.className = 'form-group';
    
    const seniorLabel = document.createElement('label');
    seniorLabel.htmlFor = 'seniorCount';
    seniorLabel.textContent = 'Senior Citizens Count';
    
    const seniorInput = document.createElement('input');
    seniorInput.type = 'number';
    seniorInput.id = 'seniorCount';
    seniorInput.value = barangay.seniorCount;
    seniorInput.min = 0;
    
    seniorGroup.appendChild(seniorLabel);
    seniorGroup.appendChild(seniorInput);
    
    // Append form groups
    form.appendChild(pwdGroup);
    form.appendChild(seniorGroup);
    
    modalBody.appendChild(form);
    
    // Add buttons
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-primary';
    saveBtn.textContent = 'Save Changes';
    saveBtn.onclick = (e) => {
        e.preventDefault();
        // Update data
        barangayData[id].pwdCount = parseInt(pwdInput.value);
        barangayData[id].seniorCount = parseInt(seniorInput.value);
        
        // Refresh table
        populateTable();
        
        // Close modal
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
        
        // Show notification
        showNotification(`Updated data for ${barangay.name}`);
    };
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = (e) => {
        e.preventDefault();
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    };
    
    modalFooter.appendChild(saveBtn);
    modalFooter.appendChild(cancelBtn);
    
    // Assemble modal
    modal.appendChild(modalHeader);
    modal.appendChild(modalBody);
    modal.appendChild(modalFooter);
    overlay.appendChild(modal);
    
    // Add to DOM and animate
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 10);
}

// Function to generate a consistent color for badges based on barangay ID
function getColorForBadge(id) {
    const colors = [
        '#3498db', '#2ecc71', '#9b59b6', '#e74c3c', '#f39c12',
        '#1abc9c', '#d35400', '#34495e', '#16a085', '#27ae60',
        '#2980b9', '#8e44ad', '#c0392b', '#f1c40f', '#7f8c8d',
        '#3498db'
    ];
    
    return colors[id % colors.length];
}

// Function to initialize chart for dashboard summary
function initializeDashboardChart() {
    const ctx = document.getElementById('dashboardChart').getContext('2d');
    
    // Prepare data
    const labels = Object.values(barangayData).map(b => b.name);
    const pwdData = Object.values(barangayData).map(b => b.pwdCount);
    const seniorData = Object.values(barangayData).map(b => b.seniorCount);
    
    // Create chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'PWD Residents',
                    backgroundColor: '#3498db',
                    data: pwdData
                },
                {
                    label: 'Senior Citizens',
                    backgroundColor: '#f39c12',
                    data: seniorData
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Barangays'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Residents'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'PWD and Senior Citizens by Barangay'
                }
            }
        }
    });
}

// Summary stats calculation
function updateSummaryStats() {
    const totalPWD = Object.values(barangayData).reduce((sum, b) => sum + b.pwdCount, 0);
    const totalSeniors = Object.values(barangayData).reduce((sum, b) => sum + b.seniorCount, 0);
    const totalBarangays = Object.keys(barangayData).length;
    
    document.getElementById('totalPWD').textContent = totalPWD;
    document.getElementById('totalSeniors').textContent = totalSeniors;
    document.getElementById('totalBarangays').textContent = totalBarangays;
    document.getElementById('totalPriority').textContent = totalPWD + totalSeniors;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Setup dashboard elements if they exist
    const dashboardEl = document.getElementById('dashboardChart');
    if (dashboardEl) {
        initializeDashboardChart();
    }
    
    // Update summary stats
    updateSummaryStats();
    
    // Initialize table and filters
    populateTable();
    populateFilter();
    setupSearch();
});
        