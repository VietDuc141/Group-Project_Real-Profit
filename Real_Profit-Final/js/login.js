document.addEventListener("DOMContentLoaded", () => {
    // Fetch the login status from the PHP endpoint
    fetch("session_status.php")
        .then(response => response.json())
        .then(data => {
            const dropdownLog = document.querySelector(".dropdown-log");

            // Clear existing content
            dropdownLog.innerHTML = '';

            if (data.isLoggedIn) {
                // If user is logged in, show Logout button only
                dropdownLog.innerHTML = '<a href="logout.php" class="dropdown-item-log">Logout</a>';
            } else {
                // If user is not logged in, show Login button only
                dropdownLog.innerHTML = '<a href="loginbox.html" class="dropdown-item-log">Login</a>';
            }
        })
        .catch(err => console.error("Error fetching session status:", err));
});