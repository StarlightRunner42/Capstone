// Age calculation with validation
function calculateAge() {
  const birthdayInput = document.getElementById('birthday').value;
  if (!birthdayInput) return false;
  
  const birthday = new Date(birthdayInput);
  const today = new Date();
  
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDifference = today.getMonth() - birthday.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthday.getDate())) {
      age--;
  }

  const ageInput = document.getElementById('age');
  ageInput.value = age;
  
  // Validate senior age (60+)
  if (age < 60) {
      ageInput.style.borderColor = 'red';
      alert('You must be at least 60 years old to register as a senior.');
      return false;
  } else {
      ageInput.style.borderColor = '';
      return true;
  }
}

// Purok dropdown population
const puroks = {
  "1": ["Kamagong", "Narra", "Ipil-Ipil", "Akasya", "Flying-E"],
  "2": ["Gomez", "Katipunan", "Kahilwayan", "Sool Uno", "Sool Dos"],
  "3": ["Paghida.et A", "Paghida.et B", "Ilimnan", "Guintipunan", "Mahigugmaon"],
  "4": ["Antilla Subd", "Gomez Extension", "Bonifacio Extension", "Mckinley Bukid", "Zulueta Bukid"],
  "5": ["Elina subd", "Portuna", "St francis", "Carmilla paste 3", "Villa carmen"],
  "6": ["Paghidaet", "Antoni Luna", "Swimming Pool", "Boulevard", "Barra"],
  "7": ["Katilingban", "Sawmill", "Paghidait", "Mangingisda", "Baybayon"],
  "8": ["Sunshine", "Sunrise", "Sunset", "Sampaguita", "Newsite"],
  "9": ["Proper", "New site", "Bactic uno", "Kalbaryo", "Defuigo"],
  "10": ["Camunsilan", "Proper", "Bungol", "Hda Balaring", "Pasil"],
  "11": ["Colisap", "Phison", "balas", "Lunot", "Sandiego"],
  "12": ["Mahigugmaon", "Malipayun", "Mainabyanon", "Marka"],
  "13": ["Hda.Adoracion", "Hda.Boac", "Hda.Progreso", "Hda.Banita jarra", "Hda.Violata"],
  "14": ["kalinti", "kadipota", "yuta"],
  "15": ["kalinti", "kadipota", "yuta"],
  "16": ["Mapisanon", "Nami nami", "Bay-bay", "Paraiso", "Mainuswagon"]
};

function updatePurokOptions() {
  const barangay = document.getElementById('barangay').value;
  const purokSelect = document.getElementById('purok');
  
  purokSelect.innerHTML = '<option value="" disabled selected>Select Purok</option>';

  if (puroks[barangay]) {
      puroks[barangay].forEach(purok => {
          const option = document.createElement('option');
          option.value = purok;
          option.textContent = purok;
          purokSelect.appendChild(option);
      });
  }
}

// Form validation function
function validateCurrentStep(currentStep) {
  let isValid = true;
  const currentFieldset = document.getElementsByTagName('fieldset')[currentStep];
  const requiredInputs = currentFieldset.querySelectorAll('[required]');
  
  // Check all required fields in current step
  requiredInputs.forEach(input => {
      if (!input.value.trim()) {
          input.style.borderColor = 'red';
          isValid = false;
          
          // Scroll to the first invalid field
          if (isValid === false) {
              input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
      } else {
          input.style.borderColor = '';
      }
  });
  
  // Special validation for contact information
  if (currentStep === 1) {
      const contactEntries = document.querySelectorAll('.contact-entry');
      contactEntries.forEach(entry => {
          const contactType = entry.querySelector('.contact-type').value;
          const name = entry.querySelector('input[name$="[name]"]').value;
          const relationship = entry.querySelector('input[name$="[relationship]"]').value;
          const phone = entry.querySelector('input[name$="[phone]"]').value;
          
          if (!name || !relationship || !phone) {
              isValid = false;
              entry.style.border = '1px solid red';
          } else {
              entry.style.border = '';
          }
      });
  }
  
  // Validate email format if email field exists
  if (currentStep === 0) {
      const emailInput = document.getElementById('email');
      if (emailInput && !validateEmail(emailInput.value.trim())) {
          emailInput.style.borderColor = 'red';
          isValid = false;
      }
  }
  
  if (!isValid) {
      alert('Please complete all required fields before proceeding.');
  }
  
  return isValid;
}

// Email validation helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Form navigation with validation
var currentTab = 0;
showTab(currentTab);

function showTab(n) {
  const x = document.getElementsByTagName('fieldset');
  x[n].style.display = 'block';
  
  // Update button visibility
  document.getElementById('prevBtn').style.display = n === 0 ? 'none' : 'inline';
  document.getElementById('nextBtn').innerHTML = n === x.length - 1 ? 'Submit' : 'Next';
  
  // Update progress steps
  fixStepIndicator(n);
}

function nextPrev(n) {
  const x = document.getElementsByTagName('fieldset');
  
  // Validate before proceeding forward
  if (n === 1 && !validateCurrentStep(currentTab)) {
      return false;
  }
  
  x[currentTab].style.display = 'none';
  currentTab = currentTab + n;
  
  if (currentTab >= x.length) {
      document.getElementById('housingForm').submit();
      return false;
  }
  
  showTab(currentTab);
}

function fixStepIndicator(n) {
  const steps = document.getElementsByClassName('step');
  for (let i = 0; i < steps.length; i++) {
      steps[i].classList.remove('active');
  }
  steps[n].classList.add('active');
}

// Child information management
document.addEventListener('DOMContentLoaded', function() {
  const childrenContainer = document.getElementById('childrenContainer');
  
  // Add new child entry
  document.getElementById('addChild').addEventListener('click', function() {
    const childEntry = childrenContainer.querySelector('.child-entry');
    const newChild = childEntry.cloneNode(true);

    // Clear input values
    newChild.querySelectorAll('input').forEach(input => {
      input.value = '';
    });
    newChild.querySelector('select').value = 'not_working';
    
    // Show delete button for new entry
    newChild.querySelector('.delete-child').style.display = 'inline-block';
    
    childrenContainer.appendChild(newChild);
    
    // Attach event listeners to new elements
    attachWorkingStatusListeners();
  });

  // Delete child entry
  childrenContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-child')) {
      const childEntries = childrenContainer.querySelectorAll('.child-entry');
      if (childEntries.length > 1) {
        e.target.closest('.child-entry').remove();
      }
    }
  });

  // Initialize listeners for existing elements
  attachWorkingStatusListeners();
});

