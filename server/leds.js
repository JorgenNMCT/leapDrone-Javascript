var arDrone = require('ar-drone');
var client = arDrone.createClient();

client
  .after(2000, function () {
    client.animateLeds('blinkOrange', 5, 2);
  })
  .after(2500, function() {
    client.animateLeds('redSnake', 5, 2);    
  })
  .after(2000, function() {
    client.animateLeds('fire', 5, 2);
  })