document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let loginBtn = document.getElementById('loginBtn');
    loginBtn.classList.add('active');

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    let params = new URLSearchParams({username: username, password: password}).toString();

    fetch(`/api/login?${params}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/play';

                let token = data.token;
                localStorage.setItem('token', token);
            } else {
                showError("Incorrect Login");
            }
            loginBtn.classList.remove('active');
        })
        .catch((error) => {
            console.error('Error:', error);
            loginBtn.classList.remove('active');
        });
});

let errorTimeout;

function showError(message) {
    let inputElements = document.querySelectorAll('.form-group input');

    inputElements.forEach(input => {
        input.style.borderColor = 'red';
    });

    let errorMessage = document.getElementById('loginError');
    errorMessage.textContent = message;

    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(resetErrors, 3000);
}
function resetErrors() {
    let inputElements = document.querySelectorAll('.form-group input');

    inputElements.forEach(input => {
        input.style.borderColor = '';
    });

    let errorMessage = document.getElementById('loginError');
    errorMessage.textContent = '';
}

