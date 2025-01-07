<?php
// Include PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Load Composer autoloader

// Database connection (update with your database details)
$servername = "localhost";
$username = "root";
$password = "coolguy27122004";
$dbname = "my_web_db";

// Create a connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check for database connection errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];

    // Check if the email exists in the database
    $sql = "SELECT * FROM account WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Email exists, generate a token
        $token = bin2hex(string: random_bytes(length: 16));  // Generate a random token

        // Update the token in the database
        $user = $result->fetch_assoc();
        $user_id = $user['user_id']; 

        // Insert token into the password_reset_tokens table
        $sql = "INSERT INTO password_reset_tokens (user_id, token) 
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE 
        token = VALUES(token)";

        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('is', $user_id, $token);
        $stmt->execute();

        // Send reset email with the token link
        sendPasswordResetEmail($email, $token);

        echo 'Password reset link has been sent to your email.';
    } else {
        echo 'No user found with that email address.';
    }
}

// Function to send password reset email
function sendPasswordResetEmail($email, $token) {
    $reset_token = $token;

    // PHPMailer setup
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';  // Set the SMTP server
        $mail->SMTPAuth = true;
        $mail->Username = 'realprofit.web@gmail.com';  // Your email address
        $mail->Password = 'wcdj gwvp ykcd wobr';  // Your email password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('realprofit.web@gmail.com', 'Real Profit');
        $mail->addAddress($email);  // User's email address

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Password Reset Request';
        $mail->Body    = 'Token to reset yout password<br>';
        $mail->Body   .=  $reset_token;

        // Send the email
        $mail->send();

        
        header("Location: verify_token.html");
        exit;
        
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
 
?>
