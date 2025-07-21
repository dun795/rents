// Initialize Firebase (make sure firebase config is included in rooms.html)
const db = firebase.firestore();

let allRooms = [];
const roomsPerPage = 6;
let currentPage = 1;

async function loadRoomsFromFirebase() {
    try {
        const snapshot = await db.collection('rooms').orderBy('createdAt', 'desc').get();
        allRooms = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        displayRooms(1);
        updatePagination();
    } catch (error) {
        console.error('Error loading rooms:', error);
    }
}

function displayRooms(page) {
    const startIndex = (page - 1) * roomsPerPage;
    const endIndex = startIndex + roomsPerPage;
    const roomsToDisplay = allRooms.slice(startIndex, endIndex);

    const roomGrid = document.querySelector('.room-grid');
    roomGrid.innerHTML = '';

    roomsToDisplay.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        roomCard.innerHTML = `
            <div class="room-img">
                <img src="${room.imageUrl || '/api/placeholder/400/320'}" alt="${room.title}">
            </div>
            <div class="room-content">
                <h3 class="room-title">${room.title}</h3>
                <div class="room-details">
                    <div class="room-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${room.location}</span>
                    </div>
                    <div class="room-detail">
                        <i class="fas fa-ruler-combined"></i>
                        <span>${room.size} m²</span>
                    </div>
                    <div class="room-detail">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Available: ${room.availableDate}</span>
                    </div>
                </div>
                <div class="room-amenities">
                    ${room.amenities.map(amenity => `<span class="amenity">${amenity}</span>`).join('')}
                </div>
                <div class="room-price">R${room.price}/month</div>
                <div class="room-actions">
                    <a href="#" class="view-details">View Details</a>
                    <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                </div>
            </div>
        `;
        roomGrid.appendChild(roomCard);
    });

    setupWishlistButtons();
}

function updatePagination() {
    const totalPages = Math.ceil(allRooms.length / roomsPerPage);
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        if (i === currentPage) pageLink.className = 'active';
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            displayRooms(currentPage);
            updatePaginationActive();
        });
        pagination.appendChild(pageLink);
    }
}

function updatePaginationActive() {
    const links = document.querySelectorAll('.pagination a');
    links.forEach(link => {
        link.classList.remove('active');
        if (parseInt(link.textContent) === currentPage) {
            link.classList.add('active');
        }
    });
}

function setupWishlistButtons() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                btn.style.background = '#ffeded';
                btn.style.color = '#ff3b3b';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                btn.style.background = '#f1f1f1';
                btn.style.color = '#888';
            }
        });
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadRoomsFromFirebase();
});

// Mobile menu toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('#navMenu');

menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Filter form submission
const filterForm = document.querySelector('.filter-form');
filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add filter logic here
    alert('Filters applied! This would normally filter the results.');
});