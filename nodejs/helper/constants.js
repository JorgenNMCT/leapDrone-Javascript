
// How many frames do we go back for precision?
const AVERAGE_FRAMES = 20;

// Minimum movement a user has to perform, until an action happens
const MIN_MOVEMENT = 4; // General movement
const MIN_MOVEMENT_FORWARD = 5; // Specific forward
const MIN_MOVEMENT_BACKWARD = 5; // Specific backward

module.exports = {
    AVERAGE_FRAMES: AVERAGE_FRAMES,
    MIN_MOVEMENT: MIN_MOVEMENT,
    MIN_MOVEMENT_FORWARD: MIN_MOVEMENT_FORWARD,
    MIN_MOVEMENT_BACKWARD: MIN_MOVEMENT_BACKWARD
};