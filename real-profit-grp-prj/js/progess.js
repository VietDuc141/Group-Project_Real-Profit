// lesson1.js
document.addEventListener("DOMContentLoaded", () => {
    updateProgressBar();
});

function finishQuiz() {
    const questions = document.querySelectorAll(".question");
    let allCorrect = true;

    questions.forEach((question) => {
        const selected = question.querySelector("input[type=radio]:checked");
        if (!selected || selected.value !== "correct") {
            allCorrect = false;
        }
    });

    const warning = document.querySelector(".warning");
    const success = document.querySelector(".success");
    const currentUrl = window.location.href;
    const match = currentUrl.match(/lesson(\d+)\.html/);

    if (match) {
        let currentLesson = parseInt(match[1]);

        if (allCorrect) {
            warning.style.display = "none";
            success.style.display = "block";

            // Lưu bài học đã hoàn thành vào localStorage
            let completedLessons = JSON.parse(localStorage.getItem("completedLessons")) || [];
            if (!completedLessons.includes(currentLesson)) {
                completedLessons.push(currentLesson);
                localStorage.setItem("completedLessons", JSON.stringify(completedLessons));
            }

            setTimeout(() => {
                if (currentLesson === 11) {
                    window.location.href = "practice.html"; // Chuyển đến trang thực hành
                } else {
                    const nextLesson = `lesson${currentLesson + 1}.html`;
                    window.location.href = nextLesson; // Chuyển đến bài học tiếp theo
                }
            }, 2000);

        } else {
            warning.style.display = "block";
            success.style.display = "none";
        }
    }
}

// Hàm cập nhật progress bar
function updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    let completedLessons = JSON.parse(localStorage.getItem("completedLessons")) || [];
    const totalLessons = 11;
    const progress = (completedLessons.length / totalLessons) * 100;

    progressBar.value = progress;
    progressText.textContent = `Progress: ${progress.toFixed(1)}%`;
}