const courseLinks = document.querySelectorAll('.course-link');
const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('.close-modal-btn');

function showModal() {
  modal.classList.add('show'); 
}

function hideModal() {
  modal.classList.remove('show');
}

courseLinks.forEach(courseLink => {
  courseLink.addEventListener('click', function (e) {
    const dropdownLogItem = document.querySelector('.dropdown-log .dropdown-item-log');

    if (dropdownLogItem && dropdownLogItem.textContent.trim() === 'Login') {
      e.preventDefault();
      showModal();
    }
  });
});

closeModalBtn.addEventListener('click', hideModal);

window.addEventListener('click', function(e) {
  if (e.target === modal) {
    hideModal();
  }
});