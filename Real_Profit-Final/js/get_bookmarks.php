<?php
// get_bookmarks.php
session_start();

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "my_web_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the logged-in user's ID
$user_id = $_SESSION['user_id'];

// Fetch bookmarked news
$sql = "SELECT n.news_id, n.title, n.description, n.url, n.image, n.published_at, n.source
        FROM news n
        INNER JOIN bookmarks b ON n.news_id = b.news_id
        WHERE b.user_id = $user_id";

$result = $conn->query($sql);

$bookmarkedNews = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $bookmarkedNews[] = $row;
    }
}

$conn->close();

// Return bookmarked news as JSON
header('Content-Type: application/json');
echo json_encode($bookmarkedNews);?>