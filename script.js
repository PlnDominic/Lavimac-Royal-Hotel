document.getElementById('search-button').addEventListener('click', () => {
    const checkIn = document.getElementById('check-in-date').value;
    const checkOut = document.getElementById('check-out-date').value;
    const room = document.getElementById('room-select').value;
    const adults = document.getElementById('adults-count').value;
    const children = document.getElementById('children-count').value;

    // Store the search parameters in localStorage for use in rooms.html if needed
    localStorage.setItem('searchParams', JSON.stringify({
        checkIn,
        checkOut,
        room,
        adults,
        children
    }));

    // Redirect to rooms.html
    window.location.href = 'rooms.html';
});

function sendEmail(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    const mailtoLink = `mailto:info@lavimacroyalhotel.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;
    
    window.location.href = mailtoLink;
}

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Close menu when window is resized to desktop size
        window.addEventListener('resize', () => {
            if (window.innerWidth > 600) {
                navLinks.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
});

document.getElementById('view-toggle').addEventListener('click', function() {
    if (window.innerWidth > 600) {
        window.resizeTo(375, 667); // iPhone size
    } else {
        window.resizeTo(1024, 768); // Desktop size
    }
});
