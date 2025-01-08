
document.getElementById('contactForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this);
    const notification = document.getElementById('notification');

    try {
        const response = await fetch('sendfaqs.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.text();

        if (response.ok) {
            // Display success notification
            notification.style.display = 'block';
            notification.style.backgroundColor = '#28a745';
            notification.textContent = 'Message sent successfully!';
        } else {
            // Display error notification
            notification.style.display = 'block';
            notification.style.backgroundColor = '#dc3545';
            notification.textContent = `Error: ${result}`;
        }

        // Hide the notification after 5 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);

    } catch (error) {
        // Handle fetch errors
        notification.style.display = 'block';
        notification.style.backgroundColor = '#dc3545';
        notification.textContent = 'Something went wrong. Please try again later.';
        console.error(error);
    }
});

