import { getCookie, deleteAllCookies } from './scripts/cookies.js';

function createVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.classList.add('vehicle-card');

    // Add POPULAR tag if the vehicle is popular
    if (vehicle.popular) {
        const popularTag = document.createElement('span');
        popularTag.classList.add('popular-tag');
        popularTag.textContent = 'POPULAR';
        card.appendChild(popularTag);
    }

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');
    card.appendChild(imageContainer);

    const image = document.createElement('img');
    image.classList.add('vehicle-image');
    image.src = vehicle.image_url; // Set the image URL
    image.alt = vehicle.name; // Set the alt text for accessibility
    imageContainer.appendChild(image);

    if (vehicle.in_use) {
        const overlay = document.createElement('div');
        overlay.classList.add('overlay', 'unavailable-overlay');
        imageContainer.appendChild(overlay);
    }

    const name = document.createElement('h3');
    name.classList.add('vehicle-name', 'color1');
    name.textContent = vehicle.name;
    card.appendChild(name);

    const description = document.createElement('p');
    description.classList.add('vehicle-description', 'color2');
    description.textContent = vehicle.description;
    card.appendChild(description);

    const details = document.createElement('div');
    details.classList.add('vehicle-details', 'color1');
    card.appendChild(details);

    const seatingCapacity = document.createElement('p');
    seatingCapacity.textContent = 'Seating Capacity: ' + vehicle.seating_capacity;
    details.appendChild(seatingCapacity);

    const transmissionType = document.createElement('p');
    transmissionType.textContent = 'Transmission: ' + vehicle.transmission_type;
    details.appendChild(transmissionType);
    
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    card.appendChild(buttonContainer);

    const price = document.createElement('button');
    price.classList.add('btn', 'vehicle-price');
    price.textContent = 'Price: ' + vehicle.price + '$/day';
    buttonContainer.appendChild(price);

    // Add click event listener to the price button
    price.addEventListener('click', function() {
        // Redirect to the subscribe page with vehicle ID as a query parameter
        const user_id = getCookie('user_id');
        const session = getCookie('session');

        if (!user_id || !session) {
            window.location.href = '/login';
        } else {
            window.location.href = '/subscribe?vehicle_id=' + vehicle.vehicle_id;
        }
    });

    const favoriteButton = document.createElement('span');
    favoriteButton.classList.add('vehicle-favorite');

    // Set the favorite button's background image based on whether the vehicle is favorited
    if (vehicle.favorited) {
        favoriteButton.classList.add('favorited');
    } else {
        favoriteButton.classList.add('unfavorited');
    }

    // Add click event listener to toggle favorite state
    favoriteButton.addEventListener('click', function() {
        vehicle.favorited = !vehicle.favorited;
        favoriteButton.classList.toggle('favorited', vehicle.favorited);
        favoriteButton.classList.toggle('unfavorited', !vehicle.favorited);
    });

    buttonContainer.appendChild(favoriteButton);

    if (vehicle.in_use) {
        const availability = document.createElement('p');
        availability.textContent = 'Currently Unavailable';
        availability.classList.add('vehicle-not-available');
        details.appendChild(availability);

        price.disabled = true;
        price.classList.add('btn-danger'); // Apply btn-danger class for unavailable vehicles
    } else {
        price.classList.add('btn-primary'); // Apply btn-primary class for available vehicles
    }

    return card;
}

// Calculate popularity based on order count
function calculatePopularity(vehicles) {
    // Sort vehicles by order count
    vehicles.sort((a, b) => b.times_ordered - a.times_ordered);

    // Calculate the threshold for the top 20%
    const thresholdIndex = Math.floor(0.2 * vehicles.length);
    const thresholdOrders = vehicles[thresholdIndex].times_ordered;

    // Mark vehicles as popular if they have at least the threshold order count
    vehicles.forEach(vehicle => {
        vehicle.popular = vehicle.times_ordered >= thresholdOrders;
    });
}

async function fetchVehicles() {
    try {
        // Make a POST request to fetch vehicles from the server
        const response = await fetch('/vehicles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Check if the response is successful (status code 200-299)
        if (response.ok) {
            // Parse the JSON response
            const data = await response.json();
            const vehicles = data.vehicles;

            // Sort vehicles based on availability, popularity, and inUse status
            const sortedVehicles = vehicles
                .map(vehicle => {
                    // Determine if the vehicle is popular and adjust its sorting weight accordingly
                    const popularityWeight = vehicle.popular ? 1000000 : 0;
                    // Adjust the sorting weight to prioritize available "POPULAR" vehicles
                    const availabilityWeight = vehicle.in_use ? 0 : -1000000;
                    // Assign the sorting weight based on popularity, availability, and inUse status
                    vehicle.sortingWeight = popularityWeight + availabilityWeight + vehicle.times_ordered;
                    return vehicle;
                })
                .sort((a, b) => {
                    // Sort in descending order of sorting weight
                    return b.sortingWeight - a.sortingWeight;
                });

            calculatePopularity(sortedVehicles);

            // Call the function to initialize the vehicle catalog with sorted vehicles
            initializeVehicleCatalog(sortedVehicles);
        } else {
            // If the response is not successful, log the error
            console.error('Failed to fetch vehicles:', response.statusText);
        }
    } catch (error) {
        // If an error occurs during the fetch request, log the error
        console.error('Error fetching vehicles:', error);
    }

    // Function to initialize the vehicle catalog
    function initializeVehicleCatalog(sortedVehicles) {
        const catalog = document.getElementById('vehicleCatalog');
        catalog.innerHTML = ''; // Clear existing content
        
        // Separate available and unavailable vehicles
        const availableVehicles = sortedVehicles.filter(vehicle => !vehicle.in_use);
        const unavailableVehicles = sortedVehicles.filter(vehicle => vehicle.in_use);

        // Append available vehicles first, then unavailable ones
        availableVehicles.forEach(vehicle => {
            const card = createVehicleCard(vehicle);
            catalog.appendChild(card);
        });
        unavailableVehicles.forEach(vehicle => {
            const card = createVehicleCard(vehicle);
            catalog.appendChild(card);
        });
    }
}

// Call the fetchVehicles function to initiate the fetch request
fetchVehicles();
