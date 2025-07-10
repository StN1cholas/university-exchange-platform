// Открытие/закрытие выпадающего меню по клику на глаз
const eyeButton = document.getElementById('eyeButton');
const dropdownMenu = document.getElementById('dropdownMenu');

document.addEventListener('click', (e) => {
    if (eyeButton && dropdownMenu) {
        if (eyeButton.contains(e.target)) {
            dropdownMenu.classList.toggle('active');
        } else if (!dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('active');
        }
    }
});

// Появление логотипа "Движ" в шапке при прокрутке hero-блока
const headerLogo = document.getElementById('headerLogo');
const heroSection = document.querySelector('.hero');

function handleScroll() {
    if (!headerLogo || !heroSection) return;
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    if (heroBottom <= 64) {
        headerLogo.style.opacity = '1';
    } else {
        headerLogo.style.opacity = '1'; // Можно сделать fade, если нужно скрывать
    }
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('DOMContentLoaded', handleScroll);

// --- Логика фильтра программ ---
const filterBtn = document.getElementById('filterBtn');
const filterDropdown = document.getElementById('filterDropdown');
const filterCategories = document.querySelectorAll('.filter-category');
const filterOptions = document.getElementById('filterOptions');
const filterApplyBtn = document.getElementById('filterApplyBtn');
const selectedFilters = document.getElementById('selectedFilters');
let activeCategory = null;

// // Пример данных для фильтра
// const universitiesList = [
//     'ИТМО', 'ННГУ', 'МГУ', 'МФТИ', 'УРФУ', 'ДФУ'
// ];
let selectedUniversities = [];

// // --- Данные для фильтра ---
// const directionsList = [
//     'Социология', 'Радиофизика', 'Компьютерные технологии', 'Философия', 'Религиоведение'
// ];
// const formsList = ['Очно', 'Заочно'];
// const languagesList = ['Русский', 'Английский'];
// const durationsList = ['3 месяца', '6 месяцев', '9 месяцев'];
// const citiesList = [
//     'г. Нижний Новгород, Нижегородская область',
//     'г. Екатеринбург, Свердловская область',
//     'г. Москва, Московская область',
//     'г. Санкт-Петербург, Ленинградская область',
//     'г. Владивосток, Приморский край',
//     'г. Казань, Республика Татарстан'
// ];

let universitiesList = [];
let directionsList = []; // Мы пока не сделали для него ручку, так что он будет пуст
let citiesList = [];
let languagesList = [];
let formsList = [];
let durationsList = [];

let selectedGrade = null;
let selectedDirection = null;
let selectedForm = null;
let selectedLanguage = null;
let selectedCity = null;
let selectedDuration = null;
let universitySearch = '';
let citySearch = '';

// --- ИЗМЕНЕНИЕ 2: ДОБАВЛЯЕМ НОВУЮ ФУНКЦИЮ ЗАГРУЗКИ ДАННЫХ ---

/**
 * Загружает все необходимые данные для фильтров с бэкенда.
 */
async function loadFilterData() {
    console.log("Загружаем данные для фильтров...");
    try {
        // Делаем все запросы одновременно для максимальной скорости
        const [
            citiesRes,
            universitiesRes,
            languagesRes,
            durationsRes,
            fieldsOfStudyRes,
            studyFormatsRes
        ] = await Promise.all([
            fetch('http://localhost:8080/api/v1/filters/cities'),
            fetch('http://localhost:8080/api/v1/filters/universities'),
            fetch('http://localhost:8080/api/v1/filters/languages'),
            fetch('http://localhost:8080/api/v1/filters/durations'),
            fetch('http://localhost:8080/api/v1/filters/fields-of-study'),
            fetch('http://localhost:8080/api/v1/filters/study-formats')
        ]);

        // Превращаем ответы в JSON
        const cities = await citiesRes.json();
        const universities = await universitiesRes.json();
        const languages = await languagesRes.json();
        const durations = await durationsRes.json();
        const fieldsOfStudy = await fieldsOfStudyRes.json();
        const studyFormats = await studyFormatsRes.json();

        // Заполняем наши пустые массивы реальными данными из БД
        // Приводим города к формату "г. Город, Область", чтобы фронтенд не сломался
        citiesList = cities.map(city => `г. ${city}`);
        universitiesList = universities;
        languagesList = languages;
        durationsList = durations;
        directionsList = fieldsOfStudy;
        formsList = studyFormats;

        console.log("Данные для фильтров успешно загружены!");

    } catch (error) {
        console.error("Не удалось загрузить данные для фильтров:", error);
    }
}

const courseOptions = [
    { group: 'Бакалавриат', values: ['1 курс', '2 курс', '3 курс', '4 курс'] },
    { group: 'Магистратура', values: ['1 курс', '2 курс'] },
    { group: 'Специалитет', values: ['1 курс', '2 курс', '3 курс', '4 курс', '5 курс'] },
];
let selectedCourse = null;

function renderFilterOptions(category) {
    filterOptions.innerHTML = '';
    if (category === 'grade') {
        // Ползунок успеваемости
        const sliderWrap = document.createElement('div');
        sliderWrap.className = 'filter-slider';
        const value = document.createElement('div');
        value.className = 'filter-slider-value';
        value.textContent = selectedGrade.toFixed(1);
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 1;
        slider.max = 5;
        slider.step = 0.1;
        slider.value = selectedGrade;
        slider.className = 'slider';
        slider.oninput = (e) => {
            selectedGrade = parseFloat(e.target.value);
            value.textContent = selectedGrade.toFixed(1);
        };
        sliderWrap.appendChild(value);
        sliderWrap.appendChild(slider);
        // Подписи
        const labels = document.createElement('div');
        labels.className = 'filter-slider-labels';
        for (let i = 1; i <= 5; i++) {
            const label = document.createElement('span');
            label.textContent = i;
            labels.appendChild(label);
        }
        sliderWrap.appendChild(labels);
        filterOptions.appendChild(sliderWrap);
    } else if (category === 'universities') {
        // Поиск по вузам
        let prevActive = document.activeElement;
        let prevSelectionStart = null, prevSelectionEnd = null;
        if (prevActive && prevActive.classList && prevActive.classList.contains('filter-search')) {
            prevSelectionStart = prevActive.selectionStart;
            prevSelectionEnd = prevActive.selectionEnd;
        }
        const search = document.createElement('input');
        search.type = 'text';
        search.className = 'filter-search';
        search.placeholder = 'Поиск по вузам...';
        search.value = universitySearch;
        search.oninput = (e) => {
            universitySearch = e.target.value;
            renderFilterOptions('universities');
        };
        filterOptions.appendChild(search);
        // Восстановление фокуса и позиции курсора
        setTimeout(() => {
            if (document.activeElement !== search) {
                search.focus();
            }
            if (prevSelectionStart !== null && prevSelectionEnd !== null) {
                search.setSelectionRange(prevSelectionStart, prevSelectionEnd);
            }
        }, 0);
        // Кнопка "Все"
        const filtered = universitiesList.filter(u => u.toLowerCase().includes(universitySearch.toLowerCase()));
        const allOption = document.createElement('div');
        allOption.className = 'filter-option' + (selectedUniversities.length === universitiesList.length ? ' selected' : '');
        allOption.textContent = 'Все';
        allOption.onclick = () => {
            if (selectedUniversities.length === universitiesList.length) {
                selectedUniversities = [];
            } else {
                selectedUniversities = [...universitiesList];
            }
            renderFilterOptions('universities');
        };
        filterOptions.appendChild(allOption);
        // Список вузов
        filtered.forEach(u => {
            const option = document.createElement('div');
            option.className = 'filter-option' + (selectedUniversities.includes(u) ? ' selected' : '');
            option.textContent = u;
            if (selectedUniversities.includes(u)) {
                const check = document.createElement('span');
                check.className = 'checkmark';
                check.textContent = '✔';
                option.appendChild(check);
            }
            option.onclick = () => {
                if (selectedUniversities.includes(u)) {
                    selectedUniversities = selectedUniversities.filter(x => x !== u);
                } else {
                    selectedUniversities.push(u);
                }
                renderFilterOptions('universities');
            };
            filterOptions.appendChild(option);
        });
    } else if (category === 'direction') {
        // Направления обучения: вертикальный список
        directionsList.forEach(dir => {
            const item = document.createElement('div');
            item.className = 'filter-city-item' + (selectedDirection === dir ? ' selected' : '');
            item.textContent = dir;
            item.onclick = () => {
                selectedDirection = selectedDirection === dir ? null : dir;
                renderFilterOptions('direction');
            };
            filterOptions.appendChild(item);
        });
    } else if (category === 'form') {
        // Форма обучения
        const group = document.createElement('div');
        group.className = 'filter-btn-group';
        formsList.forEach(form => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn-option' + (selectedForm === form ? ' selected' : '');
            btn.textContent = form;
            btn.onclick = () => {
                selectedForm = selectedForm === form ? null : form;
                renderFilterOptions('form');
            };
            group.appendChild(btn);
        });
        filterOptions.appendChild(group);
    } else if (category === 'language') {
        // Язык обучения
        const group = document.createElement('div');
        group.className = 'filter-btn-group';
        languagesList.forEach(lang => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn-option' + (selectedLanguage === lang ? ' selected' : '');
            btn.textContent = lang;
            btn.onclick = () => {
                selectedLanguage = selectedLanguage === lang ? null : lang;
                renderFilterOptions('language');
            };
            group.appendChild(btn);
        });
        filterOptions.appendChild(group);
    } else if (category === 'city') {
        // Поиск по городам
        let prevActive = document.activeElement;
        let prevSelectionStart = null, prevSelectionEnd = null;
        if (prevActive && prevActive.classList && prevActive.classList.contains('filter-search')) {
            prevSelectionStart = prevActive.selectionStart;
            prevSelectionEnd = prevActive.selectionEnd;
        }
        const search = document.createElement('input');
        search.type = 'text';
        search.className = 'filter-search';
        search.placeholder = 'Поиск по городам...';
        search.value = citySearch;
        search.oninput = (e) => {
            citySearch = e.target.value;
            renderFilterOptions('city');
        };
        filterOptions.appendChild(search);
        // Восстановление фокуса и позиции курсора
        setTimeout(() => {
            if (document.activeElement !== search) {
                search.focus();
            }
            if (prevSelectionStart !== null && prevSelectionEnd !== null) {
                search.setSelectionRange(prevSelectionStart, prevSelectionEnd);
            }
        }, 0);
        // Список городов
        const filtered = citiesList.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));
        const list = document.createElement('div');
        list.className = 'filter-city-list';
        filtered.forEach(city => {
            const item = document.createElement('div');
            item.className = 'filter-city-item' + (selectedCity === city ? ' selected' : '');
            item.textContent = city;
            item.onclick = () => {
                selectedCity = selectedCity === city ? null : city;
                renderFilterOptions('city');
            };
            list.appendChild(item);
        });
        filterOptions.appendChild(list);
    } else if (category === 'duration') {
        // Продолжительность
        const group = document.createElement('div');
        group.className = 'filter-btn-group';
        durationsList.forEach(dur => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn-option' + (selectedDuration === dur ? ' selected' : '');
            btn.textContent = dur;
            btn.onclick = () => {
                selectedDuration = selectedDuration === dur ? null : dur;
                renderFilterOptions('duration');
            };
            group.appendChild(btn);
        });
        filterOptions.appendChild(group);
    } else if (category === 'course') {
        // Курс: вертикальный список
        courseOptions.forEach(group => {
            const groupLabel = document.createElement('div');
            groupLabel.style.fontWeight = 'bold';
            groupLabel.style.margin = '8px 0 4px 0';
            groupLabel.textContent = group.group;
            filterOptions.appendChild(groupLabel);
            group.values.forEach(val => {
                const item = document.createElement('div');
                item.className = 'filter-city-item' + (selectedCourse === val ? ' selected' : '');
                item.textContent = val;
                item.onclick = () => {
                    selectedCourse = selectedCourse === val ? null : val;
                    renderFilterOptions('course');
                };
                filterOptions.appendChild(item);
            });
        });
    } else {
        // fallback
        const stub = document.createElement('div');
        stub.className = 'filter-option';
        stub.textContent = 'Скоро будет...';
        filterOptions.appendChild(stub);
    }
}

