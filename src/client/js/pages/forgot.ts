let email = document.getElementById('email') as HTMLInputElement;
let forgotBtn = document.getElementById('forgotBtn') as HTMLInputElement;
let error = document.getElementById('forgotError') as HTMLInputElement;
let passwordTab = document.getElementById('password-tab') as HTMLInputElement;
let usernameTab = document.getElementById('username-tab') as HTMLInputElement;

const emailRegex =
	"(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"" +
	'(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:' +
	'(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]' +
	'|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b' +
	'\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])';

let endpoint = '/api/forgotpassword';

passwordTab.addEventListener('click', function (e) {
	endpoint = '/api/forgotpassword';
	passwordTab.classList.add('active');
	usernameTab.classList.remove('active');
});

usernameTab.addEventListener('click', function (e) {
	endpoint = '/api/forgotusername';
	usernameTab.classList.add('active');
	passwordTab.classList.remove('active');
});

document.getElementById('forgotForm')!.addEventListener('submit', function (e) {
	e.preventDefault();

	if (!email.value.match(emailRegex)) {
		showError('Please enter a valid email address.', 'red');
		return;
	}

	forgotBtn.classList.add('active');

	let params = new URLSearchParams({ email: email.value }).toString();

	fetch(`${endpoint}?${params}`, {
		method: 'GET'
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				showError('If an account with that email exists, a link has been sent.', 'green');
			} else {
				showError('Please enter a valid email address.', 'red');
			}
			forgotBtn.classList.remove('active');
		})
		.catch((error) => {
			console.error(error);
			forgotBtn.classList.remove('active');
		});
});

let errorTimeout: NodeJS.Timeout;

function showError(message: string, color: string) {
	let inputElements = document.querySelectorAll('.form-group input') as NodeListOf<HTMLInputElement>;
	inputElements.forEach((input: HTMLInputElement) => {
		input.style.borderColor = color;
	});

	let errorMessage = document.getElementById('forgotError')!;
	errorMessage.textContent = message;
	errorMessage.style.color = color;

	clearTimeout(errorTimeout);
	errorTimeout = setTimeout(resetErrors, 3000);
}

function resetErrors() {
	let inputElements = document.querySelectorAll('.form-group input') as NodeListOf<HTMLInputElement>;
	inputElements.forEach((input: HTMLInputElement) => {
		input.style.borderColor = '';
	});

	let errorMessage = document.getElementById('forgotError')!;
	errorMessage.textContent = '';
}
