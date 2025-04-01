document.addEventListener("DOMContentLoaded", () => {
    // Get completed_lessons from server
    fetch('learning.php?action=get_completed_lessons')
        .then(response => response.json())
        .then(data => {
            if (data.status !== 'success') {
                console.error("Error while get completed_lessons:", data.message);
                return;
            }

            const completedLessons = data.completed_lessons || [];

            // Function to check accessibility to lessons
            function canAccessLesson(lessonNumber) {
                for (let i = 1; i < lessonNumber; i++) {
                    if (!completedLessons.includes(i)) {
                        return false; // If any lessons are unavailable, return false
                    }
                }
                return true;
            }

            // Execute the click event to course-link
            document.querySelectorAll(".course-link").forEach((link) => {
                link.addEventListener("click", (e) => {
                    const lessonNumber = parseInt(link.href.match(/lesson(\d+)\.html/)[1]);

                    if (!canAccessLesson(lessonNumber)) {
                        const nextLesson = completedLessons.length + 1;
                        alert(`Please complete Lesson ${nextLesson - 1} before accessing Lesson ${lessonNumber}.`);
                        e.preventDefault();
                    }
                });
            });
        })
        .catch(error => {
            console.error("Error while calling API get_completed_lessons:", error);
        });
});