// Переключение категорий фильтра
filterCategories.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) {
            // Если уже активен — скрыть подполя
            btn.classList.remove('active');
            filterOptions.classList.remove('active');
            filterApplyBtn.style.display = 'none';
            activeCategory = null;
            return;
        }
        filterCategories.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category;
        renderFilterOptions(activeCategory);
        filterOptions.classList.add('active');
        filterApplyBtn.style.display = 'block';
        // Позиционируем filterOptions под кнопкой относительно окна
        setTimeout(() => {
            const btnRect = btn.getBoundingClientRect();
            const filterWidth = filterOptions.offsetWidth;
            let left = btnRect.left + btnRect.width / 2 - filterWidth / 2;
            let top = btnRect.bottom + 8;
            // Защита от выхода за пределы экрана
            if (left < 8) left = 8;
            if (left + filterWidth > window.innerWidth - 8) left = window.innerWidth - filterWidth - 8;
            filterOptions.style.left = left + 'px';
            filterOptions.style.top = top + 'px';
            filterOptions.style.transform = '';
        }, 0);
    });
});

// // При загрузке все подполя скрыты
// window.addEventListener('DOMContentLoaded', () => {
//     filterCategories.forEach(b => b.classList.remove('active'));
//     filterOptions.classList.remove('active');
//     filterApplyBtn.style.display = 'none';
//     activeCategory = null;
// });

