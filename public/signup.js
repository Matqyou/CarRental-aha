import { init_form, bad_field, bad_fields, complete_field, neutral_field } from './scripts/forms.js';

// Signup form
var signupForm = document.getElementById('fill-form');
var emailAuth = signupForm.querySelector('#email');
var usernameAuth = signupForm.querySelector('#username');
var passwordAuth = signupForm.querySelector('#password');
var signupButton = signupForm.querySelector('#signup');
var success = signupForm.querySelector('#success');
var failure = signupForm.querySelector('#failure');
var loading = signupForm.querySelector('#form-loading');

init_form(signupForm);

function clearResponse(data) {
    if (data['status'] == 'success') {
        loading.style.display = 'none';
        success.textContent = 'Database cleared successfully!';
        success.style.fontSize = '0.60em';
        failure.style.fontSize = '0pt';
        signupButton.disabled = false;
        clearButton.disabled = false;
    }
}

var clearButton = document.getElementById('clear');
clearButton.addEventListener('click', function(event) {
    event.preventDefault();
    loading.style.display = 'block';
    success.style.fontSize = '0pt';
    failure.style.fontSize = '0pt';
    signupButton.disabled = true;
    clearButton.disabled = true;

    setTimeout(function() {
        fetch(window.location.origin + '/clear', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            })
            .then(response => response.json())
            .then(data => clearResponse(data))
            .catch(error => {
                loading.style.display = 'none';
                failure.style.fontSize = '0.6em';
                failure.textContent = error;
                signupButton.disabled = false;
                clearButton.disabled = false;
            }
        );
    }, 500);
})

function authResponse(data) {
    loading.style.display = 'none';
    if (data['status'] == 'success') {
        success.textContent = 'Account has been created successfully!';
        success.style.fontSize = '0.50em';
        failure.style.fontSize = '0pt';
        signupButton.style.display = 'none';
        
        complete_field(emailAuth);
        complete_field(usernameAuth);
        complete_field(passwordAuth);

        setTimeout(() => {
            window.location.href = data['redirect'];
        }, 500);
    } else {
        signupButton.disabled = false;
        clearButton.disabled = false;
        emailAuth.disabled = false;
        usernameAuth.disabled = false;
        passwordAuth.disabled = false;

        var reason = data['reason'];
        
        if (reason.includes('password_long')) { bad_field(passwordAuth, 'Password is too long'); }
        if (reason.includes('username_long')) { bad_field(usernameAuth, 'Username is too long'); }
        else if (reason.includes('username_taken')) { bad_field(usernameAuth, 'This username is taken'); }
        if (reason.includes('email_long')) { bad_field(emailAuth, 'Email is too long'); }
        else if (reason.includes('email_taken')) { bad_field(emailAuth, 'This email is taken'); }

        signupButton.style.display = 'block';
        failure.style.fontSize = '0.50em';
        failure.textContent = 'Fix the form and try again';
    }
}

signupButton.addEventListener('click', function(event) {
    event.preventDefault();
    const email = emailAuth.value.trim();
    const username = usernameAuth.value.trim();
    const password = passwordAuth.value.trim();

    var error = false;
    if (password == '') { bad_field(passwordAuth, 'Field left empty'); error = true; }
    if (username == '') { bad_field(usernameAuth, 'Field left empty'); error = true; }
    if (email == '') { bad_field(emailAuth, 'Field left empty'); error = true; }
    else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            bad_field(emailAuth, 'Please enter a valid email');
            error = true;
        }
    }

    if (error) { 
        failure.textContent = 'Fix the form and try again';
        failure.style.fontSize = '0.60em';
        success.style.fontSize = '0pt';
        return;
    }

    loading.style.display = 'block';
    success.style.fontSize = '0pt';
    failure.style.fontSize = '0pt';
    emailAuth.disabled = true;
    usernameAuth.disabled = true;
    passwordAuth.disabled = true;
    signupButton.disabled = true;
    clearButton.disabled = true;

    var sendData = {
        'email': email,
        'username': username,
        'password': password
    };

    setTimeout(function() {
        fetch(window.location.origin + '/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(sendData),
        })
        .then(response => response.json())
        .then(data => authResponse(data))
        .catch(error => {
            emailAuth.disabled = false;
            usernameAuth.disabled = false;
            passwordAuth.disabled = false;
            signupButton.disabled = false;
            clearButton.disabled = false;
            loading.style.display = 'none';
            failure.style.fontSize = '0.6em';
            failure.textContent = error;
        });
    }, 500);
});
