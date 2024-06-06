// Show the loading screen when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    var loadingScreen = document.getElementById('loading');
    loadingScreen.style.display = 'flex'; // Display the loading screen
});

// Hide the loading screen when all resources (images, stylesheets, etc.) have been loaded
window.addEventListener('load', function() {
    var loadingScreen = document.getElementById('loading');
    loadingScreen.style.display = 'none'; // Hide the loading screen
});