// Кнопка 'Принять' скрывает подполя
filterApplyBtn.addEventListener('click', () => {
    filterOptions.classList.remove('active');
    filterApplyBtn.style.display = 'none';
    filterCategories.forEach(b => b.classList.remove('active'));
    activeCategory = null;
    renderSelectedFilters();
});

function renderSelectedFilters() {
    selectedFilters.innerHTML = '';
    // Успеваемость
    if (selectedGrade !== null) {
        const filter = document.createElement('div');
        filter.className = 'selected-filter';
        filter.textContent = `Успеваемость: ${selectedGrade.toFixed(1)}`;
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-filter';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = () => {
            selectedGrade = null;
            renderSelectedFilters();
        };
        filter.appendChild(removeBtn);
        selectedFilters.appendChild(filter);
        //fetchPrograms();
    }
    // Вузы
    selectedUniversities.forEach(u => {
        const filter = document.createElement('div');
        filter.className = 'selected-filter';
        filter.textContent = u;
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-filter';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = () => {
            selectedUniversities = selectedUniversities.filter(x => x !== u);
            renderSelectedFilters();
        };
        filter.appendChild(removeBtn);
        selectedFilters.appendChild(filter);
    });
    // Направление
    if (selectedDirection) {
        const filter = document.createElement('div');
        filter.className = 'selected-filter';
        filter.textContent = `Направление: ${selectedDirection}`;
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-filter';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = () => {
            selectedDirection = null;
            renderSelectedFilters();
        };
        filter.appendChild(removeBtn);
        selectedFilters.appendChild(filter);
    }
    // Форма
    if (selectedForm) {
        const filter = document.createElement('div');
        filter.className = 'selected-filter';
        filter.textContent = `Форма: ${selectedForm}`;
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-filter';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = () => {
            selectedForm = null;
            renderSelectedFilters();
        };
        filter.appendChild(removeBtn);
        selectedFilters.appendChild(filter);
    }
    // Язык
    if (selectedLanguage) {
        const filter = document.createElement('div');
        filter.className = 'selected-filter';
        filter.textContent = `Язык: ${selectedLanguage}`;
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-filter';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = () => {
            selectedLanguage = null;
            renderSelectedFilters();
        };
        filter.appendChild(removeBtn);
        selectedFilters.appendChild(filter);
    }
    // Город
    if (selectedCity) {
        const filter = document.createElement('div');
        filter.className = 'selected-filter';
        filter.textContent = selectedCity;
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-filter';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = () => {
            selectedCity = null;
            renderSelectedFilters();
        };
        filter.appendChild(removeBtn);
        selectedFilters.appendChild(filter);
    }
    // Продолжительность
    if (selectedDuration) {
        const filter = document.createElement('div');
        filter.className = 'selected-filter';
        filter.textContent = `Продолжительность: ${selectedDuration}`;
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-filter';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = () => {
            selectedDuration = null;
            renderSelectedFilters();
        };
        filter.appendChild(removeBtn);
        selectedFilters.appendChild(filter);
    }
    // Курс
    if (selectedCourse) {
        const filter = document.createElement('div');
        filter.className = 'selected-filter';
        filter.textContent = `Курс: ${selectedCourse}`;
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-filter';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = () => {
            selectedCourse = null;
            renderSelectedFilters();
        };
        filter.appendChild(removeBtn);
        selectedFilters.appendChild(filter);
    }
    fetchPrograms();
}

