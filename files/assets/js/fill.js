document.getElementById("acceptTerms").addEventListener("change", function() {
    // Automatically select "Yes" when the checkbox is checked
    document.getElementById("yesOption").checked = this.checked;
});


function calculateAge() {
    const birthdayInput = document.getElementById('birthday').value;
    const birthday = new Date(birthdayInput);
    const today = new Date();

    
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDifference = today.getMonth() - birthday.getMonth();

    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }

    document.getElementById('age').value = age;
}

// Puroks and HOA names for each Barangay
const puroksAndHOA = {
        1: { 
            puroks: ["Kamagong", "Narra", "Ipil-Ipil", "Akasya", "Flying-E"], 
            hoas: ["Lourdes Hiponia Lamis", "Joshua Hiponia Lamis", "Cheryl Mae Valero Lamis"]
        },
        2: { 
            puroks: ["Gomez", "Katipunan", "Kahilwayan", "Sool Uno", "Sool Dos"], 
            hoas: ["Barangay 2 HOA", "Barangay 2A HOA"]
        },
        3: { 
            puroks: ["Paghida.et A", "Paghida.et B", "Ilimnan", "Guintipunan", "Mahigugmaon"], 
            hoas: ["Barangay 3 HOA"]
        },
        4: { 
            puroks: ["Antilla Subd", "Gomez Extension", "Bonifacio Extension", "Mckinley Bukid", "Zulueta Bukid"], 
            hoas: ["Barangay 4 HOA", "Barangay 4A HOA"]
        },
        5: { 
            puroks: ["Elina subd", "Portuna", "St francis", "Carmilla paste 3", "Villa carmen"], 
            hoas: ["Barangay 5 HOA"]
        },
        6: { 
            puroks: ["Paghidaet", "Antoni Luna", "Swimming Pool", "Boulevard", "Barra"], 
            hoas: ["Barangay Mambulac HOA", "Barangay Mambulac A HOA"]
        },
        7: { 
            puroks: ["Katilingban", "Sawmill", "Paghidait", "Mangingisda", "Baybayon"], 
            hoas: ["Barangay Guinhalaran HOA"]
        },
        8: { 
            puroks: ["Sunshine", "Sunrise", "Sunset", "Sampaguita", "Newsite"], 
            hoas: ["Barangay E-Lopez HOA"]
        },
        9: { 
            puroks: ["Proper", "New site", "Bactic uno", "Kalbaryo", "Defuigo"], 
            hoas: ["Barangay Bagtic HOA", "Barangay Bagtic A HOA"]
        },
        10: { 
            puroks: ["Camunsilan", "Proper", "Bungol", "Hda Balaring", "Pasil"], 
            hoas: ["Barangay Balaring HOA"]
        },
        11: { 
            puroks: ["Colisap", "Phison", "balas", "Lunot", "Sandiego"], 
            hoas: ["Barangay Hawaiian HOA"]
        },
        12: { 
            puroks: ["Mahigugmaon", "Malipayun", "Mainabyanon", "Marka"], 
            hoas: ["Barangay Patag HOA"]
        },
        13: { 
            puroks: ["Hda.Adoracion", "Hda.Boac", "Hda.Progreso", "Hda.Banita jarra", "Hda.Violata"], 
            hoas: ["Barangay Kapt. Ramon HOA"]
        },
        14: { 
            puroks: ["Proper", "New Site", "Bactic Uno", "Kalbaryo", "Defuigo"], 
            hoas: ["Barangay Guimbalaon HOA", "Barangay Guimbalaon A HOA"]
        },
        15: { 
            puroks: ["Matagoy", "Paradise", "Kalubihan", "Baryo Rizal", "Hda Makina"], 
            hoas: ["Barangay Rizal HOA"]
        },
        16: { 
            puroks: ["Mapisanon", "Nami nami", "Bay-bay", "Paraiso", "Mainuswagon"], 
            hoas: ["Barangay Lantad HOA"]
        }
    };

    // Function to update Purok options and HOA name based on selected Barangay
    function updateFormFields() {
        var barangay = document.getElementById("barangay").value; // Get selected barangay
        var purokSelect = document.getElementById("purok"); // Get the purok select element
       
        // Clear existing options
        purokSelect.innerHTML = "<option value='' disabled selected>Select Purok</option>";

        // Check if barangay is selected
        if (barangay && puroksAndHOA[barangay]) {
            // Populate Purok dropdown
            puroksAndHOA[barangay].puroks.forEach(function(purok) {
                var option = document.createElement("option");
                option.value = purok;
                option.textContent = purok;
                purokSelect.appendChild(option);
            });

        }
    }
    
function toggleHouseOwnerFields() {
const houseTitleSelect = document.getElementById('house_title');
const houseOwnerContainer = document.getElementById('houseOwnerContainer');
houseOwnerContainer.style.display = houseTitleSelect.value === 'Yes' ? 'block' : 'none';
}

function toggleLandOwnerFields() {
const landTitleSelect = document.getElementById('land_title');
const landOwnerContainer = document.getElementById('landOwnerContainer');
landOwnerContainer.style.display = landTitleSelect.value === 'Yes' ? 'block' : 'none';
}

// Initialize the visibility of fields based on current selections
document.addEventListener('DOMContentLoaded', () => {
toggleHouseOwnerFields();
toggleLandOwnerFields();
});

// JavaScript to toggle the 'Other' qualification input field
function toggleOtherQualificationInput() {
    const qualification = document.getElementById('qualification').value;
    const otherQualificationRow = document.getElementById('otherQualificationRow');
    if (qualification === 'Other') {
        otherQualificationRow.style.display = 'block';
    } else {
        otherQualificationRow.style.display = 'none';
    }
}



document.addEventListener('DOMContentLoaded', function() {
    const childrenContainer = document.getElementById('childrenContainer');
    const addChildButton = document.getElementById('addChild');
    
    // Add new child entry
    addChildButton.addEventListener('click', function() {
        const childEntry = document.querySelector('.child-entry').cloneNode(true);
        const inputs = childEntry.querySelectorAll('input, select');
        
        // Clear all input values in the cloned entry
        inputs.forEach(input => {
            if (input.type !== 'button') {
                input.value = '';
            }
        });
        
        // Show the delete button for all entries except the first one
        const deleteButtons = childrenContainer.querySelectorAll('.delete-child');
        if (deleteButtons.length > 0) {
            deleteButtons[0].style.display = 'inline-block';
        }
        
        // Show delete button for the new entry
        childEntry.querySelector('.delete-child').style.display = 'inline-block';
        
        childrenContainer.appendChild(childEntry);
    });
    
    // Delete child entry
    childrenContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-child')) {
            const childEntries = childrenContainer.querySelectorAll('.child-entry');
            if (childEntries.length > 1) {
                e.target.closest('.child-entry').remove();
                
                // Hide delete button if only one entry remains
                if (childrenContainer.querySelectorAll('.child-entry').length === 1) {
                    childrenContainer.querySelector('.delete-child').style.display = 'none';
                }
            }
        }
    });
});