<?php
session_start();
header(header: 'Content-Type: application/json');

// Check if the user is logged in
echo json_encode(value: ['isLoggedIn' => isset($_SESSION['user_id'])]);
?>
