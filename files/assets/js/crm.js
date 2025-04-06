 // Updated data structure with PWD and Senior Citizens
 const purok = {
    1: { 
        name: "Barangay 1",
        purok: ["Kamagong", "Narra", "Ipil-Ipil", "Akasya", "Flying-E"], 
      
    },
    2: { 
        name: "Barangay 2",
        purok: ["Gomez", "Katipunan", "Kahilwayan", "Sool Uno", "Sool Dos"], 
    
    },
    3: { 
        name: "Barangay 3",
        purok: ["Paghida.et A", "Paghida.et B", "Ilimnan", "Guintipunan", "Mahigugmaon"], 
        
    },
    4: { 
        name: "Barangay 4",
        purok: ["Antilla Subd", "Gomez Extension", "Bonifacio Extension", "Mckinley Bukid", "Zulueta Bukid"], 
       
    },
    5: { 
        name: "Barangay 5",
        purok: ["Elina subd", "Portuna", "St francis", "Carmilla paste 3", "Villa carmen"], 
       
    },
    6: { 
        name: "Barangay Mambulac",
        purok: ["Paghidaet", "Antoni Luna", "Swimming Pool", "Boulevard", "Barra"], 
    
    },
    7: { 
        name: "Barangay Guinhalaran",
        purok: ["Katilingban", "Sawmill", "Paghidait", "Mangingisda", "Baybayon"], 
        
    },
    8: { 
        name: "Barangay E-Lopez",
        purok: ["Sunshine", "Sunrise", "Sunset", "Sampaguita", "Newsite"], 
        
    },
    9: { 
        name: "Barangay Bagtic",
        purok: ["Proper", "New site", "Bactic uno", "Kalbaryo", "Defuigo"], 
        
    },
    10: { 
        name: "Barangay Balaring",
        purok: ["Camunsilan", "Proper", "Bungol", "Hda Balaring", "Pasil"], 
        
    },
    11: { 
        name: "Barangay Hawaiian",
        purok: ["Colisap", "Phison", "balas", "Lunot", "Sandiego"], 
        
    },
    12: { 
        name: "Barangay Patag",
        purok: ["Mahigugmaon", "Malipayun", "Mainabyanon", "Marka"], 
        
    },
    13: { 
        name: "Barangay Kapt. Ramon",
        purok: ["Hda.Adoracion", "Hda.Boac", "Hda.Progreso", "Hda.Banita jarra", "Hda.Violata"], 
        
    },
    14: { 
        name: "Barangay Guimbalaon",
        purok: ["Proper", "New Site", "Bactic Uno", "Kalbaryo", "Defuigo"], 
        
    },
    15: { 
        name: "Barangay Rizal",
        purok: ["Matagoy", "Paradise", "Kalubihan", "Baryo Rizal", "Hda Makina"], 
        
    },
    16: { 
        name: "Barangay Lantad",
        purok: ["Mapisanon", "Nami nami", "Bay-bay", "Paraiso", "Mainuswagon"], 
       
    }
};