// Contact information management
document.addEventListener('DOMContentLoaded', function() {
  const contactsContainer = document.getElementById('contactsContainer');
  const addContactButton = document.getElementById('addContact');
  let contactCounter = 1;

  addContactButton.addEventListener('click', function() {
      contactCounter++;
      const newContact = document.createElement('div');
      newContact.className = 'contact-entry';
      newContact.dataset.contactId = contactCounter;
      
      newContact.innerHTML = `
          <div class="form-row">
              <div class="form-group">
                  <label>Contact Type</label>
                  <select class="contact-type" name="contacts[${contactCounter}][type]" required>
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="emergency">Emergency</option>
                  </select>
              </div>
              <div class="form-group">
                  <label>Full Name</label>
                  <input type="text" name="contacts[${contactCounter}][name]" required>
              </div>
          </div>
          
          <div class="form-row">
              <div class="form-group">
                  <label>Relationship</label>
                  <input type="text" name="contacts[${contactCounter}][relationship]" required>
              </div>
              <div class="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="contacts[${contactCounter}][phone]" required>
              </div>
          </div>
          
          <div class="form-row">
              <div class="form-group">
                  <label>Email Address</label>
                  <input type="email" name="contacts[${contactCounter}][email]">
              </div>
              <div class="form-group">
                  <button type="button" class="remove-contact">Remove</button>
              </div>
          </div>
      `;
      
      contactsContainer.appendChild(newContact);
      
      newContact.querySelector('.remove-contact').addEventListener('click', function() {
          contactsContainer.removeChild(newContact);
      });
  });
});

// Spouse input toggle
function toggleSpouseInput() {
  const civilStatus = document.getElementById('civil_status').value;
  const spouseGroup = document.getElementById('spouseGroup');
  spouseGroup.style.display = civilStatus === 'Married' ? 'block' : 'none';
  
  // Validate spouse name if married
  if (civilStatus === 'Married') {
      const spouseName = document.getElementById('spouse_name');
      if (!spouseName.value.trim()) {
          spouseName.style.borderColor = 'red';
          return false;
      }
  }
  return true;
}

// Working status toggle for children
function toggleIncome(selectElement) {
  const formRow = selectElement.closest('.form-row');
  const incomeInput = formRow.querySelector('input[name="childIncome[]"]');
  
  // Make sure we found the income input
  if (!incomeInput) return;
  
  if (selectElement.value === 'working') {
    incomeInput.style.display = 'block';
    incomeInput.setAttribute('required', 'required');
  } else {
    incomeInput.style.display = 'none';
    incomeInput.removeAttribute('required');
    incomeInput.value = ''; // clear value if hidden
  }
}


function attachWorkingStatusListeners() {
  document.querySelectorAll('select[name="childWorkingStatus[]"]').forEach(select => {
    select.addEventListener('change', function() {
      toggleIncome(this);
    });
    
    // Initialize visibility based on current value
    toggleIncome(select);
  });
}



// Initialize purok options if a barangay is already selected
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('barangay').value) {
      updatePurokOptions();
  }
  
  // Add real-time validation for fields
  const requiredInputs = document.querySelectorAll('[required]');
  requiredInputs.forEach(input => {
      input.addEventListener('input', function() {
          if (this.value.trim()) {
              this.style.borderColor = '';
          }
      });
      
      input.addEventListener('blur', function() {
          if (!this.value.trim() && this.hasAttribute('required')) {
              this.style.borderColor = 'red';
          }
      });
  });
}); 