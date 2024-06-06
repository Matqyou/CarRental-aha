

// FOCUS AND SCROLLING EFFECT
// Flag to track whether an input is currently focused
var isInputFocused = false;

// Add event listeners for input focus and blur events
document.addEventListener('focusin', function(event) {
    var videoOverlay = document.getElementById('video-overlay');
    videoOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; // Darken the overlay when an input is focused
    isInputFocused = true;
});

document.addEventListener('focusout', function(event) {
    var videoOverlay = document.getElementById('video-overlay');
    var scrollPosition = window.scrollY || window.pageYOffset;
    var opacity = Math.min(0.5 + scrollPosition / 350, 0.9); // Calculate the opacity based on scroll position

    if (!isInputFocused) {
        videoOverlay.style.backgroundColor = 'rgba(0, 0, 0, ' + opacity + ')'; // Set the overlay opacity based on scroll position
    }
    isInputFocused = false;
});

// Add event listener for scroll event
window.addEventListener('scroll', function() {
    // Check if an input is focused, if so, do nothing
    if (isInputFocused) {
        return;
    }

    var videoOverlay = document.getElementById('video-overlay');
    var scrollPosition = window.scrollY || window.pageYOffset;
    var opacity = Math.min(0.5 + scrollPosition / 350, 0.9); // Calculate the opacity based on scroll position

    videoOverlay.style.backgroundColor = 'rgba(0, 0, 0, ' + opacity + ')'; // Set the overlay opacity based on scroll position
});
