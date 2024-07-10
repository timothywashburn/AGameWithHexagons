let email = document.getElementById('email');
let forgotBtn = document.getElementById('forgotBtn');
let error = document.getElementById('forgotError');
let passwordTab = document.getElementById('password-tab');
let usernameTab = document.getElementById('username-tab');

let endpoint = '/api/forgotpassword';

passwordTab.addEventListener('click', function(e) {
    endpoint = '/api/forgotpassword';
    passwordTab.classList.add('active');
    usernameTab.classList.remove('active');
});

usernameTab.addEventListener('click', function(e) {
    endpoint = '/api/forgotusername';
    usernameTab.classList.add('active');
    passwordTab.classList.remove('active');
});

forgotBtn.addEventListener('click', function(e) {
    e.preventDefault();

    forgotBtn.classList.add('active');

    let params = new URLSearchParams({ email: email.value }).toString();

    fetch(`${endpoint}?${params}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                error.textContent = `If an account with that email exists, an email has been sent.`;
                error.style.color = 'green';
                error.style.visibility = 'visible';
            } else {
                error.textContent = `Error with operation.`;
                error.style.color = 'red';
                error.style.visibility = 'visible';
            }
            forgotBtn.classList.remove('active');
        })
        .catch((error) => {
            console.error('Error:', error);
            forgotBtn.classList.remove('active');
        });
});
