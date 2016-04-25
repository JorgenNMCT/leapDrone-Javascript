var arDrone = require('ar-drone');
var client = arDrone.createClient();
client.createRepl();

/*client.on('navdata', function(data) {
   console.log(data.demo);
   console.log("=============="); 
});*/

/*
{ controlState: 'CTRL_LANDED',
  flyState: 'FLYING_OK',
  batteryPercentage: 43,
  rotation:
   { frontBack: -1.332,
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
     z: 152.282 },
  frontBackDegrees: -1.332,
  leftRightDegrees: -0.979,
  clockwiseDegrees: 152.282,
  altitude: 0,
  altitudeMeters: 0,
  velocity: { x: 0, y: 0, z: 0 },
  xVelocity: 0,
  yVelocity: 0,
  zVelocity: 0,
  frameIndex: 0,
  detection:
   { camera: { rotation: [Object], translation: [Object], type: 3 },
     tagIndex: 0 },
  drone: { camera: { rotation: [Object], translation: [Object] } } }

  // zie: https://github.com/felixge/node-ar-drone/blob/master/lib/navdata/parseNavdata.js#L447
  //	> wifi quality: data.wifi.linkQuality
  //	> battery: data.demo.batteryPercentage
  //	> altitudeMeters: data.demo.altitudeMeters
  //	> communication lost: data.droneState.communicationLost
  //	> Low battery: data.droneState.lowBattery
  //	> gps:
			> data avail: data.gps.dataAvailable
			> latitude: data.gps.latitude
			> longitude: data.gps.longitude
			> elevation: data.gps.elevation
			> nbSatellites: data.gps.nbSatellites
  
  */