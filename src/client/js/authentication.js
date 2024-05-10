import { RegistrationError } from '../../shared/enums.js';
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    let params = new URLSearchParams({username: username, password: password}).toString();

    fetch(`http://localhost:3000/api/register?${params}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Account created successfully');
            } else {
                let error = Object.values(RegistrationError).find((error) => error.code === data.result);
                alert('Error creating account: ' + error.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});