// Alle constantes ophalen om deze hier te gebruiken
var constants = require("../helper/constants.js");

// Variables for program stability
var isFlying = false;
var camNumber = 0; // default head camera

var Drone = function (io, client) {
    var self = this;
    
    self.up = function () {
        if (isFlying) {
            client.up(constants.DRONE_SPEED_UP_DOWN);
            io.sockets.emit('move', { sender: 'Drone', info: 'up' });
            console.log('DRONE: Up');
        } else {
            io.sockets.emit('drone', { sender: 'Drone', info: 'Going up denied, not flying', priority: 'high' });
            console.log('DRONE: Going up denied, not flying');
        }
    };

    self.down = function () {
        if (isFlying) {
            client.down(constants.DRONE_SPEED_UP_DOWN);
            io.sockets.emit('move', { sender: 'Drone', info: 'down' });
            console.log('DRONE: Down');
        } else {
            io.sockets.emit('drone', { sender: 'Drone', info: 'Going down denied, not flying', priority: 'high' });
            console.log('DRONE: Going down denied, not flying');
        }
    };

    self.left = function () {
        if (isFlying) {
            client.left(constants.DRONE_SPEED_UP_DOWN);
            io.sockets.emit('move', { sender: 'Drone', info: 'left' });
            console.log('DRONE: Left');
        } else {
            io.sockets.emit('drone', { sender: 'Drone', info: 'Going left denied, not flying', priority: 'high' });
            console.log('DRONE: Going left denied, not flying');
        }
    };

    self.right = function () {
        if (isFlying) {
            client.right(constants.DRONE_SPEED_UP_DOWN);
            io.sockets.emit('move', { sender: 'Drone', info: 'right' });
            console.log('DRONE: Right');
        } else {
            io.sockets.emit('drone', { sender: 'Drone', info: 'Going right denied, not flying', priority: 'high' });
            console.log('DRONE: Going right denied, not flying');
        }
    };

    self.front = function () {
        if (isFlying) {
            client.front(constants.DRONE_SPEED_UP_DOWN);
            io.sockets.emit('move', { sender: 'Drone', info: 'front' });
            console.log('DRONE: Front');
        } else {
            io.sockets.emit('drone', { sender: 'Drone', info: 'Going forward denied, not flying', priority: 'high' });
            console.log('DRONE: Going forward denied, not flying');
        }
    };

    self.back = function () {
        if (isFlying) {
            client.back(constants.DRONE_SPEED_UP_DOWN);
            io.sockets.emit('move', { sender: 'Drone', info: 'back' });
            console.log('DRONE: Back');
        } else {
            io.sockets.emit('drone', { sender: 'Drone', info: 'Going backward denied, not flying', priority: 'high' });
            console.log('DRONE: Going backward denied, not flying');
        }
    };

    self.takeoff = function () {
        if (!isFlying) {
            client.takeoff();
            isFlying = true;
            io.sockets.emit('drone', { sender: 'Drone', info: 'takeoff', priority: 'med' });
            console.log('DRONE: Takeoff');
        } else {
            io.sockets.emit('drone', { sender: 'Drone', info: 'takeoff denied, already flying', priority: 'high' });
            console.log('DRONE: Takeoff denied, already flying');
        }
    };

    self.land = function () {
        if (isFlying) {
            client.land();
            isFlying = false;
            io.sockets.emit('drone', { sender: 'Drone', info: 'landing', priority: 'med' });
            console.log('DRONE: Land');
        } else {
            io.sockets.emit('drone', { sender: 'Drone', info: 'landing denied, not flying', priority: 'high' });
            console.log('DRONE: Land denied, not flying');
        }
    };

    self.hover = function () {
        if (isFlying) {
            client.stop();
            io.sockets.emit('drone', { sender: 'Drone', info: 'hovering', priority: 'med' });
            console.log('DRONE: Hovering');
        } else {
            io.sockets.emit('drone', { sender: 'Drone', info: 'hovering denied, not flying', priority: 'high' });
            console.log('DRONE: Hovering denied, not flying');
        }
    }

    self.emergency = function () {
        if (isFlying) {
            client.stop();
            client.land();
            isFlying = false;
            io.sockets.emit('drone', { sender: 'Drone', info: 'emergency', priority: 'high' });
            console.log('DRONE: Emergency');
        } else {
            io.sockets.emit('drone', { sender: 'Drone', info: 'emergency denied, not flying', priority: 'high' });
            console.log('DRONE: Emergency denied, not flying');
        }
    }

    self.shutdown = function () {
        if (isFlying) {
            client
                .after(1000, function () {
                    this.stop();
                })
                .after(1000, function () {
                    this.land();
                });
            isFlying = false;
            io.sockets.emit('drone', { sender: 'Drone', info: 'shutting down', priority: 'med' });
            console.log('DRONE: Shutting down');
        } else {
            io.sockets.emit('drone', { sender: 'Drone', info: 'shutting down denied, not flying', priority: 'high' });
            console.log('DRONE: Shutting down denied, not flying');
        }
    }
    
    self.nextCamera = function() {
        if(camNumber == 0) {
            camNumber = 3;
        }else if(camNumber == 3) {
            camNumber = 0;
        }
        
        client.config('video:video_channel', camNumber);
    }
};

// Zie movement/Hand.js voor de uitleg
module.exports = Drone;