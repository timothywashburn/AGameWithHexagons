(document.getElementById('loginForm') as HTMLElement).addEventListener('submit', function(e) {
    e.preventDefault();

    let loginBtn = document.getElementById('loginBtn') as HTMLElement;
    loginBtn.classList.add('active');

    let username = (document.getElementById('username') as HTMLInputElement).value;
    let password = (document.getElementById('password') as HTMLInputElement).value;

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

let errorTimeout: NodeJS.Timeout;

function showError(message: string) {
    let inputElements = document.querySelectorAll('.form-group input') as NodeListOf<HTMLInputElement>;
    inputElements.forEach((input: HTMLInputElement) => {
        input.style.borderColor = 'red';
    });

    let errorMessage = document.getElementById('loginError') as HTMLElement;
    errorMessage.textContent = message;

    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(resetErrors, 3000);
}
function resetErrors() {
    let inputElements = document.querySelectorAll('.form-group input') as NodeListOf<HTMLInputElement>;
    inputElements.forEach((input: HTMLInputElement) => {
        input.style.borderColor = '';
    });

    let errorMessage = document.getElementById('loginError') as HTMLElement;
    errorMessage.textContent = '';
}

