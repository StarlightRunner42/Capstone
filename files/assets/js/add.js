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
  
  function nextPrev(n) {
    var x = document.getElementsByTagName("fieldset");
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


