import { init_form, bad_field, bad_fields, complete_field, neutral_field } from './scripts/forms.js';
import { getCookie, deleteAllCookies } from './scripts/cookies.js';

console.log(`Current cookie: '${document.cookie}'`)

// Login form
var loginForm = document.getElementById('fill-form');
var authField = loginForm.querySelector('#auth');
var passwordField = loginForm.querySelector('#password');
var loginButton = loginForm.querySelector('#login');
var success = loginForm.querySelector('#success');
var failure = loginForm.querySelector('#failure');
var loading = loginForm.querySelector('#form-loading');

console.log('init form');
init_form(loginForm);

function authResponse(data) {
    loading.style.display = 'none';
    if (data['status'] == 'success') {
        success.textContent = 'Logged in successfully!';
        success.style.fontSize = '0.50em';
        failure.style.fontSize = '0pt';
        loginButton.style.display = 'none';

        complete_field(authField);
        complete_field(passwordField);

        const uid = data['uid'];
        const session = data['session'];

        // Set a cookie with an expiration time of one day
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1); // Set expiration date to tomorrow
        document.cookie = `user_id=${uid}; expires=${expirationDate.toUTCString()}; path=/`;
        document.cookie = `session=${session}; expires=${expirationDate.toUTCString()}; path=/`;
        console.log(`Logged into account #${uid}! (session: ${session})`);

        setTimeout(() => {
            window.location.href = data['redirect'];
        }, 500);

    } else {
        loginButton.disabled = false;
        authField.disabled = false;
        passwordField.disabled = false;

        var reason = data['reason'];
        
        if (reason.includes('auth_long')) { bad_field(authField, "Login is too long"); }
        if (reason.includes('password_long')) { bad_field(passwordField, "Password is too long"); }
        if (reason.includes('bad_creditentials')) {
            bad_fields(loginForm, 'credentials', "Login or password is invalid");
        }

        loginButton.style.display = 'block';
        failure.style.fontSize = '0.50em';
        failure.textContent = 'Fix the form and try again';
    }
}

loginButton.addEventListener('click', function(event) {
    event.preventDefault();
    const auth = authField.value.trim();
    const password = passwordField.value.trim();

    var error = false;
    if (password == '') { bad_field(passwordField, 'Field left empty'); error = true; }
    if (auth == '') { bad_field(authField, 'Field left empty'); error = true; }

    if (error) { 
        failure.textContent = 'Fix the form and try again';
        failure.style.fontSize = '0.60em';
        success.style.fontSize = '0pt';
        return;
    }

    loading.style.display = 'block';
    success.style.fontSize = '0pt';
    failure.style.fontSize = '0pt';
    authField.disabled = true;
    passwordField.disabled = true;
    loginButton.disabled = true;

    const sendData = {
        'auth': auth,
        'password': password
    };

    setTimeout(function() {
        fetch(window.location.origin + '/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(sendData),
        })
        .then(response => response.json())
        .then(data => authResponse(data))
        .catch(error => {
            authField.disabled = false;
            passwordField.disabled = false;
            loginButton.disabled = false;
            loading.style.display = 'none';
            failure.style.fontSize = '0.6em';
            failure.textContent = error;
        });
    }, 500);
});
