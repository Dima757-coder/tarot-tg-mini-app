document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("card-container");
  const sendBtn = document.getElementById("send-btn");

  const tg = window.Telegram.WebApp;
  tg.ready();

  let selectedCards = [];
  const totalCardsToShow = 6;

  // Создаём 6 карт-рубашек
  for (let i = 0; i < totalCardsToShow; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = i;
    card.addEventListener("click", () => selectCard(card));
    container.appendChild(card);
  }

  function selectCard(card) {
    if (selectedCards.includes(card)) return;

    if (selectedCards.length >= 3) {
      alert("Можно выбрать только 3 карты");
      return;
    }

    card.classList.add("selected");
    selectedCards.push(card);

    if (selectedCards.length === 3) {
      sendBtn.disabled = false;
    }
  }

  sendBtn.addEventListener("click", () => {
    const shuffled = shuffleArray(tarotCards).slice(0, 3);
    selectedCards.forEach((card, index) => {
      const meaning = shuffled[index];
      const img = document.createElement("img");
      img.src = meaning.image_url_up;
      img.alt = meaning.name;
      img.style.width = "100%";
      img.style.borderRadius = "10px";
      card.innerHTML = "";
      card.appendChild(img);

      const p = document.createElement("p");
      p.textContent = `${meaning.name}: ${meaning.meaning.upright}`;
      card.appendChild(p);
    });

    sendBtn.style.display = "none";

    // Отправляем данные в Telegram
    tg.sendData(JSON.stringify({
      action: "show_result",
      cards: shuffled.map(c => c.name)
    }));
  });

  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }
});
