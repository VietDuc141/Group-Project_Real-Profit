<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html"); // If not logged in, redirect to login page
    exit();
}

// Get user details from session
$user_id = $_SESSION['user_id'];
$email = $_SESSION['email'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account</title>
</head>
<body>
    <h2>Welcome, <?php echo htmlspecialchars($email); ?>!</h2>
    <p>This is your account page.</p>
    
    <!-- Log out button -->
    <a href="logout.php">Log out</a>
</body>
</html>
