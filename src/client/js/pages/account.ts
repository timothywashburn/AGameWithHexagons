import {
    NameChangeError,
    EmailChangeError,
    PasswordChangeError,
    ToastMessage,
} from '../../../shared/enums';
import { showToast } from "../controllers/toast";
import { Modal } from "bootstrap";

window.onload = function() {
    showToasts();

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

            (document.getElementById('username') as HTMLInputElement).value = data.info.username;

            if (data.info.email === null) changeEmailButton();
            else (document.getElementById('email') as HTMLInputElement).value = data.info.email;

            if(data.info.email != null && data.info.email_verified.data[0] === 0) {
                let div = document.getElementById('unverified-container') as HTMLElement;
                div.style.visibility = 'visible';
            }

        })
        .catch(error => console.error('Error:', error));
};

function showToasts() {
    const urlParams = new URLSearchParams(window.location.search);
    const toastId = urlParams.get('toast') as string;

    let toast = Object.values(ToastMessage).find((toast) => toast.id === parseInt(toastId));
    if (toast) showToast(toast.message, toast.color);
}

function setupButtons() {
    let changeEmailButton = document.getElementById('change-email') as HTMLElement;
    changeEmailButton.onclick = function () {
        let modal = new Modal(document.getElementById('promptModal') as HTMLElement);
        modal.show();

        updateModal('Email');
    }

    let changeNameButton = document.getElementById('change-username') as HTMLElement;
    changeNameButton.onclick = function () {
        let modal = new Modal(document.getElementById('promptModal') as HTMLElement);
        modal.show();

        updateModal('Username');
    }

    let logoutButton = document.getElementById('logoutBtn') as HTMLElement;
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

    let modal = document.getElementById('promptModal') as HTMLElement;
    modal.addEventListener('hidden.bs.modal', function () {
        updateModal('placeholder');
        (document.getElementById('placeholder') as HTMLInputElement).value = '';
        (document.getElementById('placeholder-confirm') as HTMLInputElement).value = '';

        resetErrors();
    });

    let resendLink = document.getElementById('resend-link') as HTMLElement;
    resendLink.addEventListener('click', function(e) {
        e.preventDefault();

        fetch('/api/resendverification', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            }
        })
            .then(response => response.json())
            .then(data => {
                let link = document.getElementById('resend-link') as HTMLElement;
                link.removeAttribute('href');

                if (data.success) {
                    link.textContent = 'Verification Email Sent!';
                    link.style.color = 'green';
                } else {
                    link.textContent = 'Error Sending Verification Email';
                    link.style.color = 'red';
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
}

(document.getElementById('placeholderForm') as HTMLElement).addEventListener('submit', function(e) {
    e.preventDefault();

    let confirmButton = document.getElementById('confirmBtn') as HTMLElement;
    confirmButton.addEventListener('click', function() {
        let modalTitle = (document.getElementById('promptModalLabel') as HTMLElement).textContent;

        if (modalTitle === 'Change Email') {
            let email = (document.getElementById('email') as HTMLInputElement).value;
            let confirm = (document.getElementById('email-confirm') as HTMLInputElement).value;

            if (email !== confirm) {
                showError('Emails do not match');
                return;
            }

            changeEmail(email);
        } else if (modalTitle === 'Change Username') {
            let username = (document.getElementById('username') as HTMLInputElement).value;
            let confirm = (document.getElementById('username-confirm') as HTMLInputElement).value;

            if (username !== confirm) {
                showError('Usernames do not match');
                return;
            }

            changeUsername(username);
        }
    });

    let cancelButton = document.getElementById('cancelBtn') as HTMLElement;
    cancelButton.addEventListener('click', function() {
        let modal = document.getElementById('promptModal') as HTMLElement;

        updateModal('placeholder');
        (document.getElementById('placeholder') as HTMLInputElement).value = '';
        (document.getElementById('placeholder-confirm') as HTMLInputElement).value = '';

        resetErrors();

        modal.classList.remove('show');
        modal.style.display = 'none';

        let backdrops = document.getElementsByClassName('modal-backdrop') as HTMLCollectionOf<Element>;
        for (let i = 0; i < backdrops.length; i++) {
            backdrops[i].parentNode!.removeChild(backdrops[i]);
        }
    });
});

(document.getElementById('changePasswordForm') as Element).addEventListener('submit', function(e) {
    e.preventDefault();

    let changePasswordButton = document.getElementById('change-password') as HTMLInputElement;
    changePasswordButton.onclick = function() {
        let oldPassword = (document.getElementById('old-password') as HTMLInputElement).value;
        let newPassword = (document.getElementById('new-password') as HTMLInputElement).value;
        let confirm = (document.getElementById('confirm-new-password') as HTMLInputElement).value;

        if (newPassword !== confirm) {
            resetErrors();
            showPasswordError('Passwords do not match', false);
            return;
        }

        changePassword(oldPassword, confirm);
    }
});

function changeUsername(newUsername: string) {
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

            let error = Object.values(NameChangeError).find((error) => error.id === data.result) as NameChangeError;
            console.log(error);

            if (error.id === NameChangeError.SUCCESS.id) {
                location.href = `/account?toast=${ToastMessage.NAME_CHANGE_SUCCESS.id}`;
            }
            else showError(error.message);
        })
        .catch(error => console.error('Error:', error));
}

function changeEmail(newEmail: string) {
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

            let error = Object.values(EmailChangeError).find((error) => error.id === data.result) as EmailChangeError;

            if (error.id === EmailChangeError.SUCCESS.id) {
                location.href = `/account?toast=${ToastMessage.EMAIL_CHANGE_SUCCESS.id}`;
            }
            else showError(error.message);
        })
        .catch(error => console.error('Error:', error));
}

