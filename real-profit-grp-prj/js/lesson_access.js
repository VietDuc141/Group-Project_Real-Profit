// learning.js
document.addEventListener("DOMContentLoaded", () => {
    let completedLessons = JSON.parse(localStorage.getItem("completedLessons")) || [];
    let currentLesson = completedLessons.length + 1; // Xác định bài học hiện tại

    updateProgressBar();

    // Kiểm tra quyền truy cập vào bài học
    document.querySelectorAll(".course-link").forEach((link) => {
        link.addEventListener("click", (e) => {
            const lessonNumber = parseInt(link.href.match(/lesson(\d+)\.html/)[1]);

            if (lessonNumber > currentLesson) {
                alert("Please complete the previous lessons first.");
                e.preventDefault();
            }
        });
    });
});

// Hàm cập nhật thanh tiến trình
function updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    let completedLessons = JSON.parse(localStorage.getItem("completedLessons")) || [];
    const totalLessons = 11;
    const progress = (completedLessons.length / totalLessons) * 100;

    progressBar.value = progress;
    progressText.textContent = `Progress: ${progress.toFixed(1)}%`;
}