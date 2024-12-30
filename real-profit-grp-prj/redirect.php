<?php
session_start();

// Include the Composer autoloader for Google API client
require_once __DIR__ . '/vendor/autoload.php';


// Database connection (change credentials as per your database setup)
$servername = "localhost";
$username = "root"; 
$password = "coolguy27122004";     
$dbname = "my_web_db";  

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

use Google\Client;
use Google\Service\Oauth2;


// Init configuration for Google OAuth
$clientID = '';
$clientSecret = '';
$redirectUri = 'http://localhost/real-profit-grp-prj/redirect.php';  // Your redirect URL

// Create Google Client
$client = new Google_Client();
$client->setClientId($clientID);
$client->setClientSecret($clientSecret);
$client->setRedirectUri($redirectUri);
$client->addScope("email");
$client->addScope("profile");

// Check if the OAuth code is returned from Google
if (isset($_GET['code'])) {
    // Get the OAuth token using the code
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    
    // Set the access token for the client
    $client->setAccessToken($token['access_token']);
    
    // Create Google OAuth service
    $google_oauth = new Google\Service\Oauth2($client);
    
    // Fetch user profile information
    $google_account_info = $google_oauth->userinfo->get();
    $email = $google_account_info->email;
    $name = $google_account_info->name;

    // Check if the user exists in the database
    $sql = "SELECT user_id FROM account WHERE email = '$email'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        // User exists, log them in
        $row = $result->fetch_assoc();
        $_SESSION['user_id'] = $row['user_id'];
        $_SESSION['user_email'] = $email;
        $_SESSION['user_name'] = $name;

        // Redirect to dashboard or other authenticated page
        header('Location: index.html');
        exit();
    } else {
        // User does not exist, create a new user record (with empty or random password)
        $password = '';  // No password provided by Google, set an empty or random password
        $password_hashed = password_hash($password, PASSWORD_DEFAULT);  // Hash the password

        // Insert new user into the database
        $stmt = $conn->prepare("INSERT INTO account (name, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $email, $password_hashed);
        $stmt->execute();

        // Set session variables for the user
        $_SESSION['user_email'] = $email;
        $_SESSION['user_name'] = $name;
        $_SESSION['user_id'] = $conn->insert_id; // Get the new user's ID

        // Redirect to dashboard or other authenticated page
        header('Location: index.html');
        exit();
    }
} else {
    // Redirect to Google OAuth if no code is found
    header('Location: ' . $client->createAuthUrl());
    exit();
}
?>
