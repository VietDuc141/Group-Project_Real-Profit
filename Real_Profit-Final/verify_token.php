<?php
// Database Connection
$host = 'localhost'; // Your database host
$user = 'root'; // Your database username
$password = ''; // Your database password
$database = 'my_web_db'; // Your database name

// Establish the connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Verify Token
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['token'])) {
    $token = trim($_POST['token']); // Remove extra whitespace
    echo "Token received: " . htmlspecialchars($token) . "<br>";

    // Prepare the SQL query
    $sql = "SELECT user_id FROM password_reset_tokens WHERE token = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param('s', $token); // Bind the token parameter
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $user_id = $row['user_id'];

            // Token is valid
            echo "✅ Token is valid for user ID: " . htmlspecialchars($user_id);
            header("Location: changepass.html");
            exit();
            
        } else {
            echo "❌ Token is invalid or not found.";
        }

        $stmt->close();
    } else {
        echo "Error preparing SQL statement: " . $conn->error;
    }
} else {
    echo "❌ Token is missing.";
}

// Close the database connection
$conn->close();
?>
