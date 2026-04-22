(function() {
            // Хранилище
            const STORAGE_USERS = 'tega_users';
            const STORAGE_CURRENT_USER = 'tega_current_user';

            function getUsers() {
                const users = localStorage.getItem(STORAGE_USERS);
                return users ? JSON.parse(users) : [];
            }

            function saveUsers(users) {
                localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
            }

            function getCurrentUser() {
                const user = localStorage.getItem(STORAGE_CURRENT_USER);
                return user ? JSON.parse(user) : null;
            }

            function setCurrentUser(user) {
                if (user) {
                    localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(user));
                } else {
                    localStorage.removeItem(STORAGE_CURRENT_USER);
                }
            }

            // Демо-пользователи
            function initDemoUsers() {
                let users = getUsers();
                if (users.length === 0) {
                    users = [
                        { username: 'Алексей', email: 'alex@tega.ru', password: '123456' },
                        { username: 'Мария', email: 'maria@tega.ru', password: '123456' },
                        { username: 'Дмитрий', email: 'dima@tega.ru', password: '123456' }
                    ];
                    saveUsers(users);
                }
            }

            // Модальное окно авторизации
            let authModal = null;

            function showAuthModal() {
                if (authModal) return;

                const modalHtml = `
                    <div id="authModal" class="auth-modal-overlay">
                        <div class="auth-modal">
                            <div class="auth-tabs">
                                <div class="auth-tab active" data-tab="login">Вход</div>
                                <div class="auth-tab" data-tab="register">Регистрация</div>
                                <div class="auth-tab" data-tab="forgot">Восстановление</div>
                            </div>

                            <!-- Форма входа -->
                            <div id="loginForm" class="auth-form active-form">
                                <h2>🔐 Вход</h2>
                                <div class="sub">Войдите в свой аккаунт</div>
                                <input type="text" id="loginEmail" placeholder="Email или имя пользователя">
                                <input type="password" id="loginPassword" placeholder="Пароль">
                                <div id="loginError" class="error-msg"></div>
                                <button id="doLogin">Войти</button>
                            </div>

                            <!-- Форма регистрации -->
                            <div id="registerForm" class="auth-form">
                                <h2>📝 Регистрация</h2>
                                <div class="sub">Создайте новый аккаунт</div>
                                <input type="text" id="regUsername" placeholder="Имя пользователя">
                                <input type="email" id="regEmail" placeholder="Email">
                                <input type="password" id="regPassword" placeholder="Пароль (мин. 6 символов)">
                                <input type="password" id="regConfirmPassword" placeholder="Подтвердите пароль">
                                <div id="regError" class="error-msg"></div>
                                <div id="regSuccess" class="success-msg"></div>
                                <button id="doRegister">Зарегистрироваться</button>
                            </div>

                            <!-- Форма восстановления -->
                            <div id="forgotForm" class="auth-form">
                                <h2>🔄 Восстановление</h2>
                                <div class="sub">Введите email для сброса пароля</div>
                                <input type="email" id="forgotEmail" placeholder="Ваш email">
                                <div id="forgotError" class="error-msg"></div>
                                <div id="forgotSuccess" class="success-msg"></div>
                                <button id="doForgot">Отправить код</button>
                            </div>

                            <button class="close-auth" id="closeAuthModal">Закрыть</button>
                        </div>
                    </div>
                `;

                document.body.insertAdjacentHTML('beforeend', modalHtml);
                authModal = document.getElementById('authModal');

                // Переключение вкладок
                const tabs = document.querySelectorAll('.auth-tab');
                const forms = {
                    login: document.getElementById('loginForm'),
                    register: document.getElementById('registerForm'),
                    forgot: document.getElementById('forgotForm')
                };

                tabs.forEach(tab => {
                    tab.addEventListener('click', () => {
                        const tabName = tab.getAttribute('data-tab');
                        tabs.forEach(t => t.classList.remove('active'));
                        tab.classList.add('active');
                        Object.values(forms).forEach(f => f.classList.remove('active-form'));
                        forms[tabName].classList.add('active-form');
                        // Очищаем ошибки
                        document.querySelectorAll('.error-msg, .success-msg').forEach(el => {
                            el.style.display = 'none';
                            el.textContent = '';
                        });
                    });
                });

                // Логин
                document.getElementById('doLogin').addEventListener('click', () => {
                    const loginInput = document.getElementById('loginEmail').value.trim();
                    const password = document.getElementById('loginPassword').value;
                    const errorDiv = document.getElementById('loginError');

                    const users = getUsers();
                    const user = users.find(u => u.email === loginInput || u.username === loginInput);

                    if (!user) {
                        errorDiv.textContent = '❌ Пользователь не найден';
                        errorDiv.style.display = 'block';
                        return;
                    }
                    if (user.password !== password) {
                        errorDiv.textContent = '❌ Неверный пароль';
                        errorDiv.style.display = 'block';
                        return;
                    }

                    setCurrentUser({ username: user.username, email: user.email });
                    updateAuthUI();
                    closeAuthModal();
                    alert(`✅ Добро пожаловать, ${user.username}!`);
                });

                // Регистрация
                document.getElementById('doRegister').addEventListener('click', () => {
                    const username = document.getElementById('regUsername').value.trim();
                    const email = document.getElementById('regEmail').value.trim();
                    const password = document.getElementById('regPassword').value;
                    const confirm = document.getElementById('regConfirmPassword').value;
                    const errorDiv = document.getElementById('regError');
                    const successDiv = document.getElementById('regSuccess');

                    errorDiv.style.display = 'none';
                    successDiv.style.display = 'none';

                    if (!username || !email || !password) {
                        errorDiv.textContent = '❌ Заполните все поля';
                        errorDiv.style.display = 'block';
                        return;
                    }
                    if (password.length < 6) {
                        errorDiv.textContent = '❌ Пароль должен быть не менее 6 символов';
                        errorDiv.style.display = 'block';
                        return;
                    }
                    if (password !== confirm) {
                        errorDiv.textContent = '❌ Пароли не совпадают';
                        errorDiv.style.display = 'block';
                        return;
                    }
                    if (!email.includes('@')) {
                        errorDiv.textContent = '❌ Введите корректный email';
                        errorDiv.style.display = 'block';
                        return;
                    }

                    const users = getUsers();
                    if (users.some(u => u.email === email)) {
                        errorDiv.textContent = '❌ Email уже зарегистрирован';
                        errorDiv.style.display = 'block';
                        return;
                    }
                    if (users.some(u => u.username === username)) {
                        errorDiv.textContent = '❌ Имя пользователя уже занято';
                        errorDiv.style.display = 'block';
                        return;
                    }

                    users.push({ username, email, password });
                    saveUsers(users);

                    successDiv.textContent = '✅ Регистрация успешна! Теперь войдите';
                    successDiv.style.display = 'block';

                    // Очищаем поля
                    document.getElementById('regUsername').value = '';
                    document.getElementById('regEmail').value = '';
                    document.getElementById('regPassword').value = '';
                    document.getElementById('regConfirmPassword').value = '';

                    // Переключаем на вкладку входа через 1.5 секунды
                    setTimeout(() => {
                        tabs.forEach(t => t.classList.remove('active'));
                        tabs[0].classList.add('active');
                        Object.values(forms).forEach(f => f.classList.remove('active-form'));
                        forms.login.classList.add('active-form');
                        errorDiv.style.display = 'none';
                        successDiv.style.display = 'none';
                    }, 1500);
                });

                // Восстановление пароля
                document.getElementById('doForgot').addEventListener('click', () => {
                    const email = document.getElementById('forgotEmail').value.trim();
                    const errorDiv = document.getElementById('forgotError');
                    const successDiv = document.getElementById('forgotSuccess');

                    errorDiv.style.display = 'none';
                    successDiv.style.display = 'none';

                    if (!email) {
                        errorDiv.textContent = '❌ Введите email';
                        errorDiv.style.display = 'block';
                        return;
                    }

                    const users = getUsers();
                    const userIndex = users.findIndex(u => u.email === email);

                    if (userIndex === -1) {
                        errorDiv.textContent = '❌ Пользователь с таким email не найден';
                        errorDiv.style.display = 'block';
                        return;
                    }

                    // Генерация кода
                    const resetCode = Math.floor(100000 + Math.random() * 900000);
                    const newPassword = prompt(`🔐 Код подтверждения: ${resetCode}\n\nВведите новый пароль (минимум 6 символов):`);

                    if (!newPassword) {
                        errorDiv.textContent = '❌ Операция отменена';
                        errorDiv.style.display = 'block';
                        return;
                    }

                    if (newPassword.length < 6) {
                        errorDiv.textContent = '❌ Пароль должен быть не менее 6 символов';
                        errorDiv.style.display = 'block';
                        return;
                    }

                    users[userIndex].password = newPassword;
                    saveUsers(users);

                    successDiv.textContent = '✅ Пароль успешно изменен! Теперь войдите с новым паролем.';
                    successDiv.style.display = 'block';

                    document.getElementById('forgotEmail').value = '';

                    // Переключаем на вход
                    setTimeout(() => {
                        tabs.forEach(t => t.classList.remove('active'));
                        tabs[0].classList.add('active');
                        Object.values(forms).forEach(f => f.classList.remove('active-form'));
                        forms.login.classList.add('active-form');
                        errorDiv.style.display = 'none';
                        successDiv.style.display = 'none';
                    }, 2000);
                });

                document.getElementById('closeAuthModal').addEventListener('click', closeAuthModal);
                authModal.addEventListener('click', (e) => {
                    if (e.target === authModal) closeAuthModal();
                });
            }

            function closeAuthModal() {
                if (authModal) {
                    authModal.remove();
                    authModal = null;
                }
            }

            function logout() {
                setCurrentUser(null);
                updateAuthUI();
                alert('👋 Вы вышли из аккаунта');
            }

            function updateAuthUI() {
                const container = document.getElementById('authButtonContainer');
                const currentUser = getCurrentUser();

                if (currentUser) {
                    container.innerHTML = `
                        <div class="auth-button" id="userMenuBtn">
                            <i class="fas fa-user-circle"></i> ${currentUser.username}
                        </div>
                        <div class="user-menu" id="userDropdownMenu">
                            <div class="user-info">
                                <div class="user-name">${currentUser.username}</div>
                                <div class="user-email">${currentUser.email}</div>
                            </div>
                            <button class="menu-item logout-item" id="logoutBtn">
                                <i class="fas fa-sign-out-alt"></i> Выйти
                            </button>
                        </div>
                    `;

                    const userMenuBtn = document.getElementById('userMenuBtn');
                    const dropdown = document.getElementById('userDropdownMenu');
                    const logoutBtn = document.getElementById('logoutBtn');

                    if (userMenuBtn) {
                        userMenuBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            dropdown.classList.toggle('show');
                        });
                    }

                    if (logoutBtn) {
                        logoutBtn.addEventListener('click', () => {
                            logout();
                            dropdown.classList.remove('show');
                        });
                    }

                    document.addEventListener('click', function closeMenu(e) {
                        if (userMenuBtn && !userMenuBtn.contains(e.target) && dropdown && !dropdown.contains(e.target)) {
                            dropdown.classList.remove('show');
                        }
                    });
                } else {
                    container.innerHTML = `
                        <div class="auth-button" id="loginBtn">
                            <i class="fas fa-sign-in-alt"></i> Войти
                        </div>
                    `;
                    const loginBtn = document.getElementById('loginBtn');
                    if (loginBtn) {
                        loginBtn.addEventListener('click', showAuthModal);
                    }
                }
            }

            // Данные квартир
            const buyApartments = [
                { price: '20 500 000 ₽', desc: '2-комн. кв. · 60 м² · 8/8 этаж', address: 'Нововладыкинский проезд, 1к2', img: 'https://a0.muscache.com/im/pictures/f50d118f-2525-4841-9bb1-7396132b7037.jpg' },
                { price: '15 000 000 ₽', desc: '2-комн. кв. · 52,30 м² · 4/12 этаж', address: 'Звездный бул., 1', img: 'https://avatars.mds.yandex.net/i?id=ded801e12077bd8d06db148cc59bad06_l-5287379-images-thumbs&n=13' },
                { price: '25 200 300 ₽', desc: '3-комн. кв. · 62,70 м² · 5/12 этаж', address: 'Гостиничная ул., 10К5', img: 'https://evropoly.com/wp-content/uploads/2016/05/Schober-Sapelli-4-1200x787.jpg' },
                { price: '30 600 300 ₽', desc: '2-комн. кв. · 65 м² · 20/38 этаж', address: 'Староалексеевская ул., 5А', img: 'https://www.loft2rent.ru/upload_data/2025/6646/upldXZw1Ll.jpeg.1200x800.jpg' },
                { price: '39 870 700 ₽', desc: '3-комн. кв. · 85 м² · 16/22 этаж', address: 'ул. 800-летия Москвы, 11', img: 'https://avatars.mds.yandex.net/i?id=0ae8debb8104c5cf7334f00b2de280b5_l-10608176-images-thumbs&n=13' },
                { price: '31 580 050 ₽', desc: '3-комн. кв. · 63,10 м² · 7/12 этаж', address: '1-й Рижский пер., 2К7', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF-T74jx3kmUwYW8-MCx63ReB2WfSFxtdjpg&s' }
            ];

            const rentApartments = [
                { price: '50 000 ₽', desc: '2-комн. кв. · 86 м² · 6/17 этаж', address: 'Алтуфьевское ш., 18В', img: 'https://media.kvartirka.com/s3/thumbs/flat/0/233/233496/4529464_w936h624.jpg' },
                { price: '70 000 ₽', desc: '2-комн. кв. · 52,20 м² · 6/14 этаж', address: 'ул. Годовикова, 11к4', img: 'https://cdn0.divan.ru/img/v1/cGCTLE8qbp6Q4t8ZcigHK-EYN7s3AahtqWOSnE9vpJM/rs:fit:1920:1440:0:0/g:ce:0:0/bg:ffffff/q:85/czM6Ly9kaXZhbi9ja2VkaXRvci93aWtpLWFydGljbGUvMzI4NS82NThlN2Y5YTE1YmQ3LmpwZw.jpg' },
                { price: '45 000 ₽', desc: 'Студия · 18 м² · 5/16 этаж', address: 'Ракетный бул., 13К2', img: 'https://attaches.1001tur.ru/hotels/gallery/458495/64961698049164.jpg' },
                { price: '43 000 ₽', desc: 'Студия · 23 м² · 12/20 этаж', address: 'Федоскинская ул., 9К3', img: 'https://avatars.mds.yandex.net/i?id=8b538d14791d61ba599bd08f679be779914f7243-4707222-images-thumbs&n=13' },
                { price: '70 000 ₽', desc: '1-комн. апарт. · 33,60 м² · 3/5 этаж', address: 'проезд Серебрякова, 11к1', img: 'https://avatars.mds.yandex.net/get-altay/754546/2a0000018d4b1bbd2f4854f58ecba1bf36a7/XL' },
                { price: '40 000 ₽', desc: 'Студия · 30 м² · 8/24 этаж', address: 'ул. Корнейчука, 54', img: 'https://alutur.com/hotel/photo?t/x500/extranet/65/b8/65b832d22de903794f5c49986d2c4cb70de7eb52.jpeg' }
            ];

            const suburbanApartments = [
                { price: '16 505 000 ₽', desc: 'Дом · 43 м²', address: 'с. Ивановское, Московская обл.', img: 'https://img.dmclk.ru/c960x640q80/vitrina/99/a7/99a7bdf39202209450e4e10942457ffaac0b99e2.jpg' },
                { price: '14 360 000 ₽', desc: 'Дом · 70 м²', address: 'с. Ивановское, Московская обл.', img: 'https://countryside.cdn-cian.ru/images/1564617600/9dfaaefd-5a3b-4727-bb20-39805f9d0626-gallery-thumb-v1.jpe' },
                { price: '12 550 400 ₽', desc: 'Дом · 80 м²', address: 'с. Домодедово, Московская обл.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc6WZNbDicnOT7VgcChgwmQpeQQYZ7WDYrew&s' },
                { price: '16 230 000 ₽', desc: '2-комн. кв. · 57 м² · 6/12 этаж', address: 'с. Дмитров, Московская обл.', img: 'https://img.dmclk.ru/vitrina/owner/9f/e6/9fe68bd72e104aaaae2a9e9707a4ad5d.jpg' },
                { price: '12 370 000 ₽', desc: '1-комн. кв. · 43,80 м² · 3/16 этаж', address: 'с. Видное, Московская обл.', img: 'https://img.dmclk.ru/vitrina/owner/12/7a/127abebe6cc146c8add3982a31a03d9e.jpg' },
                { price: '26 364 000 ₽', desc: '1-комн. кв. · 34,70 м² · 1/8 этаж', address: 'с. Можайск, Московская обл.', img: 'https://f4.mirkvartir.me/journal/custom/be1c774d-cd3c-43ed-bbfa-54d5bcf4257e.jpg' }
            ];

            function createCard(apt) {
                const div = document.createElement('div');
                div.className = 'portfolio-item';
                div.setAttribute('data-price', apt.price);
                div.setAttribute('data-desc', apt.desc);
                div.setAttribute('data-address', apt.address);
                div.innerHTML = `
                    <img src="${apt.img}" alt="квартира" style="height:180px; width:100%; object-fit:cover;">
                    <div class="portfolio-info">
                        <h5>${apt.price}</h5>
                        <p>${apt.desc}<br>${apt.address}</p>
                    </div>
                `;
                return div;
            }

            document.getElementById('buyGrid').append(...buyApartments.map(createCard));
            document.getElementById('rentGrid').append(...rentApartments.map(createCard));
            document.getElementById('suburbanGrid').append(...suburbanApartments.map(createCard));

            // Модальное окно квартир
            const modal = document.getElementById('apartmentModal');
            const modalPrice = document.getElementById('modalPrice');
            const modalAddressText = document.getElementById('modalAddressText');
            const modalRooms = document.getElementById('modalRooms');
            const modalArea = document.getElementById('modalArea');
            const modalFloor = document.getElementById('modalFloor');
            const telegramLink = document.getElementById('telegramLink');
            const whatsappLink = document.getElementById('whatsappLink');
            const callLink = document.getElementById('callLink');
            const emailLink = document.getElementById('emailLink');
            const closeModalBtn = document.getElementById('closeModalBtn');

            function parseDesc(desc) {
                const parts = desc.split('·').map(s => s.trim());
                return {
                    rooms: parts[0] || '—',
                    area: parts[1] || '—',
                    floor: parts[2] || '—'
                };
            }

            function openApartmentModal(card) {
                const price = card.dataset.price;
                const desc = card.dataset.desc;
                const address = card.dataset.address;
                const { rooms, area, floor } = parseDesc(desc);

                modalPrice.textContent = price;
                modalAddressText.textContent = address;
                modalRooms.textContent = rooms;
                modalArea.textContent = area;
                modalFloor.textContent = floor;

                const message = encodeURIComponent(`Здравствуйте! Интересует квартира: ${address}, ${price}`);
                telegramLink.href = `https://t.me/TegaSalesBot?text=${message}`;
                whatsappLink.href = `https://wa.me/74951234567?text=${message}`;
                callLink.href = `tel:+74951234567`;
                emailLink.href = `mailto:sales@tega.ru?subject=Запрос по квартире&body=${message}`;

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function closeApartmentModal() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }

            document.addEventListener('click', (e) => {
                const card = e.target.closest('.portfolio-item');
                if (card) openApartmentModal(card);
            });

            closeModalBtn.addEventListener('click', closeApartmentModal);
            modal.addEventListener('click', (e) => { if (e.target === modal) closeApartmentModal(); });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeApartmentModal(); });

            // Плавный скролл
            document.querySelectorAll('.navbar a').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                });
            });

            initDemoUsers();
            updateAuthUI();
        })();