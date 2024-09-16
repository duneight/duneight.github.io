// main.js

/**
 * Initialize all components of the application.
 */
function initializeApp() {
    initializePlayers();
    initializeSchedule();
    initializeMatrix();
    initializeDragAndDrop();
    setupTabNavigation();
}

/**
 * Handle tab switching.
 */
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');
            // Show corresponding tab content
            const target = document.getElementById(tab.dataset.tab);
            target.classList.add('active');
        });
    });
}

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);
