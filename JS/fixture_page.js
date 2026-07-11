  const matches = [
    { home: "Real Madrid", homelogo:"../assets/images/realmadrid.png", away: "Barcelona", awaylogo:"../assets/images/barcelona.png", date: "20 May 2026", time: "4:00 pm" },
    { home: "Inter Milan", homelogo:"../assets/images/intermilan.png", away: "AC Milan", awaylogo:"../assets/images/acmilan.png", date: "21 May 2026", time: "5:00 pm" },
    { home: "Arsenal", homelogo:"../assets/images/arsenal.png", away: "Chelsea", awaylogo:"../assets/images/chelsea.png", date: "22 May 2026", time: "4:00 pm" },
    { home: "Manchester United", homelogo:"../assets/images/manchesterunited.png", away: "Manchester City", awaylogo:"../assets/images/manchestercity.png", date: "27 May 2026", time: "6:00 pm" },
    { home: "Tottenham", homelogo:"../assets/images/tottenham.png", away: "Paris Saint German", awaylogo:"../assets/images/psg.png", date: "22 May 2026", time: "5:00 pm" },
  ];
 
  const colorPairs = [
    ["#0f5c33", "#0c1b36"],
    ["#177a41", "#1a3260"],
    ["#22a05a", "#0c1b36"],
    ["#0f5c33", "#1a3260"],
    ["#177a41", "#081226"],
  ];
 
  function initials(name){
    return name.split(" ").map(w => w[0]).join("").toUpperCase();
  }
 
  function renderMatches(list){
    const container = document.getElementById("matchList");
    const empty = document.getElementById("emptyState");
    const count = document.getElementById("resultCount");
    container.innerHTML = "";
 
    if(list.length === 0){
      empty.classList.add("show");
      count.textContent = "0 matches";
      return;
    }
    empty.classList.remove("show");
    count.textContent = list.length + (list.length === 1 ? " match" : " matches");
 
    list.forEach((m, i) => {
      const [c1, c2] = colorPairs[i % colorPairs.length];
      const row = document.createElement("div");
      row.className = "match-row";
      row.innerHTML = `
        <div class="fixture">
        <img class="team-logo" src="${m.homelogo}" alt="${m.home} logo">
          <span class="team-name">${m.home}</span>
          <span class="vs">vs</span>
          <span class="team-name">${m.away}</span>
          <img class="team-logo" src="${m.awaylogo}" alt="${m.away} logo">
        </div>
        <div class="date-cell">${m.date}</div>
        <div class="time-cell"><i class="fa-regular fa-clock"></i>${m.time}</div>
      `;
      container.appendChild(row);
    });
  }
 
  function runSearch(){
    const q = document.getElementById("searchInput").value.trim().toLowerCase();
    if(q === ""){
      renderMatches(matches);
      return;
    }
    const filtered = matches.filter(m =>
      m.home.toLowerCase().includes(q) ||
      m.away.toLowerCase().includes(q) ||
      (m.home + " vs " + m.away).toLowerCase().includes(q)
    );
    renderMatches(filtered);
  }
 
  document.getElementById("searchBtn").addEventListener("click", runSearch);
  document.getElementById("searchInput").addEventListener("input", runSearch);
  document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if(e.key === "Enter") runSearch();
  });
 
  renderMatches(matches);
