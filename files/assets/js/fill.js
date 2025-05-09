// Age calculation with validation
function calculateAge() {
  const birthdayInput = document.getElementById('birthday').value;
  if (!birthdayInput) return false;
  
  const birthday = new Date(birthdayInput);
  if (isNaN(birthday.getTime())) {
    Swal.fire({
      title: "Invalid date",
      text: "Please enter a valid date of birth",
      icon: "error"
    });
    return false;
  }
  
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
      icon: "error"
    });
    return false;
  } else {
    ageInput.style.borderColor = '';
    return true;
  }
}

// Purok dropdown population
const puroks = {
  "Barangay 1": ["Kamagong", "Narra", "Ipil-Ipil", "Akasya", "Flying-E"],
  "Barangay 2": ["Gomez", "Katipunan", "Kahilwayan", "Sool Uno", "Sool Dos"],
  "Barangay 3": ["Paghida.et A", "Paghida.et B", "Ilimnan", "Guintipunan", "Mahigugmaon"],
  "Barangay 4": ["Antilla Subd", "Gomez Extension", "Bonifacio Extension", "Mckinley Bukid", "Zulueta Bukid"],
  "Barangay 5": ["Elina subd", "Portuna", "St francis", "Carmilla paste 3", "Villa carmen"],
  "Barangay Mambulac": ["Paghidaet", "Antoni Luna", "Swimming Pool", "Boulevard", "Barra"],
  "Barangay Guinhalaran": ["Katilingban", "Sawmill", "Paghidait", "Mangingisda", "Baybayon"],
  "Barangay E-Lopez": ["Sunshine", "Sunrise", "Sunset", "Sampaguita", "Newsite"],
  "Barangay Bagtic": ["Proper", "New site", "Bactic uno", "Kalbaryo", "Defuigo"],
  "Barangay Balaring": ["Camunsilan", "Proper", "Bungol", "Hda Balaring", "Pasil"],
  "Barangay Hawaiian": ["Colisap", "Phison", "balas", "Lunot", "Sandiego"],
  "Barangay Patag": ["Mahigugmaon", "Malipayun", "Mainabyanon", "Marka"],
  "Barangay Kapt.ramon": ["Hda.Adoracion", "Hda.Boac", "Hda.Progreso", "Hda.Banita jarra", "Hda.Violata"],
  "Barangay Guimbalao": ["kalinti", "kadipota", "yuta"],
  "Barangay Rizal": ["kalinti", "kadipota", "yuta"],
  "Barangay Lantad": ["Mapisanon", "Nami nami", "Bay-bay", "Paraiso", "Mainuswagon"]
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
  
  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = 'red';
      isValid = false;
      
      if (isValid === false) {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      input.style.borderColor = '';
    }
  });
  
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
  
  if (currentStep === 0) {
    const emailInput = document.getElementById('email');
    if (emailInput && !validateEmail(emailInput.value.trim())) {
      emailInput.style.borderColor = 'red';
      isValid = false;
    }
  }
  
  if (!isValid) {
    Swal.fire({
      title: "Please complete all required fields before proceeding.",
      text: "Some fields are Empty.",
      icon: "error"
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

function showTab(n) {
  var x = document.getElementsByTagName("fieldset");
  for (var i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  
  x[n].style.display = "block";
  
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  
  fixStepIndicator(n);
}

function nextPrev(n) {
  var x = document.getElementsByTagName("fieldset");
  
  if (n > 0 && !validateCurrentStep(currentTab)) {
    return false;
  }
  
  x[currentTab].style.display = "none";
  currentTab = currentTab + n;
  
  if (currentTab >= x.length) {
    // Instead of directly submitting, we'll handle it with AJAX
    submitForm();
    return false;
  }
  
  showTab(currentTab);
}

function fixStepIndicator(n) {
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  x[n].className += " active";
}

function toggleIncome(selectElement) {
  const formRow = selectElement.closest('.form-row');
  const incomeInput = formRow.querySelector('input[name="childIncome[]"]');
  if (selectElement.value === 'working') {
    incomeInput.style.display = 'block';
  } else {
    incomeInput.style.display = 'none';
    incomeInput.value = '';
  }
}

// Child information management
document.addEventListener('DOMContentLoaded', function() {
  const childrenContainer = document.getElementById('childrenContainer');
  
  document.getElementById('addChild').addEventListener('click', function() {
    const childEntry = childrenContainer.querySelector('.child-entry');
    const newChild = childEntry.cloneNode(true);

    newChild.querySelectorAll('input').forEach(input => {
      input.value = '';
    });
    newChild.querySelector('select').value = 'not_working';
    newChild.querySelector('.delete-child').style.display = 'inline-block';
    
    childrenContainer.appendChild(newChild);
    attachWorkingStatusListeners();
  });

  childrenContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-child')) {
      const childEntries = childrenContainer.querySelectorAll('.child-entry');
      if (childEntries.length > 1) {
        e.target.closest('.child-entry').remove();
      }
    }
  });

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
  
  // Initialize first tab
  showTab(0);
});

function attachWorkingStatusListeners() {
  document.querySelectorAll('select[name="childWorkingStatus[]"]').forEach(select => {
    select.addEventListener('change', function() {
      toggleIncome(this);
    });
    toggleIncome(select);
  });
}

// Form submission with AJAX and SweetAlert
function submitForm() {
  const form = document.getElementById('housingForm');
  const formData = new FormData(form);
  
  // Show loading indicator
  Swal.fire({
    title: 'Processing...',
    text: 'Please wait while we save your information',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  // Disable submit button to prevent multiple submissions
  const submitButton = document.querySelector('#nextBtn');
  submitButton.disabled = true;

  fetch(form.action, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => Promise.reject(err));
    }
    return response.json();
  })
  .then(data => {
    Swal.fire({
      title: 'Success!',
      text: data.message || 'Senior citizen record created successfully',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      // Optionally redirect or reset form
      // window.location.href = '/success-page';
      // form.reset();
    });
  })
  .catch(error => {
    console.error('Error:', error);
    Swal.fire({
      title: 'Error!',
      text: error.message || 'An error occurred while saving the data',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  })
  .finally(() => {
    submitButton.disabled = false;
  });
}