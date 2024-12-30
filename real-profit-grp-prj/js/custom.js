
  (function ($) {
  
  "use strict";

    // PRE LOADER
    $(window).load(function(){
      $('.preloader').delay(500).slideUp('slow'); // set duration in brackets    
    });

    // NAVBAR
    $(".navbar").headroom();

    $('.navbar-collapse a').click(function(){
        $(".navbar-collapse").collapse('hide');
    });

    $('.slick-slideshow').slick({
      autoplay: true,
      infinite: true,
      arrows: false,
      fade: true,
      dots: true,
    });

    $('.slick-testimonial').slick({
      arrows: false,
      dots: true,
    });
    
  })(window.jQuery);

// LOGINBOX
const loginContainer = document.getElementById ('login-container') 
const registerBtn = document.getElementById ('register')
const loginBtn = document.getElementById ('login')

registerBtn.addEventListener('click', () => {
  loginContainer.classList.add("active");
});

loginBtn.addEventListener('click', () => {
  loginContainer.classList.remove("active");
});

// CHAT BOT
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input img");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

const appElement = document.querySelector("#box");

let  userMessage;
const API_KEY = "AIzaSyD9ljcqnz08fsUdc3eiyNvz9syWAAhwMbA";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  // Create Chat list
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = className === "outgoing" 
  ? `<p></p>` 
  : `<img src="images/chatbot/AiBot_icon.png" alt="Chatbot Icon" class="bot-icon"><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
}

const generateResponse = (incomingChatLi) => {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  const messageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
          contents: [{ 
              role: "user", 
              parts: [{ text: userMessage }] 
          }] 
      })
  }

  // Send POST request to API     
  fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
      messageElement.textContent = data.candidates[0].content.parts[0].text;
  }).catch((error) => {      
      messageElement.textContent = "Oops! Something went wrong. Please try again.";
  }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
  userMessage = chatInput.value.trim();
  console.log(userMessage);

  if(!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append the user's message
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
      // Display response
      const incomingChatLi = createChatLi("Thinking...", "incoming")
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight);
      generateResponse(incomingChatLi);
  }, 600);
}

chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
      e.preventDefault();
      handleChat();
  }
})

sendChatBtn.addEventListener("click", handleChat);

chatbotToggler.addEventListener("click", () => {
    appElement.classList.toggle("show-chatbot");
});
chatbotCloseBtn.addEventListener("click", () => {
    appElement.classList.remove("show-chatbot");
});

// OPEN LESSONS
function toggleChapter(element) {
  const lessonContent= element.nextElementSibling;
  const toggleSymbol = element.querySelector('.toggle-symbol');

  if (lessonContent.style.display === "none" || !lessonContent.style.display) {
    lessonContent.style.display = "block";
    toggleSymbol.textContent = "-";
  } else {
    lessonContent.style.display = "none";
    toggleSymbol.textContent = "+";
  }
}

function toggleAll() {
  const chapters = document.querySelectorAll('.chapter');
  const expandAllButton = document.querySelector('.expand-all');

  chapters.forEach((chapter) => {
    const lessonContent = chapter.querySelector('.lesson-content');
    const toggleSymbol = chapter.querySelector('.toggle-symbol');

    if (expandAllButton.textContent === "Expand All") {
      lessonContent.style.display = "block";
      toggleSymbol.textContent = "-";
    } else {
      lessonContent.style.display = "none";
      toggleSymbol.textContent = "+";
    }
  });

  expandAllButton.textContent =
    expandAllButton.textContent === "Expand All"
      ? "Close all"
      : "Expand All";
}

// DO TEST 
function finishQuiz() {
  const questions = document.querySelectorAll('.question');
  let allCorrect = true;

  questions.forEach(question => {
      const selected = question.querySelector('input[type=radio]:checked');
      if (!selected || selected.value !== 'correct') {
          allCorrect = false;
      }
  });

  const warning = document.querySelector('.warning');
  const success = document.querySelector('.success');

  const currentUrl = window.location.href;
  const match = currentUrl.match(/lesson(\d+)\.html/);

  if (match) {
      let currentLesson = parseInt(match[1]); // Take the number of the lesson
      if (allCorrect) {
          warning.style.display = 'none';
          success.style.display = 'block';
          setTimeout(() => {
              if (currentLesson === 11) {
                  window.location.href = 'practice.html'; // Redirect to practice page
              } else {
                  const nextLesson = `lesson${currentLesson + 1}.html`;
                  window.location.href = nextLesson; // Redirect to the next lesson
              }
          }, 2000);
      } else {
          warning.style.display = 'block';
          success.style.display = 'none';
      }
  } 
}
