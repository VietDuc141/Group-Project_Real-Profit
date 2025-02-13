document.addEventListener("DOMContentLoaded", () => {
    const bookmarkedNews = JSON.parse(localStorage.getItem('bookmarkedNews'))
    const cardsContainer = document.getElementById("bookmarked-news"); // Use the same ID as in your HTML
    const newsCardTemplate = document.getElementById("template-news-card"); // Assuming you have a template

    // Check if we have bookmarked news to display
    if (bookmarkedNews.length === 0) {
        cardsContainer.innerHTML = "<p>No bookmarked news found.</p>";
    } else {
        bookmarkedNews.forEach((article) => {
            // Clone the template
            const cardClone = newsCardTemplate.content.cloneNode(true);
            
            // Fill in the card details
            fillDataInCard(cardClone, article);

            // Append to container
            cardsContainer.appendChild(cardClone);
        });
    }

    function fillDataInCard(cardClone, article) {
        // Select elements within the cloned template
        const newsImg = cardClone.querySelector("#news-img");
        const newsTitle = cardClone.querySelector("#news-title");
        const newsSource = cardClone.querySelector("#news-source");
        const newsDesc = cardClone.querySelector("#news-desc");

        // Set values
        newsImg.src = article.image || "https://via.placeholder.com/400x200"; // Fallback if image is missing
        newsImg.alt = article.title;

        newsTitle.textContent = article.title.length > 60 
          ? `${article.title.slice(0, 60)}...` 
          : article.title;

        const date = new Date(article.publishedAt).toLocaleString("en-US", { 
            timeZone: "Asia/Jakarta" 
        });
        newsSource.textContent = `${article.source} · ${date}`

        newsDesc.textContent = article.description 
          ? (article.description.length > 150 
              ? `${article.description.slice(0, 150)}...` 
              : article.description)
          : "No description available";

        // Add click event to open article
        cardClone.querySelector(".card").addEventListener("click", () => {
            window.open(article.url, "_blank"); // Open in new tab
        });
    }
});