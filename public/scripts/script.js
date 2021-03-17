let form = document.getElementById('form')
let fname = form.querySelector('#fname')
let lname = form.querySelector('#lname')
let age = form.querySelector('#age')
let email = form.querySelector('#email')
let password = form.querySelector('#password')
let confirmPassword = form.querySelector('#confirm-password')
let submitButton = form.querySelector('.form__submit-button')
let modal = document.getElementById('modal')
let modalContent = modal.querySelector('#modal-content')
let modalText = modalContent.querySelector('#modal-text')
let modalButton = modal.querySelector('#modal-button')
let gender = () => {
    for (let element of form['gender']) {
        if (element.checked) {
            return element.value
        }
    }
}

class User {
    fname;
    lname;
    gender;
    age;
    email;
    password;

    constructor(fname, lname, gender, age, email, password) {
        this.fname = fname;
        this.lname = lname;
        this.gender = gender;
        this.age = age;
        this.email = email;
        this.password = password;
    }

    userInfo() {
        return `${this.fname} ${this.lname}, ${this.gender}, age: ${this.age} ,email: ${this.email}, password: ${this.password}`
    }
}

submitButton.onclick = (event) => {
    event.preventDefault()

    let user = new User(fname.value, lname.value, gender(), age.value, email.value, password.value)
    if (formValidCheck(form)) {
        showModalForm(user)
        sendNewUser(user)
    }

}

modalButton.onclick = () => {
    document.location.href = '/'
}

for (let element of form.elements) {
    element.oninput = () => {
        clearError(form)
        clearError(element)
    }
}

function formValidCheck(form) {
    console.log('formValidCheck start', email.value)
    let errors = 0;
    clearError(form)
    for (let element of form.elements) {
        if (elementValidCheck(element) === false) {
            errors++
            break;
        }
    }
    console.log('formValidCheck end', email.value)
    return errors === 0

}

function elementValidCheck(element) {
    switch (element.type) {
        case 'email':
            clearError(element)
            if (emptyInputCheck(element)
                && emailValidCheck(element)) {
                return true
            } else {
                if (!emptyInputCheck(element)) {
                    errorAlert(element, 'Enter email')
                    return false
                } else {
                    if (!emailValidCheck(element)) {
                        errorAlert(element, 'Incorrect email')
                    }
                }
                return false
            }

        case 'password':
            clearError(element)
            if (emptyInputCheck(password)
                && emptyInputCheck(confirmPassword)
                && passwordValidCheck(password, confirmPassword)) {
                return true
            } else {
                if (element.id === 'password'
                    && !emptyInputCheck(password)) {
                    errorAlert(element, 'Enter password')
                } else {
                    if (!emptyInputCheck(confirmPassword)) {
                        errorAlert(confirmPassword, 'Confirm password')
                    } else {
                        if (!passwordValidCheck(password, confirmPassword)) {
                            clearError(form)
                            errorAlert(form, 'Passwords do not match')
                        }
                    }
                }
                return false
            }

        case 'radio':
            clearError(element)
            if (radioInputCheck(element)) {
                return true
            } else {
                errorAlert(element, 'This field is required')
                return false
            }

        case 'number':
            clearError(element)
            if (emptyInputCheck(element)
                && element.value > 10
                && element.value < 100) {
                return true
            } else {
                if (!emptyInputCheck(element)) {
                    errorAlert(element, 'This field is required')
                } else {
                    if (element.value < 10 || element.value > 100) {
                        errorAlert(element, 'Not valid age')
                    }
                }
                return false
            }

        case 'text':
            clearError(element)

            if (emptyInputCheck(element)) {
                return true
            } else {
                errorAlert(element, 'This field is required')
                return false
            }

    }

}

function passwordValidCheck(pass, confirm) {

    return pass.value === confirm.value;

}

function emailValidCheck(element) {
    let email = element.value
    let emailLocalPart = email.slice(0, email.indexOf('@'))
    let emailDomainPart = email.slice(email.indexOf('@') + 1)
    return !(emailLocalPart.match(/[^A-Za-z0-9!#$%&'*+\-/=?^_.`{|}~]/g) !== null
        || emailDomainPart.match(/[^A-Za-z0-9.]/g) !== null
        || emailLocalPart.length === 0
        || email.indexOf('@') === -1
        || emailDomainPart.indexOf('.') === -1
        //check for dot-errors (te..st@test.com/ test.com. /test.@test.com)
        || emailLocalPart.split('.').indexOf('') !== -1
        || emailDomainPart.split('.').indexOf('') !== -1);
}

function errorAlert(element, err) {

    let errAddress;
    if (element.type === 'radio') {
        errAddress = document.getElementById(`error-${element.name}`)
    } else {
        errAddress = document.getElementById(`error-${element.id}`)
    }
    let error = document.createElement('div')
    error.className = 'error'
    error.innerText = err
    errAddress.append(error)

}

function clearError(element) {
    let errAddress;
    if (element.type === 'radio') {
        errAddress = document.getElementById(`error-${element.name}`)
    } else {
        errAddress = document.getElementById(`error-${element.id}`)
    }
    errAddress.innerHTML = ''
}

function emptyInputCheck(element) {
    if (element.type === 'radio') {
        radioInputCheck(element)
    } else {
        return (element.value !== '' && element.value !== undefined)
    }

}

function radioInputCheck(element) {
    let name = element.name
    let checked = 0;
    for (let e of form) {
        if (e.name === name) {
            if (e.checked) {
                checked = 1
                break;
            }
        }
    }
    return checked === 1
}

async function getUsersList() {
    let usersList = ''
    await fetch('', {
        method: 'POST',
        headers: {
            'task': 'users-list'
        }
    })
        .then(response => response.json())
        .then(result => {
                for (let obj of result) {
                    let user = new User(obj.fname, obj.lname, obj.gender, obj.age, obj.email, obj.password)
                    usersList += `${result.indexOf(obj) + 1}: ${user.userInfo()}<br>`
                }
            }
        )
    return usersList
}

function showModalForm(user) {
    modalText.innerHTML = ''
    let newUser = document.createElement('p')
    newUser.className = 'modal__text'
    newUser.innerHTML = `New user:<br>${user.fname} ${user.lname}, ${user.gender}, age: ${user.age}, email: ${user.email}, password: ${user.password}`
    let usersList = document.createElement('p')
    getUsersList()
        .then(result => {
            if (result === undefined) {
                usersList = `Users list is empty`
            }
            usersList.innerHTML = `Users list:<br>${result}`
        })
    usersList.className = 'modal__text'
    modalText.append(newUser)
    modalText.append(usersList)
    modal.style.display = "block"
}

function sendNewUser(user) {
    fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'task': 'new-user'
        },
        body: JSON.stringify(user)
    }).then()
}
