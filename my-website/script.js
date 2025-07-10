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
let filterOptionsAnchorBtn = null;
let filterOptionsEl = null;

function closeAllFilterOptions() {
    document.querySelectorAll('.filter-options').forEach(el => el.remove());
    document.querySelectorAll('.filter-category').forEach(btn => btn.classList.remove('active'));
    filterOptionsAnchorBtn = null;
    activeCategory = null;
}

// Пример данных для фильтра
const universitiesList = [
    'ИТМО', 'ННГУ', 'МГУ', 'МФТИ', 'УРФУ', 'ДФУ'
];
let selectedUniversities = [];

// --- Данные для фильтра ---
const directionsList = [
    'Социология', 'Радиофизика', 'Компьютерные технологии', 'Философия', 'Религиоведение'
];
const formsList = ['Очно', 'Заочно'];
const languagesList = ['Русский', 'Английский'];
const durationsList = ['3 месяца', '6 месяцев', '9 месяцев'];
const citiesList = [
    'г. Нижний Новгород, Нижегородская область',
    'г. Екатеринбург, Свердловская область',
    'г. Москва, Московская область',
    'г. Санкт-Петербург, Ленинградская область',
    'г. Владивосток, Приморский край',
    'г. Казань, Республика Татарстан'
];

let selectedGrade = 3.0;
let selectedDirection = null;
let selectedForm = null;
let selectedLanguage = null;
let selectedCity = null;
let selectedDuration = null;
let universitySearch = '';
let citySearch = '';

const courseOptions = [
    { group: 'Бакалавриат', values: ['1 курс', '2 курс', '3 курс', '4 курс'] },
    { group: 'Магистратура', values: ['1 курс', '2 курс'] },
    { group: 'Специалитет', values: ['1 курс', '2 курс', '3 курс', '4 курс', '5 курс'] },
];
let selectedCourse = null;

function renderFilterOptions(category, container) {
    const el = container || filterOptions;
    el.innerHTML = '';
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
        el.appendChild(sliderWrap);
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
            renderFilterOptions('universities', el);
        };
        el.appendChild(search);
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
            renderFilterOptions('universities', el);
        };
        el.appendChild(allOption);
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
                renderFilterOptions('universities', el);
            };
            el.appendChild(option);
        });
    } else if (category === 'direction') {
        // Направления обучения: вертикальный список
        directionsList.forEach(dir => {
            const item = document.createElement('div');
            item.className = 'filter-city-item' + (selectedDirection === dir ? ' selected' : '');
            item.textContent = dir;
            item.onclick = () => {
                selectedDirection = selectedDirection === dir ? null : dir;
                renderFilterOptions('direction', el);
            };
            el.appendChild(item);
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
                renderFilterOptions('form', el);
            };
            group.appendChild(btn);
        });
        el.appendChild(group);
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
                renderFilterOptions('language', el);
            };
            group.appendChild(btn);
        });
        el.appendChild(group);
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
            renderFilterOptions('city', el);
        };
        el.appendChild(search);
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
                renderFilterOptions('city', el);
            };
            list.appendChild(item);
        });
        el.appendChild(list);
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
                renderFilterOptions('duration', el);
            };
            group.appendChild(btn);
        });
        el.appendChild(group);
    } else if (category === 'course') {
        // Курс: вертикальный список
        courseOptions.forEach(group => {
            const groupLabel = document.createElement('div');
            groupLabel.style.fontWeight = 'bold';
            groupLabel.style.margin = '8px 0 4px 0';
            groupLabel.textContent = group.group;
            el.appendChild(groupLabel);
            group.values.forEach(val => {
                const item = document.createElement('div');
                item.className = 'filter-city-item' + (selectedCourse === val ? ' selected' : '');
                item.textContent = val;
                item.onclick = () => {
                    selectedCourse = selectedCourse === val ? null : val;
                    renderFilterOptions('course', el);
                };
                el.appendChild(item);
            });
        });
    } else {
        // fallback
        const stub = document.createElement('div');
        stub.className = 'filter-option';
        stub.textContent = 'Скоро будет...';
        el.appendChild(stub);
    }
}

// Переключение категорий фильтра
filterCategories.forEach(btn => {
    btn.addEventListener('click', () => {
        const wrap = btn.parentElement;
        if (btn.classList.contains('active')) {
            // Если уже активен — скрыть подполя
            closeAllFilterOptions();
            filterApplyBtn.style.display = 'none';
            return;
        }
        closeAllFilterOptions();
        btn.classList.add('active');
        activeCategory = btn.dataset.category;
        // Создаём filterOptions внутри wrap
        filterOptionsEl = document.createElement('div');
        filterOptionsEl.className = 'filter-options active';
        filterOptionsEl.style.display = 'block';
        filterOptionsEl.style.visibility = 'hidden';
        wrap.appendChild(filterOptionsEl);
        renderFilterOptions(activeCategory, filterOptionsEl);
        filterApplyBtn.style.display = 'block';
        filterOptionsAnchorBtn = btn;
        // После рендера — позиционируем и показываем
        requestAnimationFrame(() => {
            positionFilterOptions();
            filterOptionsEl.style.visibility = 'visible';
        });
    });
});

