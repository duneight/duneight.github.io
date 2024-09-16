// js/interactionMatrix.js

/**
 * Interaction Matrix Module
 * Tracks interactions between players across matches and rounds.
 */

/**
 * Initialize the interaction matrix.
 */
function initializeMatrix() {
    const allPlayers = players.map(player => player.name);
    const matrix = document.getElementById('interactionMatrix');
    matrix.innerHTML = '';

    // Create header row
    const headerRow = createElement('tr');
    const emptyHeader = createElement('th');
    headerRow.appendChild(emptyHeader);

    allPlayers.forEach(player => {
        const th = createElement('th');
        th.textContent = player;
        headerRow.appendChild(th);
    });
    matrix.appendChild(headerRow);

    // Create matrix rows
    allPlayers.forEach(player1 => {
        const row = createElement('tr');
        const th = createElement('th');
        th.textContent = player1;
        row.appendChild(th);

        allPlayers.forEach(player2 => {
            const td = createElement('td', [], { id: `matrix-${player1}-${player2}` });
            td.textContent = '0';
            if (player1 === player2) {
                td.classList.add('gray');
            }
            row.appendChild(td);
        });

        matrix.appendChild(row);
    });
}

/**
 * Update the interaction matrix based on the current schedule.
 */
function updateMatrix() {
    const allPlayers = players.map(player => player.name);
    const counts = {};

    // Initialize counts
    allPlayers.forEach(p1 => {
        counts[p1] = {};
        allPlayers.forEach(p2 => {
            counts[p1][p2] = 0;
        });
    });

    const assignedPairs = new Set();
    let message = '';

    const matches = document.querySelectorAll('.match');
    matches.forEach(match => {
        const teamADiv = match.querySelector('.team[data-team="A"]');
        const teamBDiv = match.querySelector('.team[data-team="B"]');
        const pairA = teamADiv.textContent.trim();
        const pairB = teamBDiv.textContent.trim();

        // Check for duplicate pairs
        if (pairA) {
            if (assignedPairs.has(pairA)) {
                message = `Pair "${pairA}" is assigned multiple times.`;
                teamADiv.style.backgroundColor = 'var(--error-color)';
            } else {
                assignedPairs.add(pairA);
                teamADiv.style.backgroundColor = 'var(--background-color)';
            }
        }

        if (pairB) {
            if (assignedPairs.has(pairB)) {
                message = `Pair "${pairB}" is assigned multiple times.`;
                teamBDiv.style.backgroundColor = 'var(--error-color)';
            } else {
                assignedPairs.add(pairB);
                teamBDiv.style.backgroundColor = 'var(--background-color)';
            }
        }

        // Get all players in the match
        const playersA = pairA ? pairA.split('&').map(p => p.trim()) : [];
        const playersB = pairB ? pairB.split('&').map(p => p.trim()) : [];
        const allMatchPlayers = playersA.concat(playersB);

        // Update counts
        allMatchPlayers.forEach(p1 => {
            allMatchPlayers.forEach(p2 => {
                if (p1 !== p2) {
                    counts[p1][p2]++;
                }
            });
        });
    });

    // Update matrix cells
    allPlayers.forEach(p1 => {
        allPlayers.forEach(p2 => {
            const cell = document.getElementById(`matrix-${p1}-${p2}`);
            const count = counts[p1][p2];
            cell.textContent = count;
            cell.classList.remove('red');

            // Highlight if interaction is 0 or more than 2
            if (p1 !== p2 && (count === 0 || count > 2)) {
                cell.classList.add('red');
            } else if (p1 === p2) {
                cell.classList.add('gray');
            }
        });
    });

    // Display message if any conflicts
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
}
