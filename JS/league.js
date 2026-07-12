let leagues = [
    { id:1, name:"Friends League", members:12, max:20, type:"Private", joined:true, myRank:3, myPoints:142 },
    { id:2, name:"Office Champions", members:18, max:20, type:"Private", joined:true, myRank:1, myPoints:201 },
    { id:3, name:"Cricket Fans Club", members:15, max:20, type:"Public", joined:false, myRank:7, myPoints:98 },
    { id:4, name:"Weekend Warriors", members:10, max:20, type:"Private", joined:true, myRank:2, myPoints:176 },
    { id:5, name:"Campus Elite", members:9, max:20, type:"Invite Only", joined:false, myRank:5, myPoints:110 },
  ];

  const managerPool = ["A. Kumar","S. Rai","M. Thapa","P. Gurung","R. Shrestha","N. Basnet","D. Lama","K. Adhikari"];

  const initials = name => name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();

  function typeClass(t){
    if(t==="Public") return "public";
    if(t==="Invite Only") return "invite";
    return "private";
  }

  // ===== Render league list =====
  const leagueList = document.getElementById('leagueList');
  const listPane = document.getElementById('listPane');
  const emptyPane = document.getElementById('emptyPane');
  const createPane = document.getElementById('createPane');
  let currentTab = 'all';

  function filteredLeagues(){
    if(currentTab==='joined') return leagues.filter(l=>l.joined);
    if(currentTab==='invite') return leagues.filter(l=>l.type==="Invite Only");
    return leagues;
  }

  function renderList(){
    const data = filteredLeagues();
    leagueList.innerHTML = '';

    if(data.length===0){
      listPane.style.display='none';
      emptyPane.style.display='block';
      return;
    }
    listPane.style.display='block';
    emptyPane.style.display='none';

    data.forEach(l=>{
      const pct = Math.round((l.members/l.max)*100);
      const r = 28, circ = 2*Math.PI*r;
      const offset = circ - (pct/100)*circ;

      const card = document.createElement('div');
      card.className = 'league-card';
      card.innerHTML = `
        <div class="ring-avatar">
          <svg viewBox="0 0 64 64">
            <circle class="ring-bg" cx="32" cy="32" r="${r}"></circle>
            <circle class="ring-fg" cx="32" cy="32" r="${r}" stroke-dasharray="${circ}" stroke-dashoffset="${offset}"></circle>
          </svg>
          <div class="avatar-inner"><i class="fa-solid fa-users"></i></div>
        </div>
        <div class="league-info">
          <h3>${l.name}</h3>
          <div class="league-meta">
            <span><i class="fa-solid fa-user-group"></i> ${l.members} / ${l.max} Members</span>
            <span class="type-badge ${typeClass(l.type)}">${l.type}</span>
            ${l.joined ? `<span class="rank-pill"><i class="fa-solid fa-trophy"></i> Your rank: #${l.myRank}</span>` : ''}
          </div>
        </div>
        <div class="league-actions">
          <button class="view-btn" data-id="${l.id}">View League</button>
          <div class="menu-wrap">
            <button class="menu-btn" data-menu="${l.id}"><i class="fa-solid fa-ellipsis"></i></button>
            <div class="dropdown" id="dropdown-${l.id}">
              <button data-invite="${l.id}"><i class="fa-solid fa-user-plus"></i> Invite Friends</button>
              <button data-view="${l.id}"><i class="fa-solid fa-eye"></i> View Details</button>
              ${l.joined
                ? `<button class="danger" data-leave="${l.id}"><i class="fa-solid fa-right-from-bracket"></i> Leave League</button>`
                : `<button data-join="${l.id}"><i class="fa-solid fa-right-to-bracket"></i> Join League</button>`}
            </div>
          </div>
        </div>
      `;
      leagueList.appendChild(card);
    });
  }

  // ===== Tabs =====
  document.getElementById('tabs').addEventListener('click', e=>{
    const btn = e.target.closest('.tab-btn');
    if(!btn) return;
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentTab = btn.dataset.tab;

    if(currentTab==='create'){
      listPane.style.display='none';
      emptyPane.style.display='none';
      createPane.style.display='block';
    } else {
      createPane.style.display='none';
      renderList();
    }
  });

  function goToCreateTab(){
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelector('.tab-btn[data-tab="create"]').classList.add('active');
    currentTab='create';
    listPane.style.display='none';
    emptyPane.style.display='none';
    createPane.style.display='block';
  }
  document.getElementById('topCreateBtn').addEventListener('click', goToCreateTab);
  document.getElementById('emptyCreateBtn').addEventListener('click', goToCreateTab);

  // ===== Create league form =====
  document.getElementById('typeGroup').addEventListener('click', e=>{
    const opt = e.target.closest('.radio-opt');
    if(!opt) return;
    document.querySelectorAll('.radio-opt').forEach(o=>o.classList.remove('selected'));
    opt.classList.add('selected');
  });

  document.getElementById('createForm').addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('leagueName').value.trim();
    const max = parseInt(document.getElementById('maxMembers').value) || 20;
    const type = document.querySelector('input[name="type"]:checked').value;
    if(!name) return;

    const newLeague = { id: Date.now(), name, members:1, max, type, joined:true, myRank:1, myPoints:0 };
    leagues.unshift(newLeague);

    e.target.reset();
    document.querySelectorAll('.radio-opt').forEach(o=>o.classList.remove('selected'));
    document.querySelector('.radio-opt[data-type="Private"]').classList.add('selected');

    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelector('.tab-btn[data-tab="all"]').classList.add('active');
    currentTab='all';
    createPane.style.display='none';
    renderList();
    showToast(`"${name}" created — invite your friends!`);
  });

  // ===== Card interactions (delegated) =====
  leagueList.addEventListener('click', e=>{
    const menuBtn = e.target.closest('.menu-btn');
    if(menuBtn){
      const id = menuBtn.dataset.menu;
      document.querySelectorAll('.dropdown').forEach(d=>{
        if(d.id !== `dropdown-${id}`) d.classList.remove('open');
      });
      document.getElementById(`dropdown-${id}`).classList.toggle('open');
      return;
    }

    const viewBtn = e.target.closest('[data-id]') || e.target.closest('[data-view]');
    if(viewBtn){
      const id = viewBtn.dataset.id || viewBtn.dataset.view;
      openLeagueModal(id);
      closeAllDropdowns();
      return;
    }

    const inviteBtn = e.target.closest('[data-invite]');
    if(inviteBtn){
      openInviteModal(inviteBtn.dataset.invite);
      closeAllDropdowns();
      return;
    }

    const leaveBtn = e.target.closest('[data-leave]');
    if(leaveBtn){
      const l = leagues.find(x=>x.id==leaveBtn.dataset.leave);
      l.joined = false;
      l.members = Math.max(0, l.members-1);
      renderList();
      showToast(`You left "${l.name}"`);
      return;
    }

    const joinBtn = e.target.closest('[data-join]');
    if(joinBtn){
      const l = leagues.find(x=>x.id==joinBtn.dataset.join);
      l.joined = true;
      l.members = Math.min(l.max, l.members+1);
      renderList();
      showToast(`You joined "${l.name}"`);
      return;
    }
  });

  function closeAllDropdowns(){
    document.querySelectorAll('.dropdown').forEach(d=>d.classList.remove('open'));
  }
  document.addEventListener('click', e=>{
    if(!e.target.closest('.menu-wrap')) closeAllDropdowns();
  });

  // ===== League detail modal =====
  const leagueOverlay = document.getElementById('leagueOverlay');

  function openLeagueModal(id){
    const l = leagues.find(x=>x.id==id);
    if(!l) return;
    document.getElementById('modalLeagueName').textContent = l.name;
    document.getElementById('modalLeagueSub').textContent = `${l.members} / ${l.max} Members · ${l.type}`;

    // Standings — build a mock table including "me"
    const rows = [];
    for(let i=1;i<=Math.min(l.members,6);i++){
      if(i===l.myRank && l.joined){
        rows.push({rank:i, name:"You", team:"My Squad", pts:l.myPoints, me:true});
      } else {
        rows.push({rank:i, name:managerPool[i%managerPool.length], team:`Team ${i}`, pts: Math.max(40, l.myPoints + (Math.floor(Math.random()*40)-20) - (i-l.myRank)*8), me:false});
      }
    }
    if(l.joined && !rows.find(r=>r.me)){
      rows.push({rank:l.myRank, name:"You", team:"My Squad", pts:l.myPoints, me:true});
    }
    rows.sort((a,b)=>b.pts-a.pts);
    document.getElementById('standingsBody').innerHTML = rows.map((r,i)=>`
      <tr class="${r.me ? 'me':''}">
        <td>${i+1}</td>
        <td>${r.name}</td>
        <td>${r.team}</td>
        <td class="pts" style="text-align:right;">${r.pts}</td>
      </tr>
    `).join('');

    // Fixtures — mock
    const fixtures = [
      {a:"You", b:managerPool[0], date:"Sat, Jul 18"},
      {a:managerPool[1], b:managerPool[2], date:"Sat, Jul 18"},
      {a:"You", b:managerPool[3], date:"Sat, Jul 25"},
    ];
    document.getElementById('fixturesBody').innerHTML = fixtures.map(f=>`
      <div class="fixture-item">
        <span class="vs">${f.a} vs ${f.b}</span>
        <span class="date">${f.date}</span>
      </div>
    `).join('');

    // Members
    const memberNames = ["You", ...managerPool.slice(0, Math.max(0,l.members-1))];
    document.getElementById('membersBody').innerHTML = memberNames.slice(0,10).map((m,i)=>`
      <div class="member-item">
        <div class="avatar-circle">${initials(m)}</div>
        <div>
          <div class="name">${m}</div>
          <div class="role">${i===0 ? "Commissioner" : "Member"}</div>
        </div>
      </div>
    `).join('');
    document.getElementById('inviteLink').value = `https://fantasyfootball.app/join/${l.id}`;

    // reset to standings tab
    document.querySelectorAll('.modal-tab').forEach(t=>t.classList.remove('active'));
    document.querySelector('.modal-tab[data-pane="standings"]').classList.add('active');
    document.querySelectorAll('.modal-pane').forEach(p=>p.classList.remove('active'));
    document.getElementById('pane-standings').classList.add('active');

    leagueOverlay.classList.add('open');
  }

  document.getElementById('closeModal').addEventListener('click', ()=>leagueOverlay.classList.remove('open'));
  leagueOverlay.addEventListener('click', e=>{ if(e.target===leagueOverlay) leagueOverlay.classList.remove('open'); });

  document.querySelectorAll('.modal-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.modal-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.modal-pane').forEach(p=>p.classList.remove('active'));
      document.getElementById(`pane-${tab.dataset.pane}`).classList.add('active');
    });
  });

  document.getElementById('copyLinkBtn').addEventListener('click', function(){
    const input = document.getElementById('inviteLink');
    input.select();
    navigator.clipboard?.writeText(input.value);
    this.textContent = 'Copied!';
    this.classList.add('copied');
    setTimeout(()=>{ this.textContent='Copy link'; this.classList.remove('copied'); }, 1500);
  });

  // ===== Invite modal =====
  const inviteOverlay = document.getElementById('inviteOverlay');
  let inviteTargetLeague = null;

  function openInviteModal(id){
    const l = leagues.find(x=>x.id==id);
    if(!l) return;
    inviteTargetLeague = l;
    document.getElementById('inviteLeagueName').textContent = l.name;
    document.getElementById('inviteModalLink').value = `https://fantasyfootball.app/join/${l.id}`;
    document.getElementById('inviteEmail').value = '';
    inviteOverlay.classList.add('open');
  }
  document.getElementById('closeInviteModal').addEventListener('click', ()=>inviteOverlay.classList.remove('open'));
  inviteOverlay.addEventListener('click', e=>{ if(e.target===inviteOverlay) inviteOverlay.classList.remove('open'); });

  document.getElementById('copyInviteModalBtn').addEventListener('click', function(){
    const input = document.getElementById('inviteModalLink');
    input.select();
    navigator.clipboard?.writeText(input.value);
    this.textContent='Copied!';
    this.classList.add('copied');
    setTimeout(()=>{ this.textContent='Copy'; this.classList.remove('copied'); }, 1500);
  });

  document.getElementById('sendInviteBtn').addEventListener('click', ()=>{
    const email = document.getElementById('inviteEmail').value.trim();
    if(!email) return;
    showToast(`Invite sent to ${email}`);
    document.getElementById('inviteEmail').value = '';
  });

  // ===== Toast =====
  let toastTimer;
  function showToast(msg){
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>toast.classList.remove('show'), 2600);
  }

  // ===== Init =====
  renderList();