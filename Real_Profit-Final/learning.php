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
    echo json_encode(['status' => 'error', 'message' => 'Failed to connect to the database:' . $conn->connect_error]);
    exit;
}

// Get user_id from session
$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
if (!$user_id) {
    echo json_encode(['status' => 'error', 'message' => 'Please sign in']);
    exit;
}

// Execute request getting completed_lessons
if (isset($_GET['action']) && $_GET['action'] === 'get_completed_lessons') {
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
    echo json_encode(['status' => 'success', 'completed_lessons' => $completed_lessons]);
    $conn->close();
    exit;
}

// Execute request getting overall_progress
if (isset($_GET['action']) && $_GET['action'] === 'get_overall_progress') {
    $sql = "SELECT overall_progress FROM user_progress WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->bind_result($overall_progress);
    $stmt->fetch();
    $stmt->close();
    echo json_encode(['overall_progress' => $overall_progress ?? 0]);
    $conn->close();
    exit;
}

// Get data from payload
$json = file_get_contents('php://input');
error_log("Payload nhận được: " . $json);
$data = json_decode($json, true);

if (!$data || !isset($data['progress']) || !isset($data['lesson_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Dữ liệu không hợp lệ']);
    exit;
}

$progress = $data['progress'];
$lesson_id = $data['lesson_id'];

// Check if progress is number
if (!is_numeric($progress)) {
    echo json_encode(['status' => 'error', 'message' => 'Progress must be number']);
    exit;
}

// Save progress
$check_sql = "SELECT COUNT(*) FROM lessons_history WHERE user_id = ? AND lesson_id = ?";
$check_stmt = $conn->prepare($check_sql);
if (!$check_stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Prepare check thất bại: ' . $conn->error]);
    exit;
}
$check_stmt->bind_param("ii", $user_id, $lesson_id);
$check_stmt->execute();
$check_stmt->bind_result($count);
$check_stmt->fetch();
$check_stmt->close();

if ($count > 0) {
    $sql = "UPDATE lessons_history SET progress = ?, completed_at = NOW() WHERE user_id = ? AND lesson_id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Prepare update thất bại: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("dii", $progress, $user_id, $lesson_id);
} else {
    $sql = "INSERT INTO lessons_history (user_id, lesson_id, progress, completed_at) VALUES (?, ?, ?, NOW())";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Prepare insert thất bại: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("iid", $user_id, $lesson_id, $progress);
}

if (!$stmt->execute()) {
    echo json_encode(['status' => 'error', 'message' => 'Execute thất bại: ' . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Compute overall_progress
$total_lessons = 11;
$completed_sql = "SELECT COUNT(*) FROM lessons_history WHERE user_id = ? AND progress = 100";
$completed_stmt = $conn->prepare($completed_sql);
$completed_stmt->bind_param("i", $user_id);
$completed_stmt->execute();
$completed_stmt->bind_result($completed_count);
$completed_stmt->fetch();
$completed_stmt->close();

$overall_progress = ($completed_count / $total_lessons) * 100;

// Save overall_progress to TABLE user_progress
$progress_sql = "INSERT INTO user_progress (user_id, overall_progress, updated_at) VALUES (?, ?, NOW()) 
                 ON DUPLICATE KEY UPDATE overall_progress = ?, updated_at = NOW()";
$progress_stmt = $conn->prepare($progress_sql);
$progress_stmt->bind_param("idd", $user_id, $overall_progress, $overall_progress);
if ($progress_stmt->execute()) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Tiến độ đã được lưu',
        'overall_progress' => $overall_progress
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Lưu tiến độ tổng thể thất bại: ' . $progress_stmt->error]);
}

$progress_stmt->close();
$conn->close();
?>