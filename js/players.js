// players.js

let players = [
    { name: "Mottram", handicap: 2.9, team: "A" },
    { name: "Dan", handicap: 3.9, team: "A" },
    { name: "Whidden", handicap: 4.8, team: "A" },
    { name: "Graham", handicap: 6.0, team: "A" },
    { name: "Bails", handicap: 8.8, team: "A" },
    { name: "Derek", handicap: 11.7, team: "A" },
    { name: "Ioi", handicap: 15.2, team: "B" },
    { name: "Luke", handicap: 23.0, team: "B" },
    { name: "Geoff", handicap: 23.0, team: "B" },
    { name: "Chapete", handicap: 24.5, team: "B" },
    { name: "Shane", handicap: 30.0, team: "B" },
    { name: "Bendy", handicap: 35.0, team: "B" }
];

/**
 * Load players from localStorage if available.
 */
function loadPlayers() {
    if (localStorage.getItem('players')) {
        players = JSON.parse(localStorage.getItem('players'));
    }
}

/**
 * Save players to localStorage.
 */
function savePlayers() {
    localStorage.setItem('players', JSON.stringify(players));
}

/**
 * Generate all possible pairs within teams.
 * @returns {Array}
 */
function generatePairs() {
    const teamAPairs = [];
    const teamBPairs = [];

    const teamAPlayers = players.filter(p => p.team === 'A').map(p => p.name);
    const teamBPlayers = players.filter(p => p.team === 'B').map(p => p.name);

    // Generate Team A Pairs
    for (let i = 0; i < teamAPlayers.length; i++) {
        for (let j = i + 1; j < teamAPlayers.length; j++) {
            teamAPairs.push(`${teamAPlayers[i]} & ${teamAPlayers[j]}`);
        }
    }

    // Generate Team B Pairs
    for (let i = 0; i < teamBPlayers.length; i++) {
        for (let j = i + 1; j < teamBPlayers.length; j++) {
            teamBPairs.push(`${teamBPlayers[i]} & ${teamBPlayers[j]}`);
        }
    }

    return teamAPairs.concat(teamBPairs);
}

/**
 * Create pair elements in the pair list.
 */
function createPairElements() {
    const pairContainer = document.getElementById('pairContainer');
    pairContainer.innerHTML = '';
    const pairs = generatePairs();

    pairs.forEach(pair => {
        const team = getPlayer(pair.split('&')[0].trim()).team;
        const div = createElement('div', ['pair'], {
            'data-pair': pair,
            'data-team': team,
            'draggable': 'true',
            'aria-grabbed': 'false',
            'role': 'button',
            'tabindex': '0',
            'aria-label': `Pair ${pair}`
        });
        div.textContent = pair;
        pairContainer.appendChild(div);
    });
}

/**
 * Generate the player information table.
 */
function generatePlayerInfo() {
    const playerTableBody = document.getElementById('playerTable').querySelector('tbody');
    playerTableBody.innerHTML = ''; // Clear existing rows

    players.forEach((player, index) => {
        const tr = createElement('tr');

        // Player Name
        const tdName = createElement('td');
        const inputName = createElement('input', [], { type: 'text', value: player.name, 'aria-label': 'Player Name' });
        inputName.dataset.originalName = player.name;
        tdName.appendChild(inputName);
        tr.appendChild(tdName);

        // Handicap
        const tdHandicap = createElement('td');
        const inputHandicap = createElement('input', [], { type: 'number', step: '0.1', value: player.handicap, 'aria-label': 'Handicap' });
        tdHandicap.appendChild(inputHandicap);
        tr.appendChild(tdHandicap);

        // Team
        const tdTeam = createElement('td');
        const selectTeam = createElement('select');
        const optionA = createElement('option');
        optionA.value = 'A';
        optionA.textContent = 'A';
        const optionB = createElement('option');
        optionB.value = 'B';
        optionB.textContent = 'B';
        selectTeam.appendChild(optionA);
        selectTeam.appendChild(optionB);
        selectTeam.value = player.team;
        tdTeam.appendChild(selectTeam);
        tr.appendChild(tdTeam);

        // Actions
        const tdActions = createElement('td');
        const deleteButton = createElement('button', [], { 'aria-label': `Delete player ${player.name}` });
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete player ${player.name}?`)) {
                players.splice(index, 1);
                generatePlayerInfo();
                createPairElements();
                initializeDragAndDrop();
                updateMatrix();
                savePlayers();
                displayMessage('success', `Player ${player.name} deleted successfully.`);
            }
        });
        tdActions.appendChild(deleteButton);
        tr.appendChild(tdActions);

        playerTableBody.appendChild(tr);
    });
}

/**
 * Add a new player.
 */
function addPlayer() {
    players.push({ name: '', handicap: 0.0, team: 'A' });
    generatePlayerInfo();
    savePlayers();
}

/**
 * Update players based on table input.
 */
function updatePlayers() {
    const playerTableBody = document.getElementById('playerTable').querySelector('tbody');
    const rows = playerTableBody.querySelectorAll('tr');
    const updatedPlayers = [];
    const nameSet = new Set();
    let hasError = false;

    rows.forEach((row, index) => {
        const inputName = row.querySelector('input[type="text"]');
        const inputHandicap = row.querySelector('input[type="number"]');
        const selectTeam = row.querySelector('select');

        const name = inputName.value.trim();
        const handicap = parseFloat(inputHandicap.value);
        const team = selectTeam.value;

        // Validation
        if (name === '') {
            displayMessage('error', 'Player name cannot be empty.');
            hasError = true;
            return;
        }
        if (isNaN(handicap) || handicap < 0) {
            displayMessage('error', `Invalid handicap for player ${name}.`);
            hasError = true;
            return;
        }
        if (nameSet.has(name)) {
            displayMessage('error', `Duplicate player name: ${name}.`);
            hasError = true;
            return;
        }

        nameSet.add(name);
        updatedPlayers.push({ name, handicap, team });
    });

    if (hasError) return;

    players = updatedPlayers;
    generatePlayerInfo();
    createPairElements();
    initializeDragAndDrop();
    initializeMatrix();
    updateMatrix();
    savePlayers();
    displayMessage('success', 'Player information updated successfully.');
}

/**
 * Get player data for algorithms.
 * @returns {Array}
 */
function getPlayersData() {
    return players;
}

/**
 * Find a player by name.
 * @param {string} name 
 * @returns {Object|null}
 */
function getPlayer(name) {
    return players.find(player => player.name === name) || null;
}

/**
 * Initialize player management functionalities.
 */
function initializePlayers() {
    loadPlayers();
    generatePlayerInfo();
    createPairElements();
    initializeDragAndDrop();
    document.getElementById('addPlayerBtn').addEventListener('click', addPlayer);
    document.getElementById('updatePlayersBtn').addEventListener('click', updatePlayers);
}