// --- НОВЫЙ БЛОК: Логика взаимодействия с бэкендом ---

// Контейнер, куда мы будем вставлять карточки программ
const programsContainer = document.getElementById('programsContainer');

/**
 * Функция для отрисовки карточек программ на странице
 * @param {Array} programs - Массив объектов программ, полученный от бэкенда
 */
function renderPrograms(programs) {
    if (!programsContainer) return; // Если контейнера нет, ничего не делаем

    programsContainer.innerHTML = ''; // Очищаем старые результаты

    if (programs.length === 0) {
        programsContainer.innerHTML = '<p class="not-found">По вашему запросу ничего не найдено.</p>';
        return;
    }

    programs.forEach(program => {
        // Создаем HTML-элемент для одной карточки
        const card = document.createElement('div');
        card.className = 'program-card'; // Присваиваем класс для стилизации

        // Наполняем карточку данными из объекта program
        card.innerHTML = `
            <h3 class="program-title">${program.title}</h3>
            <p class="university-name">${program.universityName}, ${program.city}</p>
            <div class="program-details">
                <span><strong>Язык:</strong> ${program.language}</span>
                <span><strong>Длительность:</strong> ${program.duration}</span>
                <span><strong>GPA от:</strong> ${program.minGpaRequired}</span>
            </div>
            <p class="program-description">${program.description || ''}</p>
            <p class="program-competencies"><strong>Компетенции:</strong> ${program.competencies || ''}</p>
        `;

        // Добавляем созданную карточку в контейнер
        programsContainer.appendChild(card);
    });
}


