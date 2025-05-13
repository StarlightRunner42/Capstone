document.addEventListener('DOMContentLoaded', function() {
  // Get the employment status dropdown
  const employmentStatus = document.getElementById('employment_status');
  // Get the category and type groups
  const categoryGroup = document.getElementById('categoryGroup');
  const typeGroup = document.getElementById('typeGroup');

  // Add event listener for changes in employment status
  employmentStatus.addEventListener('change', function() {
      if (this.value === 'Employee') {
          // Show both category and type fields for employees
          categoryGroup.style.display = 'block';
          typeGroup.style.display = 'block';
      } else {
          // Hide both fields for unemployed or self-employed
          categoryGroup.style.display = 'none';
          typeGroup.style.display = 'none';
          
          // Optional: Clear the values when hidden
          document.getElementById('employment_category').value = '';
          document.getElementById('employment_type').value = '';
      }
  });

  // Trigger the change event once in case there's a default value
  employmentStatus.dispatchEvent(new Event('change'));
});

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
  
  // Uncomment for senior age validation (60+)
  /*
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
  */
  return true;
}

// Purok dropdown population
// const puroks = {
//   "1": ["Kamagong", "Narra", "Ipil-Ipil", "Akasya", "Flying-E"],
//   "2": ["Gomez", "Katipunan", "Kahilwayan", "Sool Uno", "Sool Dos"],
//   "3": ["Paghida.et A", "Paghida.et B", "Ilimnan", "Guintipunan", "Mahigugmaon"],
//   "4": ["Antilla Subd", "Gomez Extension", "Bonifacio Extension", "Mckinley Bukid", "Zulueta Bukid"],
//   "5": ["Elina subd", "Portuna", "St francis", "Carmilla paste 3", "Villa carmen"],
//   "6": ["Paghidaet", "Antoni Luna", "Swimming Pool", "Boulevard", "Barra"],
//   "7": ["Katilingban", "Sawmill", "Paghidait", "Mangingisda", "Baybayon"],
//   "8": ["Sunshine", "Sunrise", "Sunset", "Sampaguita", "Newsite"],
//   "9": ["Proper", "New site", "Bactic uno", "Kalbaryo", "Defuigo"],
//   "10": ["Camunsilan", "Proper", "Bungol", "Hda Balaring", "Pasil"],
//   "11": ["Colisap", "Phison", "balas", "Lunot", "Sandiego"],
//   "12": ["Mahigugmaon", "Malipayun", "Mainabyanon", "Marka"],
//   "13": ["Hda.Adoracion", "Hda.Boac", "Hda.Progreso", "Hda.Banita jarra", "Hda.Violata"],
//   "14": ["Kalinti", "Kadipota", "Yuta"],
//   "15": ["Mapisanon", "Nami-nami", "Bay-bay"], // Changed to be unique from barangay 14
//   "16": ["Mapisanon", "Nami nami", "Bay-bay", "Paraiso", "Mainuswagon"]
// };

// function updatePurokOptions() {
//   const barangay = document.getElementById('barangay').value;
//   const purokSelect = document.getElementById('purok');
  
//   // Clear existing options
//   purokSelect.innerHTML = '<option value="" disabled selected>Select Purok</option>';

//   if (puroks[barangay]) {
//       puroks[barangay].forEach(purok => {
//           const option = document.createElement('option');
//           option.value = purok;
//           option.textContent = purok;
//           purokSelect.appendChild(option);
//       });
//   }
// }

