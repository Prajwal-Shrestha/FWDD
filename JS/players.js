const playerGrid = document.getElementById("playerGrid");
const searchInput = document.getElementById("searchPlayer");

let players = [];

/* ==========================================
   LOAD PLAYERS
========================================== */

fetch("../data/players.json")
  .then((res) => res.json())
  .then((data) => {
    players = data;
    displayPlayers(players);
  });

/* ==========================================
   DISPLAY PLAYERS
========================================== */

function displayPlayers(list) {

    playerGrid.innerHTML = "";

    list.forEach(player => {

        playerGrid.innerHTML += `

        <div class="player-row">

            <div class="player-info">

                <img src="${player.image}" alt="${player.name}">

                <div class="player-text">

                    <h3>${player.name}</h3>

                    <small>${player.club}</small>

                </div>

            </div>

            <div class="club">

                ${player.club}

            </div>

            <div>

                <span class="position">

                    ${player.position}

                </span>

            </div>

            <div class="price">

                £${player.price}M

            </div>

            <div class="points">

                ${player.points}

            </div>

            <div class="actions">

                <button
                    class="view-btn"
                    onclick="viewDetails(${player.id})">

                    View Details

                </button>

                <button
                    class="team-btn"
                    onclick="addToTeam(${player.id})">

                    Add Team

                </button>

            </div>

        </div>

        `;

    });

}

/* ==========================================
   SEARCH PLAYER
========================================== */

searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    const filtered = players.filter(player =>
        player.name.toLowerCase().includes(value)
    );

    displayPlayers(filtered);

});

/* ==========================================
   ADD TO TEAM
========================================== */

function addToTeam(id){

    const player = players.find(p => p.id === id);

    let team = JSON.parse(localStorage.getItem("team")) || [];

    if(team.some(p => p.id === id)){
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

/* ==========================================
   VIEW DETAILS
========================================== */

function viewDetails(id){

    localStorage.setItem("selectedPlayer", id);

    window.location.href = "player-details.html";

}