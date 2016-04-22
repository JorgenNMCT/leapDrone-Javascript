/* If window is loaded */
$(document).ready(function() {
    generateControls();    
});

/* Socket.IO */
var socket = io("http://localhost");

socket.on("move", function (data) {
    console.log(data);
    addToFeed(data.priority, data.sender, data.info);
});

socket.on("leap", function (data) {
    console.log(data);
    handleSocket(data);
});

socket.on("leapdevice", function (data) {
    console.log(data);
    handleSocket(data);
});

function handleSocket(data) {
    console.log(typeof data.priority !== "undefined");
    if(typeof data.priority != "undefined" && typeof data.msg != "undefined")
        showNotification(data.sender, data.priority, data.msg);
    addToFeed(data.priority, data.sender, data.info);
}

function addToFeed(priority, sender, msg) {
    var $li = $('<li>', {class: 'bg-' + getBootstrapClass(priority) }).html(sender + ': ' + msg);
    $('.feedScroller').append($li);
    $('.feedScroller').scrollTop($('.feedScroller')[0].scrollHeight);
}

function showNotification(sender, priority, msg) {
    var classType = getBootstrapClass(priority);    
    $.notify({
        title: "<strong><span>" + sender + "</span> says: </strong>",
        message: msg
    }, {
            type: classType,
            delay: 5000
        });
}

function generateControls() {
    $.each(keyMap, function(i, btn) {
        $tr = $("<tr>");
        $key = $("<td>").html( (btn.key == null ? String.fromCharCode(i) : btn.key) );
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
           classType = '';
            break;
    }
    return classType;
}