// requires
var oLeap = require("leapjs");
var oHand = require("./movement/Hand.js");

// instances
var Leap = oLeap;
var movementHand = new oHand();

var controller = new Leap.Controller();
controller.connect();

// Controller events
//controller.on('frame', onFrame);
controller.on('connect', onConnected);
controller.on('deviceConnected', onDeviceConnected);
controller.on('deviceAttached', onDeviceAttached); // Dispatched when the Leap Motion device is plugged in or turned on
controller.on('deviceDisconnected', onDeviceDisconnected);
controller.on('deviceStopped', onDeviceStopped); // Dispatched when the Leap Motion device is plugged in or turned on
controller.on('disconnect', onDisconnect); // Dispatched when this Controller object disconnects from the Leap Motion WebSocket server.
controller.on('blur', onBlur); // Dispatched when the browser page loses focus
controller.on('focus', onFocus); // Dispatched when the browser tab gains focus.

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
                        console.log("Right: ", currentHand.stabilizedPalmPosition[0], oldHand.stabilizedPalmPosition[0]);
                    } else if (movementHand.moveLeft(currentHand.stabilizedPalmPosition[0], oldHand, controller)) {
                        console.log("Left: ", currentHand.stabilizedPalmPosition[0], oldHand.stabilizedPalmPosition[0]);
                    }

                    if (movementHand.moveUp(currentHand.stabilizedPalmPosition[1], oldHand, controller)) {
                        console.log("Up: ", currentHand.stabilizedPalmPosition[1], oldHand.stabilizedPalmPosition[1]);
                    } else if (movementHand.moveDown(currentHand.stabilizedPalmPosition[1], oldHand, controller)) {
                        console.log("Down: ", currentHand.stabilizedPalmPosition[1], oldHand.stabilizedPalmPosition[1]);
                    }

                    if (movementHand.moveForward(currentHand.palmPosition[2], oldHand, controller)) {
                        console.log("Forward: ", currentHand.palmPosition[2], oldHand.palmPosition[2]);
                    } else if (movementHand.moveBackward(currentHand.palmPosition[2], oldHand, controller)) {
                        console.log("Backward: ", currentHand.palmPosition[2], oldHand.palmPosition[2]);
                    }
                } else { // Niet alle vingers zijn uitgestrekt
                    //console.log("Niet alle fingers zijn uitgestrekt");
                }
            }
        }

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
});

function onDeviceConnected() {
    console.log("Device connected");
}

function onDeviceDisconnected() {
    console.log("Device disconnected");
}

function onConnected() {
    console.log("Connected");
}

function onDeviceAttached(e) {
    console.log("Device attached: ", e);
}

function onDeviceStopped() {
    console.log("Device stopped");
}

function onDisconnect() {
    console.log("Disconnected");
}

function onBlur() {
    console.log("Focus lost");
}

function onFocus() {
    console.log("Focus gained");
}