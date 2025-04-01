<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Start session
session_start();

// Connect database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "my_web_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to connect to the database']);
    exit;
}

// Get user_id from session
$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
if (!$user_id) {
    echo json_encode(['status' => 'error', 'message' => 'Please sign in']);
    $conn->close();
    exit;
}

// Get lesson_id from query string
$lesson_id = isset($_GET['lesson_id']) ? (int)$_GET['lesson_id'] : null;
if (!$lesson_id) {
    echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy lesson_id']);
    $conn->close();
    exit;
}

// Get completed_lessons
$sql = "SELECT lesson_id FROM lessons_history WHERE user_id = ? AND progress = 100";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$completed_lessons = [];
while ($row = $result->fetch_assoc()) {
    $completed_lessons[] = (int)$row['lesson_id'];
}
$stmt->close();

error_log("User ID: $user_id, Lesson ID: $lesson_id, Completed Lessons: " . json_encode($completed_lessons));

// Check accessibility to lesson
$can_access = true;
for ($i = 1; $i < $lesson_id; $i++) {
    if (!in_array($i, $completed_lessons)) {
        $can_access = false;
        break;
    }
}

error_log("Can Access Lesson $lesson_id: " . ($can_access ? 'true' : 'false'));

// Return result
if ($can_access) {
    echo json_encode(['status' => 'success', 'message' => 'Có quyền truy cập']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Bạn chưa hoàn thành các bài học trước đó']);
}

$conn->close();
?>