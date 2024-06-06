

// LOADING CONTENT
function loadHTML(url, elementId) {
    fetch(url)
    .then(response => response.text())
    .then(html => {
        // Parse the HTML string
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Get the content section element
        const contentSection = document.getElementById(elementId);

        // Insert the parsed HTML content
        contentSection.innerHTML = doc.body.innerHTML;

        // Execute scripts in the parsed HTML content
        const scripts = doc.querySelectorAll('script');
        scripts.forEach(script => {
            // Create a new script element
            const scriptElement = document.createElement('script');

            // Set the src attribute if present
            if (script.src) {
                scriptElement.src = script.src;
            }

            // Set the type attribute based on whether it's a module or not
            if (script.getAttribute('type') === 'module') {
                scriptElement.type = 'module';
            } else {
                scriptElement.type = 'text/javascript';
            }

            // Set the inline script content if present
            if (!script.src && script.textContent.trim()) {
                scriptElement.textContent = script.textContent;
            }

            // Append the new script element to the document's head or body
            if (script.src) {
                document.head.appendChild(scriptElement);
            } else {
                document.body.appendChild(scriptElement);
            }
        });
    })
    .catch(error => console.error('Error loading HTML:', error));
}


// var buttons = document.querySelectorAll('[redir]');
// buttons.forEach(function(button) {
//     button.addEventListener("click", function() {
//         var page = this.getAttribute('redir');
//         var loading = document.getElementById('loading');
//         var content = document.getElementById('content-section');
//         loading.style.display = 'block';
//         content.innerHTML = '';
//         setTimeout(function() { 
//             loadHTML(`subpages/${page}.html`, 'content-section');
//             loading.style.display = 'none';
//             content.style.display = 'block';
//         }, 500);
        
//     });
// });

// defaultLoad = 'login';
// setTimeout(function() { 
//     loadHTML(`subpages/${defaultLoad}.html`, 'content-section');
//     var loading = document.getElementById('loading');
//     var video = document.getElementById('video-container'); // Accessing the style tag by its ID
//     video.style.display = 'block'; // or 'inline', 'inline-block', 'flex', etc.
//     loading.style.display = 'none';
// }, 500);

function loadContent() {
    const path = window.location.pathname;
            let page = 'login'; // Default page
            if (path === '/login') {
                page = 'login';
            } else if (path === '/signup') {
                page = 'signup';
            } else if (path === '/client') {
                page = 'client';
            }
            
            // loadHTML(page);

            // fetch(page)
            //     .then(response => response.text())
            //     .then(html => {
            //         document.getElementById('content').innerHTML = html;
            //         // Initialize scripts for the loaded page
            //         initializeScripts();
            //     })
            //     .catch(error => console.log('Error loading page:', error));
}

window.onload = loadContent;
window.onpopstate = loadContent;