/**
 * Главная функция для запроса программ с бэкенда
 */
async function fetchPrograms() {
    // 1. Собираем все выбранные фильтры в объект
    const params = new URLSearchParams();

    // ВАЖНО: Мы берем значения из тех же переменных, что и в твоем коде
    if (selectedCity) {
        // На бэкенд отправляем только название города
        const cleanCity = selectedCity.split(',')[0].replace('г.', '').trim();
        params.append('city', cleanCity);
    }
    if (selectedLanguage) {
        params.append('language', selectedLanguage);
    }
    if (selectedDuration) {
        params.append('duration', selectedDuration);
    }
    if (selectedForm) {
        params.append('studyFormat', selectedForm);
    }
    if (selectedDirection) {
        params.append('fieldOfStudy', selectedDirection);
    }
    if (selectedGrade) {
        params.append('grade', selectedGrade);
    }
    // Добавляем все выбранные университеты
    selectedUniversities.forEach(uni => {
        params.append('universityName', uni);
    });

    // Формируем URL для запроса
    const url = `http://localhost:8080/api/v1/programs?${params.toString()}`;

    console.log("Отправляем запрос на бэкенд:", url); // Очень полезно для отладки!

    try {
        const response = await fetch(url); // Отправляем GET-запрос

        if (!response.ok) {
            // Если сервер ответил ошибкой (404, 500 и т.д.)
            console.error("Ошибка от сервера:", response.status, response.statusText);
            programsContainer.innerHTML = '<p class="error">Произошла ошибка при загрузке данных.</p>';
            return;
        }

        const programs = await response.json(); // Превращаем ответ в JSON-объект (массив)
        console.log("Получены данные с бэкенда:", programs); // Полезно для отладки!

        // 2. Отрисовываем полученные программы на странице
        renderPrograms(programs);

    } catch (error) {
        // Если произошла сетевая ошибка (например, бэкенд не запущен)
        console.error("Сетевая ошибка:", error);
        programsContainer.innerHTML = '<p class="error">Не удалось подключиться к серверу. Убедитесь, что бэкенд запущен.</p>';
    }
}


