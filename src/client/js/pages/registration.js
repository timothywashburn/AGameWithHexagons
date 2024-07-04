import { RegistrationError } from '../../../shared/enums.js';

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let registerBtn = document.getElementById('registerBtn');
    registerBtn.classList.add('active');

    let error = document.getElementById('registrationError');

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        error.textContent = 'Passwords do not match';
        error.style.visibility = 'visible';
        registerBtn.classList.remove('active');
        return;
    }

    let params = new URLSearchParams({username: username, password: password}).toString();

    fetch(`/api/register?${params}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/play';

                let token = data.token;
                if(token) localStorage.setItem('token', token);

            } else {
                let errorMessage = Object.values(RegistrationError).find((error) => error.id === data.result);
                error.textContent = errorMessage.message;
                error.style.visibility = 'visible';
            }
            registerBtn.classList.remove('active');
        })
        .catch((error) => {
            console.error('Error:', error);
            registerBtn.classList.remove('active');
        });
});