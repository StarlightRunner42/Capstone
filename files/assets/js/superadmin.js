 // JavaScript for the application
 document.addEventListener('DOMContentLoaded', function() {
    // Data storage (in a real app, this would be server-side)
    let barangays = JSON.parse(localStorage.getItem('barangays')) || [];
    let puroks = JSON.parse(localStorage.getItem('puroks')) || [];
    
    // DOM elements
    const notification = document.getElementById('notification');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Barangay form elements
    const barangayForm = document.getElementById('barangayForm');
    const barangayNameInput = document.getElementById('barangayName');
    const barangayDescInput = document.getElementById('barangayDescription');
    
    // Purok form elements
    const purokForm = document.getElementById('purokForm');
    const purokBarangaySelect = document.getElementById('purokBarangay');
    const purokNameInput = document.getElementById('purokName');
    const purokLeaderInput = document.getElementById('purokLeader');
    const purokContactInput = document.getElementById('purokContact');
    
    // Table elements
    const barangayTableBody = document.querySelector('#barangayTable tbody');
    const purokTableBody = document.querySelector('#purokTable tbody');
    
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
            
            // If viewing data, refresh tables
            if (tab.getAttribute('data-tab') === 'view') {
                renderBarangayTable();
                renderPurokTable();
            }
        });
    });
    
    // Barangay form submission
    barangayForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newBarangay = {
            id: Date.now(), // Simple ID generation
            name: barangayNameInput.value.trim(),
            description: barangayDescInput.value.trim(),
            dateCreated: new Date().toLocaleString()
        };
        
        // Check if barangay already exists
        const exists = barangays.some(b => b.name.toLowerCase() === newBarangay.name.toLowerCase());
        
        if (exists) {
            showNotification('Barangay already exists!', 'error');
            return;
        }
        
        barangays.push(newBarangay);
        saveData();
        showNotification('Barangay added successfully!', 'success');
        barangayForm.reset();
        populatePurokBarangaySelect();
    });
    
    // Purok form submission
    purokForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const selectedBarangay = barangays.find(b => b.id == purokBarangaySelect.value);
        
        const newPurok = {
            id: Date.now(), // Simple ID generation
            barangayId: parseInt(purokBarangaySelect.value),
            barangayName: selectedBarangay ? selectedBarangay.name : '',
            name: purokNameInput.value.trim(),
            leader: purokLeaderInput.value.trim(),
            contact: purokContactInput.value.trim(),
            dateCreated: new Date().toLocaleString()
        };
        
        // Check if purok already exists in this barangay
        const exists = puroks.some(p => 
            p.barangayId === newPurok.barangayId && 
            p.name.toLowerCase() === newPurok.name.toLowerCase()
        );
        
        if (exists) {
            showNotification('Purok already exists in this barangay!', 'error');
            return;
        }
        
        puroks.push(newPurok);
        saveData();
        showNotification('Purok added successfully!', 'success');
        purokForm.reset();
    });
    
    // Populate barangay dropdown for purok form
    function populatePurokBarangaySelect() {
        purokBarangaySelect.innerHTML = '<option value="">Select Barangay</option>';
        
        barangays.forEach(barangay => {
            const option = document.createElement('option');
            option.value = barangay.id;
            option.textContent = barangay.name;
            purokBarangaySelect.appendChild(option);
        });
    }
    
    // Render barangay table
    function renderBarangayTable() {
        barangayTableBody.innerHTML = '';
        
        if (barangays.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" style="text-align: center;">No barangays found</td>';
            barangayTableBody.appendChild(row);
            return;
        }
        
        barangays.forEach(barangay => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${barangay.id}</td>
                <td>${barangay.name}</td>
                <td>${barangay.description || '-'}</td>
                <td>${barangay.dateCreated}</td>
                <td class="action-btns">
                    <button class="btn-edit" data-id="${barangay.id}">Edit</button>
                    <button class="btn-delete btn-secondary" data-id="${barangay.id}">Delete</button>
                </td>
            `;
            barangayTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editBarangay(id);
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteBarangay(id);
            });
        });
    }
    
    // Render purok table
    function renderPurokTable() {
        purokTableBody.innerHTML = '';
        
        if (puroks.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="7" style="text-align: center;">No puroks found</td>';
            purokTableBody.appendChild(row);
            return;
        }
        
        puroks.forEach(purok => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${purok.id}</td>
                <td>${purok.name}</td>
                <td>${purok.barangayName}</td>
                <td>${purok.leader || '-'}</td>
                <td>${purok.contact || '-'}</td>
                <td>${purok.dateCreated}</td>
                <td class="action-btns">
                    <button class="btn-edit" data-id="${purok.id}">Edit</button>
                    <button class="btn-delete btn-secondary" data-id="${purok.id}">Delete</button>
                </td>
            `;
            purokTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editPurok(id);
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deletePurok(id);
            });
        });
    }
    
    // Edit barangay
    function editBarangay(id) {
        const barangay = barangays.find(b => b.id === id);
        if (!barangay) return;
        
        // Switch to barangay tab
        document.querySelector('.tab[data-tab="barangay"]').click();
        
        // Fill form with barangay data
        barangayNameInput.value = barangay.name;
        barangayDescInput.value = barangay.description || '';
        
        // Change form to update mode
        barangayForm.dataset.editId = id;
        barangayForm.querySelector('button').textContent = 'Update Barangay';
        
        // Change form submit handler temporarily
        barangayForm.onsubmit = function(e) {
            e.preventDefault();
            
            barangay.name = barangayNameInput.value.trim();
            barangay.description = barangayDescInput.value.trim();
            
            saveData();
            showNotification('Barangay updated successfully!', 'success');
            
            // Reset form
            barangayForm.reset();
            delete barangayForm.dataset.editId;
            barangayForm.querySelector('button').textContent = 'Save Barangay';
            barangayForm.onsubmit = barangayFormDefaultHandler;
            
            // Refresh purok barangay select
            populatePurokBarangaySelect();
        };
    }
    
    // Edit purok
    function editPurok(id) {
        const purok = puroks.find(p => p.id === id);
        if (!purok) return;
        
        // Switch to purok tab
        document.querySelector('.tab[data-tab="purok"]').click();
        
        // Fill form with purok data
        purokBarangaySelect.value = purok.barangayId;
        purokNameInput.value = purok.name;
        purokLeaderInput.value = purok.leader || '';
        purokContactInput.value = purok.contact || '';
        
        // Change form to update mode
        purokForm.dataset.editId = id;
        purokForm.querySelector('button').textContent = 'Update Purok';
        
        // Change form submit handler temporarily
        purokForm.onsubmit = function(e) {
            e.preventDefault();
            
            const selectedBarangay = barangays.find(b => b.id == purokBarangaySelect.value);
            
            purok.barangayId = parseInt(purokBarangaySelect.value);
            purok.barangayName = selectedBarangay ? selectedBarangay.name : '';
            purok.name = purokNameInput.value.trim();
            purok.leader = purokLeaderInput.value.trim();
            purok.contact = purokContactInput.value.trim();
            
            saveData();
            showNotification('Purok updated successfully!', 'success');
            
            // Reset form
            purokForm.reset();
            delete purokForm.dataset.editId;
            purokForm.querySelector('button').textContent = 'Save Purok';
            purokForm.onsubmit = purokFormDefaultHandler;
        };
    }
    
    // Delete barangay
    function deleteBarangay(id) {
        if (confirm('Are you sure you want to delete this barangay? All associated puroks will also be deleted.')) {
            // Delete barangay
            barangays = barangays.filter(b => b.id !== id);
            
            // Delete associated puroks
            puroks = puroks.filter(p => p.barangayId !== id);
            
            saveData();
            showNotification('Barangay and associated puroks deleted successfully!', 'success');
            
            // Refresh tables
            renderBarangayTable();
            renderPurokTable();
            
            // Refresh purok barangay select
            populatePurokBarangaySelect();
        }
    }
    
    // Delete purok
    function deletePurok(id) {
        if (confirm('Are you sure you want to delete this purok?')) {
            puroks = puroks.filter(p => p.id !== id);
            saveData();
            showNotification('Purok deleted successfully!', 'success');
            renderPurokTable();
        }
    }
    
    // Save data to localStorage
    function saveData() {
        localStorage.setItem('barangays', JSON.stringify(barangays));
        localStorage.setItem('puroks', JSON.stringify(puroks));
    }
    
    // Show notification
    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = 'notification ' + type;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
    
    // Store default form handlers
    const barangayFormDefaultHandler = barangayForm.onsubmit;
    const purokFormDefaultHandler = purokForm.onsubmit;
    
    // Initialize the app
    populatePurokBarangaySelect();
});