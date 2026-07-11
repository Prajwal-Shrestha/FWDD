const tabButtons = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".tab-panel");
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("panel-" + btn.dataset.tab).classList.add("active");
  });
});

const scoreOneEl = document.getElementById("scoreOne");
const scoreTwoEl = document.getElementById("scoreTwo");
const statusEl = document.getElementById("matchStatus");
const statusTextEl = document.getElementById("statusText");
const teamOneBlock = document.getElementById("teamOneBlock");
const teamTwoBlock = document.getElementById("teamTwoBlock");
const eventsList = document.getElementById("eventsList");
const noEventsMsg = document.getElementById("noEventsMsg");

function bump(el) {
  el.classList.remove("bump");
  void el.offsetWidth; // restart animation
  el.classList.add("bump");
}

function addEvent(image, player, minute) {
  if (noEventsMsg) noEventsMsg.remove();
  const row = document.createElement("div");
  row.className = "event-row";
  row.innerHTML = `
  <div class="player-image">
      <img src="${image}" alt="${player}">
  </div>

  <div class="event-name">
      <i class="fa-solid fa-futbol event-icon-type"></i>
      ${player}
  </div>

  <div class="event-minute">${minute}</div>
`;
  eventsList.appendChild(row);
}

function updateLeader(one, two) {
  teamOneBlock.classList.toggle("leading", one > two);
  teamTwoBlock.classList.toggle("leading", two > one);
}

const updates = [
  {
    one: 1,
    two: 0,
    scorer: "Erling Halland",
    minute: "23'",
    image: "../assets/images/haaland.png",
    delay: 5500,
    status: "Live",
  },
  {
    one: 1,
    two: 1,
    scorer: "Cole Palmer",
      minute: "45'",
    image: "../assets/images/palmer.png",
    delay: 7500,
    status: "Live · 2nd Half",
  },
  {
    one: 2,
    two: 1,
    scorer: "Erling Halland",
      minute: "67'",
    image: "../assets/images/haaland.png",
    delay: 9500,
    status: "Full Time",
  },
];

let total = 0;
updates.forEach((u) => {
  total += u.delay;
  setTimeout(() => {
    scoreOneEl.textContent = u.one;
    scoreTwoEl.textContent = u.two;
    bump(scoreOneEl);
    bump(scoreTwoEl);
    updateLeader(u.one, u.two);
    addEvent(u.image, u.scorer, u.minute);
    statusTextEl.textContent = u.status;

    if (u.status === "Full Time") {
      statusEl.classList.remove("live");
      statusEl.classList.add("ft");
    }
  }, total);
});
