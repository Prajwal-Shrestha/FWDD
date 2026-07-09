const container = document.getElementById("playerDetails");

const id = Number(localStorage.getItem("selectedPlayer"));

fetch("../data/players.json")

.then(res=>res.json())

.then(players=>{

const player = players.find(p=>p.id===id);

container.innerHTML=`

<div class="details-card">

<img src="${player.image}">

<div class="player-info">

<h2>${player.name}</h2>

<h4>${player.club}</h4>

<div class="info-grid">

<div class="info-box">

<h3>Position</h3>

<p>${player.position}</p>

</div>

<div class="info-box">

<h3>Price</h3>

<p>£${player.price}M</p>

</div>

<div class="info-box">

<h3>Goals</h3>

<p>${player.goals}</p>

</div>

<div class="info-box">

<h3>Assists</h3>

<p>${player.assists}</p>

</div>

<div class="info-box">

<h3>Fantasy Points</h3>

<p>${player.points}</p>

</div>

<div class="info-box">

<h3>Club</h3>

<p>${player.club}</p>

</div>

</div>

<button class="add-team" onclick="addPlayer(${player.id})">

Add To Team

</button>

</div>

</div>

`;

});

function addPlayer(id){

fetch("../data/players.json")

.then(res=>res.json())

.then(players=>{

const player=players.find(p=>p.id===id);

let team=JSON.parse(localStorage.getItem("team"))||[];

if(team.some(p=>p.id===id)){

alert("Player already in team");

return;

}

team.push(player);

localStorage.setItem("team",JSON.stringify(team));

alert(player.name+" added successfully!");

});

}