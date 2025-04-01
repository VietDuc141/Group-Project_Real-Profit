document.addEventListener("DOMContentLoaded", () => {
    // Get overall progress from the server
    fetch('learning.php?action=get_overall_progress')
        .then(response => response.json())
        .then(data => {
            const progress = data.overall_progress || 0;
            document.getElementById("progress-bar").value = progress;
            document.getElementById("progress-text").textContent = `Progress: ${progress.toFixed(1)}%`;
        })
        .catch(error => console.error('Error:', error));

    // Execute the logout event
    const dropdownLog = document.querySelector(".dropdown-log");
    
    // Use delegation event to execute click "Logout"
    dropdownLog.addEventListener("click", (event) => {
        const logoutLink = event.target.closest(".dropdown-item-log");
        if (logoutLink && logoutLink.textContent === "Logout") {
            event.preventDefault(); // Ngăn hành vi mặc định của thẻ <a>

            // Reset progress bar to 0
            document.getElementById("progress-bar").value = 0;
            document.getElementById("progress-text").textContent = `Progress: 0%`;

            // Call API logout to destroy session
            fetch('logout.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    window.location.href = "index.html";
                } else {
                    console.error("Error while logging out:", result.message);
                    window.location.href = "index.html";
                }
            })
            .catch(error => {
                console.error("Error while calling logout API:", error);
                window.location.href = "index.html";
            });
        }
    });
});

// Function Finish Quiz
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

            sendLessonCompletionToServer(currentLesson, 100);

            setTimeout(() => {
                if (currentLesson === 11) {
                    window.location.href = "practice.html";
                } else {
                    const nextLesson = `lesson${currentLesson + 1}.html`;
                    window.location.href = nextLesson;
                }
            }, 2000);
        } else {
            warning.style.display = "block";
            success.style.display = "none";
        }
    }
}

function sendLessonCompletionToServer(lessonId, progress) {
    let data = {
        lesson_id: lessonId,
        progress: progress
    };

    fetch('learning.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log("Result from server:", result);
        if (result.status === 'success') {
            document.getElementById("progress-bar").value = result.overall_progress;
            document.getElementById("progress-text").textContent = `Progress: ${result.overall_progress.toFixed(1)}%`;
        }
    })
    .catch(error => {
        console.error("Error while sending data to server:", error);
    });
}