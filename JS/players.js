const playerGrid = document.getElementById("playerGrid");
const searchInput = document.getElementById("searchPlayer");
const positionFilter = document.getElementById("positionFilter");
const clubFilter = document.getElementById("clubFilter");
const sortFilter = document.getElementById("sortFilter");

let players = [];

fetch("../data/players.json")
    .then(res => res.json())
    .then(data => {
        players = data;
        displayPlayers(players);
    });

function displayPlayers(list) {

    playerGrid.innerHTML = "";

    list.forEach(player => {

        playerGrid.innerHTML += `

        <div class="player-card">

            <img src="${player.image}" alt="${player.name}">

            <h3>${player.name}</h3>

            <p class="club">${player.club}</p>

            <span class="position">${player.position}</span>

            <div class="stats">

                <div class="stat">
                    <h4>Price</h4>
                    <p>£${player.price}M</p>
                </div>

                <div class="stat">
                    <h4>Points</h4>
                    <p>${player.points}</p>
                </div>

                <div class="stat">
                    <h4>Goals</h4>
                    <p>${player.goals}</p>
                </div>

            </div>

            <div class="buttons">

                <button class="view-btn"
                    onclick="viewDetails(${player.id})">
                    View Details
                </button>

                <button class="team-btn"
                    onclick="addToTeam(${player.id})">
                    Add Team
                </button>

            </div>

        </div>

        `;
    });
}

function filterPlayers() {

    let filtered = [...players];

    const search = searchInput.value.toLowerCase();
    const position = positionFilter.value;
    const club = clubFilter.value;
    const sort = sortFilter.value;

    if (search) {
        filtered = filtered.filter(player =>
            player.name.toLowerCase().includes(search)
        );
    }

    if (position) {
        filtered = filtered.filter(player =>
            player.position === position
        );
    }

    if (club) {
        filtered = filtered.filter(player =>
            player.club === club
        );
    }

    if (sort === "points") {
        filtered.sort((a, b) => b.points - a.points);
    }

    if (sort === "price") {
        filtered.sort((a, b) => b.price - a.price);
    }

    displayPlayers(filtered);

}

searchInput.addEventListener("keyup", filterPlayers);
positionFilter.addEventListener("change", filterPlayers);
clubFilter.addEventListener("change", filterPlayers);
sortFilter.addEventListener("change", filterPlayers);

function addToTeam(id) {

    const player = players.find(p => p.id === id);

    let team = JSON.parse(localStorage.getItem("team")) || [];

    if (team.some(p => p.id === id)) {
        alert("Player already added!");
        return;
    }

    if (team.length >= 11) {
        alert("Maximum 11 players allowed!");
        return;
    }

    team.push(player);

    localStorage.setItem("team", JSON.stringify(team));

    alert(`${player.name} added to your team!`);
}

function viewDetails(id) {

    localStorage.setItem("selectedPlayer", id);

    window.location.href = "player-details.html";

}