const totalPlayers = document.getElementById("totalPlayers");
const totalPoints = document.getElementById("totalPoints");
const totalBudget = document.getElementById("totalBudget");

let team = JSON.parse(localStorage.getItem("savedTeam")) || [];

if (team.length === 0) {
    team = JSON.parse(localStorage.getItem("team")) || [];
}

function loadTeam() {

    let points = 0;
    let budget = 0;

    // Clear every position
    for (let i = 0; i < 9; i++) {
        const slot = document.getElementById(`player${i}`);
        if (slot) slot.innerHTML = "";
    }

    team.forEach((player, index) => {

        if (index > 8) return;

        points += player.points;
        budget += player.price;

        const slot = document.getElementById(`player${index}`);

        if (slot) {

            slot.innerHTML = `
                <div class="player-circle">
                    <i class="fa-solid fa-user"></i>
                </div>

                <div class="player-name">
                    ${player.position}<br>
                    ${player.name}
                </div>
            `;
        }

    });

    totalPlayers.textContent = team.length;
    totalPoints.textContent = points;
    totalBudget.textContent = "£" + budget.toFixed(1) + "M";

}

loadTeam();

document.getElementById("resetTeam").addEventListener("click", () => {

    if (confirm("Reset your team?")) {

        localStorage.removeItem("team");
        localStorage.removeItem("savedTeam");

        location.reload();
    }

});