// Constructor
function Hand() { }

Hand.prototype.moveRight = function (x, hand, controller) {
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
    return util.calculateAverageBoolean(isRight);
}

Hand.prototype.moveLeft = function (x, hand, controller) {
    var count = 0;
    var isLeft = [];

    var nieuweX = x;
    var huidigeX = hand.stabilizedPalmPosition[0];
    for (var i = 0; i < AVERAGE_FRAMES; i++) {
        var handFromFrame = controller.frame(i).hand(hand.id);
        if (handFromFrame.valid === true && ((nieuweX - huidigeX >= MIN_MOVEMENT) || (huidigeX - nieuweX >= MIN_MOVEMENT))) {
            if (nieuweX < huidigeX) {
                isLeft[count] = true;
            } else {
                isLeft[count] = false;
            }
            count++;
        }
    }
    return util.calculateAverageBoolean(isLeft);
}

Hand.prototype.moveUp = function (y, hand, controller) {
    var count = 0;
    var isUp = [];

    var nieuweY = y;
    var huidigeY = hand.stabilizedPalmPosition[1];
    for (var i = 0; i < AVERAGE_FRAMES; i++) {
        var handFromFrame = controller.frame(i).hand(hand.id);
        if (handFromFrame.valid === true && ((nieuweY - huidigeY >= MIN_MOVEMENT) || (huidigeY - nieuweY >= MIN_MOVEMENT))) {
            if (nieuweY > huidigeY) {
                isUp[count] = true;
            } else {
                isUp[count] = false;
            }
            count++;
        }
    }
    return util.calculateAverageBoolean(isUp);
}

Hand.prototype.moveDown = function (y, hand, controller) {
    var count = 0;
    var isDown = [];

    var nieuweY = y;
    var huidigeY = hand.stabilizedPalmPosition[1];
    for (var i = 0; i < AVERAGE_FRAMES; i++) {
        var handFromFrame = controller.frame(i).hand(hand.id);
        if (handFromFrame.valid === true && ((nieuweY - huidigeY >= MIN_MOVEMENT) || (huidigeY - nieuweY >= MIN_MOVEMENT))) {
            if (nieuweY < huidigeY) {
                isDown[count] = true;
            } else {
                isDown[count] = false;
            }
            count++;
        }
    }
    return util.calculateAverageBoolean(isDown);
}

Hand.prototype.moveForward = function (z, hand, controller) {
    var count = 0;
    var isForward = [];

    var nieuweZ = z;
    var huidigeZ = hand.stabilizedPalmPosition[2];
    for (var i = 0; i < AVERAGE_FRAMES; i++) {
        var handFromFrame = controller.frame(i).hand(hand.id);
        if (handFromFrame.valid === true && ((nieuweZ - huidigeZ >= MIN_MOVEMENT_FORWARD) || (huidigeZ - nieuweZ >= MIN_MOVEMENT_FORWARD))) {
            if (nieuweZ < huidigeZ) {
                isForward[count] = true;
            } else {
                isForward[count] = false;
            }
            count++;
        }
    }
    return util.calculateAverageBoolean(isForward);
}

Hand.prototype.moveBackward = function (z, hand, controller) {
    var count = 0;
    var isBackward = [];

    var nieuweZ = z;
    var huidigeZ = hand.stabilizedPalmPosition[2];
    for (var i = 0; i < AVERAGE_FRAMES; i++) {
        var handFromFrame = controller.frame(i).hand(hand.id);
        if (handFromFrame.valid === true && ((nieuweZ - huidigeZ >= MIN_MOVEMENT_BACKWARD) || (huidigeZ - nieuweZ >= MIN_MOVEMENT_BACKWARD))) {
            if (nieuweZ > huidigeZ) {
                isBackward[count] = true;
            } else {
                isBackward[count] = false;
            }
            count++;
        }
    }
    return util.calculateAverageBoolean(isBackward);
}

Hand.prototype.fingersExtended = function(fingers) {
    if(fingers.length > 0) {
        var result = true;
        for(var i = 0; i < fingers.length; i++) {
            if(fingers[i].extended == false) { result = false; break; }
        }
        return result;
    }else{
        return false;
    }
}