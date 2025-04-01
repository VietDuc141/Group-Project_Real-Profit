<?php
session_start();

// Check if the user is authenticated (adjust this as needed)
if (!isset($_SESSION['user_id'])) {
    die("❌ You must be logged in to change your password.");
}

$host = 'localhost';
$user = 'root';
$password = '';
$database = 'my_web_db';

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the posted password values
    $newPassword = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirmPassword'] ?? '';

    // Validate if passwords match
    if ($newPassword !== $confirmPassword) {
        die("❌ Passwords do not match. Please try again.");
    }

    // Validate password strength (minimum length, etc.)
    if (strlen($newPassword) < 8) {
        die("❌ Password must be at least 8 characters long.");
    }

    // Hash the new password (important for security)
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

    // Get the current user's ID from the session
    $userId = $_SESSION['user_id'];

    // Prepare the SQL statement to update the password
    $sql = "UPDATE account SET password = ? WHERE user_id = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        // Bind parameters and execute
        $stmt->bind_param('si', $hashedPassword, $userId);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            // Password changed successfully, redirect to login page
            header("Location: loginbox.html");
            exit();
        } else {
            echo "❌ Failed to update password. Please try again later.";
        }

        $stmt->close();
    } else {
        echo "Error preparing SQL statement: " . $conn->error;
    }
}

$conn->close();
?>
