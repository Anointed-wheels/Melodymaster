// ==========================================
// INSTRUCTORS PAGE INTERACTIVITY SCRIPT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log("Instructors Page loaded successfully.");

  const searchInput = document.getElementById('instructor-search-input');
  const filterPills = document.querySelectorAll('.filter-pill');
  const instructorCards = document.querySelectorAll('.instructor-card');

  let currentCategory = 'all';
  let searchTerm = '';

  // Function to filter cards
  function filterInstructors() {
    instructorCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const name = card.getAttribute('data-name').toLowerCase();
      const bioText = card.querySelector('.instructor-bio').textContent.toLowerCase();
      const instrumentText = card.querySelector('.instructor-instrument').textContent.toLowerCase();

      const matchesCategory = (currentCategory === 'all' || category === currentCategory);
      const matchesSearch = (name.includes(searchTerm) || bioText.includes(searchTerm) || instrumentText.includes(searchTerm));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Handle Pill Clicks
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-filter');
      filterInstructors();
    });
  });

  // Handle Search Input Typing
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase().trim();
    filterInstructors();
  });
});