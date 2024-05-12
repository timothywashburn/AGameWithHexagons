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
            let error = document.getElementById('loginError');
            if (data.success) {
                window.location.href = '/play';

                let token = data.token;
                localStorage.setItem('token', token);

                if (error) error.style.visibility = 'hidden';
            } else {
                error.textContent = 'Incorrect Login';
                error.style.visibility = 'visible';
            }
            loginBtn.classList.remove('active');
        })
        .catch((error) => {
            console.error('Error:', error);
            loginBtn.classList.remove('active');
        });
});
