const tg = window.Telegram.WebApp;
const cardsContainer = document.getElementById("cards");
const submitBtn = document.getElementById("submit-btn");

let selectedCards = [];

// Отображаем карты
tarotCards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className = "tarot-card";
    cardElement.innerHTML = `
        <img src="${card.image_url_up}" alt="${card.name}">
        <h3>${card.name}</h3>
    `;
    cardElement.addEventListener("click", () => toggleCard(index));
    cardsContainer.appendChild(cardElement);
});

// Выбор/отмена карты
function toggleCard(index) {
    const card = tarotCards[index];
    const cardElement = cardsContainer.children[index];

    if (selectedCards.includes(card)) {
        selectedCards = selectedCards.filter(c => c !== card);
        cardElement.classList.remove("selected");
    } else {
        if (selectedCards.length < 3) {
            selectedCards.push(card);
            cardElement.classList.add("selected");
        }
    }

    submitBtn.disabled = selectedCards.length !== 3;
}

// Отправка данных в бота
submitBtn.addEventListener("click", () => {
    const result = {
        action: "tarot_selected",
        cards: selectedCards.map(card => ({
            name: card.name,
            meaning: card.meaning
        }))
    };
    tg.sendData(JSON.stringify(result));
    tg.close();
});