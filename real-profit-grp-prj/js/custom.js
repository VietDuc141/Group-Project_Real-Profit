
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

  // OPEN LESSONS
  function toggleLesson(element) {
    const lessonContent = element.nextElementSibling; // Lấy phần nội dung của bài học
    const toggleSymbol = element.querySelector(".toggle-symbol"); // Lấy dấu "+" hoặc "-"
  
    if (lessonContent.style.display === "block") {
      lessonContent.style.display = "none"; // Ẩn nội dung
      toggleSymbol.textContent = "+"; // Đổi về dấu "+"
    } else {
      lessonContent.style.display = "block"; // Hiện nội dung
      toggleSymbol.textContent = "-"; // Đổi sang dấu "-"
    }
  }
  
