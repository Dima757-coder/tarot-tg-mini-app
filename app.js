document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("card-container");
  const sendBtn = document.getElementById("send-btn");

  const tg = window.Telegram.WebApp;
  tg.ready();

  let selectedCards = [];
  const totalCardsToShow = 6;

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
  }

  sendBtn.addEventListener("click", () => {
    const shuffled = shuffleArray(tarotCards).slice(0, 3);
    selectedCards.forEach((card, index) => {
      const meaning = shuffled[index];
      const isReversed = Math.random() < 0.5;

      const back = card.querySelector(".card-back");
      back.innerHTML = `
        <img src="${isReversed ? meaning.image_url_down : meaning.image_url_up}" 
             alt="${meaning.name}" 
             style="width:100%; border-radius:10px;">
        <p style="margin-top: 8px; font-weight: bold;">${meaning.name}</p>
      `;

      setTimeout(() => {
        card.classList.add("flipped");
      }, index * 300);
    });

    sendBtn.style.display = "none";

    tg.sendData(JSON.stringify({
      action: "show_result",
      cards: shuffled.map(c => c.name)
    }));
  });

  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }
});
