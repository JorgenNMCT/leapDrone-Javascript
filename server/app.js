/* Requires */
var oLeap = require("leapjs");
var oHand = require("./movement/Hand.js");

// Alle constantes ophalen om deze hier te gebruiken
var constants = require("./helper/constants.js");

// SocketIO
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

// Drone instances
var arDrone = require('ar-drone');
var client  = arDrone.createClient();

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
                        client.right(constants.DRONE_SPEED_LEFT_RIGHT);
                        io.sockets.emit('move', { sender: 'drone', info: 'right' });
                    } else if (movementHand.moveLeft(currentHand.stabilizedPalmPosition[0], oldHand, controller)) {
                        console.log("LEAP: Left", currentHand.stabilizedPalmPosition[0], oldHand.stabilizedPalmPosition[0]);
                        io.sockets.emit('move', { sender: 'drone', info: 'left' });
                        client.left(constants.DRONE_SPEED_LEFT_RIGHT);
                    }

                    if (movementHand.moveUp(currentHand.stabilizedPalmPosition[1], oldHand, controller)) {
                        console.log("LEAP: Up", currentHand.stabilizedPalmPosition[1], oldHand.stabilizedPalmPosition[1]);
                        io.sockets.emit('move', { sender: 'drone', info: 'up' });
                        client.up(constants.DRONE_SPEED_LEFT_RIGHT);
                    } else if (movementHand.moveDown(currentHand.stabilizedPalmPosition[1], oldHand, controller)) {
                        console.log("LEAP: Down", currentHand.stabilizedPalmPosition[1], oldHand.stabilizedPalmPosition[1]);
                        io.sockets.emit('move', { sender: 'drone', info: 'down' });
                        client.down(constants.DRONE_SPEED_LEFT_RIGHT);
                    }

                    if (movementHand.moveForward(currentHand.palmPosition[2], oldHand, controller)) {
                        console.log("LEAP: Forward", currentHand.palmPosition[2], oldHand.palmPosition[2]);
                        io.sockets.emit('move', { sender: 'drone', info: 'forward' });
                        client.front(constants.DRONE_SPEED_LEFT_RIGHT);
                    } else if (movementHand.moveBackward(currentHand.palmPosition[2], oldHand, controller)) {
                        console.log("LEAP: Backward", currentHand.palmPosition[2], oldHand.palmPosition[2]);
                        io.sockets.emit('move', { sender: 'drone', info: 'backward' });
                        client.back(constants.DRONE_SPEED_LEFT_RIGHT);
                    }
                } else { // Niet alle vingers zijn uitgestrekt
                    //console.log("Niet alle fingers zijn uitgestrekt");
                    client.stop();
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
    io.sockets.emit("leapdevice", { sender: 'leap device', info: "connected", msg: "Leap Motion device is connected.", priority: "low" });
}

function onDeviceDisconnected() {
    console.log("LEAP: Device disconnected");
    io.sockets.emit("leapdevice", { sender: 'leap device', info: "disconnected", msg: "Leap Motion device is disconnected!", priority: "high" });
}

function onConnected() {
    console.log("LEAP: Connected");
    io.sockets.emit("leap", { sender: 'leap', info: "connected", priority: "low" });
}

function onDeviceAttached(e) {
    console.log("LEAP: Device attached: ", e);
    io.sockets.emit("leapdevice", { sender: 'leap device', info: "attached", data: e, msg: "Leap Motion device is attached.", priority: "low" });
}

function onDeviceStopped() {
    console.log("LEAP: Device stopped");
    io.sockets.emit("leapdevice", { sender: 'leap device', info: "stopped", msg: "Leap Motion device/service stopped working.", priority: "high" });
}

function onDisconnect() {
    console.log("LEAP: Disconnected");
    io.sockets.emit("leap", { sender: 'leap', info: "disconnected", msg: "Leap Motion service is disconnected.", priority: "high" });
}

function onBlur() {
    console.log("LEAP: Focus lost");
    io.sockets.emit("leap", { sender: 'leap', info: "blur" });
}

function onFocus() {
    console.log("LEAP: Focus gained");
    io.sockets.emit("leap", { sender: 'leap', info: "focus" });
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

/* Listen for specific events */
io.on('connection', function (socket) {
    // Listen for drone specific events (takeoff, ...)
    socket.on('drone', function (data) {
        console.log("SOCKET.IO: " + data.action);
        var cmd = "client." + data.action + "();";
        eval(cmd);
        console.log(cmd);
    });
    // Listen for movement specific events (up, down, ...)
    socket.on('move', function (data) {
        console.log("SOCKET.IO: Movement -> " + data.action);
        var cmd = "client." + data.action + "(" + constants.DRONE_SPEED_UP_DOWN + ");";
        eval(cmd);
        console.log(cmd);
        setTimeout(function() {
            client.stop();
        }, 1000);
    });
});

// To prevent a memory leak on runtime. We set unlimited listeners
io.sockets.setMaxListeners(0);

/* Proper cleaning of the app */
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) {
        // code to let the drone land
        client.stop();
        client.land();
    }
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));