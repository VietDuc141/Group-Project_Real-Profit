<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Start session
session_start();

// Destroy session
session_unset(); // Remove all session variables
session_destroy(); // Destroy the session

// Return JSON
echo json_encode(['status' => 'success', 'message' => 'Đăng xuất thành công']);
exit();
?>