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

    self.generateFakeDroneData = function () {
        var data = {
            'demo': {
                controlState: 'CTRL_LANDED',
                flyState: 'FLYING_OK',
                batteryPercentage: self.randomInt(15, 100),
                rotation:
                {
                    frontBack: -1.332,
                    pitch: -1.332,
                    theta: -1.332,
                    y: -1.332,
                    leftRight: -0.979,
                    roll: -0.979,
                    phi: -0.979,
                    x: -0.979,
                    clockwise: 152.282,
                    yaw: 152.282,
                    psi: 152.282,
                    z: 152.282
                },
                frontBackDegrees: -1.332,
                leftRightDegrees: -0.979,
                clockwiseDegrees: 152.282,
                altitude: 0,
                altitudeMeters: self.randomDouble(0, 20),
                velocity: { x: 0, y: 0, z: 0 },
                xVelocity: 0,
                yVelocity: 0,
                zVelocity: 0,
                frameIndex: 0
            },
            'wifi': {
                linkQuality: self.randomSmall()
            },
            'droneState': {
                communicationLost: self.randomInt(0, 1),
                lowBattery: self.randomInt(0, 1)
            },
            'gps': {
                dataAvailable: self.randomInt(0, 1),
                latitude: self.randomDouble(50, 52),
                longitude: self.randomDouble(30, 52),
                elevation: self.randomDouble(0, 20),
                nbSatellites: self.randomInt(0, 10)
            }
        }
        return data;
    };

    // Grenzen incl
    self.randomDouble = function (min, max) {
        return Math.random() * (max - min + 1) + min;
    };

    // Grenzen incl
    self.randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // tussen 0 en 1 (excl 1)
    self.randomSmall = function () {
        return Math.random();
    }

};

// Zie movement/Hand.js voor de uitleg
module.exports = Util;