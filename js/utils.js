// js/utils.js

/**
 * Utility Functions Module
 */

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
 * Undo/Redo Stack Management
 */
const undoStack = [];
const redoStack = [];
const MAX_STACK_SIZE = 50;

/**
 * Push a new state to the undo stack.
 * @param {Object} state 
 */
function pushToUndoStack(state) {
    if (undoStack.length >= MAX_STACK_SIZE) {
        undoStack.shift(); // Remove the oldest state
    }
    undoStack.push(JSON.stringify(state));
    // Clear redo stack on new action
    redoStack.length = 0;
}

/**
 * Undo the last action.
 * @returns {Object|null} - The previous state or null if stack is empty.
 */
function undo() {
    if (undoStack.length === 0) return null;
    const currentState = getCurrentSchedule();
    redoStack.push(JSON.stringify(currentState));
    const previousState = JSON.parse(undoStack.pop());
    return previousState;
}

/**
 * Redo the last undone action.
 * @returns {Object|null} - The redone state or null if stack is empty.
 */
function redo() {
    if (redoStack.length === 0) return null;
    const currentState = getCurrentSchedule();
    undoStack.push(JSON.stringify(currentState));
    const redoneState = JSON.parse(redoStack.pop());
    return redoneState;
}

