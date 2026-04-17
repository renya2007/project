        (function() {
            "use strict";

            // ---------- ДАННЫЕ КВАРТИР (как в верстке) ----------
            // Для удобства заполняем все карточки через js, сохраняя исходную информацию
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

            // Функция создания DOM-карточки (возвращает элемент)
            function createCard(apt) {
                const div = document.createElement('div');
                div.className = 'portfolio-item';
                div.setAttribute('data-price', apt.price);
                div.setAttribute('data-desc', apt.desc);
                div.setAttribute('data-address', apt.address);
                
                const img = document.createElement('img');
                img.src = apt.img;
                img.alt = 'квартира';
                img.style.height = '180px';
                
                const infoDiv = document.createElement('div');
                infoDiv.className = 'portfolio-info';
                
                const priceEl = document.createElement('h5');
                priceEl.textContent = apt.price;
                const descEl = document.createElement('p');
                descEl.innerHTML = apt.desc + '<br>' + apt.address;
                
                infoDiv.appendChild(priceEl);
                infoDiv.appendChild(descEl);
                div.appendChild(img);
                div.appendChild(infoDiv);
                
                return div;
            }

            // Рендерим сетки
            const buyGrid = document.getElementById('buyGrid');
            const rentGrid = document.getElementById('rentGrid');
            const suburbanGrid = document.getElementById('suburbanGrid');
            
            buyApartments.forEach(a => buyGrid.appendChild(createCard(a)));
            rentApartments.forEach(a => rentGrid.appendChild(createCard(a)));
            suburbanApartments.forEach(a => suburbanGrid.appendChild(createCard(a)));

            // ---------- МОДАЛЬНОЕ ОКНО ----------
            const modal = document.getElementById('apartmentModal');
            const modalPrice = document.getElementById('modalPrice');
            const modalAddressSpan = document.querySelector('#modalAddress span');
            const modalRooms = document.getElementById('modalRooms');
            const modalArea = document.getElementById('modalArea');
            const modalFloor = document.getElementById('modalFloor');
            
            const telegramLink = document.getElementById('telegramLink');
            const whatsappLink = document.getElementById('whatsappLink');
            const callLink = document.getElementById('callLink');
            const emailLink = document.getElementById('emailLink');
            const closeBtn = document.getElementById('closeModalBtn');

            // Парсим строку описания, чтобы извлечь комнатность/площадь/этаж
            function parseDesc(descStr) {
                // descStr пример: "2-комн. кв. · 60 м² · 8/8 этаж" или "Дом · 43 м²"
                let rooms = '–', area = '–', floor = '–';
                if (!descStr) return { rooms, area, floor };
                
                const parts = descStr.split('·').map(s => s.trim());
                if (parts.length >= 1) rooms = parts[0];
                if (parts.length >= 2) area = parts[1];
                if (parts.length >= 3) floor = parts[2];
                else floor = '—';
                
                return { rooms, area, floor };
            }

            // Функция генерации контактов на основе адреса (для демо)
            function updateContactLinks(address, price) {
                // Пример: создаём ссылки с упоминанием адреса
                const message = encodeURIComponent(`Здравствуйте! Интересует квартира по адресу: ${address}, цена ${price}.`);
                const phoneNumber = '+74951234567'; // условный номер офиса
                
                telegramLink.href = `https://t.me/TegaSalesBot?text=${message}`;
                whatsappLink.href = `https://wa.me/74951234567?text=${message}`;
                callLink.href = `tel:${phoneNumber}`;
                emailLink.href = `mailto:sales@tega.ru?subject=Запрос по квартире ${address}&body=${message}`;
            }

            // Открыть модалку с данными карточки
            function openModal(cardElement) {
                const price = cardElement.getAttribute('data-price') || 'Цена по запросу';
                const desc = cardElement.getAttribute('data-desc') || '';
                const address = cardElement.getAttribute('data-address') || 'Москва';
                
                const { rooms, area, floor } = parseDesc(desc);
                
                modalPrice.textContent = price;
                modalAddressSpan.textContent = address;
                modalRooms.textContent = rooms;
                modalArea.textContent = area;
                modalFloor.textContent = floor;
                
                updateContactLinks(address, price);
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function closeModal() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }

            // Обработчик клика на любую карточку (делегирование)
            document.addEventListener('click', function(e) {
                const card = e.target.closest('.portfolio-item');
                if (!card) return;
                // не открываем если клик был по ссылке внутри (на всякий)
                if (e.target.closest('a')) return;
                
                openModal(card);
            });

            // Закрытие
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) closeModal(); // клик по оверлею
            });
            
            // Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    closeModal();
                }
            });

            // ---------- ПЛАВНЫЙ СКРОЛЛ (навигация) ----------
            const navLinks = document.querySelectorAll('.navbar a');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });

        })();