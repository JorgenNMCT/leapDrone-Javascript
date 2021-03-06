/* Keymapping with the action */
var keyMap = {
    84: { send: "drone", action: "takeoff" },
    76: { send: "drone", action: "land" },
    72: { send: "drone", action: "hover" },

    69: { send: "drone", action: "emergency" },

    78: { send: "drone", action: "nextCamera" },

    17: { send: "move", key: "ctrl", action: "up" },
    32: { send: "move", key: "space", action: "down" },
    37: { send: "move", key: "left arrow", action: "left" },
    39: { send: "move", key: "right arrow", action: "right" },
    38: { send: "move", key: "up arrow", action: "front" },
    40: { send: "move", key: "down arrow", action: "back" }
}

// check if we find a keypress when the server did connect

$(document).keydown(function (e) {
    if (isServerOnline()) {
        if (typeof keyMap[e.which] !== "undefined" && typeof keyMap[e.which] !== "null") {
            var button = keyMap[e.which];
            socket.emit(button.send, { action: button.action });
            addToFeed(null, "Key press", (button.key == null ? String.fromCharCode(e.which) : button.key) + " (" + button.action + ")");
        }
    }
});
