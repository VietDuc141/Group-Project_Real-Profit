<?php
// Database connection details
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "your_database_name";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: ". $conn->connect_error);
}

// NewsAPI configuration
$apiKey = "d772b456f34045b9884c22e79dc5e159";
$url = "https://newsapi.org/v2/everything?q=Stock%20Market&apiKey=". $apiKey;

// Fetch news data from NewsAPI
$response = file_get_contents($url);
$data = json_decode($response, true);

// Store news data in the database
foreach ($data['articles'] as $article) {
    // Sanitize data to prevent SQL injection (using mysqli_real_escape_string)
    $title = mysqli_real_escape_string($conn, $article['title']);
    $source = mysqli_real_escape_string($conn, $article['source']['name']);
    $description = mysqli_real_escape_string($conn, $article['description']);
    $url = mysqli_real_escape_string($conn, $article['url']);
    $image = mysqli_real_escape_string($conn, $article['urlToImage']);
    $publishedAt = mysqli_real_escape_string($conn, $article['publishedAt']);

    $sql = "INSERT INTO news (title, source, description, url, image, published_at) 
            VALUES ('$title', '$source', '$description', '$url', '$image', '$publishedAt')";

    if ($conn->query($sql)!== TRUE) {
        echo "Error: ". $sql. "<br>". $conn->error;
    }
}

$conn->close();?>