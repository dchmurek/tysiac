const players = JSON.parse(localStorage.getItem('players')) || [];
const playerList = document.getElementById('playerList');
const drawTeamsButton = document.getElementById('drawTeams');
const createCustomTeamsButton = document.getElementById('createCustomTeams'); // New button reference
const team1Name = document.getElementById('team1Name');
const team2Name = document.getElementById('team2Name');
const team1Points = document.getElementById('team1Points');
const team2Points = document.getElementById('team2Points');
const winnerMessage = document.getElementById('winnerMessage');
const winnerDiv = document.getElementById('winner');
const teamsDiv = document.getElementById('teams');
const dealerNameDisplay = document.getElementById('dealerNameDisplay');

let team1Score = parseInt(localStorage.getItem('team1Score')) || 0;
let team2Score = parseInt(localStorage.getItem('team2Score')) || 0;
let gameStarted = false;
let dealerName = '';

document.getElementById('addPlayer').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value;
    if (playerName) {
        players.push(playerName);
        updatePlayerList();
        document.getElementById('playerName').value = '';
        localStorage.setItem('players', JSON.stringify(players));
        drawTeamsButton.disabled = players.length < 4; // Minimum 4 players for teams
    }
});

drawTeamsButton.addEventListener('click', () => {
    if (players.length >= 4) {
        shufflePlayers();
        setupTeams();
        gameStarted = true;
        localStorage.setItem('gameStarted', gameStarted);
    }
});

// Updated event listener for custom teams
createCustomTeamsButton.addEventListener('click', () => {
    const team1Players = prompt('Enter names for Team 1, separated by a comma:').split(',');
    const team2Players = prompt('Enter names for Team 2, separated by a comma:').split(',');

    if (team1Players.length >= 2 && team2Players.length >= 2) {
        dealerName = prompt('Enter the dealer name:');
        dealerNameDisplay.innerText = `Dealer: ${dealerName}`;
        dealerNameDisplay.classList.remove('hidden'); // Show dealer name

        team1Name.innerText = `${team1Players.join(' and ')} - Team 1`;
        team2Name.innerText = `${team2Players.join(' and ')} - Team 2`;
        team1Points.innerText = `Points: ${team1Score}`;
        team2Points.innerText = `Points: ${team2Score}`;
        teamsDiv.classList.remove('hidden');
        gameStarted = true;
        localStorage.setItem('gameStarted', gameStarted);
    } else {
        alert('Each team must have at least 2 players.');
    }
});

function shufflePlayers() {
    const shuffledPlayers = [...players];
    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
    }

    // Setup teams based on shuffled players
    team1Name.innerText = `${shuffledPlayers[0]} and ${shuffledPlayers[1]} - Team 1`;
    team2Name.innerText = `${shuffledPlayers[2]} and ${shuffledPlayers[3]} - Team 2`;
    dealerName = shuffledPlayers[4] || '';
    dealerNameDisplay.innerText = `Dealer: ${dealerName}`;
    dealerNameDisplay.classList.remove('hidden'); // Show dealer name
    team1Points.innerText = `Points: ${team1Score}`;
    team2Points.innerText = `Points: ${team2Score}`;
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
            team1Points.innerText = `Points: ${team1Score}`;
            localStorage.setItem('team1Score', team1Score);
            if (team1Score >= 1000) declareWinner(1);
        } else {
            team2Score += points;
            team2Points.innerText = `Points: ${team2Score}`;
            localStorage.setItem('team2Score', team2Score);
            if (team2Score >= 1000) declareWinner(2);
        }
        input.value = '';
    }
}

function declareWinner(team) {
    winnerMessage.innerText = `Team ${team === 1 ? '1' : '2'} has won!`;
    winnerDiv.classList.remove('hidden');
    teamsDiv.classList.add('hidden');
}

document.getElementById('resetGame').addEventListener('click', () => {
    localStorage.clear(); // Clear local storage
    location.reload(); // Reload the page
});

// Add reset game functionality
document.getElementById('resetGameTotal').addEventListener('click', () => {
    localStorage.clear(); // Clear local storage
    location.reload(); // Reload the page
});

function updatePlayerList() {
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.innerText = player;
        playerList.appendChild(li);
    });
}

// Resetting game state after refresh
if (localStorage.getItem('gameStarted') === 'true') {
    setupTeams();
}
