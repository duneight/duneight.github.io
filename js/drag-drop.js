// drag-drop.js

/**
 * Initialize drag-and-drop functionality using Interact.js.
 */
function initializeDragAndDrop() {
    // Make pairs draggable
    interact('.pair').draggable({
        inertia: true,
        autoScroll: true,
        modifiers: [
            interact.modifiers.snap({
                targets: [
                    interact.snappers.grid({ x: 20, y: 20 })
                ],
                range: Infinity,
                relativePoints: [ { x: 0, y: 0 } ]
            }),
            interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true
            })
        ],
        listeners: {
            move: dragMoveListener,
            start (event) {
                event.target.classList.add('dragging');
            },
            end (event) {
                event.target.classList.remove('dragging');
                event.target.style.transform = 'translate(0, 0)';
                event.target.removeAttribute('data-x');
                event.target.removeAttribute('data-y');
            }
        }
    });

    function dragMoveListener (event) {
        const target = event.target;
        // Keep the dragged position in the data-x/data-y attributes
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // Translate the element
        target.style.transform = `translate(${x}px, ${y}px)`;

        // Update the position attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

    // Define dropzones for team slots
    interact('.team').dropzone({
        accept: '.pair',
        overlap: 0.75,
        ondropactivate: function (event) {
            event.target.classList.add('drop-active');
        },
        ondragenter: function (event) {
            event.target.classList.add('drop-target');
        },
        ondragleave: function (event) {
            event.target.classList.remove('drop-target');
        },
        ondrop: function (event) {
            handleDrop(event);
        },
        ondropdeactivate: function (event) {
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });

    // Allow pairs to be dropped back to the pair list
    interact('#pairContainer').dropzone({
        accept: '.pair',
        ondropactivate: function (event) {
            event.target.classList.add('drop-active');
        },
        ondragenter: function (event) {
            event.target.classList.add('drop-target');
        },
        ondragleave: function (event) {
            event.target.classList.remove('drop-target');
        },
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
        },
        ondropdeactivate: function (event) {
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}

/**
 * Handle drop event when a pair is dropped into a team slot.
 * @param {Object} event 
 */
function handleDrop(event) {
    const pair = event.relatedTarget;
    const target = event.target;

    // Retrieve pair's team
    const pairTeam = pair.getAttribute('data-team');
    const slotTeam = target.getAttribute('data-team');

    // Validation: Ensure pair is assigned to the correct team slot
    if (pairTeam !== slotTeam) {
        displayMessage('error', `Cannot assign pair to team ${slotTeam}.`);
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

    updateMatrix();
}
