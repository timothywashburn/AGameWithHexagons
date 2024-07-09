import { NameChangeError, EmailChangeError, PasswordChangeError } from '../../../shared/enums.js';

window.onload = function() {

    fetch('/api/account', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        }
    })
        .then(response => response.json())
        .then(data => {
            if (!data.success) window.location.href = '/login';

            setupButtons();

            document.getElementById('username').value = data.info.username;

            if (data.info.email === null) changeEmailButton();
            else document.getElementById('email').value = data.info.email;

        })
        .catch(error => console.error('Error:', error));
};


function setupButtons() {
    let changeEmailButton = document.getElementById('change-email');
    changeEmailButton.onclick = function () {
        let modal = new bootstrap.Modal(document.getElementById('promptModal'))
        modal.show();

        updateModal('Email');
    }

    let changeNameButton = document.getElementById('change-username');
    changeNameButton.onclick = function () {
        let modal = new bootstrap.Modal(document.getElementById('promptModal'))
        modal.show();

        updateModal('Username');
    }


    let confirmButton = document.getElementById('confirmBtn');

    confirmButton.addEventListener('click', function() {
        let modalTitle = document.getElementById('promptModalLabel').textContent;

        if (modalTitle === 'Change Email') {

            let email = document.getElementById('email').value;
            let confirm = document.getElementById('email-confirm').value;

            if (email !== confirm) {
                showError('Emails do not match');
                return;
            }

            changeEmail(email);
        } else if (modalTitle === 'Change Username') {

            let username = document.getElementById('username').value;
            let confirm = document.getElementById('username-confirm').value;

            if (username !== confirm) {
                showError('Usernames do not match');
                return;
            }

            changeUsername(username);
        }
    });

    let cancelButton = document.getElementById('cancelBtn');

    cancelButton.addEventListener('click', function() {
        let modal = document.getElementById('promptModal');

        updateModal("placeholder")
        document.getElementById('placeholder').value = '';
        document.getElementById('placeholder-confirm').value = '';

        resetErrors();

        modal.classList.remove('show');
        modal.style.display = 'none';

        let backdrops = document.getElementsByClassName('modal-backdrop');
        for (let i = 0; i < backdrops.length; i++) {
            backdrops[i].parentNode.removeChild(backdrops[i]);
        }
    });

    let logoutButton = document.getElementById('logoutBtn');

    logoutButton.addEventListener('click', function() {
        fetch('/api/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/login';
                } else {
                    console.error(data.error);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });

    let modal = document.getElementById('promptModal');

    modal.addEventListener('hidden.bs.modal', function () {
        updateModal("placeholder")
        document.getElementById('placeholder').value = '';
        document.getElementById('placeholder-confirm').value = '';

        resetErrors();
    });

    let changePasswordButton = document.getElementById('change-password');
    changePasswordButton.onclick = function() {
        let oldPassword = document.getElementById('old-password').value;
        let newPassword = document.getElementById('new-password').value;
        let confirm = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirm) {
            resetErrors();
            showPasswordError('Passwords do not match', false);
            return;
        }

        changePassword(oldPassword, confirm);
    }
}

function changeUsername(newUsername) {
    let params = new URLSearchParams({username: newUsername}).toString();

    fetch(`/api/changeusername?${params}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        }
    })
        .then(response => response.json())
        .then(data => {
            resetErrors();

            let error = Object.values(NameChangeError).find((error) => error.id === data.result);
            console.log(error);

            if (error.id === NameChangeError.SUCCESS.id) location.reload();
            else showError(error.message);
        })
        .catch(error => console.error('Error:', error));
}

function changeEmail(newEmail) {
    let params = new URLSearchParams({email: newEmail}).toString();

    fetch(`/api/changeemail?${params}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        }
    })
        .then(response => response.json())
        .then(data => {
            resetErrors();

            let error = Object.values(EmailChangeError).find((error) => error.id === data.result);

            if (error.id === EmailChangeError.SUCCESS.id) location.reload();
            else showError(error.message);
        })
        .catch(error => console.error('Error:', error));
}

function changePassword(oldPassword, newPassword) {
    let params = new URLSearchParams({oldPassword: oldPassword, newPassword: newPassword}).toString();

    fetch(`/api/changepassword?${params}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            resetErrors();

            let error = Object.values(PasswordChangeError).find((error) => error.id === data.result);
            console.log(error);

            if (error.id === PasswordChangeError.SUCCESS.id) location.reload();
            else showPasswordError(error.message, true);
        })
        .catch(error => console.error('Error:', error));

}

function changeEmailButton() {
    let changeEmailButton = document.getElementById('change-email');
    changeEmailButton.textContent = 'Add Email';
    changeEmailButton.style.color = 'green';
    changeEmailButton.style.borderColor = 'green';

    changeEmailButton.onmouseover = function() {
        this.style.color = 'white';
        this.style.border = '1px solid gray';
    };
    changeEmailButton.onmouseout = function() {
        this.style.color = 'green';
        this.style.border = '1px solid green';
    };
}

let errorTimeout;

function showError(message) {
    let inputElements = document.querySelectorAll('.modal-body input');

    inputElements.forEach(input => {
        input.style.borderColor = 'red';
    });

    let errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;

    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(resetErrors, 3000);
}

function showPasswordError(message, highlightOld) {
    let passwordInputElements = document.querySelectorAll('.info-field input[type="password"]');
    let passwordErrorMessage = document.getElementById('main-error-message');

    passwordInputElements.forEach((input, index) => {
        if (!highlightOld && index === 0) input.borderColor = '';
        else input.style.borderColor = 'red';
    });

    passwordErrorMessage.textContent = message;

    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(resetErrors, 3000);
}

function resetErrors() {
    let inputElements = document.querySelectorAll('.modal-body input');

    inputElements.forEach(input => {
        input.style.borderColor = '';
    });

    let errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';

    let passwordInputElements = document.querySelectorAll('.info-field input[type="password"]');

    passwordInputElements.forEach(input => {
        input.style.borderColor = '';
    });

    let passwordErrorMessage = document.getElementById('main-error-message');
    passwordErrorMessage.textContent = '';
}

function updateModal(type) {
    document.getElementById('promptModalLabel').textContent = `Change ${type}`;

    document.querySelectorAll('.modal-body label').forEach((label, index) => {
        label.textContent = `${type}${index === 0 ? '' : ' Confirmation'}`;
        label.htmlFor = `${type.toLowerCase()}${index === 0 ? '' : '-confirm'}`;
    });

    document.querySelectorAll('.modal-body input').forEach((input, index) => {
        input.id = `${type.toLowerCase()}${index === 0 ? '' : '-confirm'}`;
    });
}
