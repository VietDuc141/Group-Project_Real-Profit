<?php
session_start();
header(header: 'Content-Type: application/json');

// Check the login status
$isLoggedIn = isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);

// Return JSON
echo json_encode(['isLoggedIn' => $isLoggedIn]);
?>