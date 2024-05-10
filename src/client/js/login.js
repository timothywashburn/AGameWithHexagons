document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    let params = new URLSearchParams({username: username, password: password}).toString();

    fetch(`/api/login?${params}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {

                alert('Login successful');

                let token = data.token;
                localStorage.setItem('token', token);

            } else {
                alert('Incorrect Login');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});
