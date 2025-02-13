<?php

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "my_web_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: ". $conn->connect_error);
}

// Get news ID from AJAX request
$newsId = $_POST['news_id'];

// Insert bookmark information into the database (replace with your actual user ID logic)
$sql = "INSERT INTO bookmarks (news_id, user_id) VALUES ('$newsId', 'current_user_id')";

if ($conn->query($sql) === TRUE) {
    echo "Bookmark added successfully";
} else {
    echo "Error: ". $sql. "<br>". $conn->error;
}

$conn->close();?>