<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer files
require 'vendor/autoload.php'; // Use this if you installed PHPMailer using Composer
// Alternatively, include PHPMailer manually if not using Composer
// require 'path/to/PHPMailer/src/Exception.php';
// require 'path/to/PHPMailer/src/PHPMailer.php';
// require 'path/to/PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email address.";
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // SMTP server configuration
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Replace with your email provider's SMTP host
        $mail->SMTPAuth = true;
        $mail->Username = 'realprofit.web@gmail.com'; // Your email address
        $mail->Password = 'wcdj gwvp ykcd wobr'; // Your email password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Email details
        $mail->setFrom($email, $name); // User's email as the sender
        $mail->addAddress('realprofit.web@gmail.com', 'Real Profit Web'); // Your recipient email
        $mail->Subject = $subject;
        $mail->isHTML(true);
        $mail->Body = "
            <h3>New Contact Request</h3>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Subject:</strong> $subject</p>
            <p><strong>Message:</strong><br>$message</p>
        ";

        // Send email
        $mail->send();
        echo "Message sent successfully!";
    } catch (Exception $e) {
        http_response_code(500);
        echo " Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    http_response_code(405);
    echo "Invalid request.";
}
?>
