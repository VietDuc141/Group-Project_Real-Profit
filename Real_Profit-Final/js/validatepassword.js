// validatePassword.js

function validatePassword() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return false; // Prevent form submission if passwords do not match
    }

    return true; // Allow form submission if passwords match
}
