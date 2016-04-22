/* === Leap motion constants */
// How many frames do we go back for precision?
const AVERAGE_FRAMES = 20;

// Minimum movement a user has to perform, until an action happens
const MIN_MOVEMENT = 4; // General movement
const MIN_MOVEMENT_FORWARD = 5; // Specific forward
const MIN_MOVEMENT_BACKWARD = 5; // Specific backward

/* === Socket.IO constants */
const SOCKET_IO_PORT = 80;

/* === Drone constants */
/* Speed */
const DRONE_SPEED_UP_DOWN = 0.1;       // Up and down
const DRONE_SPEED_FRONT_BACK = 0.01;    // Frontward and backward
const DRONE_SPEED_LEFT_RIGHT = 0.01;    // Left and right
const DRONE_SPEED_CIRCLES = 0.01;       // Clock- or counter clockwise

/* Speed */

module.exports = {
    AVERAGE_FRAMES: AVERAGE_FRAMES,
    MIN_MOVEMENT: MIN_MOVEMENT,
    MIN_MOVEMENT_FORWARD: MIN_MOVEMENT_FORWARD,
    MIN_MOVEMENT_BACKWARD: MIN_MOVEMENT_BACKWARD,
    SOCKET_IO_PORT: SOCKET_IO_PORT,
    DRONE_SPEED_UP_DOWN: DRONE_SPEED_UP_DOWN,
    DRONE_SPEED_FRONT_BACK: DRONE_SPEED_FRONT_BACK,
    DRONE_SPEED_LEFT_RIGHT: DRONE_SPEED_LEFT_RIGHT,
    DRONE_SPEED_CIRCLES: DRONE_SPEED_CIRCLES
};