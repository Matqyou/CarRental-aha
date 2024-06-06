import { init_form, bad_field, bad_fields, complete_field, neutral_field } from './scripts/forms.js';
import { getCookie, deleteAllCookies } from './scripts/cookies.js';

// Client form
var clientForm = document.getElementById('fill-form');
var birthdateField = clientForm.querySelector('#birthdate');
var phoneField = clientForm.querySelector('#phone');
var addressField = clientForm.querySelector('#address');
var cardField = clientForm.querySelector('#card');
var submitButton = clientForm.querySelector('#submit');
var success = clientForm.querySelector('#success');
var failure = clientForm.querySelector('#failure');
var loading = clientForm.querySelector('#form-loading');

init_form(clientForm);

submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    const birthdate = birthdateField.value.trim();
    const phone = phoneField.value.trim();
    const address = addressField.value.trim();
    let card = cardField.value.trim();
    card = card.replace(/\s+/g, ''); // Remove all spaces from the card number

    var error = false;
    if (card == '') { bad_field(cardField, 'Please enter your card number'); error = true; }
    else if (card.length !== 16) { bad_field(cardField, 'Please enter a valid card number'); error = true; }
    if (address == '') { bad_field(addressField, 'Please enter your billing address'); error = true; }
    if (phone == '') { bad_field(phoneField, 'Please enter your phone number'); error = true; }
    if (birthdate == '') { bad_field(birthdateField, 'Please enter your birthdate'); error = true; }

    if (error) { 
        failure.textContent = 'Fix the form and try again';
        failure.style.fontSize = '0.60em';
        success.style.fontSize = '0pt';
        return;
    }

    // Retrieve user ID from cookies
    const userId = getCookie('user_id');

    loading.style.display = 'block';
    submitButton.style.display = 'none';
    success.style.fontSize = '0pt';
    failure.style.fontSize = '0pt';
    birthdateField.disabled = true;
    phoneField.disabled = true;
    addressField.disabled = true;
    cardField.disabled = true;

    var sendData = {
        'user_id': userId,
        'birthdate': birthdate,
        'phone': phone,
        'address': address,
        'card': card
    };

    setTimeout(function() {
        fetch(window.location.origin + '/add_client', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(sendData),
        })
        .then(response => response.json())
        .then(data => {
            // Handle response from the server (success or error)
            if (data.status === 'success') {
                // Client details added successfully
                success.textContent = 'Information has been submitted successfully!';
                success.style.fontSize = '0.50em';
            } else {
                // Error occurred, display error message
                if (data.reason === 'client_data_exists') {
                    failure.textContent = 'Data was submitted already';
                } else {
                    failure.textContent = 'Failed to submit information. Please try again.';
                }
                failure.style.fontSize = '0.60em';
            }

            setTimeout(() => {
                window.location.href = data['redirect'];
            }, 500);
        })
        .catch(error => {
            // Handle fetch error
            failure.textContent = 'Failed to submit information. Please try again.';
            failure.style.fontSize = '0.60em';
        })
        .finally(() => {
            loading.style.display = 'none';
            submitButton.style.display = 'block';
            birthdateField.disabled = false;
            phoneField.disabled = false;
            addressField.disabled = false;
            cardField.disabled = false;
        });
    }, 500);
});


var phoneNumberInputs = document.querySelectorAll('input[type="phone"]');
phoneNumberInputs.forEach(phoneNumberInput => {
    phoneNumberInput.addEventListener('input', function() {
        let phoneNumber = this.value.replace(/\D/g, '');
        if (phoneNumber.length > 8) { phoneNumber = phoneNumber.slice(0, 8); }

        // let showNumber;
        // if (phoneNumber.length) { showNumber = '+371 ' + phoneNumber; }
        // else { showNumber = phoneNumber; }
        this.value = phoneNumber;
    });
});

var cardInputs = document.querySelectorAll('input[type="card"]');
cardInputs.forEach(cardInput => {
    cardInput.addEventListener('input', function() {
        let cardNumber = this.value.replace(/\D/g, '');
        if (cardNumber.length > 16) { cardNumber = cardNumber.slice(0, 16);}

        let showCard = '';
        for (let i = 0; i < cardNumber.length; i++) {
            if (i > 0 && i % 4 == 0) { showCard += ' '; }
            showCard += cardNumber[i];
        }
        this.value = showCard;
    });
});
