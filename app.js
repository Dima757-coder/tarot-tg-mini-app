document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("card-container");

  const tg = window.Telegram.WebApp;
  tg.ready();

  let selectedCards = [];
  const totalCardsToShow = 6;

  // Создаём 6 карт-рубашек
  for (let i = 0; i < totalCardsToShow; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = i;

    // HTML структура карты
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back"></div>
      </div>
    `;

    card.addEventListener("click", () => selectCard(card));
    container.appendChild(card);
  }

  function selectCard(card) {
    if (selectedCards.includes(card)) return;

    if (selectedCards.length >= 3) {
      alert("Можно выбрать только 3 карты");
      return;
    }

    selectedCards.push(card);
    card.classList.add("selected");

    // Активируем анимацию переворота
    const shuffled = shuffleArray(tarotCards);
    const meaning = shuffled[0]; // Берём случайную карту
    const isReversed = Math.random() < 0.5;

    const back = card.querySelector(".card-back");
    back.innerHTML = `
      <img src="${isReversed ? meaning.image_url_down : meaning.image_url_up}" 
           alt="${meaning.name}" 
           style="width:100%; border-radius:10px;">
      <p style="margin-top: 8px; font-weight: bold;">${meaning.name}</p>
    `;

    // Анимация переворота
    setTimeout(() => {
      card.classList.add("flipped");
    }, 100);

    // Проверяем, выбрано ли 3 карты
    if (selectedCards.length === 3) {
      showContinueButton();
    }
  }

function showContinueButton() {
  const btn = document.createElement("button");
  btn.textContent = "Продолжить";
  btn.id = "continue-btn";
  btn.style.marginTop = "60px";
  btn.style.padding = "12px 20px";
  btn.style.fontSize = "16px";
  btn.style.backgroundColor = "#4CAF50";
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.borderRadius = "5px";
  btn.style.cursor = "pointer";

  document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("card-container");

  const tg = window.Telegram.WebApp;
  tg.ready();

  let selectedCards = [];
  const totalCardsToShow = 6;

  // Создаём 6 карт-рубашек
  for (let i = 0; i < totalCardsToShow; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = i;

    // HTML структура карты
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back"></div>
      </div>
    `;

    card.addEventListener("click", () => selectCard(card));
    container.appendChild(card);
  }

  function selectCard(card) {
    if (selectedCards.includes(card)) return;

    if (selectedCards.length >= 3) {
      alert("Можно выбрать только 3 карты");
      return;
    }

    selectedCards.push(card);
    card.classList.add("selected");

    // Активируем анимацию переворота
    const shuffled = shuffleArray(tarotCards);
    const meaning = shuffled[0]; // Берём случайную карту
    const isReversed = Math.random() < 0.5;

    const back = card.querySelector(".card-back");
    back.innerHTML = `
      <img src="${isReversed ? meaning.image_url_down : meaning.image_url_up}" 
           alt="${meaning.name}" 
           style="width:100%; border-radius:10px;">
      <p style="margin-top: 8px; font-weight: bold;">${meaning.name}</p>
    `;

    // Анимация переворота
    setTimeout(() => {
      card.classList.add("flipped");
    }, 100);

    // Проверяем, выбрано ли 3 карты
    if (selectedCards.length === 3) {
      showContinueButton();
    }
  }

function showContinueButton() {
  const btn = document.createElement("button");
  btn.textContent = "Продолжить";
  btn.id = "continue-btn";
  btn.style.marginTop = "60px";
  btn.style.padding = "12px 20px";
  btn.style.fontSize = "16px";
  btn.style.backgroundColor = "#4CAF50";
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.borderRadius = "5px";
  btn.style.cursor = "pointer";

  btn.addEventListener("click", () => {
    const selectedCardData = selectedCards.map(card => {
      const back = card.querySelector(".card-back");
      const nameEl = back.querySelector("p");
      const img = back.querySelector("img");

      // Определяем, перевёрнута ли карта
      const isReversed = img.src.includes('_down') || img.src.includes('reversed');

      return {
        name: nameEl.textContent,
        position: isReversed ? 'reversed' : 'upright',
        image: img.src.trim()  // <-- Добавлено: передаем URL картинки
      };
    });

    // Отправляем данные в Telegram-бота
    tg.sendData(JSON.stringify({
      action: "cards_selected",
      cards: selectedCardData
    }));

    tg.close();
  });

  document.body.appendChild(btn);
}

  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }
});

  document.body.appendChild(btn);
}

  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }
});
