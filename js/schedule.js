// schedule.js

/**
 * Generate schedule slots based on tournament settings.
 * Currently, the number of rounds and matches per round are fixed.
 * Future enhancements can make these customizable.
 */
function createScheduleSlots() {
    const scheduleContainer = document.getElementById('scheduleContainer');
    scheduleContainer.innerHTML = '';

    const numRounds = getTournamentSettings().rounds;
    const matchesPerRound = getTournamentSettings().matchesPerRound;

    for (let i = 1; i <= numRounds; i++) {
        const roundDiv = createElement('div', ['round']);
        roundDiv.innerHTML = `<h3><i class="fas fa-flag icon"></i> Round ${i}</h3>`;

        for (let j = 1; j <= matchesPerRound; j++) {
            const matchDiv = createElement('div', ['match']);

            const teamADiv = createElement('div', ['team', 'empty'], {
                'data-round': i,
                'data-match': j,
                'data-team': 'A',
                'aria-label': `Round ${i} Match ${j} Team A`
            });

            const vsDiv = createElement('div', ['vs']);
            vsDiv.textContent = 'VS';

            const teamBDiv = createElement('div', ['team', 'empty'], {
                'data-round': i,
                'data-match': j,
                'data-team': 'B',
                'aria-label': `Round ${i} Match ${j} Team B`
            });

            matchDiv.appendChild(teamADiv);
            matchDiv.appendChild(vsDiv);
            matchDiv.appendChild(teamBDiv);

            roundDiv.appendChild(matchDiv);
        }

        scheduleContainer.appendChild(roundDiv);
    }
}

/**
 * Randomize the schedule by assigning pairs randomly to schedule slots.
 */
function randomizeSchedule() {
    // Reset pair list
    createPairElements();
    initializeDragAndDrop();

    // Get all available pairs
    const availablePairs = Array.from(document.querySelectorAll('#pairContainer .pair'));

    // Shuffle the pairs
    shuffleArray(availablePairs);

    // Assign pairs to schedule slots
    const teamSlots = document.querySelectorAll('.team.empty');

    // Clear existing assignments
    teamSlots.forEach(slot => slot.textContent = '');

    let index = 0;

    teamSlots.forEach(slot => {
        if (index < availablePairs.length) {
            const pair = availablePairs[index++];
            slot.appendChild(pair);
        }
    });

    updateMatrix();
    displayMessage('success', 'Schedule randomized successfully.');
}

/**
 * Reset the schedule by clearing all assignments and restoring the pair list.
 */
function resetSchedule() {
    // Reset pair list
    createPairElements();
    initializeDragAndDrop();

    // Clear schedule slots
    const teamSlots = document.querySelectorAll('.team.empty');
    teamSlots.forEach(slot => slot.textContent = '');

    updateMatrix();
    displayMessage('success', 'Schedule reset successfully.');
}

/**
 * Automatically generate the schedule using scheduling algorithms.
 */
function autoGenerateSchedule() {
    displayMessage('warning', 'Auto-generating schedule. Please wait...');
    // Disable buttons to prevent multiple executions
    toggleButtons(true);

    // Perform scheduling in a Web Worker to prevent blocking the UI
    if (window.Worker) {
        const worker = new Worker('js/worker.js');
        worker.postMessage({ action: 'generate', players: getPlayersData() });

        worker.onmessage = function(e) {
            const { type, data } = e.data;
            if (type === 'result') {
                applySchedule(data.schedule);
                displayMessage('success', 'Schedule generated automatically.');
            } else if (type === 'error') {
                displayMessage('error', data.message);
            }
            toggleButtons(false);
            worker.terminate();
        };
    } else {
        displayMessage('error', 'Web Workers are not supported in your browser.');
        toggleButtons(false);
    }
}

/**
 * Apply the generated schedule to the UI.
 * @param {Array} schedule 
 */
function applySchedule(schedule) {
    // Clear existing assignments
    const teamSlots = document.querySelectorAll('.team.empty');
    teamSlots.forEach(slot => slot.textContent = '');

    // Assign pairs to slots
    schedule.forEach((round, roundIndex) => {
        round.matches.forEach((match, matchIndex) => {
            const teamA = match.teamA;
            const teamB = match.teamB;

            const slotA = document.querySelector(`.team[data-round="${roundIndex + 1}"][data-match="${matchIndex + 1}"][data-team="A"]`);
            const slotB = document.querySelector(`.team[data-round="${roundIndex + 1}"][data-match="${matchIndex + 1}"][data-team="B"]`);

            if (teamA) {
                slotA.appendChild(createPairElement(teamA));
            }
            if (teamB) {
                slotB.appendChild(createPairElement(teamB));
            }
        });
    });

    updateMatrix();
}

/**
 * Toggle the disabled state of action buttons during processing.
 * @param {boolean} disable 
 */
function toggleButtons(disable) {
    document.getElementById('randomizeBtn').disabled = disable;
    document.getElementById('resetBtn').disabled = disable;
    document.getElementById('autoGenerateBtn').disabled = disable;
}
