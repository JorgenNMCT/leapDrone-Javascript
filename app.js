// Constants
const AVERAGE_FRAMES = 120;
const MIN_MOVEMENT = 4;

var controller = new Leap.Controller();
controller.connect();

// Controller events
//controller.on('frame', onFrame);
controller.on('deviceConnected', onDeviceConnected);
controller.on('deviceDisconnected', onDeviceDisconnected);
controller.on('connect', onConnected);

var controller = Leap.loop(null, function (frame) {
    var newFrame = frame;
    var oldFrame = controller.frame(2);

    if (newFrame.hands.length >= 1) {
        for (var i = 0; i < newFrame.hands.length; i++) {
            var hand = newFrame.hands[i];
            var oldHand = oldFrame.hand(hand.id);

            if (hand.type == "right" && hand.valid == true && oldHand.valid == true) {
                var x = hand.stabilizedPalmPosition[0];
                if (handsMoveRight(x, oldHand, controller) === true) {
//                    console.log("Rechts: ", x, oldHand.stabilizedPalmPosition[0]);
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

// Helper function
function calculateAverageBoolean(array) {
    var countTrue = 0;
    var countFalse = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] == true) {
            countTrue++;
        } else {
            countFalse++;
        }
    }
    if (countTrue >= (array.length / 2)) return true;
    return false;
}

function handsMoveRight(x, hand, controller) {
    var count = 0;
    var isRight = [];

    var nieuweX = x;
    var huidigeX = hand.stabilizedPalmPosition[0];
    for (var i = 0; i < AVERAGE_FRAMES; i++) {
        var handFromFrame = controller.frame(i).hand(hand.id);
        if (handFromFrame.valid === true && ((nieuweX - huidigeX >= MIN_MOVEMENT) || (huidigeX - nieuweX >= MIN_MOVEMENT))) {
            if (nieuweX > huidigeX) {
                isRight[count] = true;
            } else {
                isRight[count] = false;
            }
            count++;
        }
    }
    console.log(isRight);
    return calculateAverageBoolean(isRight);
}