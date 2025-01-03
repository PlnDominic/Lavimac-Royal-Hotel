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

// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !menuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        menuBtn.innerHTML = '☰';
    }
});

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
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

// Calendar Functionality
function generateCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');
    if (!calendarGrid) return;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Days of the week header
    const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });

    // Generate days for current month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayIndex - 1; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        // Add click event for date selection
        dayElement.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            dayElement.classList.add('selected');
        });

        calendarGrid.appendChild(dayElement);
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    generateCalendar();

    // Add event listeners for month navigation
    const prevButton = document.querySelector('.prev-month');
    const nextButton = document.querySelector('.next-month');

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            // Implement previous month logic
        });

        nextButton.addEventListener('click', () => {
            // Implement next month logic
        });
    }
});
