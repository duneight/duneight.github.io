// js/main.js

/**
 * Main JavaScript File
 * Initializes all components and handles tab navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize all components of the application.
 */
function initializeApp() {
    initializeSchedule();
    initializePlayers();
    initializeMatrix();
    initializeDragAndDrop();
    initializeWorker(); // Initialize the Web Worker
    setupTabNavigation();
    setupAutoGenerateButton(); // Setup the Auto Generate button
    loadExistingSchedule(); // Load schedule from localStorage if available
}

/**
 * Setup event listener for the Auto Generate button.
 */
function setupAutoGenerateButton() {
    const autoGenerateBtn = document.getElementById('autoGenerateBtn');
    autoGenerateBtn.addEventListener('click', () => {
        const selectedAlgorithm = getSelectedAlgorithm();
        generateSchedule(selectedAlgorithm);
    });
}

/**
 * Get the selected scheduling algorithm from the UI.
 * @returns {string} - 'greedy' or 'simulatedAnnealing'
 */
function getSelectedAlgorithm() {
    // Implement based on your UI, e.g., a dropdown in the settings panel
    // For demonstration, we'll return 'greedy'
    return 'greedy';
}

/**
 * Load existing schedule from localStorage.
 */
function loadExistingSchedule() {
    const savedSchedule = localStorage.getItem('schedule');
    if (savedSchedule) {
        const schedule = JSON.parse(savedSchedule);
        populateSchedule(schedule);
    }
}

/**
 * Save the generated schedule to localStorage.
 * @param {Object} schedule 
 */
function saveSchedule(schedule) {
    localStorage.setItem('schedule', JSON.stringify(schedule));
}

/* Loader Styles */
.loader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(240, 240, 240, 0.8);
    display: none; /* Hidden by default */
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.loader .spinner {
    border: 8px solid #f3f3f3;
    border-top: 8px solid var(--primary-color);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
}

/* Spinner Animation */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Interaction Matrix Highlights */
.matrix .red {
    background-color: #ffdddd;
}

.matrix .gray {
    background-color: #dddddd;
}