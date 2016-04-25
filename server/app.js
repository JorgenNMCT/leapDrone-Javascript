/* Requires */
var oLeap = require("leapjs");
var oHand = require("./movement/Hand.js");

// Alle constantes ophalen om deze hier te gebruiken
var constants = require("./helper/constants.js");

// Helper functie ophalen
var oUtil = require("./helper/Util.js");
// De opgehaalde helper functie declareren als 'util'
var util = new oUtil();

// Drone instances
var arDrone = require('ar-drone');
var client = arDrone.createClient();

// SocketIO
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

// Eigen drone instance
var Drone = require("./helper/Drone.js");
var drone = new Drone(io);

// instances
var Leap = oLeap;
var movementHand = new oHand();

// Variables for program stability
var isHovering = false;

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
                        drone.right();
                        console.log("LEAP: Right", currentHand.stabilizedPalmPosition[0], oldHand.stabilizedPalmPosition[0]);
                        io.sockets.emit('move', { sender: 'Leap', info: 'right' });
                        isHovering = false;
                    } else if (movementHand.moveLeft(currentHand.stabilizedPalmPosition[0], oldHand, controller)) {
                        drone.left();
                        console.log("LEAP: Left", currentHand.stabilizedPalmPosition[0], oldHand.stabilizedPalmPosition[0]);
                        io.sockets.emit('move', { sender: 'Leap', info: 'left' });
                        isHovering = false;
                    }

                    if (movementHand.moveUp(currentHand.stabilizedPalmPosition[1], oldHand, controller)) {
                        drone.up();
                        console.log("LEAP: Up", currentHand.stabilizedPalmPosition[1], oldHand.stabilizedPalmPosition[1]);
                        io.sockets.emit('move', { sender: 'Leap', info: 'up' });
                        isHovering = false;
                    } else if (movementHand.moveDown(currentHand.stabilizedPalmPosition[1], oldHand, controller)) {
                        drone.down();
                        console.log("LEAP: Down", currentHand.stabilizedPalmPosition[1], oldHand.stabilizedPalmPosition[1]);
                        io.sockets.emit('move', { sender: 'Leap', info: 'down' });
                        isHovering = false;
                    }

                    if (movementHand.moveForward(currentHand.palmPosition[2], oldHand, controller)) {
                        drone.front();
                        console.log("LEAP: Forward", currentHand.palmPosition[2], oldHand.palmPosition[2]);
                        io.sockets.emit('move', { sender: 'Leap', info: 'forward' });
                        isHovering = false;
                    } else if (movementHand.moveBackward(currentHand.palmPosition[2], oldHand, controller)) {
                        drone.back();
                        console.log("LEAP: Backward", currentHand.palmPosition[2], oldHand.palmPosition[2]);
                        io.sockets.emit('move', { sender: 'Leap', info: 'backward' });
                        isHovering = false;
                    }
                } else { // Niet alle vingers zijn uitgestrekt
                    //console.log("Niet alle fingers zijn uitgestrekt");
                    if (!isHovering) { drone.hover(); isHovering = true; }
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

var callback = function (err) { if (err) console.log(err); };
client.config({ key: 'general:navdata_demo', value: 'FALSE', timeout: 1000 }, callback);

// Ask the drone for his data!
client.on('navdata', function (data) {
    // send the data to the web interface
    io.sockets.emit('data', { device: 'drone', info: data });
});

// We need some fake test data, so here we go
if (constants.DEBUG_MODE) {
    /*setInterval(function () {
        var data = util.generateFakeDroneData();
        io.sockets.emit('data', { device: 'drone', info: data });
    }, 500);*/
}

/* Listen for specific events */
io.on('connection', function (socket) {
    // Listen for drone specific events (takeoff, ...)
    socket.on('drone', function (data) {
        console.log("SOCKET.IO: " + data.action);
        var cmd = "drone." + data.action + "();";
        eval(cmd);
    });
    // Listen for movement specific events (up, down, ...)
    socket.on('move', function (data) {
        console.log("SOCKET.IO: Movement -> " + data.action + " (speed: " + constants.DRONE_SPEED_UP_DOWN + ")");
        var cmd = "drone." + data.action + "();";
        eval(cmd);
    });
});

// To prevent a memory leak on runtime. We set unlimited listeners
io.sockets.setMaxListeners(0);

/* Proper cleaning of the app */
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) // program stopped, let the drone land in peace
        drone.shutdown();

    if (err) { console.log(err.stack); drone.emergency(); }
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));