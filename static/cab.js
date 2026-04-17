// ---------- ПОЛНОСТЬЮ ПУСТЫЕ ДАННЫЕ ПО УМОЛЧАНИЮ ----------
  // Никаких типовых имен, телефонов и адресов — только пустые строки.
  const emptyUser = {
    name: "",
    email: "",
    phone: "",
    city: "",
    birth: "",
    userId: ""
  };

  // Генерация короткого случайного ID при первом запуске (чтобы был уникальный идентификатор)
  function generateUserId() {
    return 'user_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  }

  // Загрузка из localStorage или пустой объект
  let currentUser = { ...emptyUser };

  // DOM элементы
  const displayNameEl = document.getElementById('displayName');
  const displayIdEl = document.getElementById('displayId');
  const regDateSpan = document.getElementById('regDate');
  const infoEmailEl = document.getElementById('infoEmail');
  const infoPhoneEl = document.getElementById('infoPhone');
  const infoCityEl = document.getElementById('infoCity');
  const infoBirthEl = document.getElementById('infoBirth');
  const avatarDisplay = document.getElementById('avatarDisplay');

  // поля формы
  const editName = document.getElementById('editName');
  const editEmail = document.getElementById('editEmail');
  const editPhone = document.getElementById('editPhone');
  const editCity = document.getElementById('editCity');
  const editBirth = document.getElementById('editBirth');

  const saveBtn = document.getElementById('saveBtn');
  const resetBtn = document.getElementById('resetBtn');
  const backToSiteBtn = document.getElementById('backToSiteBtn');
  const toastMsg = document.getElementById('messageToast');

  // ---- вспомогательные функции ----
  function getInitialsFromName(name) {
    if (!name || name.trim() === "") return "👤";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length-1].charAt(0)).toUpperCase();
  }

  function updateAvatarFromName(name) {
    if (!name || name.trim() === "") {
      avatarDisplay.innerHTML = "👤";
      return;
    }
    const initials = getInitialsFromName(name);
    let avatarText = initials.length > 2 ? initials.slice(0,2) : initials;
    avatarDisplay.innerHTML = avatarText || "👤";
  }

  // Форматирование "—" для пустых полей
  function formatEmpty(value) {
    if (!value || value.trim() === "") return "—";
    return value;
  }

  function renderProfile() {
    // Отображаем имя или прочерк
    displayNameEl.innerText = currentUser.name && currentUser.name.trim() !== "" ? currentUser.name : "—";

    // ID пользователя: если нет — генерируем и сохраняем
    if (!currentUser.userId || currentUser.userId === "") {
      currentUser.userId = generateUserId();
      try {
        localStorage.setItem('personalCabinetUser', JSON.stringify(currentUser));
      } catch(e) {}
    }
    displayIdEl.innerText = currentUser.userId;

    // Регистрация: показываем дату первого создания профиля (храним в localStorage отдельно)
    let registrationDate = localStorage.getItem('userRegDate');
    if (!registrationDate) {
      const now = new Date();
      registrationDate = `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()}`;
      localStorage.setItem('userRegDate', registrationDate);
    }
    regDateSpan.innerText = registrationDate;

    infoEmailEl.innerText = formatEmpty(currentUser.email);
    infoPhoneEl.innerText = formatEmpty(currentUser.phone);
    infoCityEl.innerText = formatEmpty(currentUser.city);
    infoBirthEl.innerText = formatEmpty(currentUser.birth);

    updateAvatarFromName(currentUser.name);
  }

  function fillForm() {
    editName.value = currentUser.name || "";
    editEmail.value = currentUser.email || "";
    editPhone.value = currentUser.phone || "";
    editCity.value = currentUser.city || "";
    editBirth.value = currentUser.birth || "";
  }

  let toastTimeout;
  function showMessage(text, isError = false) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastMsg.innerText = text || (isError ? "⚠️ Ошибка" : "✅ Данные сохранены");
    toastMsg.style.background = isError ? "#9b2c2c" : "#2c5f2d";
    toastMsg.classList.add('show');
    toastTimeout = setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 2300);
  }

  function validateUserData(user) {
    if (!user.name || user.name.trim().length < 2) {
      showMessage("Имя должно содержать минимум 2 символа", true);
      return false;
    }
    if (user.email && user.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        showMessage("Введите корректный email (пример: name@domain.ru)", true);
        return false;
      }
    } else {
      showMessage("Укажите email", true);
      return false;
    }
    if (!user.phone || user.phone.trim().length < 5) {
      showMessage("Телефон слишком короткий (минимум 5 символов)", true);
      return false;
    }
    if (!user.city || user.city.trim().length < 2) {
      showMessage("Укажите город", true);
      return false;
    }
    if (user.birth && user.birth.trim() !== "") {
      const datePattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;
      if (!datePattern.test(user.birth)) {
        showMessage("Дата рождения должна быть в формате ДД.ММ.ГГГГ (например, 15.05.1992)", true);
        return false;
      }
      const day = parseInt(RegExp.$1, 10);
      const month = parseInt(RegExp.$2, 10);
      const year = parseInt(RegExp.$3, 10);
      if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > new Date().getFullYear()) {
        showMessage("Некорректная дата (проверьте день, месяц, год)", true);
        return false;
      }
    } else {
      showMessage("Укажите дату рождения в формате ДД.ММ.ГГГГ", true);
      return false;
    }
    return true;
  }

  function saveProfile() {
    const newUserData = {
      name: editName.value.trim(),
      email: editEmail.value.trim(),
      phone: editPhone.value.trim(),
      city: editCity.value.trim(),
      birth: editBirth.value.trim(),
      userId: currentUser.userId && currentUser.userId !== "" ? currentUser.userId : generateUserId()
    };

    if (!validateUserData(newUserData)) {
      return;
    }

    currentUser = { ...newUserData };
    try {
      localStorage.setItem('personalCabinetUser', JSON.stringify(currentUser));
    } catch(e) { console.warn(e); }

    renderProfile();
    fillForm();
    showMessage("✅ Личные данные успешно сохранены!");
  }

  // Полный сброс: очищаем все поля и удаляем данные из localStorage (кроме даты регистрации)
  function resetToEmpty() {
    currentUser = {
      name: "",
      email: "",
      phone: "",
      city: "",
      birth: "",
      userId: generateUserId()   // создаём новый свежий ID
    };
    try {
      localStorage.setItem('personalCabinetUser', JSON.stringify(currentUser));
    } catch(e) {}
    renderProfile();
    fillForm();
    showMessage("🧹 Все данные очищены, профиль как новый", false);
  }

  function loadUserFromStorage() {
    const stored = localStorage.getItem('personalCabinetUser');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          // загружаем только то, что есть, но без подмешивания типовых данных
          currentUser = {
            name: parsed.name || "",
            email: parsed.email || "",
            phone: parsed.phone || "",
            city: parsed.city || "",
            birth: parsed.birth || "",
            userId: parsed.userId || ""
          };
        } else {
          currentUser = { ...emptyUser };
        }
      } catch (err) {
        currentUser = { ...emptyUser };
      }
    } else {
      currentUser = { ...emptyUser };
    }

    // Если нет userId — генерируем
    if (!currentUser.userId || currentUser.userId === "") {
      currentUser.userId = generateUserId();
      localStorage.setItem('personalCabinetUser', JSON.stringify(currentUser));
    }

    // проверка на дату регистрации (отдельно)
    if (!localStorage.getItem('userRegDate')) {
      const now = new Date();
      const regDate = `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()}`;
      localStorage.setItem('userRegDate', regDate);
    }

    renderProfile();
    fillForm();
  }

  // Живое превью аватара при вводе имени (только визуально)
  function bindLivePreview() {
    editName.addEventListener('input', function(e) {
      const newName = e.target.value.trim();
      if (newName && newName.length > 0) {
        const previewName = newName;
        const initPreview = getInitialsFromName(previewName);
        avatarDisplay.innerHTML = initPreview.length > 2 ? initPreview.slice(0,2) : initPreview;
      } else {
        updateAvatarFromName(currentUser.name);
      }
    });
    editName.addEventListener('blur', function() {
      if (currentUser) updateAvatarFromName(currentUser.name);
    });
  }

  // Функция для возврата на главный сайт
  // Сохраняем все данные перед уходом (на всякий случай принудительно)
  function saveBeforeExit() {
    // Если в форме есть несохранённые изменения, но пользователь хочет выйти -
    // сохраняем их автоматически, чтобы данные не потерялись
    const currentFormData = {
      name: editName.value.trim(),
      email: editEmail.value.trim(),
      phone: editPhone.value.trim(),
      city: editCity.value.trim(),
      birth: editBirth.value.trim(),
      userId: currentUser.userId && currentUser.userId !== "" ? currentUser.userId : generateUserId()
    };

    // Проверяем, изменились ли данные
    const hasChanges = (
      currentFormData.name !== currentUser.name ||
      currentFormData.email !== currentUser.email ||
      currentFormData.phone !== currentUser.phone ||
      currentFormData.city !== currentUser.city ||
      currentFormData.birth !== currentUser.birth
    );

    if (hasChanges && currentFormData.name && currentFormData.email && currentFormData.phone && currentFormData.city && currentFormData.birth) {
      // Если есть изменения и поля заполнены — сохраняем
      if (validateUserData(currentFormData)) {
        currentUser = { ...currentFormData };
        localStorage.setItem('personalCabinetUser', JSON.stringify(currentUser));
        console.log("Данные автоматически сохранены перед выходом");
      }
    } else if (hasChanges) {
      // Если поля не полностью заполнены, но пользователь уходит — всё равно сохраняем то, что есть
      // (не проходим валидацию, но сохраняем черновик)
      currentUser = { ...currentFormData };
      localStorage.setItem('personalCabinetUser', JSON.stringify(currentUser));
      console.log("Черновик сохранён перед выходом");
    }
  }

  function goBackToSite() {
    // Сохраняем все текущие данные перед выходом
    saveBeforeExit();

    // URL сайта, с которого пришли (можно настроить под свои нужды)
    // По умолчанию — предыдущая страница в истории браузера
    // Если нужно конкретный сайт — раскомментируйте нужную строку

    // Мой сайт:
    window.location.href = "index2.html";
}

  function initEventListeners() {
    saveBtn.addEventListener('click', saveProfile);
    resetBtn.addEventListener('click', resetToEmpty);
    backToSiteBtn.addEventListener('click', goBackToSite);
  }

  function setupEnterSubmit() {
    const inputs = [editName, editEmail, editPhone, editCity, editBirth];
    inputs.forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          saveProfile();
        }
      });
    });
  }

  // Сохраняем данные перед закрытием страницы / перезагрузкой
  function setupBeforeUnload() {
    window.addEventListener('beforeunload', function() {
      // Сохраняем текущие данные из формы даже без нажатия кнопки "Сохранить"
      const currentFormData = {
        name: editName.value.trim(),
        email: editEmail.value.trim(),
        phone: editPhone.value.trim(),
        city: editCity.value.trim(),
        birth: editBirth.value.trim(),
        userId: currentUser.userId && currentUser.userId !== "" ? currentUser.userId : generateUserId()
      };

      // Сохраняем всегда, даже если не прошли валидацию (чтобы не потерять введённое)
      if (currentFormData.name !== currentUser.name ||
          currentFormData.email !== currentUser.email ||
          currentFormData.phone !== currentUser.phone ||
          currentFormData.city !== currentUser.city ||
          currentFormData.birth !== currentUser.birth) {

        // Сохраняем текущий пользовательский ввод в localStorage
        const saveData = {
          name: currentFormData.name,
          email: currentFormData.email,
          phone: currentFormData.phone,
          city: currentFormData.city,
          birth: currentFormData.birth,
          userId: currentFormData.userId
        };
        localStorage.setItem('personalCabinetUser', JSON.stringify(saveData));
      }
    });
  }

  function init() {
    loadUserFromStorage();
    initEventListeners();
    bindLivePreview();
    setupEnterSubmit();
    setupBeforeUnload();  // Автосохранение при закрытии страницы
  }

  init();