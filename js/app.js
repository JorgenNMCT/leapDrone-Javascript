// Constants
const AVERAGE_FRAMES = 20;
const MIN_MOVEMENT = 4;

// Prototypes
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
                if (movementHand.moveRight(hand.stabilizedPalmPosition[0], oldHand, controller)) {
                    console.log("Rechts: ", hand.stabilizedPalmPosition[0], oldHand.stabilizedPalmPosition[0]);
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