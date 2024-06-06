import { init_form, bad_field, bad_fields, complete_field, neutral_field, bad_checkbox, complete_checkbox } from './scripts/forms.js';
import { getCookie, deleteAllCookies } from './scripts/cookies.js';

// Subscribe form
var subscribeForm = document.getElementById('fill-form');
var beginField = subscribeForm.querySelector('#begin_date');
var endField = subscribeForm.querySelector('#end_date');
var termsCheckbox = subscribeForm.querySelector('#terms_conditions');
var submitButton = subscribeForm.querySelector('#submit');
var success = subscribeForm.querySelector('#success');
var failure = subscribeForm.querySelector('#failure');
var loading = subscribeForm.querySelector('#form-loading');

init_form(subscribeForm);

submitButton.addEventListener('click', function(event) {
    event.preventDefault();

    // Retrieve user information from cookies
    const user_id = getCookie('user_id');
    const session = getCookie('session');

    if (!user_id || !session) {
        alert('You must be logged in to subscribe.');
        return;
    }

    // Retrieve form data
    const terms_of_service = termsCheckbox.checked;
    const begin_date = document.getElementById('begin_date').value;
    const end_date = document.getElementById('end_date').value;
    const vehicle_id = document.querySelector('#vehicleId').value;

    console.log(terms_of_service);
    
    // Validate form fields (you can add more validation if needed)
    var error = false;
    if (!begin_date) { bad_field(document.getElementById('begin_date'), 'Please select Begin Subscription date'); error = true; }
    if (!end_date) { bad_field(document.getElementById('end_date'), 'Please select End Subscription date'); error = true; }
    if (!terms_of_service) { bad_checkbox(termsCheckbox); error = true; }

    if (error) { 
        failure.textContent = 'Fix the form and try again';
        failure.style.fontSize = '0.60em';
        success.style.fontSize = '0pt';
        return;
    }

    // Display loading indicator and disable form elements
    loading.style.display = 'block';
    submitButton.style.display = 'none';
    success.style.fontSize = '0pt';
    failure.style.fontSize = '0pt';
    document.getElementById('begin_date').disabled = true;
    document.getElementById('end_date').disabled = true;

    // Prepare data to send to backend
    const sendData = {
        'user_id': user_id,
        'vehicle_id': vehicle_id,
        'begin_date': begin_date,
        'end_date': end_date
    };

    console.log(sendData);

    // Send data to backend
    fetch(window.location.origin + '/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session}`
        },
        body: JSON.stringify(sendData),
    })
    .then(response => response.json())
    .then(data => {
        // Handle backend response
        if (data.status === 'success') {
            // Show success message
            complete_field(beginField);
            complete_field(endField);
            complete_checkbox(termsCheckbox);

            success.textContent = 'Subscription added successfully!';
            success.style.fontSize = '0.50em';
            failure.style.fontSize = '0pt';
        } else {
            // Show error message
            failure.textContent = 'Failed to add subscription: ' + data.reason;
            failure.style.fontSize = '0.60em';
            success.style.fontSize = '0pt';
        }
    })
    .catch(error => {
        // Show error message if request fails
        console.error('Error:', error);
        failure.textContent = 'An error occurred. Please try again.';
        failure.style.fontSize = '0.60em';
        success.style.fontSize = '0pt';
    })
    .finally(() => {
        // Hide loading indicator and enable form elements
        loading.style.display = 'none';
        document.getElementById('begin_date').disabled = false;
        document.getElementById('end_date').disabled = false;
        submitButton.style.display = 'block';
    });
});

// Function to display car information
function displayCarInfo(carData) {
    const carInfoContainer = document.querySelector('.car-info-container');

    if (!carData) {
        // Handle case when car data is not available
        carInfoContainer.innerHTML = '<p>No car selected</p>';
        return;
    }

    const cardHTML = `
    <div class="card" style="background-color: #ffffff11;"> <!-- Change the background color as needed -->
        <img src="${carData.image_url}" class="card-img-top" alt="${carData.name}">
        <div class="card-body">
            <h5 class="vehicle-name" style="color: var(--main); font-size: 20px;">${carData.name}</h5> <!-- Change the text color as needed -->
            <p class="vehicle-description color2">${carData.description}</p> <!-- Change the text color as needed -->
            <div class="vehicle-details color1">
                <p>Seating Capacity: ${carData.seating_capacity}</p> <!-- Change the text color as needed -->
                <p>Transmission Type: ${carData.transmission_type}</p> <!-- Change the text color as needed -->
                <p class="vehicle-price">Price: ${carData.price}$/day</p> <!-- Change the text color as needed -->
            </div>
        </div>
    </div>
`;

    carInfoContainer.innerHTML = cardHTML;
}

async function fetchVehicleData(vehicleId) {
    fetch(window.location.origin + '/vehicle', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ vehicleId: vehicleId }),
    })
    .then(response => response.json())
    .then(data => {
        displayCarInfo(data['vehicle']);
    })
    .catch(error => {
        console.log(error);
    });
}

// Extract vehicle ID from URL
const urlParams = new URLSearchParams(window.location.search);
const vehicleId = urlParams.get('vehicle_id');
document.getElementById('vehicleId').value = vehicleId;

if (vehicleId) {
    // If vehicle ID is found in the URL, send a POST request to fetch vehicle data
    fetchVehicleData(vehicleId);
}

