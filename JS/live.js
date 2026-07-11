const matches = [
  {
    id: 1,
    teamA: "Manchester City",
    logoA: "../assets/images/manchestercity.png",
    teamB: "Chelsea",
    logoB: "../assets/images/chelsea.png",
    scoreA: 0,
    scoreB: 0,
    status: "live",
  },
  {
    id: 2,
    teamA: "Liverpool",
    logoA: "../assets/images/liverpool.png",
    teamB: "Arsenal",
    logoB: "../assets/images/arsenal.png",
    scoreA: 0,
    scoreB: 0,
    status: "live",
  },
  {
    id: 3,
    teamA: "Manchester United",
    logoA: "../assets/images/manchesterunited.png",
    teamB: "Tottenham",
    logoB: "../assets/images/tottenham.png",
    scoreA: 0,
    scoreB: 0,
    status: "live",
    },
    {
        id: 4,
    teamA: "Real Madrid",
    logoA: "../assets/images/realmadrid.png",
    teamB: "Barcelona",
    logoB: "../assets/images/barcelona.png",
    scoreA: 0,
    scoreB: 0,
    status: "live",
  },
];

const listEl = document.getElementById("matchList");

function renderCard(m) {
  const card = document.createElement("div");
  card.className = "match-card";
  card.id = "match-" + m.id;

  card.innerHTML = `
    <div class="card-status ${m.status}" id="status-${m.id}">
      <span class="dot"></span>
      <span id="status-text-${m.id}">
        ${m.status === "live" ? "Live" : "Full Time"}
      </span>
    </div>

    <div class="team" id="teamA-${m.id}">
      <div class="crest">
        <img src="${m.logoA}" alt="${m.teamA}">
      </div>

      <div class="team-meta">
        <span class="team-name">${m.teamA}</span>
        <span class="team-score" id="scoreA-${m.id}">${m.scoreA}</span>
      </div>
    </div>

    <span class="score-sep">-</span>

    <div class="team right" id="teamB-${m.id}">
      <div class="crest">
        <img src="${m.logoB}" alt="${m.teamB}">
      </div>

      <div class="team-meta">
        <span class="team-name">${m.teamB}</span>
        <span class="team-score" id="scoreB-${m.id}">${m.scoreB}</span>
      </div>
    </div>
  `;

  listEl.appendChild(card);
}

matches.forEach(renderCard);

function bump(el) {
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
}

function updateScore(matchId, scoreA, scoreB, status) {
  const m = matches.find((x) => x.id === matchId);

  m.scoreA = scoreA;
  m.scoreB = scoreB;
  m.status = status;

  const scoreAEl = document.getElementById("scoreA-" + matchId);
  const scoreBEl = document.getElementById("scoreB-" + matchId);

  scoreAEl.textContent = scoreA;
  scoreBEl.textContent = scoreB;

  bump(scoreAEl);
  bump(scoreBEl);

  document
    .getElementById("teamA-" + matchId)
    .classList.toggle("leading", scoreA > scoreB);

  document
    .getElementById("teamB-" + matchId)
    .classList.toggle("leading", scoreB > scoreA);

  const statusEl = document.getElementById("status-" + matchId);
  const statusTextEl = document.getElementById("status-text-" + matchId);

  statusEl.classList.remove("live", "ft");
  statusEl.classList.add(status);

  statusTextEl.textContent = status === "live" ? "Live" : "Full Time";
}

const sequence = [
  { at: 2500, matchId: 1, a: 1, b: 0, status: "live" },
  { at: 4000, matchId: 2, a: 1, b: 0, status: "live" },
  { at: 5000, matchId: 2, a: 1, b: 1, status: "live" },
  { at: 6000, matchId: 3, a: 0, b: 1, status: "live" },
  { at: 8000, matchId: 1, a: 1, b: 1, status: "live" },
  { at: 9500, matchId: 2, a: 2, b: 1, status: "live" },
  { at: 11000, matchId: 3, a: 1, b: 3, status: "live" },
  { at: 17500, matchId: 1, a: 2, b: 1, status: "ft" },
  { at: 14500, matchId: 2, a: 2, b: 3, status: "ft" },
  { at: 19500, matchId: 3, a: 1, b: 5, status: "ft" },
  { at: 9500, matchId: 4, a: 1, b: 0, status: "live" },
  { at: 11500, matchId: 4, a: 1, b: 1, status: "live" },
  { at: 13500, matchId: 4, a: 2, b: 1, status: "ft" },
  { at: 20500, matchId: 4, a: 2, b: 1, status: "ft" },
];

sequence.forEach((u) => {
  setTimeout(() => {
    updateScore(u.matchId, u.a, u.b, u.status);
  }, u.at);
});
