// js/worker.js

/**
 * Web Worker for Scheduling Algorithms
 * Handles scheduling computations in a separate thread to keep the UI responsive.
 */

// Import utility functions if needed
self.importScripts('utils.js'); // Ensure utils.js is compatible with Web Workers

/**
 * Greedy Scheduling Algorithm
 * Assigns players/pairs to matches based on handicap rankings.
 * @param {Array} players - List of player objects with name, handicap, and team.
 * @param {number} numRounds - Number of rounds in the tournament.
 * @param {number} matchesPerRound - Number of matches per round.
 * @returns {Object} - Generated schedule.
 */
function greedyAlgorithm(players, numRounds, matchesPerRound) {
    const schedule = {};
    const sortedPlayers = [...players].sort((a, b) => a.handicap - b.handicap);
    let playerIndex = 0;

    for (let round = 1; round <= numRounds; round++) {
        schedule[`Round ${round}`] = [];
        for (let match = 1; match <= matchesPerRound; match++) {
            const pairA = sortedPlayers[playerIndex];
            const pairB = sortedPlayers[playerIndex + 1];
            schedule[`Round ${round}`].push({
                match: match,
                teamA: pairA ? pairA.name : null,
                teamB: pairB ? pairB.name : null
            });
            playerIndex += 2;
            if (playerIndex >= sortedPlayers.length) {
                playerIndex = 0; // Reset if we've assigned all players
            }
        }
    }

    return schedule;
}

/**
 * Simulated Annealing Scheduling Algorithm
 * Placeholder for a more advanced algorithm.
 * Currently uses the greedy algorithm for demonstration purposes.
 * @param {Array} players - List of player objects with name, handicap, and team.
 * @param {number} numRounds - Number of rounds in the tournament.
 * @param {number} matchesPerRound - Number of matches per round.
 * @returns {Object} - Generated schedule.
 */
function simulatedAnnealingAlgorithm(players, numRounds, matchesPerRound) {
    // Implement the simulated annealing algorithm here
    // For now, we'll return the greedy schedule
    return greedyAlgorithm(players, numRounds, matchesPerRound);
}

/**
 * Handle incoming messages from the main thread.
 * Expects messages with a 'type' and 'payload'.
 */
self.onmessage = function(event) {
    const { type, payload } = event.data;

    switch(type) {
        case 'generateSchedule':
            const { algorithm, players, numRounds, matchesPerRound } = payload;
            let schedule = {};

            try {
                if (algorithm === 'greedy') {
                    schedule = greedyAlgorithm(players, numRounds, matchesPerRound);
                } else if (algorithm === 'simulatedAnnealing') {
                    schedule = simulatedAnnealingAlgorithm(players, numRounds, matchesPerRound);
                } else {
                    throw new Error('Unknown scheduling algorithm.');
                }
                // Post the generated schedule back to the main thread
                self.postMessage({ type: 'scheduleGenerated', schedule });
            } catch (error) {
                // Post the error back to the main thread
                self.postMessage({ type: 'error', message: error.message });
            }
            break;

        default:
            // Handle unknown message types
            self.postMessage({ type: 'error', message: `Unknown message type: ${type}` });
    }
};
