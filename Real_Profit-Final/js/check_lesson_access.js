document.addEventListener("DOMContentLoaded", () => {
    // Check the login status
    fetch("session_status.php")
        .then(response => response.json())
        .then(data => {
            if (!data.isLoggedIn) {
                // If not logged in, redirect to index.html
                alert("Please sign in to get access to the lesson.");
                window.location.href = "index.html";
                return;
            }

            // If logged in, continue to check accessibility to lesson
            const currentUrl = window.location.href;
            const match = currentUrl.match(/lesson(\d+)\.html/);
            if (!match) {
                console.error("Không tìm thấy lesson_id trong URL");
                window.location.href = "index.html";
                return;
            }

            const lessonId = parseInt(match[1]);

            console.log("Checking access for Lesson ID:", lessonId);

            // Call API to check accessibity
            fetch(`check_access.php?lesson_id=${lessonId}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Response from check_access.php:", data);
                    if (data.status !== 'success') {
                        alert(data.message || "You cannot access to this lesson.");
                        window.location.href = "index.html";
                    }
                })
                .catch(error => {
                    console.error("Lỗi khi kiểm tra quyền truy cập:", error);
                    window.location.href = "index.html";
                });
        })
        .catch(error => {
            console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
            window.location.href = "index.html";
        });
});