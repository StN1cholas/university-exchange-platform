// auth.js
// Переходы между формами
if (document.getElementById('toRegister')) {
    document.getElementById('toRegister').onclick = () => {
        window.location.href = 'register.html';
    };
}
if (document.getElementById('toLogin')) {
    document.getElementById('toLogin').onclick = () => {
        window.location.href = 'login.html';
    };
}
// --- Логика для чекбоксов роли и валидации регистрации ---
const regEmail = document.getElementById('registerEmail');
const regPassword = document.getElementById('registerPassword');
const regStudent = document.getElementById('roleStudent');
const regUniversity = document.getElementById('roleUniversity');
const regSubmit = document.getElementById('registerSubmit');
const regError = document.getElementById('registerError');

function updateRegisterState() {
    // Только один чекбокс
    if (regStudent && regUniversity) {
        regStudent.onchange = () => {
            if (regStudent.checked) regUniversity.checked = false;
            updateRegisterState();
        };
        regUniversity.onchange = () => {
            if (regUniversity.checked) regStudent.checked = false;
            updateRegisterState();
        };
    }
    // Проверка условий
    const emailFilled = regEmail && regEmail.value.trim().length > 0;
    const passFilled = regPassword && regPassword.value.trim().length > 0;
    const oneRole = (regStudent && regStudent.checked) ^ (regUniversity && regUniversity.checked);
    regSubmit.disabled = !(emailFilled && passFilled && oneRole);
    if (!oneRole && (regStudent.checked || regUniversity.checked)) {
        regError.textContent = 'Выберите только одну роль';
    } else {
        regError.textContent = '';
    }
}
if (regEmail && regPassword && regStudent && regUniversity) {
    regEmail.oninput = updateRegisterState;
    regPassword.oninput = updateRegisterState;
    regStudent.onchange = updateRegisterState;
    regUniversity.onchange = updateRegisterState;
    updateRegisterState();
}
// ---
// Регистрация
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').onsubmit = function(e) {
        e.preventDefault();
        const email = regEmail.value;
        const password = regPassword.value;
        let role = '';
        if (regStudent.checked) role = 'student';
        if (regUniversity.checked) role = 'university';
        if (!role) {
            regError.textContent = 'Выберите роль';
            return;
        }
        localStorage.setItem('hogwarts_user', JSON.stringify({ email, password, role }));
        localStorage.setItem('hogwarts_logged', '1');
        window.location.href = 'index.html';
    };
}
// Вход
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').onsubmit = function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const user = JSON.parse(localStorage.getItem('hogwarts_user') || '{}');
        if (user.email === email && user.password === password) {
            localStorage.setItem('hogwarts_logged', '1');
            window.location.href = 'index.html';
        } else {
            alert('Неверная почта или пароль');
        }
    };
} 