const teamList = document.getElementById("teamList");
const count = document.getElementById("count");

let team = JSON.parse(localStorage.getItem("team")) || [];

function displayTeam(){

teamList.innerHTML="";

count.textContent=team.length;

team.forEach((player,index)=>{

teamList.innerHTML+=`

<div class="team-player">

<div>

<strong>${player.name}</strong>

<br>

<small>${player.position}</small>

</div>

<button onclick="removePlayer(${index})">

❌

</button>

</div>

`;

});

}

displayTeam();

function removePlayer(index){

team.splice(index,1);

localStorage.setItem("team",JSON.stringify(team));

displayTeam();

}

document.getElementById("saveTeam").onclick=function(){

localStorage.setItem("savedTeam",JSON.stringify(team));

alert("Team Saved Successfully!");

}