// // --- Логика авторизации для главной страницы ---
// window.addEventListener('DOMContentLoaded', () => {
//     const logged = localStorage.getItem('hogwarts_logged') === '1';
//     const nav = document.querySelector('.header__nav');
//     if (!nav) return;
//     let loginBtn = nav.querySelector('.header__btn.login');
//     let logoutBtn = nav.querySelector('.header__btn.logout');
//     let profileIcon = nav.querySelector('.header__profile');
//     if (loginBtn) loginBtn.remove();
//     if (logoutBtn) logoutBtn.remove();
//     if (profileIcon) profileIcon.remove();
//     if (logged) {
//         // Кнопка Выход
//         const btn = document.createElement('button');
//         btn.className = 'header__btn logout';
//         btn.textContent = 'Выход';
//         btn.onclick = () => {
//             localStorage.removeItem('hogwarts_logged');
//             window.location.reload();
//         };
//         nav.appendChild(btn);
//         // Иконка профиля
//         const icon = document.createElement('span');
//         icon.className = 'header__profile';
//         icon.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="4" stroke="#007bff" stroke-width="2"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="#007bff" stroke-width="2"/></svg>`;
//         nav.appendChild(icon);
//     } else {
//         // Кнопка Вход
//         const btn = document.createElement('button');
//         btn.className = 'header__btn login';
//         btn.textContent = 'Вход';
//         btn.onclick = () => {
//             window.location.href = 'login.html';
//         };
//         nav.appendChild(btn);
//     }
// });

// --- ИЗМЕНЕНИЕ 3: ПРАВИЛЬНЫЙ ЗАПУСК ПРИЛОЖЕНИЯ ---

// Главная точка входа
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Сначала скрываем все ненужное
    filterCategories.forEach(b => b.classList.remove('active'));
    filterOptions.classList.remove('active');
    filterApplyBtn.style.display = 'none';
    activeCategory = null;

    // 2. Асинхронно загружаем данные для фильтров и ЖДЕМ их завершения
    await loadFilterData();

    // 3. Только после этого загружаем начальный список программ
    await fetchPrograms();

    // 4. Настраиваем кнопки авторизации (старый код)
    setupAuthButtons();
});

// Вынесем старую логику авторизации в отдельную функцию для чистоты
function setupAuthButtons() {
    const logged = localStorage.getItem('hogwarts_logged') === '1';
    const nav = document.querySelector('.header__nav');
    if (!nav) return;
    let loginBtn = nav.querySelector('.header__btn.login');
    let logoutBtn = nav.querySelector('.header__btn.logout');
    let profileIcon = nav.querySelector('.header__profile');
    if (loginBtn) loginBtn.remove();
    if (logoutBtn) logoutBtn.remove();
    if (profileIcon) profileIcon.remove();
    if (logged) {
        // Кнопка Выход
        const btn = document.createElement('button');
        btn.className = 'header__btn logout';
        btn.textContent = 'Выход';
        btn.onclick = () => {
            localStorage.removeItem('hogwarts_logged');
            window.location.reload();
        };
        nav.appendChild(btn);
        // Иконка профиля
        const icon = document.createElement('span');
        icon.className = 'header__profile';
        icon.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="4" stroke="#007bff" stroke-width="2"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="#007bff" stroke-width="2"/></svg>`;
        nav.appendChild(icon);
    } else {
        // Кнопка Вход
        const btn = document.createElement('button');
        btn.className = 'header__btn login';
        btn.textContent = 'Вход';
        btn.onclick = () => {
            window.location.href = 'login.html';
        };
        nav.appendChild(btn);
    }
}