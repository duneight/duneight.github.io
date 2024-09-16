// utils.js

/**
 * Shuffle an array in place using the Fisher-Yates algorithm.
 * @param {Array} array 
 * @returns {Array}
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Create an element with optional classes and attributes.
 * @param {string} tag 
 * @param {Array} classes 
 * @param {Object} attributes 
 * @returns {HTMLElement}
 */
function createElement(tag, classes = [], attributes = {}) {
    const element = document.createElement(tag);
    classes.forEach(cls => element.classList.add(cls));
    for (let attr in attributes) {
        element.setAttribute(attr, attributes[attr]);
    }
    return element;
}

/**
 * Show an alert message.
 * @param {string} message 
 */
function showAlert(message) {
    alert(message);
}

/**
 * Display a message in the specified element.
 * @param {string} type - 'error', 'success', 'warning'
 * @param {string} message 
 */
function displayMessage(type, message) {
    const messageDiv = document.getElementById('message');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Auto-hide after 3 seconds
    setTimeout(() => {
        messageDiv.className = 'message';
        messageDiv.textContent = '';
    }, 3000);
}
