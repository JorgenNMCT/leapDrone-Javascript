/* Socket.IO */
var socket = io("http://localhost");

socket.on("move", function (data) {
    console.log(data);
    addToFeed(data.sender, data.action);
});

socket.on("leap", function (data) {
    console.log(data);
    addToFeed(data.sender, data.leap);
});

socket.on("leapdevice", function (data) {
    console.log(data);
    addToFeed(data.sender, data.device);
});

function addToFeed(from, msg) {
    var $li = $('<li>').html(from + ': ' + msg);
    $('.feedScroller').append($li);
    $('.feedScroller').scrollTop($('.feedScroller')[0].scrollHeight);
}