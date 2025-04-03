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

        var alertMessage = "<?php echo $alertMessage; ?>";
        if (alertMessage === "success") {
            Swal.fire({
                icon: 'success',
                title: 'Welcome Back!',
                text: 'Login successful',
                showConfirmButton: false,
                timer: 2000,
                customClass: {
                    popup: 'animated fadeInDown'
                }
            }).then(() => {
                const role = document.getElementById('selected-role').value;
                if (role === "admin") {
                    window.location.href = 'admin_dashboard.php';
                } else if (role === "staff") {
                    window.location.href = 'staff_dashboard.php';
                } else {
                    window.location.href = 'home_page.php';
                }
            });
        } else if (alertMessage === "error") {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'Invalid email or password. Please try again.',
                confirmButtonColor: '#2962ff'
            });
        }