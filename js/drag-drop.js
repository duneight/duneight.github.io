// js/drag-drop.js

/**
 * Drag and Drop Module
 * Handles the drag-and-drop interactions using Interact.js.
 */

/**
 * Initialize drag and drop for pairs and schedule slots.
 */
function initializeDragAndDrop() {
    interact('.pair').draggable({
        inertia: true,
        autoScroll: true,
        onmove: dragMoveListener,
        onstart: function (event) {
            event.target.classList.add('dragging');
        },
        onend: function (event) {
            event.target.classList.remove('dragging');
            event.target.style.transform = 'translate(0, 0)';
            event.target.removeAttribute('data-x');
            event.target.removeAttribute('data-y');
        }
    });

    function dragMoveListener(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

    // Initialize dropzones for team slots
    interact('.team').dropzone({
        accept: '.pair',
        overlap: 0.75,
        ondrop: handleDrop
    });

    // Allow pairs to be dropped back to the pair list
    interact('#pairContainer').dropzone({
        accept: '.pair',
        ondrop: function (event) {
            const pair = event.relatedTarget;
            if (pair.parentElement.classList.contains('team')) {
                pair.parentElement.textContent = '';
            }
            event.target.appendChild(pair);
            pair.style.transform = 'translate(0, 0)';
            pair.removeAttribute('data-x');
            pair.removeAttribute('data-y');
            updateMatrix();
            saveSchedule(getCurrentSchedule());
        }
    });
}

/**
 * Handle drop event when a pair is dropped into a team slot.
 * @param {Event} event 
 */
function handleDrop(event) {
    const pair = event.relatedTarget;
    const target = event.target;

    // Get team information
    const pairTeam = pair.getAttribute('data-team');
    const targetTeam = target.getAttribute('data-team');

    // Validate team assignment
    if (pairTeam !== targetTeam) {
        showAlert('Cannot assign pair to a different team.');
        return;
    }

    // Remove pair from previous location
    if (pair.parentElement.classList.contains('team')) {
        pair.parentElement.textContent = '';
    } else {
        pair.remove();
    }

    // If target already has a pair, move it back to the pair list
    if (target.firstChild) {
        const existingPair = target.firstChild;
        const pairContainer = document.getElementById('pairContainer');
        pairContainer.appendChild(existingPair);
    }

    // Place pair in new location
    target.textContent = '';
    target.appendChild(pair);
    pair.style.transform = 'translate(0, 0)';
    pair.removeAttribute('data-x');
    pair.removeAttribute('data-y');

    // Update interaction matrix and save schedule
    updateMatrix();
pushToUndoStack(getCurrentSchedule());
saveSchedule(getCurrentSchedule());
}
