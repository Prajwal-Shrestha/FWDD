// =============================
// Countdown Timer
// =============================

const countdown = new Date("May 26, 2026 19:30:00").getTime();

const timer = setInterval(() => {
  const now = new Date().getTime();
  const distance = countdown - now;

  if (distance < 0) {
    clearInterval(timer);

    document.querySelector(".countdown").innerHTML =
      "<h2 style='grid-column:span 4;text-align:center;'>Match Started ⚽</h2>";

    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const boxes = document.querySelectorAll(".countdown div");

  boxes[0].querySelector("h2").textContent = String(days).padStart(2, "0");
  boxes[1].querySelector("h2").textContent = String(hours).padStart(2, "0");
  boxes[2].querySelector("h2").textContent = String(minutes).padStart(2, "0");
  boxes[3].querySelector("h2").textContent = String(seconds).padStart(2, "0");
}, 1000);

// =============================
// Add Player Button
// =============================

const buttons = document.querySelectorAll(".player-card button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    button.innerHTML = "✓";
    button.style.background = "#2563eb";
    button.disabled = true;
  });
});

// =============================
// Sidebar Active Menu
// =============================

const menuItems = document.querySelectorAll(".menu li");

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    menuItems.forEach((i) => i.classList.remove("active"));

    item.classList.add("active");
  });
});

// =============================
// Notification Animation
// =============================

const bell = document.querySelector(".notification");

setInterval(() => {
  bell.style.transform = "scale(1.1)";

  setTimeout(() => {
    bell.style.transform = "scale(1)";
  }, 250);
}, 5000);

// =============================
// Welcome Message
// =============================

window.addEventListener("load", () => {
  console.log("Football Dashboard Loaded Successfully!");
});
