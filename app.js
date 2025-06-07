document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("card-container");
  let tg;
  if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.ready();
  } else {
    alert("Это приложение должно быть открыто в Telegram.");
    return;
  }

  let selectedCards = [];
  const totalCardsToShow = 6;
  let usedCards = [];

  const urlParams = new URLSearchParams(window.location.search);
  const question = urlParams.get('question') || "Как мне изменить жизнь?";

  function createCards() {
    container.innerHTML = '';
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
  }

  function selectCard(card) {
    if (selectedCards.includes(card)) return;

    if (selectedCards.length >= 3) {
      alert("Можно выбрать только 3 карты");
      return;
    }

    let availableCards = tarotCards.filter(c => !usedCards.includes(c.name));
    if (availableCards.length === 0) {
      alert("Все карты уже использованы. Пожалуйста, начните заново.");
      return;
    }

    let meaning = shuffleArray(availableCards)[0];
    usedCards.push(meaning.name);
    selectedCards.push(card);
    card.classList.add("selected");

    const isReversed = Math.random() < 0.5;
    const back = card.querySelector(".card-back");

    const img = document.createElement("img");
    img.src = isReversed ? meaning.image_url_down : meaning.image_url_up;
    img.alt = meaning.name;
    img.style.cssText = "width: 100%; height: auto; max-height: 75%; border-radius: 10px;";
    img.onerror = () => {
      console.error(`Ошибка загрузки изображения для карты: ${meaning.name}`);
      img.src = "https://iili.io/38S5Ab9.png"; // Резервное изображение
    };

    back.innerHTML = '';
    back.appendChild(img);
    back.appendChild(document.createElement("p")).textContent = meaning.name;
    back.appendChild(document.createElement("small")).textContent = isReversed ? '(Перевернутая)' : '(Прямая)';

    card.dataset.position = isReversed ? 'reversed' : 'upright';

    setTimeout(() => {
      card.classList.add("flipped");
    }, 100);

    if (selectedCards.length === 3) {
      showButtons();
    }
  }

  function showButtons() {
    const oldContinueBtn = document.getElementById("continue-btn");
    const oldResetBtn = document.getElementById("reset-btn");
    if (oldContinueBtn) oldContinueBtn.remove();
    if (oldResetBtn) oldResetBtn.remove();

    const continueBtn = document.createElement("button");
    continueBtn.textContent = "Продолжить";
    continueBtn.id = "continue-btn";
    continueBtn.classList.add("btn");
    continueBtn.addEventListener("click", () => {
      const selectedCardsData = selectedCards.map((card) => {
        return {
          name: card.querySelector(".card-back p").textContent,
          position: card.dataset.position
        };
      });

      if (selectedCardsData.some(card => ! neighbouring || !card.position)) {
        console.error("Некорректные данные карт:", selectedCardsData);
        alert("Ошибка: данные карт некорректны.");
        return;
      }

      console.log("📤 Отправляемые данные:", { cards: selectedCardsData, question });

      try {
        tg.sendData(JSON.stringify({ cards: selectedCardsData, question }));
        console.log("✅ Данные успешно отправлены в Telegram Web App");
        setTimeout(() => {
          tg.close();
        }, 500);
      } catch (error) {
        console.error("❌ Ошибка при отправке данных:", error);
        alert("Ошибка при отправке данных в Telegram.");
      }
    });

    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Начать заново";
    resetBtn.id = "reset-btn";
    resetBtn.classList.add("btn", "reset-btn");
    resetBtn.addEventListener("click", () => {
      selectedCards = [];
      usedCards = [];
      container.querySelectorAll(".card").forEach(card => {
        card.removeEventListener("click", selectCard);
      });
      container.innerHTML = '';
      createCards();
      const oldContinueBtn = document.getElementById("continue-btn");
      const oldResetBtn = document.getElementById("reset-btn");
      if (oldContinueBtn) oldContinueBtn.remove();
      if (oldResetBtn) oldResetBtn.remove();
    });

    document.body.appendChild(continueBtn);
    document.body.appendChild(resetBtn);
  }

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  createCards();
});
