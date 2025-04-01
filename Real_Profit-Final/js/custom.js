
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
