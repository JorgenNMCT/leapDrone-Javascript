var Util = function () {
    var self = this;
    self.calculateAverageBoolean = function (bools) {
        if (bools.length > 0) {
            var countTrue = 0;
            var countFalse = 0;
            for (var i = 0; i < bools.length; i++) {
                if (bools[i] == true) {
                    countTrue++;
                } else {
                    countFalse++;
                }
            }
            if (countTrue >= (bools.length / 2)) return true;
            return false;
        } else {
            return false;
        }
    };
};

// Zie movement/Hand.js voor de uitleg
module.exports = Util;