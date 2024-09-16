// js/schedule.js

/**
 * Schedule Module
 * Handles schedule generation, randomization, and reset functionalities.
 */

// Since scheduling is handled by algorithms.js via Web Worker,
// schedule.js can manage manual scheduling and interact with the worker.

function initializeSchedule() {
    createScheduleSlots();
    createPairElements();
    initializeDragAndDrop();
    initializeMatrix();
    updateMatrix();

    // Event Listeners for buttons
    document.getElementById('randomizeBtn').addEventListener('click', () => {
        randomizeSchedule();
    });
    document.getElementById('resetBtn').addEventListener('click', () => {
        resetSchedule();
    });
    // Auto Generate button is handled in main.js
}

/**
 * Randomize the schedule by assigning pairs randomly to schedule slots.
 */
function randomizeSchedule() {
    // Reset pair lists
    createPairElements();
    initializeDragAndDrop();

    // Get all available pairs
    const availablePairs = Array.from(document.querySelectorAll('#pairContainer .pair'));

    // Shuffle the pairs
    shuffleArray(availablePairs);

    // Assign pairs to schedule slots
    const teamSlots = document.querySelectorAll('.team');

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
    saveSchedule(getCurrentSchedule());
}

/**
 * Reset the schedule by clearing all assignments and restoring the pair list.
 */
function resetSchedule() {
    // Clear pair lists and re-create pairs
    createPairElements();
    initializeDragAndDrop();

    // Clear schedule slots
    const teamSlots = document.querySelectorAll('.team');
    teamSlots.forEach(slot => slot.textContent = '');

    // Update matrix
    updateMatrix();
    saveSchedule(getCurrentSchedule());
}

/**
 * Get the current schedule from the UI.
 * @returns {Object} - Current schedule.
 */
function getCurrentSchedule() {
    const schedule = {};
    const rounds = document.querySelectorAll('.round');

    rounds.forEach(roundDiv => {
        const roundTitle = roundDiv.querySelector('h3').textContent.trim();
        schedule[roundTitle] = [];

        const matches = roundDiv.querySelectorAll('.match');
        matches.forEach(matchDiv => {
            const teamADiv = matchDiv.querySelector('.team[data-team="A"]');
            const teamBDiv = matchDiv.querySelector('.team[data-team="B"]');
            const matchNumber = matchDiv.querySelector('.match').dataset.match || '1';
            schedule[roundTitle].push({
                match: matchNumber,
                teamA: teamADiv.textContent.trim(),
                teamB: teamBDiv.textContent.trim()
            });
        });
    });

    return schedule;
}
