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