// Function to update Purok options based on selected Barangay
function updateFormFields() {
    var barangay = document.getElementById("barangay").value; // Get selected barangay
    var purokSelect = document.getElementById("purok"); // Get the purok select element
    
    // Clear existing options
    purokSelect.innerHTML = "<option value='' disabled selected>Select Purok</option>";

    // Check if barangay is selected and exists in our data
    if (barangay && purok[barangay]) {
        // Populate Purok dropdown
        purok[barangay].purok.forEach(function(purokName) {
            var option = document.createElement("option");
            option.value = purokName;
            option.textContent = purokName;
            purokSelect.appendChild(option);
        });
    }
}

        // Function to calculate age based on birthdate
        function calculateAge() {
            const birthdateInput = document.getElementById('birthdate');
            const ageInput = document.getElementById('age');
            
            if (birthdateInput.value) {
                const birthdate = new Date(birthdateInput.value);
                const today = new Date();
                
                let age = today.getFullYear() - birthdate.getFullYear();
                const monthDiff = today.getMonth() - birthdate.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
                    age--;
                }
                
                ageInput.value = age;
                
                // Auto check Senior Citizen if age is 60 or above
                const seniorCheckbox = document.getElementById('senior');
                if (age >= 60) {
                    seniorCheckbox.checked = true;
                    toggleSeniorSection();
                } else if (seniorCheckbox.checked && age < 60) {
                    seniorCheckbox.checked = false;
                    toggleSeniorSection();
                }
            }
        }

    

        // Function to toggle PWD specific section
        function togglePWDSection() {
            const pwdCheckbox = document.getElementById('pwd');
            const pwdSection = document.getElementById('pwdSection');
            
            if (pwdCheckbox.checked) {
                pwdSection.style.display = 'block';
            } else {
                pwdSection.style.display = 'none';
            }
        }

        // Function to toggle Senior Citizen specific section
        function toggleSeniorSection() {
            const seniorCheckbox = document.getElementById('senior');
            const seniorSection = document.getElementById('seniorSection');
            
            if (seniorCheckbox.checked) {
                seniorSection.style.display = 'block';
            } else {
                seniorSection.style.display = 'none';
            }
        }

        // Function to handle next step
        function nextStep(currentStep) {
            // Validate current step first
            if (!validateStep(currentStep)) {
                return false;
            }
            
            // Hide current step
            document.getElementById(`step${currentStep}`).classList.remove('active');
            // Show next step
            document.getElementById(`step${currentStep + 1}`).classList.add('active');
            
            // Update progress bar and active step
            updateProgress(currentStep + 1);
            
            // If moving to review step, populate review fields
            if (currentStep === 4) {
                populateReview();
            }
            
            // Scroll to top of the form
            window.scrollTo({
                top: document.querySelector('.form-container').offsetTop,
                behavior: 'smooth'
            });
            
            return true;
        }

        // Function to handle previous step
        function prevStep(currentStep) {
            // Hide current step
            document.getElementById(`step${currentStep}`).classList.remove('active');
            // Show previous step
            document.getElementById(`step${currentStep - 1}`).classList.add('active');
            
            // Update progress bar and active step
            updateProgress(currentStep - 1);
            
            // Scroll to top of the form
            window.scrollTo({
                top: document.querySelector('.form-container').offsetTop,
                behavior: 'smooth'
            });
            
            return true;
        }

        // Function to update progress bar
        function updateProgress(step) {
            // Update progress bar width
            const progressBar = document.getElementById('progressBar');
            const progressPercentage = ((step - 1) / 4) * 100;
            progressBar.style.width = `${progressPercentage}%`;
            
            // Update active step indicator
            const steps = document.querySelectorAll('.step');
            steps.forEach(stepElement => {
                const stepNumber = parseInt(stepElement.getAttribute('data-step'));
                if (stepNumber <= step) {
                    stepElement.classList.add('active');
                } else {
                    stepElement.classList.remove('active');
                }
            });
        }

        // Function to validate each step
        function validateStep(step) {
            let isValid = true;
            
            switch(step) {
                case 1:
                    // Validate Personal Information
                    const requiredFields1 = ['firstName', 'lastName', 'birthdate', 'barangay', 'purok'];
                    requiredFields1.forEach(field => {
                        const input = document.getElementById(field);
                        if (!input.value.trim()) {
                            markInvalid(input);
                            isValid = false;
                        } else {
                            markValid(input);
                        }
                    });
                    
                    // Validate gender selection
                    const genderSelected = document.getElementById('male').checked || document.getElementById('female').checked;
                    if (!genderSelected) {
                        alert('Please select a gender.');
                        isValid = false;
                    }
                    break;
                    
                case 2:
                    // Contact Information (optional fields, no validation needed)
                    isValid = true;
                    break;
                    
                case 3:
                    // Special Categories (conditional validation)
                    if (document.getElementById('pwd').checked) {
                        // Only validate disability type if PWD is checked
                        const disabilityType = document.getElementById('disabilityType');
                        if (!disabilityType.value) {
                            markInvalid(disabilityType);
                            isValid = false;
                        } else {
                            markValid(disabilityType);
                        }
                    }
                    
                    if (document.getElementById('senior').checked) {
                        // Only validate living arrangement if Senior is checked
                        const livingArrangement = document.getElementById('livingArrangement');
                        if (!livingArrangement.value) {
                            markInvalid(livingArrangement);
                            isValid = false;
                        } else {
                            markValid(livingArrangement);
                        }
                        
                        // Validate pensioner status
                        const pensionerSelected = document.getElementById('pensionerYes').checked || 
                                                document.getElementById('pensionerNo').checked;
                        if (!pensionerSelected) {
                            alert('Please select a pensioner status.');
                            isValid = false;
                        }
                    }
                    break;
                    
                case 4:
                    // Medical Information (optional fields, no validation needed)
                    isValid = true;
                    break;
            }
            
            return isValid;
        }

        // Function to mark field as invalid
        function markInvalid(element) {
            element.classList.add('is-invalid');
            element.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.classList.remove('is-invalid');
                }
            }, { once: true });
        }

        // Function to mark field as valid
        function markValid(element) {
            element.classList.remove('is-invalid');
        }

        // Function to update the review section
