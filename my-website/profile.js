// profile.js
// --- Общие функции ---
function getUser() {
    return JSON.parse(localStorage.getItem('hogwarts_user') || '{}');
}
function setUser(user) {
    localStorage.setItem('hogwarts_user', JSON.stringify(user));
}
function getRoleLabel(role) {
    if (role === 'student') return 'Студент';
    if (role === 'university') return 'Представитель вуза';
    return '';
}
function getProfilePhotoHTML(photo) {
    if (photo) {
        return `<img src="${photo}" alt="Фото профиля">`;
    } else {
        return `<svg width="64" height="64" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#bbb" stroke-width="2"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="#bbb" stroke-width="2"/></svg>`;
    }
}
function renderHeaderNav() {
    const nav = document.querySelector('.header__nav');
    if (!nav) return;
    nav.innerHTML = '';
    // Кнопки
    const btnUniv = document.createElement('button');
    btnUniv.className = 'header__btn';
    btnUniv.textContent = 'Вузы';
    nav.appendChild(btnUniv);
    const btnDates = document.createElement('button');
    btnDates.className = 'header__btn';
    btnDates.textContent = 'Даты подачи заявлений';
    nav.appendChild(btnDates);
    // Кнопка Личный кабинет
    const profileBtn = document.createElement('button');
    profileBtn.className = 'header__btn header__profile-link';
    profileBtn.textContent = 'Личный кабинет';
    profileBtn.onclick = () => { window.location.href = 'profile.html'; };
    nav.appendChild(profileBtn);
    // Кнопка Выход
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'header__btn logout';
    logoutBtn.textContent = 'Выход';
    logoutBtn.onclick = () => {
        localStorage.removeItem('hogwarts_logged');
        window.location.href = 'index.html';
    };
    nav.appendChild(logoutBtn);
}
// --- Профиль ---
if (document.getElementById('profileRole')) {
    const user = getUser();
    document.getElementById('profileRole').textContent = getRoleLabel(user.role);
    document.getElementById('profilePhoto').innerHTML = getProfilePhotoHTML(user.photo);
    document.getElementById('profileName').textContent = user.name || '—';
    document.getElementById('profileEmail').textContent = user.email || '—';
    document.getElementById('profileUniversity').textContent = user.university || '—';
    document.getElementById('profileDepartment').textContent = user.department || '—';
    document.getElementById('profileLevel').textContent = user.level || '—';
    document.getElementById('profileDirection').textContent = user.direction || '—';
    document.getElementById('profileForm').textContent = user.form || '—';
    document.getElementById('profileCourse').textContent = user.course || '—';
    document.getElementById('editProfileBtn').onclick = () => {
        window.location.href = 'edit-profile.html';
    };
}
// --- Редактирование профиля ---
if (document.getElementById('profileEditForm')) {
    const user = getUser();
    // Заполнение полей
    document.getElementById('editName').value = user.name || '';
    document.getElementById('editUniversity').value = user.university || '';
    document.getElementById('editDepartment').value = user.department || '';
    document.getElementById('editLevel').value = user.level || '';
    document.getElementById('editDirection').value = user.direction || '';
    document.getElementById('editForm').value = user.form || '';
    document.getElementById('editCourse').value = user.course || '';
    if (user.photo) {
        document.getElementById('editProfilePhoto').innerHTML = `<img src="${user.photo}" alt="Фото профиля">`;
    }
    // Загрузка фото
    document.getElementById('editPhotoInput').onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                document.getElementById('editProfilePhoto').innerHTML = `<img src="${evt.target.result}" alt="Фото профиля">`;
                user.photo = evt.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    // Сохранить
    document.getElementById('profileEditForm').onsubmit = function(e) {
        e.preventDefault();
        user.name = document.getElementById('editName').value;
        user.university = document.getElementById('editUniversity').value;
        user.department = document.getElementById('editDepartment').value;
        user.level = document.getElementById('editLevel').value;
        user.direction = document.getElementById('editDirection').value;
        user.form = document.getElementById('editForm').value;
        user.course = document.getElementById('editCourse').value;
        setUser(user);
        window.location.href = 'profile.html';
    };
    // Назад
    document.getElementById('profileBackBtn').onclick = function() {
        window.location.href = 'profile.html';
    };
}
// Для profile.html и edit-profile.html
if (window.location.pathname.endsWith('profile.html') || window.location.pathname.endsWith('edit-profile.html')) {
    window.addEventListener('DOMContentLoaded', renderHeaderNav);
    // Кликабельная метла
    const logo = document.getElementById('headerLogo');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.onclick = () => { window.location.href = 'index.html'; };
    }
}
// --- Кнопка Личный кабинет в шапке (главная) ---
window.addEventListener('DOMContentLoaded', () => {
    const logged = localStorage.getItem('hogwarts_logged') === '1';
    const nav = document.querySelector('.header__nav');
    if (!nav) return;
    if (logged && !nav.querySelector('.header__profile-link')) {
        const profileBtn = document.createElement('button');
        profileBtn.className = 'header__btn header__profile-link';
        profileBtn.textContent = 'Личный кабинет';
        profileBtn.onclick = () => {
            window.location.href = 'profile.html';
        };
        // Вставляем перед кнопкой Выход, если есть
        const logoutBtn = nav.querySelector('.header__btn.logout');
        if (logoutBtn) {
            nav.insertBefore(profileBtn, logoutBtn);
        } else {
            nav.appendChild(profileBtn);
        }
    }
}); 