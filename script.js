
// Mobile menu toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('#navMenu');

menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Search form handling
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const location = document.getElementById('location').value;
    const budget = document.getElementById('budget').value;
    const amenities = document.getElementById('amenities').value;

    window.location.href = `rooms.html?location=${encodeURIComponent(location)}&budget=${encodeURIComponent(budget)}&amenities=${encodeURIComponent(amenities)}`;
});