// Form validation function
function validateCurrentStep(currentStep) {
  let isValid = true;
  const currentFieldset = document.getElementsByTagName('fieldset')[currentStep];
  const requiredInputs = currentFieldset.querySelectorAll('[required]');
  
  // Validate required fields
  requiredInputs.forEach(input => {
      if (!input.value.trim()) {
          input.style.borderColor = 'red';
          isValid = false;
          
          // Scroll to first invalid field
          if (!isValid) {
              input.scrollIntoView({ behavior: 'smooth', block: 'center' });
              isValid = false; // Ensure we don't override this
          }
      } else {
          input.style.borderColor = '';
      }
  });
  
  // Special validation for contact information step
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
  
  // Email validation for first step
  if (currentStep === 0) {
      const emailInput = document.getElementById('email');
      if (emailInput && emailInput.value.trim() && !validateEmail(emailInput.value.trim())) {
          emailInput.style.borderColor = 'red';
          isValid = false;
      }
  }
  
  if (!isValid) {
      Swal.fire({
          title: "Validation Error",
          text: "Please complete all required fields before proceeding.",
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
  const civilStatus = document.getElementById("civil_status").value;
  const spouseGroup = document.getElementById("spouseGroup");
  spouseGroup.style.display = civilStatus === "Married" ? "block" : "none";
}

let currentTab = 0;

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
    
    if (n == x.length) {
      document.getElementById("nextBtn").innerHTML = "Submit";
      document.getElementById("nextBtn").setAttribute("type", "submit");
    } else {
      document.getElementById("nextBtn").innerHTML = "Next";
      document.getElementById("nextBtn").setAttribute("type", "button");
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
    document.getElementById("housingForm").submit();
    return false;
  }
  
  showTab(currentTab);
}


function fixStepIndicator(n) {
  const steps = document.getElementsByClassName("step");
  for (let i = 0; i < steps.length; i++) {
      steps[i].classList.remove("active");
  }
  steps[n].classList.add("active");
}

function toggleIncome(selectElement) {
  const formRow = selectElement.closest('.form-row');
  const incomeInput = formRow.querySelector('input[name="childIncome[]"]');
  incomeInput.style.display = selectElement.value === 'working' ? 'block' : 'none';
  if (selectElement.value !== 'working') incomeInput.value = '';
}

// Child information management
document.addEventListener('DOMContentLoaded', function() {
  const childrenContainer = document.getElementById('childrenContainer');
  
  // Add child entry
  document.getElementById('addChild').addEventListener('click', function() {
      const childEntry = childrenContainer.querySelector('.child-entry');
      const newChild = childEntry.cloneNode(true);

      // Clear values
      newChild.querySelectorAll('input').forEach(input => input.value = '');
      newChild.querySelector('select').value = 'not_working';
      newChild.querySelector('.delete-child').style.display = 'inline-block';
      
      childrenContainer.appendChild(newChild);
      attachWorkingStatusListeners();
  });

  // Delete child entry (event delegation)
  childrenContainer.addEventListener('click', function(e) {
      if (e.target.classList.contains('delete-child')) {
          const childEntries = childrenContainer.querySelectorAll('.child-entry');
          if (childEntries.length > 1) {
              e.target.closest('.child-entry').remove();
          }
      }
  });

  // Contact information management
  const contactsContainer = document.getElementById('contactsContainer');
  let contactCounter = document.querySelectorAll('.contact-entry').length;

  // Add contact entry
  document.getElementById('addContact').addEventListener('click', function() {
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
  });

  // Remove contact entry (event delegation)
  contactsContainer.addEventListener('click', function(e) {
      if (e.target.classList.contains('remove-contact')) {
          const contactEntries = contactsContainer.querySelectorAll('.contact-entry');
          if (contactEntries.length > 1) {
              e.target.closest('.contact-entry').remove();
          }
      }
  });

  // Initialize purok options if a barangay is already selected
  if (document.getElementById('barangay').value) {
      updatePurokOptions();
  }
  
  // Initialize working status listeners
  attachWorkingStatusListeners();
  
  // Initialize first tab
  showTab(0);
});

function attachWorkingStatusListeners() {
  document.querySelectorAll('select[name="childWorkingStatus[]"]').forEach(select => {
      select.addEventListener('change', function() {
          toggleIncome(this);
      });
      // Initialize visibility
      toggleIncome(select);
  });
}