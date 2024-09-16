// worker.js

// Import scripts if needed (e.g., algorithms.js)
// self.importScripts('algorithms.js'); // Uncomment if algorithms.js is accessible

self.onmessage = function(e) {
    const { action, players } = e.data;

    if (action === 'generate') {
        const numRounds = 3; // Can be made dynamic
        const matchesPerRound = 3; // Can be made dynamic

        // Implement the scheduling algorithm here
        // For example, use the greedy algorithm
        try {
            const schedule = greedyAlgorithm(players, numRounds, matchesPerRound);
            self.postMessage({ type: 'result', data: { schedule } });
        } catch (error) {
            self.postMessage({ type: 'error', data: { message: error.message } });
        }
    }
};
