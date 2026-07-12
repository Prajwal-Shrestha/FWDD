 // ===== State =====
  const BASE_BUDGET = 2.5;
  const BASE_FREE_TRANSFERS = 1;
  const MAX_PER_CLUB = 3;

  let squad = [
    { id:'s1', name:"Erling Haaland", pos:"FWD", club:"Man City", price:1.5, points:210 },
    { id:'s2', name:"Kevin De Bruyne", pos:"MID", club:"Man City", price:2.5, points:185 },
    { id:'s3', name:"Alisson Becker", pos:"GK", club:"Liverpool", price:5.5, points:140 },
    { id:'s4', name:"Virgil van Dijk", pos:"DEF", club:"Liverpool", price:6.0, points:155 },
    { id:'s5', name:"Bukayo Saka", pos:"MID", club:"Arsenal", price:8.5, points:198 },
  ];

  let market = [
    { id:'m1', name:"Lionel Messi", pos:"FWD", club:"Inter Miami", price:10.5, points:245 },
    { id:'m2', name:"Neymar Junior", pos:"FWD", club:"Al Hilal", price:5.5, points:150 },
    { id:'m3', name:"Kylian Mbappe", pos:"FWD", club:"Real Madrid", price:14.5, points:260 },
    { id:'m4', name:"Jude Bellingham", pos:"MID", club:"Real Madrid", price:11.0, points:230 },
    { id:'m5', name:"Rodri", pos:"MID", club:"Man City", price:6.5, points:170 },
    { id:'m6', name:"Ruben Dias", pos:"DEF", club:"Man City", price:5.5, points:140 },
    { id:'m7', name:"Trent Alexander-Arnold", pos:"DEF", club:"Liverpool", price:7.0, points:165 },
    { id:'m8', name:"Ederson", pos:"GK", club:"Man City", price:5.5, points:130 },
    { id:'m9', name:"David Raya", pos:"GK", club:"Arsenal", price:5.0, points:125 },
    { id:'m10', name:"William Saliba", pos:"DEF", club:"Arsenal", price:5.5, points:135 },
    { id:'m11', name:"Martin Odegaard", pos:"MID", club:"Arsenal", price:8.5, points:180 },
    { id:'m12', name:"Mohamed Salah", pos:"MID", club:"Liverpool", price:13.0, points:255 },
  ];

  let freeTransfers = BASE_FREE_TRANSFERS;
  let budget = BASE_BUDGET;

  let pendingOut = []; // squad players staged for removal
  let pendingIn = [];  // market players staged for adding

  let outModalState = { search:'', pos:'ALL' };
  let inModalState = { search:'', pos:'ALL' };

  const initials = name => name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
  const fmt = n => `$${n.toFixed(1)}M`;

  // ===== Core render =====
  function pendingSpend(){ return pendingIn.reduce((s,p)=>s+p.price,0); }
  function pendingRefund(){ return pendingOut.reduce((s,p)=>s+p.price,0); }
  function budgetAfter(){ return budget + pendingRefund() - pendingSpend(); }

  function transferCount(){ return Math.min(pendingOut.length, pendingIn.length) === pendingOut.length && pendingOut.length === pendingIn.length ? pendingOut.length : Math.max(pendingOut.length, pendingIn.length); }

  function render(){
    // Stats bar
    document.getElementById('freeTransfersValue').textContent = freeTransfers;
    document.getElementById('budgetValue').textContent = fmt(budget);
    document.getElementById('pendingValue').textContent = Math.max(pendingOut.length, pendingIn.length);

    // Out list
    const outList = document.getElementById('outList');
    document.getElementById('outHeading').classList.toggle('filled', pendingOut.length>0);
    if(pendingOut.length === 0){
      outList.innerHTML = `<div class="empty-row">No players selected to transfer out yet. Click "Select From Squad" to begin.</div>`;
    } else {
      outList.innerHTML = pendingOut.map(p => `
        <div class="player-row out-row">
          <div class="player-avatar"><i class="fa-solid fa-user"></i></div>
          <div class="player-info">
            <div class="name">${p.name}</div>
            <div class="meta">
              <span class="pos-badge ${p.pos}">${p.pos}</span>
              <span>${p.club}</span>
              <span class="player-points"><i class="fa-solid fa-star"></i> ${p.points} pts</span>
            </div>
          </div>
          <div class="player-price">${fmt(p.price)}</div>
          <button class="player-action-btn remove" data-unout="${p.id}" title="Remove from transfer"><i class="fa-solid fa-xmark"></i></button>
        </div>
      `).join('');
    }

    // In list
    const inList = document.getElementById('inList');
    document.getElementById('inHeading').classList.toggle('filled', pendingIn.length>0);
    if(pendingIn.length === 0){
      inList.innerHTML = `<div class="empty-row">No replacement players added yet. Click "Add Player" to search the market.</div>`;
    } else {
      inList.innerHTML = pendingIn.map(p => `
        <div class="player-row in-row">
          <div class="player-avatar"><i class="fa-solid fa-user"></i></div>
          <div class="player-info">
            <div class="name">${p.name}</div>
            <div class="meta">
              <span class="pos-badge ${p.pos}">${p.pos}</span>
              <span>${p.club}</span>
              <span class="player-points"><i class="fa-solid fa-star"></i> ${p.points} pts</span>
            </div>
          </div>
          <div class="player-price">${fmt(p.price)}</div>
          <button class="player-action-btn remove" data-unin="${p.id}" title="Remove from transfer"><i class="fa-solid fa-xmark"></i></button>
        </div>
      `).join('');
    }

    // Confirm bar summary
    const count = Math.max(pendingOut.length, pendingIn.length);
    const extra = Math.max(0, count - freeTransfers);
    const cost = extra * 4;
    const afterBudget = budgetAfter();

    document.getElementById('summaryUsed').textContent = `${count} / ${freeTransfers} free`;
    const costEl = document.getElementById('summaryCost');
    costEl.textContent = cost > 0 ? `-${cost} pts` : '0 pts';
    costEl.classList.toggle('warn', cost > 0);

    const budgetEl = document.getElementById('summaryBudget');
    budgetEl.textContent = fmt(afterBudget);
    budgetEl.classList.toggle('bad', afterBudget < 0);

    // Validate confirm button
    const clubCounts = {};
    squad.filter(s => !pendingOut.find(p=>p.id===s.id)).concat(pendingIn).forEach(p=>{
      clubCounts[p.club] = (clubCounts[p.club]||0) + 1;
    });
    const clubViolation = Object.values(clubCounts).some(c => c > MAX_PER_CLUB);
    const balanced = pendingOut.length === pendingIn.length && pendingOut.length > 0;
    const budgetOk = afterBudget >= 0;

    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.disabled = !(balanced && budgetOk && !clubViolation);

    confirmBtn.title = !balanced ? 'Players Out and Players In must match' :
      (clubViolation ? `Max ${MAX_PER_CLUB} players per club` :
      (!budgetOk ? 'Transfer exceeds available budget' : ''));
  }

  // ===== Out list interactions =====
  document.getElementById('outList').addEventListener('click', e=>{
    const btn = e.target.closest('[data-unout]');
    if(!btn) return;
    pendingOut = pendingOut.filter(p=>p.id !== btn.dataset.unout);
    render();
  });

  document.getElementById('inList').addEventListener('click', e=>{
    const btn = e.target.closest('[data-unin]');
    if(!btn) return;
    pendingIn = pendingIn.filter(p=>p.id !== btn.dataset.unin);
    render();
  });

  // ===== Out picker modal =====
  const outOverlay = document.getElementById('outOverlay');
  document.getElementById('openOutPicker').addEventListener('click', ()=>{
    outOverlay.classList.add('open');
    renderOutModal();
  });

  function renderOutModal(){
    let data = squad.filter(s => !pendingOut.find(p=>p.id===s.id));
    if(outModalState.pos !== 'ALL') data = data.filter(p=>p.pos===outModalState.pos);
    if(outModalState.search.trim()){
      const q = outModalState.search.trim().toLowerCase();
      data = data.filter(p=>p.name.toLowerCase().includes(q) || p.club.toLowerCase().includes(q));
    }
    const body = document.getElementById('outModalBody');
    if(data.length===0){
      body.innerHTML = `<div class="modal-empty">No squad players match your search.</div>`;
      return;
    }
    body.innerHTML = data.map(p => `
      <div class="market-row">
        <div class="player-avatar"><i class="fa-solid fa-user"></i></div>
        <div class="player-info">
          <div class="name">${p.name}</div>
          <div class="meta">
            <span class="pos-badge ${p.pos}">${p.pos}</span>
            <span>${p.club}</span>
            <span class="player-points"><i class="fa-solid fa-star"></i> ${p.points} pts</span>
          </div>
        </div>
        <div class="player-price">${fmt(p.price)}</div>
        <button class="select-btn" data-select-out="${p.id}">Select</button>
      </div>
    `).join('');
  }

  document.getElementById('outModalBody').addEventListener('click', e=>{
    const btn = e.target.closest('[data-select-out]');
    if(!btn) return;
    const player = squad.find(s=>s.id===btn.dataset.selectOut);
    if(player && !pendingOut.find(p=>p.id===player.id)){
      pendingOut.push(player);
      render();
      renderOutModal();
      showToast(`${player.name} added to Players Out`);
    }
  });

  document.getElementById('outSearchInput').addEventListener('input', e=>{
    outModalState.search = e.target.value;
    renderOutModal();
  });
  document.getElementById('outPosFilters').addEventListener('click', e=>{
    const btn = e.target.closest('.pos-filter-chip');
    if(!btn) return;
    document.querySelectorAll('#outPosFilters .pos-filter-chip').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    outModalState.pos = btn.dataset.pos;
    renderOutModal();
  });

  // ===== In (market) picker modal =====
  const inOverlay = document.getElementById('inOverlay');
  document.getElementById('openInPicker').addEventListener('click', ()=>{
    inOverlay.classList.add('open');
    renderInModal();
  });

  function renderInModal(){
    let data = market.filter(m => !pendingIn.find(p=>p.id===m.id));
    if(inModalState.pos !== 'ALL') data = data.filter(p=>p.pos===inModalState.pos);
    if(inModalState.search.trim()){
      const q = inModalState.search.trim().toLowerCase();
      data = data.filter(p=>p.name.toLowerCase().includes(q) || p.club.toLowerCase().includes(q));
    }
    const body = document.getElementById('inModalBody');
    if(data.length===0){
      body.innerHTML = `<div class="modal-empty">No players match your search.</div>`;
      return;
    }
    const afterSpendAvailable = budget + pendingRefund() - pendingSpend();
    body.innerHTML = data.map(p => {
      const affordable = p.price <= afterSpendAvailable;
      return `
      <div class="market-row">
        <div class="player-avatar"><i class="fa-solid fa-user"></i></div>
        <div class="player-info">
          <div class="name">${p.name}</div>
          <div class="meta">
            <span class="pos-badge ${p.pos}">${p.pos}</span>
            <span>${p.club}</span>
            <span class="player-points"><i class="fa-solid fa-star"></i> ${p.points} pts</span>
          </div>
        </div>
        <div class="player-price">${fmt(p.price)}</div>
        <button class="select-btn" data-select-in="${p.id}" ${affordable ? '' : 'disabled'}>${affordable ? 'Select' : 'Over budget'}</button>
      </div>
    `;}).join('');
  }

  document.getElementById('inModalBody').addEventListener('click', e=>{
    const btn = e.target.closest('[data-select-in]');
    if(!btn || btn.disabled) return;
    const player = market.find(m=>m.id===btn.dataset.selectIn);
    if(player && !pendingIn.find(p=>p.id===player.id)){
      pendingIn.push(player);
      render();
      renderInModal();
      showToast(`${player.name} added to Players In`);
    }
  });

  document.getElementById('inSearchInput').addEventListener('input', e=>{
    inModalState.search = e.target.value;
    renderInModal();
  });
  document.getElementById('inPosFilters').addEventListener('click', e=>{
    const btn = e.target.closest('.pos-filter-chip');
    if(!btn) return;
    document.querySelectorAll('#inPosFilters .pos-filter-chip').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    inModalState.pos = btn.dataset.pos;
    renderInModal();
  });

  // ===== Modal close =====
  document.querySelectorAll('[data-close]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.getElementById(btn.dataset.close).classList.remove('open');
    });
  });
  [outOverlay, inOverlay].forEach(ov=>{
    ov.addEventListener('click', e=>{ if(e.target===ov) ov.classList.remove('open'); });
  });

  // ===== Cancel / Confirm =====
  document.getElementById('cancelBtn').addEventListener('click', ()=>{
    if(pendingOut.length===0 && pendingIn.length===0) return;
    pendingOut = [];
    pendingIn = [];
    render();
    showToast('Pending transfers cleared', true);
  });

  document.getElementById('confirmBtn').addEventListener('click', ()=>{
    if(document.getElementById('confirmBtn').disabled) return;

    const count = pendingOut.length;
    const extra = Math.max(0, count - freeTransfers);

    // Apply to squad
    squad = squad.filter(s => !pendingOut.find(p=>p.id===s.id));
    squad = squad.concat(pendingIn);

    // Apply budget
    budget = budgetAfter();

    // Apply free transfers
    freeTransfers = Math.max(0, freeTransfers - count);

    // Remove purchased players from market, return sold players to market pool
    const boughtIds = pendingIn.map(p=>p.id);
    market = market.filter(m => !boughtIds.includes(m.id)).concat(pendingOut);

    const msg = extra > 0
      ? `Transfers confirmed — cost ${extra*4} pts`
      : `Transfers confirmed`;

    pendingOut = [];
    pendingIn = [];

    render();
    showToast(msg);
  });

  // ===== Toast =====
  let toastTimer;
  function showToast(msg, warn){
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.toggle('warn', !!warn);
    toast.querySelector('i').className = warn ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-check';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>toast.classList.remove('show'), 2600);
  }

  // ===== Init =====
  render();