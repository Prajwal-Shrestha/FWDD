const pitchPlayers = document.getElementById("pitchPlayers");

const totalPlayers = document.getElementById("totalPlayers");

const totalPoints = document.getElementById("totalPoints");

const totalBudget = document.getElementById("totalBudget");

let team = JSON.parse(localStorage.getItem("savedTeam")) || [];

function loadTeam(){

pitchPlayers.innerHTML="";

let points=0;

let budget=0;

team.forEach(player=>{

points+=player.points;

budget+=player.price;

pitchPlayers.innerHTML+=`

<div class="player-circle">

${player.name}

</div>

`;

});

totalPlayers.innerText=team.length;

totalPoints.innerText=points;

totalBudget.innerText="£"+budget.toFixed(1)+"M";

}

loadTeam();

document.getElementById("resetTeam").onclick=function(){

if(confirm("Reset your team?")){

localStorage.removeItem("team");

localStorage.removeItem("savedTeam");

location.reload();

}

}