function positionFilterOptions() {
    if (!filterOptionsAnchorBtn || !filterOptionsEl || !filterOptionsEl.classList.contains('active')) return;
    // На мобильных — не позиционируем
    if (window.innerWidth < 600) {
        filterOptionsEl.style.left = '';
        filterOptionsEl.style.top = '';
        filterOptionsEl.style.transform = '';
        return;
    }
    const btn = filterOptionsAnchorBtn;
    const btnRect = btn.getBoundingClientRect();
    const filterWidth = filterOptionsEl.offsetWidth;
    // top — нижняя граница кнопки относительно окна
    let top = btnRect.bottom;
    // left — центрируем относительно кнопки
    let left = btnRect.left + btnRect.width / 2 - filterWidth / 2;
    // Защита от выхода за пределы окна
    if (left < 8) left = 8;
    if (left + filterWidth > window.innerWidth - 8) left = window.innerWidth - filterWidth - 8;
    filterOptionsEl.style.left = left + 'px';
    filterOptionsEl.style.top = top + 'px';
    filterOptionsEl.style.transform = '';
}

window.addEventListener('scroll', positionFilterOptions);
window.addEventListener('resize', positionFilterOptions);

// При загрузке все подполя скрыты
window.addEventListener('DOMContentLoaded', () => {
    filterCategories.forEach(b => b.classList.remove('active'));
    filterOptionsEl = null; // Убедимся, что filterOptionsEl не создан
    filterApplyBtn.style.display = 'none';
    activeCategory = null;
});

// Кнопка 'Принять' скрывает подполя
filterApplyBtn.addEventListener('click', () => {
    closeAllFilterOptions();
    filterApplyBtn.style.display = 'none';
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
}

// --- Логика авторизации для главной страницы ---
window.addEventListener('DOMContentLoaded', () => {
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
    // --- Кнопка Вузы в шапке ---
    const navHeader = document.querySelector('.header__nav');
    if (navHeader) {
        const btns = navHeader.querySelectorAll('.header__btn');
        if (btns.length > 0) {
            btns[0].onclick = () => {
                window.location.href = 'universities.html';
            };
        }
    }
    const feedbackContent = document.getElementById('feedbackContent');
    if (feedbackContent) {
        let logged = localStorage.getItem('hogwarts_logged') === '1';
        let user = null;
        try {
            user = JSON.parse(localStorage.getItem('hogwarts_user') || '{}');
        } catch (e) { user = null; }
        if (!logged) {
            feedbackContent.innerHTML = `<div class="feedback-welcome">Рады приветствовать Вас на нашем сайте! Если у вас уже был опыт работы с нашей программой, пожалуйста, войдите в учетную запись и поделитесь с нами впечатлениями о пройденной программе.</div>`;
        } else if (user && user.role === 'student') {
            feedbackContent.innerHTML = `
                <form class="feedback-form">
                    <label><span class="feedback-question">Где вы проходили обучение в рамках программы академической мобильности?</span>
                        <input class="feedback-input" type="text" name="place" autocomplete="off"></label>
                    <label><span class="feedback-question">Каким образом вы узнали о проекте?</span>
                        <input class="feedback-input" type="text" name="source" autocomplete="off"></label>
                    <label><span class="feedback-question">Была ли предоставленная информация о проекте достаточной?</span>
                        <input class="feedback-input" type="text" name="info" autocomplete="off"></label>
                    <label><span class="feedback-question">Насколько вы удовлетворены условиями обучения?</span>
                        <input class="feedback-input" type="text" name="satisfaction" autocomplete="off"></label>
                    <label><span class="feedback-question">Хотели ли бы вы поучаствовать в проекте снова?</span>
                        <input class="feedback-input" type="text" name="again" autocomplete="off"></label>
                    <label><span class="feedback-question">Свободный комментарий</span>
                        <textarea class="feedback-textarea" name="comment"></textarea></label>
                    <button type="submit" class="feedback-submit">Отправить</button>
                </form>
            `;
        } else if (user && user.role === 'university') {
            feedbackContent.innerHTML = `
                <form class="feedback-form">
                    <label><span class="feedback-question">Соответствует ли количество зачисленных студентов на программы вашего вуза ожидаемому количеству?</span>
                        <input class="feedback-input" type="text" name="expected" autocomplete="off"></label>
                    <label><span class="feedback-question">Были ли трудности при работе с сайтом?</span>
                        <input class="feedback-input" type="text" name="difficulties" autocomplete="off"></label>
                    <label><span class="feedback-question">Свободный комментарий</span>
                        <textarea class="feedback-textarea" name="comment"></textarea></label>
                    <button type="submit" class="feedback-submit">Отправить</button>
                </form>
            `;
        } else {
            feedbackContent.innerHTML = `<div class="feedback-welcome">Рады приветствовать Вас на нашем сайте! Если у вас уже был опыт работы с нашей программой, пожалуйста, войдите в учетную запись и поделитесь с нами впечатлениями о пройденной программе.</div>`;
        }
    }
}); 