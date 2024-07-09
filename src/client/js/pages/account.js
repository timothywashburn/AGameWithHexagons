import { NameChangeError, EmailChangeError } from '../../../shared/enums.js';

window.onload = function() {

    fetch('/api/account', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        }
    })
        .then(response => response.json())
        .then(data => {
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

    let modal = document.getElementById('promptModal');

    modal.addEventListener('hidden.bs.modal', function () {
        updateModal("placeholder")
        document.getElementById('placeholder').value = '';
        document.getElementById('placeholder-confirm').value = '';

        resetErrors();
    });
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
            console.log(error);

            if (error.id === EmailChangeError.SUCCESS.id) location.reload();
            else showError(error.message);
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

function showError(message) {
    let inputElements = document.querySelectorAll('.modal-body input');

    inputElements.forEach(input => {
        input.style.borderColor = 'red';
    });

    let errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
}

function resetErrors() {
    let inputElements = document.querySelectorAll('.modal-body input');

    inputElements.forEach(input => {
        input.style.borderColor = '';
    });

    let errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';
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
