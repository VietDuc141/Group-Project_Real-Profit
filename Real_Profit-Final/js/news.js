document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "d772b456f34045b9884c22e79dc5e159";
    const url = "https://newsapi.org/v2/everything?q=";

    // Use the correct container ID from your HTML
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    window.addEventListener("load", () => fetchNews("Stock Market"));

    async function fetchNews(query) {
        try {
            const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            bindData(data.articles);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }

    function bindData(articles) {
        // Clear previous content
        cardsContainer.innerHTML = "";

        articles.forEach((article) => {
            // Skip articles without an image
            if (!article.urlToImage) return;

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
        newsImg.src = article.urlToImage;
        newsImg.alt = article.title;

        newsTitle.textContent = article.title.length > 60 
            ? `${article.title.slice(0, 60)}...` 
            : article.title;

        const date = new Date(article.publishedAt).toLocaleString("en-US", { 
            timeZone: "Asia/Jakarta" 
        });
        newsSource.textContent = `${article.source.name} · ${date}`;

        newsDesc.textContent = article.description 
            ? (article.description.length > 150 
                ? `${article.description.slice(0, 150)}...` 
                : article.description)
            : "No description available";

        // Optional: Add click event to open article
        cardClone.querySelector(".card").addEventListener("click", () => {
            window.open(article.url, "_blank");
        });
    }

    // Navigation and search functions remain the same
    window.onNavItemClick = function(id) {
        fetchNews(id);
    }
});

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});