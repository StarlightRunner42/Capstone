document.addEventListener('DOMContentLoaded', function() {
    // Data structure with purok names
    const barangayData = {
        '1': {name: "Barangay 1", puroks: ["Kamagong", "Narra", "Ipil-Ipil", "Akasya", "Flying-E"] },
        '2': {name: "Barangay 2", puroks: ["Gomez", "Katipunan", "Kahilwayan", "Sool Uno", "Sool Dos"] },
        '3': { name: "Barangay 3", puroks: ["Paghida.et A", "Paghida.et B", "Ilimnan", "Guintipunan", "Mahigugmaon"] },
        '4': { name: "Barangay 4", puroks: ["Antilla Subd", "Gomez Extension", "Bonifacio Extension", "Mckinley Bukid", "Zulueta Bukid"] },
        '5': { name: "Barangay 5", puroks: ["Elina subd", "Portuna", "St francis", "Carmilla paste 3", "Villa carmen"] },
        'mambulac': {name: "Barangay Mambulac", puroks: ["Paghidaet", "Antoni Luna", "Swimming Pool", "Boulevard", "Barra"] },
        'guinhalaran': {  name: "Barangay Guinhalaran", puroks: ["Katilingban", "Sawmill", "Paghidait", "Mangingisda", "Baybayon"] },
        'elopez': { name: "Barangay E-Lopez", puroks: ["Sunshine", "Sunrise", "Sunset", "Sampaguita", "Newsite"] },
        'bagtic': { name: "Barangay Bagtic", puroks: ["Proper", "New site", "Bactic uno", "Kalbaryo", "Defuigo"] },
        'balaring': { name: "Barangay Balaring", puroks: ["Camunsilan", "Proper", "Bungol", "Hda Balaring", "Pasil"] },
        'hawaiian': { name: "Barangay Hawaiian", puroks: ["Colisap", "Phison", "balas", "Lunot", "Sandiego"] },
        'patag': { name: "Barangay Patag", puroks: ["Mahigugmaon", "Malipayun", "Mainabyanon", "Marka"] },
        'kaptRamon': { name: "Barangay Kapt. Ramon", puroks: ["Hda.Adoracion", "Hda.Boac", "Hda.Progreso", "Hda.Banita jarra", "Hda.Violata"] },
        'guimbalaon': { name: "Barangay Guimbalaon", puroks: ["Proper", "New Site", "Bactic Uno", "Kalbaryo", "Defuigo"] },
        'rizal': { name: "Barangay Rizal", puroks: ["Matagoy", "Paradise", "Kalubihan", "Baryo Rizal", "Hda Makina"] },
        'lantad': { name: "Barangay Lantad", puroks: ["Mapisanon", "Nami nami", "Bay-bay", "Paraiso", "Mainuswagon"] }
    };
    
    // DOM elements
    const barangayFilter = document.getElementById('barangay-filter');
    const purokFilter = document.getElementById('purok-filter');
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('search-btn');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    // Update purok options based on selected barangay
    barangayFilter.addEventListener('change', function() {
        const selectedBarangay = this.value;
        
        // Clear current options
        purokFilter.innerHTML = '<option value="all">All Puroks</option>';
        
        // If a specific barangay is selected, populate puroks
        if (selectedBarangay !== 'all' && barangayData[selectedBarangay]) {
            barangayData[selectedBarangay].puroks.forEach(purok => {
                const option = document.createElement('option');
                option.value = purok.toLowerCase().replace(/\s+/g, '-');
                option.textContent = purok;
                purokFilter.appendChild(option);
            });
        }
        
        filterSeniors();
    });
    
    // Filter seniors based on selections
    function filterSeniors() {
        const selectedBarangay = barangayFilter.value;
        const selectedPurok = purokFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        const barangaySections = document.querySelectorAll('.barangay-section');
        
        barangaySections.forEach(section => {
            // Barangay filtering
            if (selectedBarangay !== 'all' && section.id !== `barangay-${selectedBarangay}`) {
                section.style.display = 'none';
                return;
            } else {
                section.style.display = 'block';
            }
            
            // Purok filtering
            const purokSections = section.querySelectorAll('.purok-section');
            let hasVisiblePuroks = false;
            
            purokSections.forEach(purokSection => {
                const purokId = purokSection.id.split('-').slice(2).join('-');
                const purokName = purokSection.querySelector('.purok-header').textContent.replace('Purok ', '');
                const normalizedPurokName = purokName.toLowerCase().replace(/\s+/g, '-');
                
                // Check if this purok matches the filter
                if (selectedPurok === 'all' || normalizedPurokName === selectedPurok) {
                    purokSection.style.display = 'block';
                    hasVisiblePuroks = true;
                    
                    // Search filtering
                    if (searchTerm) {
                        const rows = purokSection.querySelectorAll('tbody tr');
                        let hasVisibleRows = false;
                        
                        rows.forEach(row => {
                            const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                            if (name.includes(searchTerm)) {
                                row.style.display = '';
                                hasVisibleRows = true;
                            } else {
                                row.style.display = 'none';
                            }
                        });
                        
                        // Hide purok section if no rows match search
                        purokSection.style.display = hasVisibleRows ? 'block' : 'none';
                        hasVisiblePuroks = hasVisiblePuroks || hasVisibleRows;
                    } else {
                        // Show all rows if no search term
                        const rows = purokSection.querySelectorAll('tbody tr');
                        rows.forEach(row => row.style.display = '');
                    }
                } else {
                    purokSection.style.display = 'none';
                }
            });
            
            // Hide barangay if no visible puroks
            section.style.display = hasVisiblePuroks ? 'block' : 'none';
        });
    }
    
    // Event listeners
    purokFilter.addEventListener('change', filterSeniors);
    searchBtn.addEventListener('click', filterSeniors);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') filterSeniors();
    });
    
    // Pagination (simplified)
    let currentPage = 1;
    nextPageBtn.addEventListener('click', function() {
        currentPage++;
        alert('Next page clicked. This would load page ' + currentPage);
    });
    
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            alert('Previous page clicked. This would load page ' + currentPage);
        }
    });
    
    // Initial filter
    filterSeniors();
});