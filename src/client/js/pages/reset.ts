import Enum from '../../../shared/enums/enum';

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (!token) {
	window.location.href = '/login';
}

document.getElementById('resetForm')!.addEventListener('submit', function (e) {
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
		method: 'GET'
	})
		.then((response) => response.json())
		.then((data) => {
			let errorElement = document.getElementById('resetError')!;
			let response = Enum.PasswordChangeResponse.getFromIndex(data.result);

			if (response === Enum.PasswordChangeResponse.SUCCESS) {
				window.location.href = '/login';
				if (errorElement) errorElement.style.visibility = 'hidden';
			} else {
				errorElement.textContent = 'An error occurred. This link is likely expired.';
				errorElement.style.visibility = 'visible';
			}
			resetBtn.classList.remove('active');
		})
		.catch((error) => {
			console.error(error);
			resetBtn.classList.remove('active');
		});
});
