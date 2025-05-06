

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

function updatePurokOptions() {
    const barangay = document.getElementById('barangay').value;
    const purokSelect = document.getElementById('purok');
    
    // Clear existing options
    purokSelect.innerHTML = '<option value="" disabled selected>Select Purok</option>';

    // Check if the selected barangay exists in our puroks object
    if (puroks[barangay]) {
        // Add each purok as an option
        puroks[barangay].forEach(purok => {
            const option = document.createElement('option');
            option.value = purok;
            option.textContent = purok;
            purokSelect.appendChild(option);
        });
    }
}

// Initialize purok options if a barangay is already selected (useful if page reloads)
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('barangay').value) {
        updatePurokOptions();
    }
});

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
    

function showPreview(inputId, previewId) {
    var input = document.getElementById(inputId);
    var preview = document.getElementById(previewId);
  
    // Ensure a file was selected
    if (input.files && input.files[0]) {
      var file = input.files[0];
  
      // Check if the file is an image
      if (file.type.match("image.*")) {
        var reader = new FileReader();
  
        // When the file is loaded, set it as the image source
        reader.onload = function (e) {
          preview.src = e.target.result;
          preview.style.display = "block"; // Make the image visible
        };
  
        reader.readAsDataURL(file); // Read the file as a Data URL
      } else {
        alert("Please upload a valid image file (e.g., .jpg, .png).");
        input.value = ""; // Reset the file input if not an image
      }
    }
  }
  
  function showTab(n) {
    // Function to display a specific tab of the form
    let x = document.getElementsByTagName("fieldset");
    x[n].style.display = "block";
  }
  
  function nextPrev(n) {
    // Function to navigate through the steps of the form
    let x = document.getElementsByTagName("fieldset");
    x[0].style.display = "none";
    x[1].style.display = "none";
    x[2].style.display = "none";
    x[3].style.display = "none";
  
    if (n === 1) {
      x[currentTab].style.display = "block";
    }
  }
  
  function toggleSpouseInput() {
    // Function to show/hide spouse name input based on civil status
    let civilStatus = document.getElementById("civil_status").value;
    let spouseGroup = document.getElementById("spouseGroup");
    spouseGroup.style.display = civilStatus === "Married" ? "block" : "none";
  }
  
  function showCheckmark(groupId) {
    // Function to show checkmark when a file is selected
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
  
  function showCheckmark(groupId) {
    var group = document.getElementById(groupId);
    group.classList.add("checked");
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

  function validateForm() {
    var valid = true;
    var currentFields = document.getElementsByTagName("fieldset")[currentTab].querySelectorAll("input, select, textarea");

    currentFields.forEach(function(field) {
        if (field.hasAttribute("required") && !field.value.trim()) {
            field.classList.add("invalid"); 
            valid = false;
        } else {
            field.classList.remove("invalid");
        }
    });

    return valid;
}
  
  function nextPrev(n) {
    var x = document.getElementsByTagName("fieldset");

    if (n === 1 && !validateForm()) {
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

// Attach change listener to existing and future select elements
function attachWorkingStatusListener(container) {
  const selects = container.querySelectorAll('select[name="childWorkingStatus[]"]');
  selects.forEach(select => {
      select.addEventListener('change', function() {
          toggleIncome(this);
      });
  });
}

// Initial setup for existing elements
document.addEventListener('DOMContentLoaded', function() {
  const childrenContainer = document.getElementById('childrenContainer');
  attachWorkingStatusListener(childrenContainer);

  // Add new child entry
  document.getElementById('addChild').addEventListener('click', function() {
      const childEntry = childrenContainer.querySelector('.child-entry');
      const newChild = childEntry.cloneNode(true);

      // Clear input values
      newChild.querySelectorAll('input').forEach(input => {
          input.value = '';
          input.style.display = (input.name === 'childIncome[]') ? 'none' : 'block'; // hide income by default
      });
      newChild.querySelector('select').value = '';
      newChild.querySelector('.delete-child').style.display = 'inline-block';

      childrenContainer.appendChild(newChild);
      attachWorkingStatusListener(newChild);
  });

  // Delete child entry
  childrenContainer.addEventListener('click', function(e) {
      if (e.target.classList.contains('delete-child')) {
          e.target.closest('.child-entry').remove();
      }
  });
});




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
      
      // Add event listener to the new remove button
      newContact.querySelector('.remove-contact').addEventListener('click', function() {
          contactsContainer.removeChild(newContact);
      });
  });
  
  // Add event listeners to existing remove buttons (if any)
  document.querySelectorAll('.remove-contact').forEach(button => {
      button.addEventListener('click', function() {
          if (!button.disabled) {
              const contactEntry = button.closest('.contact-entry');
              contactsContainer.removeChild(contactEntry);
          }
      });
  });
});
