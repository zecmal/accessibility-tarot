const startBtn = document.getElementById("startBtn");
const urlInput = document.getElementById("urlInput");
const crystalBall = document.getElementById("crystalBall");
const cardTable = document.getElementById("cardTable");
const blurLayer = document.querySelector(".blur-layer");

function getCardImages(errorId) {
  return {
    front: `images/${errorId}.png`,
    back: "images/card-back-frame.png"
  };
}

startBtn.addEventListener("click", () => {
  const url = urlInput.value.trim();
  if (!url) return;

  crystalBall.classList.remove("hidden");
  cardTable.innerHTML = "";

  fetch("http://localhost:3000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  })
    .then(res => res.json())
    .then(data => {
      showCards(data);
    })
    .catch(err => {
      console.error("Virhe backend-yhteydessä:", err);
      crystalBall.classList.add("hidden");
    });
});

function showCards(errors) {
  crystalBall.classList.add("hidden");

  if (errors.length === 0) {
    showNoIssuesCard();
    return;
  }

  errors.forEach((error, index) => {
    setTimeout(() => {
      blurLayer.classList.remove("hidden");

      const cardEl = document.createElement("div");
      cardEl.className = "card animate-in";

      const inner = document.createElement("div");
      inner.className = "card-inner";

      // Etupuoli
      const front = document.createElement("div");
      front.className = "card-front";
      const frontImg = document.createElement("img");
      frontImg.src = getCardImages(error.id).front;
      front.appendChild(frontImg);

      // Takapuoli
      const back = document.createElement("div");
      back.className = "card-back";

      const frame = document.createElement("div");
      frame.className = "card-frame-back";

      // Virheen nimi
      const title = document.createElement("div");
      title.className = "card-title";
      title.textContent = error.id || "Unknown";
      
      const text = document.createElement("div");
      text.className = "card-text";
      text.textContent = error.description || "No description available.";

      frame.appendChild(title);
      frame.appendChild(text);
      back.appendChild(frame);

      inner.appendChild(front);
      inner.appendChild(back);
      cardEl.appendChild(inner);

      cardEl.addEventListener("click", () => {
        cardEl.classList.toggle("flipped");
      });

      // 1. Lisää kortti ensin bodyyn → keskelle ruutua
      document.body.appendChild(cardEl);

      // 2. Siirrä kortti korttipöytään sulavasti
      setTimeout(() => {
        const rect = cardEl.getBoundingClientRect();
        blurLayer.classList.add("hidden");
        cardEl.classList.remove("animate-in");
        cardTable.appendChild(cardEl);
        const newRect = cardEl.getBoundingClientRect();
        const dx = rect.left - newRect.left;
        const dy = rect.top - newRect.top;
        cardEl.style.transition = "none";
        cardEl.style.transform = `translate(${dx}px, ${dy}px)`;
        cardEl.offsetHeight;
        cardEl.style.transition = "transform 0.6s ease";
        cardEl.style.transform = "translate(0, 0)";
      }, 2000);
    }, index * 2200);
  });
}

function showNoIssuesCard() {
  blurLayer.classList.remove("hidden");

  const cardEl = document.createElement("div");
  cardEl.className = "card animate-in";

  const inner = document.createElement("div");
  inner.className = "card-inner";

  // Etupuoli
  const front = document.createElement("div");
  front.className = "card-front";
  const frontImg = document.createElement("img");
  frontImg.src = "images/no-issues.png";
  front.appendChild(frontImg);

  // Takapuoli
  const back = document.createElement("div");
  back.className = "card-back";

  const frame = document.createElement("div");
  frame.className = "card-frame-back";

  const title = document.createElement("div");
  title.className = "card-title";
  title.textContent = "No Issues Found";

  const text = document.createElement("div");
  text.className = "card-text";
  text.textContent = "This page passed all accessibility checks. Great job!";

  frame.appendChild(title);
  frame.appendChild(text);
  back.appendChild(frame);

  inner.appendChild(front);
  inner.appendChild(back);
  cardEl.appendChild(inner);

  cardEl.addEventListener("click", () => {
    cardEl.classList.toggle("flipped");
  });

  document.body.appendChild(cardEl);

  setTimeout(() => {
    const rect = cardEl.getBoundingClientRect();
    blurLayer.classList.add("hidden");
    cardEl.classList.remove("animate-in");
    cardTable.appendChild(cardEl);
    const newRect = cardEl.getBoundingClientRect();
    const dx = rect.left - newRect.left;
    const dy = rect.top - newRect.top;
    cardEl.style.transition = "none";
    cardEl.style.transform = `translate(${dx}px, ${dy}px)`;
    cardEl.offsetHeight;
    cardEl.style.transition = "transform 0.6s ease";
    cardEl.style.transform = "translate(0, 0)";
  }, 2000);
}