function changePassword(oldPassword: string, newPassword: string) {
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

            let error = Object.values(PasswordChangeError).find((error) => error.id === data.result) as PasswordChangeError;
            console.log(error);

            if (error.id === PasswordChangeError.SUCCESS.id) {
                location.href = `/account?toast=${ToastMessage.PASSWORD_CHANGE_SUCCESS.id}`;
            }
            else showPasswordError(error.message, true);
        })
        .catch(error => console.error('Error:', error));

}

function changeEmailButton() {
    let changeEmailButton = document.getElementById('change-email') as HTMLElement;
    changeEmailButton.textContent = 'Add Email';
    changeEmailButton.style.color = 'green';
    changeEmailButton.style.borderColor = 'green';

    changeEmailButton.onmouseover = function() {
        (this as HTMLElement).style.color = 'white';
        (this as HTMLElement).style.border = '1px solid gray';
    };
    changeEmailButton.onmouseout = function() {
        (this as HTMLElement).style.color = 'green';
        (this as HTMLElement).style.border = '1px solid green';
    };
}

let errorTimeout: NodeJS.Timeout;

function showError(message: string) {
    let inputElements = document.querySelectorAll('.modal-body input') as NodeListOf<HTMLInputElement>;

    inputElements.forEach((input: HTMLElement) => {
        input.style.borderColor = 'red';
    });

    let errorMessage = document.getElementById('error-message') as HTMLElement;
    errorMessage.textContent = message;

    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(resetErrors, 3000);
}

function showPasswordError(message: string, highlightOld: boolean) {
    let passwordInputElements = document.querySelectorAll('.info-field input[type="password"]') as NodeListOf<HTMLInputElement>;
    let passwordErrorMessage = document.getElementById('main-error-message') as HTMLElement;

    passwordInputElements.forEach((input: HTMLElement, index: number) => {
        if (!highlightOld && index === 0) input.style.borderColor = '';
        else input.style.borderColor = 'red';
    });

    passwordErrorMessage.textContent = message;

    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(resetErrors, 3000);
}

function resetErrors() {
    let inputElements = document.querySelectorAll('.modal-body input') as NodeListOf<HTMLInputElement>;
    inputElements.forEach((input: HTMLElement) => {
        input.style.borderColor = '';
    });

    let errorMessage = document.getElementById('error-message') as HTMLElement;
    errorMessage.textContent = '';

    let passwordInputElements = document.querySelectorAll('.info-field input[type="password"]') as NodeListOf<HTMLInputElement>;
    passwordInputElements.forEach((input: HTMLElement) => {
        input.style.borderColor = '';
    });

    let passwordErrorMessage = document.getElementById('main-error-message') as HTMLElement;
    passwordErrorMessage.textContent = '';
}

function updateModal(type: string) {
    let promptModalLabel = document.getElementById('promptModalLabel') as HTMLElement;
    promptModalLabel.textContent = `Change ${type}`;

    let modalBodyLabels = document.querySelectorAll('.modal-body label') as NodeListOf<HTMLLabelElement>;
    modalBodyLabels.forEach((label: HTMLLabelElement, index) => {
        label.textContent = `${type}${index === 0 ? '' : ' Confirmation'}`;
        label.htmlFor = `${type.toLowerCase()}${index === 0 ? '' : '-confirm'}`;
    });

    document.querySelectorAll('.modal-body input').forEach((input, index) => {
        input.id = `${type.toLowerCase()}${index === 0 ? '' : '-confirm'}`;
    });
}
