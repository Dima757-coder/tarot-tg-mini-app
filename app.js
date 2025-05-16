// app.js

Telegram.WebApp.ready();
Telegram.WebApp.setHeaderTitle("Выберите карты");

const cardContainer = document.getElementById('card-container');
const selectedCards = [];

// Функция отрисовки карт (берётся из tarot-data.js)
function renderCards() {
    tarotCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <img src="${card.image_url_up}" alt="${card.name}" />
            <p>${card.name}</p>
        `;
        cardElement.addEventListener('click', () => selectCard(card));
        cardContainer.appendChild(cardElement);
    });
}

// Обработка выбора карты
function selectCard(card) {
    if (selectedCards.includes(card)) return;

    if (selectedCards.length < 3) {
        selectedCards.push(card);
        updateSelectedDisplay();

        if (selectedCards.length === 3) {
            createContinueButton();
        }
    } else {
        alert("Вы можете выбрать только 3 карты");
    }
}

// Отображение выбранных карт
function updateSelectedDisplay() {
    console.log("Выбранные карты:", selectedCards.map(c => c.name));
}

// Создание кнопки "Продолжить"
function createContinueButton() {
    const button = document.createElement('button');
    button.textContent = 'Продолжить';
    button.className = 'continue-button';
    button.onclick = () => {
        // Отправка данных в Telegram-бота
        const payload = {
            cards: selectedCards.map(card => ({
                name: card.name,
                position: Math.random() > 0.5 ? "upright" : "reversed"
            }))
        };
        Telegram.WebApp.sendData(JSON.stringify(payload)); // Основной вызов
    };

    document.body.appendChild(button);
}

// Запуск приложения
renderCards();
