// Prototypes/objects
var movementHand = new Hand();
var util = new Util();

var controller = new Leap.Controller();
controller.connect();

// Controller events
//controller.on('frame', onFrame);
controller.on('connect', onConnected);
controller.on('deviceConnected', onDeviceConnected);
controller.on('deviceDisconnected', onDeviceDisconnected);

var controller = Leap.loop(null, function (frame) {
    var newFrame = frame;
    var oldFrame = controller.frame(2);

    if (newFrame.hands.length >= 1) {
        for (var i = 0; i < newFrame.hands.length; i++) {
            var hand = newFrame.hands[i];
            var oldHand = oldFrame.hand(hand.id);

            if (hand.type == "right" && hand.valid == true && oldHand.valid == true) {
                // Alle fingers moeten uitgestrekt zijn voordat we iets gaan herkennen
                if (movementHand.fingersExtended(hand.fingers)) {
                    if (movementHand.moveRight(hand.stabilizedPalmPosition[0], oldHand, controller)) {
                        console.log("Right: ", hand.stabilizedPalmPosition[0], oldHand.stabilizedPalmPosition[0]);
                    } else if (movementHand.moveLeft(hand.stabilizedPalmPosition[0], oldHand, controller)) {
                        console.log("Left: ", hand.stabilizedPalmPosition[0], oldHand.stabilizedPalmPosition[0]);
                    }

                    if (movementHand.moveUp(hand.stabilizedPalmPosition[1], oldHand, controller)) {
                        console.log("Up: ", hand.stabilizedPalmPosition[1], oldHand.stabilizedPalmPosition[1]);
                    } else if (movementHand.moveDown(hand.stabilizedPalmPosition[1], oldHand, controller)) {
                        console.log("Down: ", hand.stabilizedPalmPosition[1], oldHand.stabilizedPalmPosition[1]);
                    }

                    if (movementHand.moveForward(hand.stabilizedPalmPosition[2], oldHand, controller)) {
                        console.log("Forward: ", hand.stabilizedPalmPosition[2], oldHand.stabilizedPalmPosition[2]);
                    } else if (movementHand.moveBackward(hand.stabilizedPalmPosition[2], oldHand, controller)) {
                        console.log("Backward: ", hand.stabilizedPalmPosition[2], oldHand.stabilizedPalmPosition[2]);
                    }
                }else{ // Niet alle vingers zijn uitgestrekt
                    console.log("Niet alle fingers zijn uitgestrekt");
                }
            }
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