function updateReview() {
    // Personal Information
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const middleName = document.getElementById('middleName').value;
    const fullName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;
    document.getElementById('review-fullName').textContent = fullName;
    document.getElementById('hiddenFirstName').value = firstName;
    document.getElementById('hiddenLastName').value = lastName;
    document.getElementById('hiddenMiddleName').value = middleName;
    
    const birthdate = document.getElementById('birthdate').value;
    document.getElementById('review-birthdate').textContent = birthdate || '-';
    document.getElementById('hiddenBirthdate').value = birthdate;
    
    const age = document.getElementById('age').value;
    document.getElementById('review-age').textContent = age || '-';
    document.getElementById('hiddenAge').value = age;
    
    const gender = document.querySelector('input[name="gender"]:checked');
    const genderValue = gender ? gender.value : '';
    document.getElementById('review-gender').textContent = genderValue ? genderValue.charAt(0).toUpperCase() + genderValue.slice(1) : '-';
    document.getElementById('hiddenGender').value = genderValue;
    
    const barangay = document.getElementById('barangay');
    const barangayText = barangay.options[barangay.selectedIndex].text;
    document.getElementById('review-barangay').textContent = barangayText || '-';
    document.getElementById('hiddenBarangay').value = barangayText;
    
    const purok = document.getElementById('purok');
    const purokText = purok.options[purok.selectedIndex].text;
    document.getElementById('review-purok').textContent = purokText || '-';
    document.getElementById('hiddenPurok').value = purokText;
    
    // Contact Information
    const contactNumber = document.getElementById('contactNumber').value;
    document.getElementById('review-contactNumber').textContent = contactNumber || '-';
    document.getElementById('hiddenContactNumber').value = contactNumber;
    
    const email = document.getElementById('email').value;
    document.getElementById('review-email').textContent = email || '-';
    document.getElementById('hiddenEmail').value = email;
    
    const emergencyContact = document.getElementById('emergencyContact').value;
    document.getElementById('review-emergencyContact').textContent = emergencyContact || '-';
    document.getElementById('hiddenEmergencyContact').value = emergencyContact;
    
    const emergencyContactName = document.getElementById('emergencyContactName').value;
    document.getElementById('review-emergencyContactName').textContent = emergencyContactName || '-';
    document.getElementById('hiddenEmergencyContactName').value = emergencyContactName;
    
    const relationship = document.getElementById('relationship').value;
    document.getElementById('review-relationship').textContent = relationship || '-';
    document.getElementById('hiddenRelationship').value = relationship;
    
    // Special Categories
    const statusCheckboxes = document.querySelectorAll('input[name="status"]:checked');
    const statusValues = Array.from(statusCheckboxes).map(cb => {
        switch(cb.value) {
            case 'pwd': return 'Person with Disability (PWD)';
            case 'senior': return 'Senior Citizen';
            case 'indigent': return 'Both PWD & Senior';
            default: return cb.value;
        }
    });
    const statusText = statusValues.join(', ') || 'None';
    document.getElementById('review-status').textContent = statusText;
    document.getElementById('hiddenStatus').value = statusText;
    
    // Show/hide PWD section based on checkbox
    const pwdSection = document.getElementById('pwdReviewDetails');
    if (document.getElementById('pwd').checked || document.getElementById('indigent').checked) {
        pwdSection.style.display = 'block';
        
        const pwdIdNumber = document.getElementById('pwdIdNumber').value;
        document.getElementById('review-pwdIdNumber').textContent = pwdIdNumber || '-';
        document.getElementById('hiddenPwdIdNumber').value = pwdIdNumber;
        
        const disabilityType = document.getElementById('disabilityType');
        const disabilityTypeText = disabilityType.options[disabilityType.selectedIndex].text;
        document.getElementById('review-disabilityType').textContent = disabilityTypeText || '-';
        document.getElementById('hiddenDisabilityType').value = disabilityTypeText;
        
        const accommodationNeeds = document.getElementById('accommodationNeeds').value;
        document.getElementById('review-accommodationNeeds').textContent = accommodationNeeds || '-';
        document.getElementById('hiddenAccommodationNeeds').value = accommodationNeeds;
    } else {
        pwdSection.style.display = 'none';
    }
    
    // Show/hide Senior section based on checkbox
    const seniorSection = document.getElementById('seniorReviewDetails');
    if (document.getElementById('senior').checked || document.getElementById('indigent').checked) {
        seniorSection.style.display = 'block';
        
        const seniorIdNumber = document.getElementById('seniorIdNumber').value;
        document.getElementById('review-seniorIdNumber').textContent = seniorIdNumber || '-';
        document.getElementById('hiddenSeniorIdNumber').value = seniorIdNumber;
        
        const pensioner = document.querySelector('input[name="pensioner"]:checked');
        const pensionerValue = pensioner ? pensioner.value : '';
        document.getElementById('review-pensioner').textContent = pensionerValue ? 
            (pensionerValue === 'yes' ? 'Receiving Pension' : 'Not Receiving Pension') : '-';
        document.getElementById('hiddenPensioner').value = pensionerValue;
        
        const livingArrangement = document.getElementById('livingArrangement');
        const livingArrangementText = livingArrangement.options[livingArrangement.selectedIndex].text;
        document.getElementById('review-livingArrangement').textContent = livingArrangementText || '-';
        document.getElementById('hiddenLivingArrangement').value = livingArrangementText;
    } else {
        seniorSection.style.display = 'none';
    }
    
    // Medical Information
    const disease = document.getElementById('disease').value;
    document.getElementById('review-disease').textContent = disease || '-';
    document.getElementById('hiddenDisease').value = disease;
    
    const healthInsurance = document.getElementById('healthInsurance').value;
    document.getElementById('review-healthInsurance').textContent = healthInsurance || '-';
    document.getElementById('hiddenHealthInsurance').value = healthInsurance;
    
    const bloodType = document.getElementById('bloodType');
    const bloodTypeText = bloodType.options[bloodType.selectedIndex].text;
    document.getElementById('review-bloodType').textContent = bloodTypeText || '-';
    document.getElementById('hiddenBloodType').value = bloodTypeText;
    
    const medications = document.getElementById('medications').value;
    document.getElementById('review-medications').textContent = medications || '-';
    document.getElementById('hiddenMedications').value = medications;
    
    // Enable/disable submit button based on consent
    document.getElementById('submitButton').disabled = !document.getElementById('consent').checked;
}

        // Helper function to format date
        function formatDate(dateString) {
            if (!dateString) return '-';
            
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }

        // Event listener for consent checkbox
        document.getElementById('consent').addEventListener('change', function() {
            document.getElementById('submitButton').disabled = !this.checked;
        });

        // Event listener for form submission
        document.getElementById('registrationForm').addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show loading state
            const submitButton = document.getElementById('submitButton');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual submission logic)
            setTimeout(function() {
                // Replace with actual form submission code
                alert('Registration submitted successfully!');
                
                // Reset form
                document.getElementById('registrationForm').reset();
                
                // Go back to first step
                const steps = document.querySelectorAll('.form-step');
                steps.forEach(step => step.classList.remove('active'));
                document.getElementById('step1').classList.add('active');
                updateProgress(1);
                
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Hide conditional sections
                document.getElementById('pwdSection').style.display = 'none';
                document.getElementById('seniorSection').style.display = 'none';
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 2000);
        });

        // Initialize the form on page load
        document.addEventListener('DOMContentLoaded', function() {
            // Hide conditional sections initially
            document.getElementById('pwdSection').style.display = 'none';
            document.getElementById('seniorSection').style.display = 'none';
            document.getElementById('review-pwd-section').style.display = 'none';
            document.getElementById('review-senior-section').style.display = 'none';
            
            // Set up event listeners for radio buttons and checkboxes
            document.getElementById('pwd').addEventListener('change', togglePWDSection);
            document.getElementById('senior').addEventListener('change', toggleSeniorSection);
            
            // Additional validation for mobile number and emergency contact fields
            const phoneInputs = document.querySelectorAll('input[type="tel"]');
            phoneInputs.forEach(input => {
                input.addEventListener('input', function() {
                    // Allow only numbers and limit to 11 digits for Philippine mobile numbers
                    this.value = this.value.replace(/[^0-9]/g, '').substring(0, 11);
                });
            });
        });
