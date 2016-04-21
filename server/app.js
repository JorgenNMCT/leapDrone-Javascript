// requires
var oLeap = require("leapjs");
var oHand = require("./movement/Hand.js");

// Alle constantes ophalen om deze hier te gebruiken
var constants = require("./helper/constants.js");

// SocketIO
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

// instances
var Leap = oLeap;
var movementHand = new oHand();

/* Make the controller accessible */
var controller = new Leap.Controller();
controller.connect();

/* Controller enable events */
controller.on('connect', onConnected);
controller.on('deviceConnected', onDeviceConnected);
controller.on('deviceAttached', onDeviceAttached); // Dispatched when the Leap Motion device is plugged in or turned on
controller.on('deviceDisconnected', onDeviceDisconnected);
controller.on('deviceStopped', onDeviceStopped); // Dispatched when the Leap Motion device is plugged in or turned on
controller.on('disconnect', onDisconnect); // Dispatched when this Controller object disconnects from the Leap Motion WebSocket server.
controller.on('blur', onBlur); // Dispatched when the browser page loses focus
controller.on('focus', onFocus); // Dispatched when the browser tab gains focus.

/* Controller */
var controller = Leap.loop({ enableGestures: true }, function (frame) {
    var newFrame = frame;
    var oldFrame = controller.frame(2);

    if (newFrame.hands.length >= 1) {
        for (var i = 0; i < newFrame.hands.length; i++) {
            var currentHand = newFrame.hands[i];
            var oldHand = oldFrame.hand(currentHand.id);

            if (currentHand.type == "right" && currentHand.valid == true && oldHand.valid == true) {
                // Alle fingers moeten uitgestrekt zijn voordat we iets gaan herkennen
                if (movementHand.fingersExtended(currentHand.fingers)) {
                    if (movementHand.moveRight(currentHand.stabilizedPalmPosition[0], oldHand, controller)) {
                        console.log("LEAP: Right", currentHand.stabilizedPalmPosition[0], oldHand.stabilizedPalmPosition[0]);
                        io.sockets.emit('move', { sender: 'drone', action: 'right' });
                    } else if (movementHand.moveLeft(currentHand.stabilizedPalmPosition[0], oldHand, controller)) {
                        console.log("LEAP: Left", currentHand.stabilizedPalmPosition[0], oldHand.stabilizedPalmPosition[0]);
                        io.sockets.emit('move', { sender: 'drone', action: 'left' });
                    }

                    if (movementHand.moveUp(currentHand.stabilizedPalmPosition[1], oldHand, controller)) {
                        console.log("LEAP: Up", currentHand.stabilizedPalmPosition[1], oldHand.stabilizedPalmPosition[1]);
                        io.sockets.emit('move', { sender: 'drone', action: 'up' });
                    } else if (movementHand.moveDown(currentHand.stabilizedPalmPosition[1], oldHand, controller)) {
                        console.log("LEAP: Down", currentHand.stabilizedPalmPosition[1], oldHand.stabilizedPalmPosition[1]);
                        io.sockets.emit('move', { sender: 'drone', action: 'down' });
                    }

                    if (movementHand.moveForward(currentHand.palmPosition[2], oldHand, controller)) {
                        console.log("LEAP: Forward", currentHand.palmPosition[2], oldHand.palmPosition[2]);
                        io.sockets.emit('move', { sender: 'drone', action: 'forward' });
                    } else if (movementHand.moveBackward(currentHand.palmPosition[2], oldHand, controller)) {
                        console.log("LEAP: Backward", currentHand.palmPosition[2], oldHand.palmPosition[2]);
                        io.sockets.emit('move', { sender: 'drone', action: 'backward' });
                    }
                } else { // Niet alle vingers zijn uitgestrekt
                    //console.log("Niet alle fingers zijn uitgestrekt");
                }
            } else if (currentHand.type == "left" && currentHand.valid == true && oldHand.valid == true) {
                if (newFrame.valid && newFrame.gestures.length > 0) {
                    newFrame.gestures.forEach(function (gesture) {
                        if (gesture.state == "stop") {
                            switch (gesture.type) {
                                case "circle":
                                    console.log("Circle Gesture");
                                    break;
                                case "keyTap":
                                    console.log("Key Tap Gesture");
                                    break;
                                case "screenTap":
                                    console.log("Screen Tap Gesture");
                                    break;
                            }
                        }
                    });
                }
            }
        }
    }
});

/* Controller events */
function onDeviceConnected() {
    console.log("LEAP: Device connected");
    io.sockets.emit("leapdevice", { sender: 'leap device', device: "connected" });
}

function onDeviceDisconnected() {
    console.log("LEAP: Device disconnected");
    io.sockets.emit("leapdevice", { sender: 'leap device', device: "disconnected" });
}

function onConnected() {
    console.log("LEAP: Connected");
    io.sockets.emit("leap", { sender: 'leap', leap: "connected" });
}

function onDeviceAttached(e) {
    console.log("LEAP: Device attached: ", e);
    io.sockets.emit("leapdevice", { sender: 'leap device', device: "attached", data: e });
}

function onDeviceStopped() {
    console.log("LEAP: Device stopped");
    io.sockets.emit("leapdevice", { sender: 'leap device', device: "stopped" });
}

function onDisconnect() {
    console.log("LEAP: Disconnected");
    io.sockets.emit("leap", { sender: 'leap', leap: "disconnected" });
}

function onBlur() {
    console.log("LEAP: Focus lost");
    io.sockets.emit("leap", { sender: 'leap', leap: "blur" });
}

function onFocus() {
    console.log("LEAP: Focus gained");
    io.sockets.emit("leap", { sender: 'leap', leap: "focus" });
}

/* Socket.io server */
app.listen(constants.SOCKET_IO_PORT);
console.log("\nSOCKET.IO: listening on *:" + constants.SOCKET_IO_PORT + "\n");

function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

// To prevent a memory leak on runtime. We set unlimited listeners
io.sockets.setMaxListeners(0);
