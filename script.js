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
