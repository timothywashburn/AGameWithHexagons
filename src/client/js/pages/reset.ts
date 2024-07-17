import {PasswordChangeResponse, PasswordChangeResponseData} from '../../../shared/enums';

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (!token) {
    window.location.href = '/login';
}

document.getElementById('resetForm')!.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!token) return;

    let resetBtn = document.getElementById('resetBtn')!;
    resetBtn.classList.add('active');

    let password = (document.getElementById('password') as HTMLInputElement).value;
    let confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement).value;

    let error = document.getElementById('resetError')!;

    if (password !== confirmPassword) {
        error.textContent = 'Passwords do not match.';
        error.style.visibility = 'visible';
        resetBtn.classList.remove('active');
        return;
    }

    let params = new URLSearchParams({ token: token.toString(), password: password.toString() }).toString();

    fetch(`/api/resetpassword?${params}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            let error = document.getElementById('resetError')!;
            let errorMessage = Object.values(PasswordChangeResponse).find((error) => error.id === data.result) as PasswordChangeResponseData;

            if (errorMessage.id === PasswordChangeResponse.SUCCESS.id) {
                window.location.href = '/login';

                if (error) error.style.visibility = 'hidden';
            } else {
                error.textContent = 'An error occurred. This link is likely expired.';
                error.style.visibility = 'visible';
            }
            resetBtn.classList.remove('active');
        })
        .catch((error) => {
            console.error(error);
            resetBtn.classList.remove('active');
        });
});
