const playerImage = document.getElementById("playerImage");
const playerName = document.getElementById("playerName");
const playerClub = document.getElementById("playerClub");
const playerPrice = document.getElementById("playerPrice");

const playerPoints = document.getElementById("playerPoints");
const playerGoals = document.getElementById("playerGoals");
const playerAssists = document.getElementById("playerAssists");
const playerMatches = document.getElementById("playerMatches");

const seasonMatches = document.getElementById("seasonMatches");
const seasonGoals = document.getElementById("seasonGoals");
const seasonAssists = document.getElementById("seasonAssists");
const seasonPoints = document.getElementById("seasonPoints");

const addTeamBtn = document.getElementById("addTeamBtn");

const id = Number(localStorage.getItem("selectedPlayer"));

fetch("../data/players.json")
.then(res => res.json())
.then(players => {

    const player = players.find(p => p.id === id);

    if(!player){
        alert("Player not found");
        return;
    }

    playerImage.src = player.image;
    playerImage.alt = player.name;

    playerName.textContent = player.name;
    playerClub.textContent = `${player.club} • ${player.position}`;
    playerPrice.textContent = `£${player.price}M`;

    playerPoints.textContent = player.points;
    playerGoals.textContent = player.goals;
    playerAssists.textContent = player.assists;

    // If matches exist in JSON use them, otherwise default to 38
    playerMatches.textContent = player.matches || 38;

    seasonMatches.textContent = player.matches || 38;
    seasonGoals.textContent = player.goals;
    seasonAssists.textContent = player.assists;
    seasonPoints.textContent = player.points;

    addTeamBtn.onclick = function(){
        addPlayer(player);
    };

});

function addPlayer(player){

    let team = JSON.parse(localStorage.getItem("team")) || [];

    if(team.some(p => p.id === player.id)){
        alert("Player already added!");
        return;
    }

    if(team.length >= 11){
        alert("Maximum 11 players allowed!");
        return;
    }

    team.push(player);

    localStorage.setItem("team", JSON.stringify(team));

    alert(player.name + " added to your team!");
}