     // Role selection functionality
     document.querySelectorAll('.role-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            document.querySelectorAll('.role-option').forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update hidden input value
            document.getElementById('selected-role').value = this.dataset.role;
        });
    });

    // Capitalize username first letter
    document.getElementById('username').addEventListener('input', function() {
        this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
    });

    // Password strength indicator
    document.getElementById('password').addEventListener('input', function() {
        const password = this.value;
        const strength = document.querySelector('.password-strength');
        const requirements = document.querySelectorAll('.requirement i');
        
        // Check requirements
        const hasLength = password.length >= 8;
        const hasCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        requirements[0].className = hasLength ? 'fas fa-check' : 'fas fa-circle';
        requirements[1].className = hasCase ? 'fas fa-check' : 'fas fa-circle';
        requirements[2].className = hasNumber ? 'fas fa-check' : 'fas fa-circle';
        
        let strengthValue = 0;
        if (hasLength) strengthValue += 33;
        if (hasCase) strengthValue += 33;
        if (hasNumber) strengthValue += 34;
        
        strength.style.width = `${strengthValue}%`;
        strength.style.background = 
            strengthValue <= 33 ? '#ff4444' :
            strengthValue <= 66 ? '#ffa700' : '#00C851';
    });

    // Alert messages
    var alertMessage = "<?php echo $alertMessage; ?>";
    if (alertMessage === "password_mismatch") {
        Swal.fire({
            icon: 'error',
            title: 'Passwords Do Not Match',
            text: 'Please ensure both passwords are identical.',
            confirmButtonColor: '#2962ff'
        });
    } else if (alertMessage === "email_exists") {
        Swal.fire({
            icon: 'warning',
            title: 'Email Already Registered',
            text: 'Please use a different email address or login to your existing account.',
            confirmButtonColor: '#2962ff'
        });
    } else if (alertMessage === "registration_success") {
        Swal.fire({
            icon: 'success',
            title: 'Welcome Aboard!',
            text: 'Your account has been created successfully.',
            showConfirmButton: true,
            confirmButtonColor: '#2962ff'
        }).then(() => {
            window.location = 'page_login.php';
        });
    } else if (alertMessage === "registration_error") {
        Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'An error occurred during registration. Please try again.',
            confirmButtonColor: '#2962ff'
        });
    }