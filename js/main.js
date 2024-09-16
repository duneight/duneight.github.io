// js/main.js

/**
 * Main JavaScript File
 * Initializes all components and handles tab navigation.
 */

// Wait for the DOM to fully load
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
    setupUndoRedo(); // Setup Undo/Redo functionality
    setupContrastToggle(); // Setup High Contrast Toggle
    loadExistingSchedule(); // Load schedule from localStorage if available
}

/**
 * Handle tab switching functionality.
 */
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove 'active' class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));

            // Add 'active' class to the clicked tab
            tab.classList.add('active');
            // Show the corresponding tab content
            const targetTab = document.getElementById(tab.getAttribute('data-tab'));
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

/**
 * Initialize the Auto Generate button functionality.
 */
function setupAutoGenerateButton() {
    const autoGenerateBtn = document.getElementById('autoGenerateBtn');
    if (autoGenerateBtn) {
        autoGenerateBtn.addEventListener('click', () => {
            const selectedAlgorithm = getSelectedAlgorithm();
            generateSchedule(selectedAlgorithm);
        });
    }
}

/**
 * Get the selected scheduling algorithm from the UI.
 * For now, we'll assume 'greedy'. Extend this based on your UI.
 * @returns {string} - 'greedy' or 'simulatedAnnealing'
 */
function getSelectedAlgorithm() {
    // Implement based on your UI, e.g., a dropdown or radio buttons
    // For demonstration, we'll return 'greedy'
    return 'greedy';
}

/**
 * Show or hide a loading indicator.
 * @param {boolean} show 
 */
function showLoadingIndicator(show) {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
        loader.setAttribute('aria-hidden', !show);
    }
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
