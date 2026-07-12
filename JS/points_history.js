// ===== Seed data =====
  // Monthly cumulative points for the chart, per range
  const chartData = {
    thisYear: [
      {m:"Jan", pts:80}, {m:"Feb", pts:190}, {m:"Mar", pts:340}, {m:"Apr", pts:520},
      {m:"May", pts:640}, {m:"Jun", pts:980}, {m:"Jul", pts:1120}, {m:"Aug", pts:1180},
      {m:"Sep", pts:1420}, {m:"Oct", pts:1510}, {m:"Nov", pts:1680}, {m:"Dec", pts:1820}
    ],
    lastYear: [
      {m:"Jan", pts:40}, {m:"Feb", pts:120}, {m:"Mar", pts:260}, {m:"Apr", pts:360},
      {m:"May", pts:520}, {m:"Jun", pts:610}, {m:"Jul", pts:780}, {m:"Aug", pts:900},
      {m:"Sep", pts:1040}, {m:"Oct", pts:1180}, {m:"Nov", pts:1340}, {m:"Dec", pts:1425}
    ],
    allTime: [
      {m:"Y1", pts:1425}, {m:"Y2", pts:1820}, {m:"Y3", pts:2340}, {m:"Y4", pts:2810},
      {m:"Y5", pts:3245}
    ]
  };

  // Gameweek history entries, per range
  const historyData = {
    thisYear: [
      { date:"20 May 2026", desc:"Gameweek 12 Result", gw:"GW12", points:120 },
      { date:"13 May 2026", desc:"Gameweek 11 Result", gw:"GW11", points:95 },
      { date:"12 May 2026", desc:"Captain Bonus Applied", gw:"GW11", points:15 },
      { date:"06 May 2026", desc:"Gameweek 10 Result", gw:"GW10", points:54 },
      { date:"29 Apr 2026", desc:"Gameweek 9 Result", gw:"GW9", points:70 },
      { date:"22 Apr 2026", desc:"Extra Transfer Penalty", gw:"GW8", points:-4 },
      { date:"22 Apr 2026", desc:"Gameweek 8 Result", gw:"GW8", points:88 },
      { date:"15 Apr 2026", desc:"Gameweek 7 Result", gw:"GW7", points:62 },
      { date:"08 Apr 2026", desc:"Bench Boost Chip Used", gw:"GW6", points:24 },
      { date:"08 Apr 2026", desc:"Gameweek 6 Result", gw:"GW6", points:77 },
      { date:"01 Apr 2026", desc:"Gameweek 5 Result", gw:"GW5", points:58 },
      { date:"25 Mar 2026", desc:"Gameweek 4 Result", gw:"GW4", points:91 },
    ],
    lastYear: [
      { date:"18 Dec 2025", desc:"Gameweek 19 Result", gw:"GW19", points:85 },
      { date:"11 Dec 2025", desc:"Gameweek 18 Result", gw:"GW18", points:66 },
      { date:"04 Dec 2025", desc:"Triple Captain Chip Used", gw:"GW17", points:48 },
      { date:"04 Dec 2025", desc:"Gameweek 17 Result", gw:"GW17", points:73 },
      { date:"27 Nov 2025", desc:"Gameweek 16 Result", gw:"GW16", points:59 },
    ],
    allTime: [
      { date:"18 Dec 2025", desc:"Season 4 Final Gameweek", gw:"S4 GW19", points:85 },
      { date:"22 May 2025", desc:"Season 3 Final Gameweek", gw:"S3 GW19", points:70 },
      { date:"20 May 2024", desc:"Season 2 Final Gameweek", gw:"S2 GW19", points:64 },
      { date:"21 May 2023", desc:"Season 1 Final Gameweek", gw:"S1 GW19", points:80 },
    ]
  };

  const stats = {
    thisYear: { total:1820, avg:73.4, best:120, bestLabel:"Gameweek 12" },
    lastYear: { total:1425, avg:66.2, best:98, bestLabel:"Gameweek 14" },
    allTime:  { total:3245, avg:65.5, best:120, bestLabel:"GW12, This Year" }
  };

  let currentRange = 'thisYear';
  let visibleRows = 5;

  // ===== Chart rendering (pure SVG, no libraries) =====
  const chartWrap = document.getElementById('chartWrap');
  const tooltip = document.getElementById('chartTooltip');

  function renderChart(){
    const data = chartData[currentRange];
    const width = 900, height = 300;
    const padL = 56, padR = 20, padT = 20, padB = 34;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const maxVal = Math.ceil(Math.max(...data.map(d=>d.pts)) / 500) * 500 || 500;
    const steps = 4;
    const stepVal = maxVal / steps;

    const xFor = i => padL + (i / (data.length - 1)) * plotW;
    const yFor = v => padT + plotH - (v / maxVal) * plotH;

    // grid lines + y labels
    let gridSvg = '';
    for(let s=0; s<=steps; s++){
      const val = stepVal * s;
      const y = yFor(val);
      gridSvg += `<line class="grid-line" x1="${padL}" y1="${y}" x2="${width-padR}" y2="${y}"></line>`;
      gridSvg += `<text class="axis-label" x="${padL-12}" y="${y+4}" text-anchor="end">${Math.round(val)}</text>`;
    }

    // x labels
    let xLabelSvg = '';
    data.forEach((d,i)=>{
      xLabelSvg += `<text class="axis-label" x="${xFor(i)}" y="${height-10}" text-anchor="middle">${d.m}</text>`;
    });

    // line + area path
    const points = data.map((d,i)=>`${xFor(i)},${yFor(d.pts)}`).join(' ');
    const areaPath = `M${xFor(0)},${yFor(0)} ` + data.map((d,i)=>`L${xFor(i)},${yFor(d.pts)}`).join(' ') + ` L${xFor(data.length-1)},${yFor(0)} Z`;

    // dots
    let dotsSvg = '';
    data.forEach((d,i)=>{
      dotsSvg += `<circle class="chart-dot" cx="${xFor(i)}" cy="${yFor(d.pts)}" r="4.5" data-idx="${i}"></circle>`;
    });

    chartWrap.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width:100%;height:280px;">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#16a34a" stop-opacity="0.16"></stop>
            <stop offset="100%" stop-color="#16a34a" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
        ${gridSvg}
        ${xLabelSvg}
        <path class="chart-area" d="${areaPath}"></path>
        <polyline class="chart-line" points="${points}"></polyline>
        ${dotsSvg}
      </svg>
    `;
    chartWrap.appendChild(tooltip);

    // hover interactions
    const svgEl = chartWrap.querySelector('svg');
    const dots = chartWrap.querySelectorAll('.chart-dot');
    dots.forEach(dot=>{
      dot.addEventListener('mouseenter', ()=>{
        dots.forEach(d=>d.classList.remove('hovered'));
        dot.classList.add('hovered');
        const idx = +dot.dataset.idx;
        const d = data[idx];
        const rect = svgEl.getBoundingClientRect();
        const wrapRect = chartWrap.getBoundingClientRect();
        const cx = (dot.cx.baseVal.value / width) * rect.width;
        const cy = (dot.cy.baseVal.value / height) * rect.height;
        tooltip.querySelector('.pts')?.remove();
        tooltip.innerHTML = `<div class="pts">${d.pts.toLocaleString()} pts</div><div class="gw">${d.m}</div>`;
        tooltip.style.left = cx + 'px';
        tooltip.style.top = cy + 'px';
        tooltip.classList.add('show');
      });
      dot.addEventListener('mouseleave', ()=>{
        dot.classList.remove('hovered');
        tooltip.classList.remove('show');
      });
    });
  }

  // ===== Stats rendering =====
  function renderStats(){
    const s = stats[currentRange];
    document.getElementById('totalPointsValue').textContent = s.total.toLocaleString();
    document.getElementById('avgPointsValue').textContent = s.avg.toFixed(1);
    document.getElementById('bestGwValue').textContent = '+' + s.best;
    document.getElementById('bestGwSub').textContent = s.bestLabel;
  }

  // ===== History table rendering =====
  function renderHistory(){
    const data = historyData[currentRange];
    const shown = data.slice(0, visibleRows);
    const body = document.getElementById('historyBody');
    body.innerHTML = shown.map(row => `
      <div class="table-row">
        <div class="date">${row.date}</div>
        <div class="desc"><span class="gw-tag">${row.gw}</span>${row.desc}</div>
        <div class="points ${row.points >= 0 ? 'pos' : 'neg'}">${row.points >= 0 ? '+' : ''}${row.points}</div>
      </div>
    `).join('');

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if(visibleRows >= data.length){
      loadMoreBtn.textContent = 'All caught up';
      loadMoreBtn.disabled = true;
    } else {
      loadMoreBtn.textContent = 'Load more';
      loadMoreBtn.disabled = false;
    }
  }

  document.getElementById('loadMoreBtn').addEventListener('click', ()=>{
    visibleRows += 5;
    renderHistory();
  });

  // ===== Range dropdown =====
  const rangeBtn = document.getElementById('rangeSelectBtn');
  const rangeDropdown = document.getElementById('rangeDropdown');
  rangeBtn.addEventListener('click', e=>{
    e.stopPropagation();
    rangeDropdown.classList.toggle('open');
  });
  rangeDropdown.addEventListener('click', e=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    document.querySelectorAll('#rangeDropdown button').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('rangeLabel').textContent = btn.textContent;
    currentRange = btn.dataset.range;
    rangeDropdown.classList.remove('open');
    visibleRows = 5;
    renderChart();
    renderStats();
    renderHistory();
  });
  document.addEventListener('click', ()=> rangeDropdown.classList.remove('open'));

  // ===== Init =====
  renderChart();
  renderStats();
  renderHistory();
  window.addEventListener('resize', renderChart);