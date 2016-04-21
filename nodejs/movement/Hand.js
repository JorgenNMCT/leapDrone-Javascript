// Alle constantes ophalen om deze hier te gebruiken
var constants = require("../helper/constants.js");

// Helper functie ophalen
var oUtil = require("../helper/Util.js");
// De opgehaalde helper functie declareren als 'util'
var util = new oUtil();

var hand = function () {
    var self = this;
    
    self.moveRight = function (x, hand, controller) {
        var count = 0;
        var isRight = [];

        var nieuweX = x;
        var huidigeX = hand.stabilizedPalmPosition[0];
        for (var i = 0; i < constants.AVERAGE_FRAMES; i++) {
            var handFromFrame = controller.frame(i).hand(hand.id);
            if (handFromFrame.valid === true && ((nieuweX - huidigeX >= constants.MIN_MOVEMENT) || (huidigeX - nieuweX >= constants.MIN_MOVEMENT))) {
                if (nieuweX > huidigeX) {
                    isRight[count] = true;
                } else {
                    isRight[count] = false;
                }
                count++;
            }
        }
        return util.calculateAverageBoolean(isRight);
    };

    self.moveLeft = function (x, hand, controller) {
        var count = 0;
        var isLeft = [];

        var nieuweX = x;
        var huidigeX = hand.stabilizedPalmPosition[0];
        for (var i = 0; i < constants.AVERAGE_FRAMES; i++) {
            var handFromFrame = controller.frame(i).hand(hand.id);
            if (handFromFrame.valid === true && ((nieuweX - huidigeX >= constants.MIN_MOVEMENT) || (huidigeX - nieuweX >= constants.MIN_MOVEMENT))) {
                if (nieuweX < huidigeX) {
                    isLeft[count] = true;
                } else {
                    isLeft[count] = false;
                }
                count++;
            }
        }
        return util.calculateAverageBoolean(isLeft);
    };

    self.moveUp = function (y, hand, controller) {
        var count = 0;
        var isUp = [];

        var nieuweY = y;
        var huidigeY = hand.stabilizedPalmPosition[1];
        for (var i = 0; i < constants.AVERAGE_FRAMES; i++) {
            var handFromFrame = controller.frame(i).hand(hand.id);
            if (handFromFrame.valid === true && ((nieuweY - huidigeY >= constants.MIN_MOVEMENT) || (huidigeY - nieuweY >= constants.MIN_MOVEMENT))) {
                if (nieuweY > huidigeY) {
                    isUp[count] = true;
                } else {
                    isUp[count] = false;
                }
                count++;
            }
        }
        return util.calculateAverageBoolean(isUp);
    };

    self.moveDown = function (y, hand, controller) {
        var count = 0;
        var isDown = [];

        var nieuweY = y;
        var huidigeY = hand.stabilizedPalmPosition[1];
        for (var i = 0; i < constants.AVERAGE_FRAMES; i++) {
            var handFromFrame = controller.frame(i).hand(hand.id);
            if (handFromFrame.valid === true && ((nieuweY - huidigeY >= constants.MIN_MOVEMENT) || (huidigeY - nieuweY >= constants.MIN_MOVEMENT))) {
                if (nieuweY < huidigeY) {
                    isDown[count] = true;
                } else {
                    isDown[count] = false;
                }
                count++;
            }
        }
        return util.calculateAverageBoolean(isDown);
    };

    self.moveForward = function (z, hand, controller) {
        var count = 0;
        var isForward = [];

        var nieuweZ = z;
        var huidigeZ = hand.palmPosition[2];
        for (var i = 0; i < constants.AVERAGE_FRAMES; i++) {
            var handFromFrame = controller.frame(i).hand(hand.id);
            if (handFromFrame.valid === true && ((nieuweZ - huidigeZ >= constants.MIN_MOVEMENT_FORWARD) || (huidigeZ - nieuweZ >= constants.MIN_MOVEMENT_FORWARD))) {
                if (nieuweZ < huidigeZ) {
                    isForward[count] = true;
                } else {
                    isForward[count] = false;
                }
                count++;
            }
        }
        return util.calculateAverageBoolean(isForward);
    };

    self.moveBackward = function (z, hand, controller) {
        var count = 0;
        var isBackward = [];

        var nieuweZ = z;
        var huidigeZ = hand.palmPosition[2];
        for (var i = 0; i < constants.AVERAGE_FRAMES; i++) {
            var handFromFrame = controller.frame(i).hand(hand.id);
            if (handFromFrame.valid === true && ((nieuweZ - huidigeZ >= constants.MIN_MOVEMENT_BACKWARD) || (huidigeZ - nieuweZ >= constants.MIN_MOVEMENT_BACKWARD))) {
                if (nieuweZ > huidigeZ) {
                    isBackward[count] = true;
                } else {
                    isBackward[count] = false;
                }
                count++;
            }
        }
        return util.calculateAverageBoolean(isBackward);
    };

    self.fingersExtended = function (fingers) {
        if (fingers.length > 0) {
            var result = true;
            for (var i = 0; i < fingers.length; i++) {
                if (fingers[i].extended == false) { result = false; break; }
            }
            return result;
        } else {
            return false;
        }
    };
};

// We exporteren de hand functies, zodat ze gebruikt kunnen worden als:
//      var oHand = require("./movement/Hand.js");
//      var movementHand = new oHand();
//      movementHand.moveRight(...);
module.exports = hand;