const players = [
  { name: "Erling Haaland", goals: 27 },
  { name: "Mohamed Salah", goals: 24 },
  { name: "Cole Palmer", goals: 21 },
  { name: "Bukayo Saka", goals: 18 },
  { name: "Son Heung-min", goals: 17 },
  { name: "Bruno Fernandes", goals: 15 },
];

const teams = [
  {
    name: "Real Madrid",
    logo: "../assets/images/realmadrid.png",
    points: 45,
    color: "#f1efef",
  },
  {
    name: "Manchester City",
    logo: "../assets/images/manchestercity.png",
    points: 43,
    color: "#6CABDD",
  },
  {
    name: "AC Milan",
    logo: "../assets/images/acmilan.png",
    points: 42,
    color: "#F2003C",
  },
  {
    name: "Liverpool",
    logo: "../assets/images/liverpool.png",
    points: 41,
    color: "#ff002b",
  },
  {
    name: "Inter Milan",
    logo: "../assets/images/intermilan.png",
    points: 40,
    color: "#004d9a",
    },
    {
        name: "Paris Saint German",
        logo: "../assets/images/psg.png",
        points: 39,
        color: "#004170"
  },
  {
    name: "Barcelona",
    logo: "../assets/images/barcelona.png",
    points: 38,
    color: "#A50044",
  },
  {
    name: "Arsenal",
    logo: "../assets/images/arsenal.png",
    points: 35,
    color: "#720e11",
  },
  {
    name: "Chelsea",
    logo: "../assets/images/chelsea.png",
    points: 30,
    color: "#034694",
  },
  {
    name: "Manchester United",
    logo: "../assets/images/manchesterunited.png",
    points: 28,
    color: "#DA291C",
  },
  {
    name: "Tottenham",
    logo: "../assets/images/tottenham.png",
    points: 25,
    color: "#132257",
  },
];

function renderPlayerList(containerId) {
  const el = document.getElementById(containerId);

  el.innerHTML = players
    .map(
      (p, i) => `
      <div class="score-row">

        <span class="rank-name">
          <span class="rank-num">${i + 1}</span>
          ${p.name}
        </span>

        <span class="goal-count">${p.goals}</span>

      </div>
    `,
    )
    .join("");
}

function renderDonut(donutId, totalId) {
  const total = teams.reduce((sum, team) => sum + team.points, 0);

  let cumulative = 0;

  const stops = teams
    .map((team) => {
      const start = (cumulative / total) * 360;

      cumulative += team.points;

      const end = (cumulative / total) * 360;

      return `${team.color} ${start}deg ${end}deg`;
    })
    .join(", ");

  const donut = document.getElementById(donutId);

  donut.style.background = `conic-gradient(${stops})`;

  document.getElementById(totalId).textContent = total;
}

function renderTeamList(containerId) {
  const el = document.getElementById(containerId);

  el.innerHTML = teams
    .map(
      (team) => `
      <div class="team-row">

        <span
          class="team-swatch"
          style="background:${team.color}">
        </span>

        <div class="team-crest">
          <img src="${team.logo}" alt="${team.name}">
        </div>

        <span class="team-name">
          ${team.name}
        </span>

        <span class="team-points">
          ${team.points}
        </span>

      </div>
    `,
    )
    .join("");
}

renderPlayerList("scoreListOverview");
renderPlayerList("scoreListPlayers");

renderDonut("donutOverview", "totalPointsOverview");

renderDonut("donutTeams", "totalPointsTeams");

renderTeamList("teamListOverview");
renderTeamList("teamListTeams");

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
