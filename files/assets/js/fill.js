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
      document.getElementById('age').value = '';
      Swal.fire({
        title: "You must be 60 years old or older to register.",
        text: "Please check your date of birth.",
        icon: "Error"
      });
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
      //alert('');
      Swal.fire({
        title: "Please complete all required fields before proceeding.",
        text: "Some fields are Empty.",
        icon: "Error"
      });
  }
  return isValid;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showCheckmark(groupId) {
  document.querySelector(`#${groupId} .checkmark`).style.display = "inline";
}

function toggleSpouseInput() {
  var civilStatus = document.getElementById("civil_status").value;
  var spouseGroup = document.getElementById("spouseGroup");
  if (civilStatus === "Married") {
    spouseGroup.style.display = "block";
  } else {
    spouseGroup.style.display = "none";
  }
}

var currentTab = 0;
showTab(currentTab);

function showTab(n) {
  var x = document.getElementsByTagName("fieldset");
  x[n].style.display = "block";
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == x.length - 1) {
    document.getElementById("nextBtn").innerHTML = "Submit";
    document.getElementById("nextBtn").setAttribute("type", "submit");
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
    document.getElementById("nextBtn").removeAttribute("type");
  }
  fixStepIndicator(n);
}

function nextPrev(n) {
  var x = document.getElementsByTagName("fieldset");
  if (n > 0 && !validateCurrentStep(currentTab)) return false;
  
  x[currentTab].style.display = "none";
  currentTab = currentTab + n;
  if (currentTab >= x.length) {
    document.getElementById("housingForm").submit();
    return false;
  }
  showTab(currentTab);
}

function fixStepIndicator(n) {
  var i,
    x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  x[n].className += " active";
}

// Function to toggle income input visibility
function toggleIncome(selectElement) {
  const formRow = selectElement.closest('.form-row');
  const incomeInput = formRow.querySelector('input[name="childIncome[]"]');
  if (selectElement.value === 'working') {
      incomeInput.style.display = 'block';
  } else {
      incomeInput.style.display = 'none';
      incomeInput.value = ''; // clear value if hidden
  }
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

function attachWorkingStatusListeners() {
  document.querySelectorAll('select[name="childWorkingStatus[]"]').forEach(select => {
    select.addEventListener('change', function() {
      toggleIncome(this);
    });
    
    // Initialize visibility based on current value
    toggleIncome(select);
  });
}