import {RegistrationResponse, RegistrationResponseData} from '../../../shared/enums/misc-enums';

document.getElementById('registerForm')!.addEventListener('submit', function(e) {
    e.preventDefault();

    let registerBtn = document.getElementById('registerBtn')!;
    registerBtn.classList.add('active');

    let username = (document.getElementById('username') as HTMLInputElement).value;
    let password = (document.getElementById('password') as HTMLInputElement).value;
    let confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

    if (password !== confirmPassword) {
        showError('Passwords do not match');
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
                let errorMessage = Object.values(RegistrationResponse).find((error) => error.id === data.result) as RegistrationResponseData;
                let userOnly = errorMessage.id === RegistrationResponse.USERNAME_EXISTS.id || errorMessage.id === RegistrationResponse.USERNAME_INVALID.id;
                showError(errorMessage.message, userOnly);
            }
            registerBtn.classList.remove('active');
        })
        .catch((error) => {
            console.error(error);
            registerBtn.classList.remove('active');
        });
});


let errorTimeout: NodeJS.Timeout;

function showError(message: string, nameOnly = false) {
    let inputElements = document.querySelectorAll('.form-group input');

    for (let i = 0; i < inputElements.length; i++) {
        (inputElements[i] as HTMLInputElement).style.borderColor = 'red';
        if (nameOnly && i === 0) break;
    }

    let errorMessage = document.getElementById('registrationError')!;
    errorMessage.textContent = message;

    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(resetErrors, 3000);
}
function resetErrors() {
    let inputElements = document.querySelectorAll('.form-group input') as NodeListOf<HTMLInputElement>;
    inputElements.forEach((input: HTMLInputElement) => {
        input.style.borderColor = '';
    });

    let errorMessage = document.getElementById('registrationError')!;
    errorMessage.textContent = '';
}
