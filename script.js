const players = JSON.parse(localStorage.getItem('players')) || [];
const playerList = document.getElementById('playerList');
const drawTeamsButton = document.getElementById('drawTeams');
const team1Name = document.getElementById('team1Name');
const team2Name = document.getElementById('team2Name');
const team1Points = document.getElementById('team1Points');
const team2Points = document.getElementById('team2Points');
const winnerMessage = document.getElementById('winnerMessage');
const winnerDiv = document.getElementById('winner');
const teamsDiv = document.getElementById('teams');
let team1Score = localStorage.getItem('team1Score') || 0;
let team2Score = localStorage.getItem('team2Score') || 0;
let gameStarted = false;

document.getElementById('addPlayer').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value;
    if (playerName) {
        players.push(playerName);
        updatePlayerList();
        document.getElementById('playerName').value = '';
        localStorage.setItem('players', JSON.stringify(players));
        drawTeamsButton.disabled = players.length < 5;
    }
});

drawTeamsButton.addEventListener('click', () => {
    shufflePlayers();
    setupTeams();
    gameStarted = true;
    localStorage.setItem('gameStarted', gameStarted);
});

function shufflePlayers() {
    for (let i = players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
    }
}

function setupTeams() {
    team1Name.innerText = `${players[0].charAt(0)}${players[1].charAt(0)} - Drużyna 1`;
    team2Name.innerText = `${players[3].charAt(0)}${players[4].charAt(0)} - Drużyna 2`;
    team1Points.innerText = `Punkty: ${team1Score}`;
    team2Points.innerText = `Punkty: ${team2Score}`;
    teamsDiv.classList.remove('hidden');
}

document.getElementById('addTeam1Points').addEventListener('click', () => {
    addPoints(1);
});

document.getElementById('addTeam2Points').addEventListener('click', () => {
    addPoints(2);
});

function addPoints(team) {
    const input = team === 1 ? document.getElementById('team1ScoreInput') : document.getElementById('team2ScoreInput');
    const points = parseInt(input.value);
    if (!isNaN(points)) {
        if (team === 1) {
            team1Score += points;
            team1Points.innerText = `Punkty: ${team1Score}`;
            localStorage.setItem('team1Score', team1Score);
            if (team1Score > 1000) declareWinner(1);
        } else {
            team2Score += points;
            team2Points.innerText = `Punkty: ${team2Score}`;
            localStorage.setItem('team2Score', team2Score);
            if (team2Score > 1000) declareWinner(2);
        }
        input.value = '';
    }
}

function declareWinner(team) {
    winnerMessage.innerText = `Drużyna ${team === 1 ? '1' : '2'} wygrała!`;
    winnerDiv.classList.remove('hidden');
    teamsDiv.classList.add('hidden');
    localStorage.removeItem('players');
    localStorage.removeItem('team1Score');
    localStorage.removeItem('team2Score');
    localStorage.removeItem('gameStarted');
}

document.getElementById('resetGame').addEventListener('click', () => {
    location.reload();
});

function updatePlayerList() {
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.innerText = player;
        playerList.appendChild(li);
    });
}

// Przywracanie stanu gry po odświeżeniu
if (localStorage.getItem('gameStarted') === 'true') {
    setupTeams();
}
