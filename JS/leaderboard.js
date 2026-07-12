  // ===== Seed data =====
  const players = [
    { rank:1, team:"Champion Squad", manager:"Alex", points:1245, winnings:50000, trend:"up", isMe:false, league:"all" },
    { rank:2, team:"Winning Warriors", manager:"Roshan", points:1198, winnings:20000, trend:"up", isMe:false, league:"all" },
    { rank:3, team:"Fantasy Kings", manager:"Suresh", points:1150, winnings:10000, trend:"flat", isMe:false, league:"all" },
    { rank:4, team:"Game Changers", manager:"Karan", points:1120, winnings:5000, trend:"down", isMe:false, league:"all" },
    { rank:5, team:"Super Strikers", manager:"Manoj", points:1050, winnings:2500, trend:"up", isMe:false, league:"all" },
    { rank:6, team:"Goal Diggers", manager:"Bibek", points:990, winnings:1500, trend:"down", isMe:false, league:"all" },
    { rank:7, team:"My Squad", manager:"You", points:940, winnings:1000, trend:"up", isMe:true, league:"all" },
    { rank:8, team:"Red Card Rebels", manager:"Sagar", points:905, winnings:0, trend:"flat", isMe:false, league:"all" },
    { rank:9, team:"Net Busters", manager:"Anup", points:860, winnings:0, trend:"down", isMe:false, league:"all" },
    { rank:10, team:"Ball Hogs", manager:"Deepak", points:812, winnings:0, trend:"up", isMe:false, league:"all" },
  ];

  const initials = name => name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();

  const trendIcon = t => {
    if(t==="up") return `<span class="trend up"><i class="fa-solid fa-arrow-up"></i> Rising</span>`;
    if(t==="down") return `<span class="trend down"><i class="fa-solid fa-arrow-down"></i> Falling</span>`;
    return `<span class="trend flat"><i class="fa-solid fa-minus"></i> Steady</span>`;
  };

  const rankMarkup = rank => {
    if(rank===1) return `<i class="fa-solid fa-trophy rank-trophy gold"></i>`;
    if(rank===2) return `<i class="fa-solid fa-trophy rank-trophy silver"></i>`;
    if(rank===3) return `<i class="fa-solid fa-trophy rank-trophy bronze"></i>`;
    return `<span class="rank-num">${rank}</span>`;
  };

  let state = { tab:'all', search:'', gw:'all', trend:'all' };

  function applyFilters(){
    let data = [...players];

    if(state.tab === 'friends'){
      data = data.filter(p=>p.isMe || ["Roshan","Suresh","Karan"].includes(p.manager));
    }
    // 'my' and 'all' both show full mock board — mock data doesn't distinguish leagues further

    if(state.trend !== 'all'){
      data = data.filter(p=>p.trend===state.trend);
    }

    if(state.search.trim()){
      const q = state.search.trim().toLowerCase();
      data = data.filter(p=> p.team.toLowerCase().includes(q) || p.manager.toLowerCase().includes(q));
    }

    return data;
  }

  function render(){
    const data = applyFilters();
    const boardBody = document.getElementById('boardBody');
    const boardWrap = document.getElementById('boardWrap');
    const emptyState = document.getElementById('emptyState');

    if(data.length === 0){
      boardWrap.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }
    boardWrap.style.display = 'block';
    emptyState.style.display = 'none';

    boardBody.innerHTML = data.map(p => `
      <div class="board-row ${p.isMe ? 'me' : ''}">
        <div class="rank-cell">${rankMarkup(p.rank)}</div>
        <div class="team-cell">
          <div class="avatar-ring">${p.isMe ? '<i class="fa-solid fa-user"></i>' : initials(p.manager)}</div>
          <div class="team-name-wrap">
            <div class="team-name">${p.team} ${p.isMe ? '<span class="you-badge">You</span>' : ''}</div>
            <div class="manager-name">${p.manager}</div>
          </div>
        </div>
        <div class="points-cell">${p.points.toLocaleString()}
          ${trendIcon(p.trend)}
        </div>
        <div class="winnings-cell">${p.winnings > 0 ? '£' + p.winnings.toLocaleString() : '—'}</div>
      </div>
    `).join('');

    // Your rank summary bar
    const me = players.find(p=>p.isMe);
    if(me){
      document.getElementById('yourRankBar').style.display = 'flex';
      document.getElementById('yourRankNum').textContent = '#' + me.rank;
      document.getElementById('yourTeamLabel').textContent = me.team;
      document.getElementById('yourPointsLabel').textContent = me.points.toLocaleString();
      document.getElementById('yourWinningsLabel').textContent = me.winnings > 0 ? '£' + me.winnings.toLocaleString() : '£0';
    } else {
      document.getElementById('yourRankBar').style.display = 'none';
    }
  }

  // ===== Tabs =====
  document.getElementById('tabs').addEventListener('click', e=>{
    const btn = e.target.closest('.tab-btn');
    if(!btn) return;
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    state.tab = btn.dataset.tab;
    render();
  });

  // ===== Contest dropdown =====
  const contestBtn = document.getElementById('contestSelectBtn');
  const contestDropdown = document.getElementById('contestDropdown');
  contestBtn.addEventListener('click', e=>{
    e.stopPropagation();
    contestDropdown.classList.toggle('open');
  });
  contestDropdown.addEventListener('click', e=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    document.querySelectorAll('#contestDropdown button').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('contestLabel').textContent = btn.dataset.contest;
    contestDropdown.classList.remove('open');
    render();
  });
  document.addEventListener('click', ()=> contestDropdown.classList.remove('open'));

  // ===== Filters panel =====
  const filtersPanel = document.getElementById('filtersPanel');
  document.getElementById('filtersBtn').addEventListener('click', ()=>{
    filtersPanel.classList.toggle('open');
  });

  function updateFilterCount(){
    let count = 0;
    if(state.gw !== 'all') count++;
    if(state.trend !== 'all') count++;
    const badge = document.getElementById('filterCount');
    if(count > 0){
      badge.style.display = 'inline-block';
      badge.textContent = count;
    } else {
      badge.style.display = 'none';
    }
  }

  document.getElementById('gwFilters').addEventListener('click', e=>{
    const btn = e.target.closest('.filter-chip');
    if(!btn) return;
    document.querySelectorAll('#gwFilters .filter-chip').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    state.gw = btn.dataset.gw;
    updateFilterCount();
    render();
  });

  document.getElementById('trendFilters').addEventListener('click', e=>{
    const btn = e.target.closest('.filter-chip');
    if(!btn) return;
    document.querySelectorAll('#trendFilters .filter-chip').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    state.trend = btn.dataset.trend;
    updateFilterCount();
    render();
  });

  document.getElementById('resetFilters').addEventListener('click', ()=>{
    state.gw = 'all';
    state.trend = 'all';
    document.querySelectorAll('#gwFilters .filter-chip').forEach(b=>b.classList.remove('selected'));
    document.querySelector('#gwFilters .filter-chip[data-gw="all"]').classList.add('selected');
    document.querySelectorAll('#trendFilters .filter-chip').forEach(b=>b.classList.remove('selected'));
    document.querySelector('#trendFilters .filter-chip[data-trend="all"]').classList.add('selected');
    updateFilterCount();
    render();
  });

  // ===== Search =====
  document.getElementById('searchInput').addEventListener('input', e=>{
    state.search = e.target.value;
    render();
  });

  // ===== Init =====
  render();