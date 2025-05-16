document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("card-container");

  const tg = window.Telegram.WebApp;
  tg.ready();

  let selectedCards = [];
  const totalCardsToShow = 6;
  let usedCards = [];

  for (let i = 0; i < totalCardsToShow; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = i;

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

    // Выбираем случайную уникальную карту
    let availableCards = tarotCards.filter(c => !usedCards.includes(c.name));
    if (availableCards.length === 0) {
      alert("Нет доступных уникальных карт");
      return;
    }

    let meaning = shuffleArray(availableCards)[0];
    usedCards.push(meaning.name);

    const isReversed = Math.random() < 0.5;

    const back = card.querySelector(".card-back");
    back.innerHTML = `
      <img src="${isReversed ? meaning.image_url_down : meaning.image_url_up}" 
           alt="${meaning.name}" 
           style="width: 100%; height: auto; max-height: 75%; border-radius: 10px;">
      <p>${meaning.name}</p>
    `;

    setTimeout(() => {
      card.classList.add("flipped");
    }, 100);

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
    const selectedCardsData = selectedCards.map((card) => {
      const back = card.querySelector(".card-back");
      const name = back.querySelector("p").textContent;
      const isReversed = Math.random() < 0.5;

      return {
        name: name,
        position: isReversed ? "reversed" : "upright"
      };
    });

    console.log("📤 Отправляемые данные:", { cards: selectedCardsData });
    tg.sendData(JSON.stringify({ cards: selectedCardsData }));

    setTimeout(() => {
      tg.close();
    }, 500); // Делаем паузу перед закрытием
  });

  document.body.appendChild(btn);
}
