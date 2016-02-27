var DIRECTION_UP = 38;
var DIRECTION_DOWN = 40;
var DIRECTION_LEFT = 37;
var DIRECTION_RIGHT = 39;
var DIRECTION_UP_2 = 87;
var DIRECTION_DOWN_2 = 83;
var DIRECTION_LEFT_2 = 65;
var DIRECTION_RIGHT_2 = 68;

function Controller() {
    this.lastInput = null;
    this.oninput = null;
    var instance = this;
    this.onkeydownhandler = function (e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if (key == DIRECTION_UP || key == DIRECTION_UP_2) {
            if (instance.oninput != null) {
                instance.oninput('U');
            }
        }
        else if (key == DIRECTION_RIGHT || key == DIRECTION_RIGHT_2) {
            if (instance.oninput != null) {
                instance.oninput('R');
            }
        }
        else if (key == DIRECTION_DOWN || key == DIRECTION_DOWN_2) {
            if (instance.oninput != null) {
                instance.oninput('D');
            }
        }
        else if (key == DIRECTION_LEFT || key == DIRECTION_LEFT_2) {
            if (instance.oninput != null) {
                instance.oninput('L');
            }
        }
    }
    
    window.addEventListener("gamepadconnected", function () {
        var gamepads = null;
        var lastDir = 'X';//filtering directions is necessary due to polling not spamming the server
        if (navigator.getGamepads != null) {
            gamepads = navigator.getGamepads();
        }
        var gamepad = null;
        if (gamepads != null && gamepads.length > 0) {
            window.setInterval(function () {
                gamepad = navigator.getGamepads()[0];
                if (gamepad.buttons[12].pressed && lastDir != 'U') {
                    lastDir = 'U';
                    instance.oninput('U');
                }
                if (gamepad.buttons[13].pressed && lastDir != 'D') {
                    lastDir = 'D';
                    instance.oninput('D');
                }
                if (gamepad.buttons[14].pressed && lastDir != 'L') {
                    lastDir = 'L';
                    instance.oninput('L');
                }
                if (gamepad.buttons[15].pressed && lastDir != 'R') {
                    lastDir = 'R';
                    instance.oninput('R');
                }
                if (gamepad.axes[0] < -0.5 && lastDir != 'L') {
                    lastDir = 'L';
                    instance.oninput('L');
                }
                if (gamepad.axes[0] > 0.5 && lastDir != 'R') {
                    lastDir = 'R';
                    instance.oninput('R');
                }
                if (gamepad.axes[1] < -0.5 && lastDir != 'U') {
                    lastDir = 'U';
                    instance.oninput('U');
                }
                if (gamepad.axes[1] > 0.5 && lastDir != 'D') {
                    lastDir = 'D';
                    instance.oninput('D');
                }
            }, 20);
        }
    });

    window.onkeydown = this.onkeydownhandler;
}