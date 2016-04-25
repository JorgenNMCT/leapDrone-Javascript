var _dateSeparator = '-';
var _droneConnected, _videoOnline;
/* If window is loaded */
$(document).ready(function () {
    _droneConnected = _videoOnline = false;

    checkServerConnection();
    checkDroneConnection();
    getVideoStatus();
    generateControls();
});

/* Socket.IO */
var socket = io("http://localhost");

socket.on("move", function (data) {
    if (isServerOnline()) {
        addToFeed(data.priority, data.sender, data.info);
    }
});

socket.on("drone", function (data) {
    handleSocket(data);
});

socket.on("leap", function (data) {
    handleSocket(data);
});

socket.on("leapdevice", function (data) {
    handleSocket(data);
});

socket.on("data", function (data) {
    if (isServerOnline()) {
        if (data.device == 'drone') { // data komt van de drone
            processDroneData(data);
            _droneConnected = true;
        }
    }
});

function handleSocket(data) {
    if (isServerOnline()) {
        if (typeof data.priority != "undefined" && typeof data.msg != "undefined")
            showNotification(data.sender, data.priority, data.msg);
        addToFeed(data.priority, data.sender, data.info);
    }
}

function addToFeed(priority, sender, msg) {
    if (isServerOnline()) {
        var d = new Date();
        var currTime = d.getDate() + _dateSeparator
            + (eval(d.getMonth() + 1) < 10 ? '0' : '') + eval(d.getMonth() + 1) + _dateSeparator
            + d.getFullYear() + " "
            + (d.getHours() < 10 ? '0' : '') + d.getHours() + ":"
            + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        var $li = $('<li>', { class: 'bg-' + getBootstrapClass(priority) }).html(currTime + ' <strong>' + sender + ': </strong>' + msg);
        $('.feedScroller').append($li);
        $('.feedScroller').scrollTop($('.feedScroller')[0].scrollHeight);
    }
}

function showNotification(sender, priority, msg) {
    if (isServerOnline()) {
        var classType = getBootstrapClass(priority);
        $.notify({
            title: "<strong><span>" + sender + "</span> says: </strong>",
            message: msg
        }, {
                type: classType,
                delay: 5000
            });
    }
}

function processDroneData(data) {
    if (isServerOnline()) {
        // Drone data
        if (propertyHasValue(data.info.demo.batteryPercentage)) $('#indicator').attr('style', "width: " + (data.info.demo.batteryPercentage - 3 > 0 ? data.info.demo.batteryPercentage - 3 : data.info.demo.batteryPercentage) + "%");
        if (propertyHasValue(data.info.demo.altitudeMeters)) $('.altitudeMeters').html(data.info.demo.altitudeMeters);
        if (propertyHasValue(data.info.wifi.linkQuality)) $('.linkQuality').html(data.info.wifi.linkQuality);
        if (propertyHasValue(data.info.droneState.communicationLost)) $('.communicationLost').html(data.info.droneState.communicationLost);
        if (propertyHasValue(data.info.droneState.lowBattery)) $('.lowBattery').html(data.info.droneState.lowBattery);
        // Gps data
        if (propertyHasValue(data.info.gps.dataAvailable)) $('.dataAvailable').html(data.info.gps.dataAvailable);
        if (propertyHasValue(data.info.gps.latitude)) $('.latitude').html(data.info.gps.latitude);
        if (propertyHasValue(data.info.gps.longitude)) $('.longitude').html(data.info.gps.longitude);
        if (propertyHasValue(data.info.gps.elevation)) $('.elevation').html(data.info.gps.elevation);
        if (propertyHasValue(data.info.gps.nbSatellites)) $('.nbSatellites').html(data.info.gps.nbSatellites);
    }
}

function propertyHasValue(prop) {
    if (prop && (typeof prop != "undefined" && typeof prop != null) && (prop != null && prop != undefined && prop != "undefined" && prop != "null")) return true;
    return false;
}

function generateControls() {
    $.each(keyMap, function (i, btn) {
        $tr = $("<tr>");
        $key = $("<td>").html((btn.key == null ? String.fromCharCode(i) : btn.key));
        $action = $("<td>").html(btn.action);
        $tr.append($key, $action);
        $('.controls > tbody').append($tr);
    });
}

function getBootstrapClass(priority) {
    switch (priority) {
        case 'high':
            classType = 'danger';
            break;
        case 'med':
            classType = 'warning';
            break;
        case 'low':
            classType = 'success';
            break;
        default:
            classType = 'primary';
            break;
    }
    return classType;
}

function setServerState(state) {
    if (state == 'online') $('#offline').hide();
    else $('#offline').show();
}

// True = online, false = offline
function isServerOnline() {
    return socket.connected;
}

function isVideoOnline() {
    return _videoOnline;
}

function getVideoStatus() {
    window.setInterval(function () {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/',
            timeout: 1000,
            success: function (data, textStatus, XMLHttpRequest) { _videoOnline = true; },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                _videoOnline = false;
            }
        });
    }, 1500);
}

function checkServerConnection() {
    setInterval(function () {
        if (socket.connected == true) setServerState('online');
        else setServerState('offline');
    }, 50);
}

function checkDroneConnection() {
    setInterval(function () {
        _droneConnected = false;
    }, 50);
}