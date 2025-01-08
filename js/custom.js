
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
