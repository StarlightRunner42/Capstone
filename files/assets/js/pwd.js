// Show/hide employment details based on selection
document.getElementById('employment_status').addEventListener('change', function() {
    const employeeDetails = document.getElementById('employeeDetails');
    
    if (this.value === 'Employee') {
      employeeDetails.style.display = 'block';
    } else {
      employeeDetails.style.display = 'none';
      // Clear the values when hidden
      document.getElementById('employment_category').value = '';
      document.getElementById('employment_type').value = '';
    }
  });