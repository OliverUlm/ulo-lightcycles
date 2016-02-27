var colors = ['#000030', 'DeepSkyBlue', 'OrangeRed', 'Orange', 'Lime'];

function FancyRenderer(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    this.introStep = 0;
    this.ctx = canvas.getContext('2d');
    var img = new Image();
    img.src = './images/game_over.png';
    var instance = this;
    
    this.renderIntro = function () {
        instance.ctx.fillStyle = colors[0];
        instance.ctx.strokeStyle = 'DarkCyan';
        
        instance.ctx.fillRect(0, 0, instance.game.width * 5, instance.game.height * 5);
        
        for (var i = 1; i < 24; i++) {
            var x = 600;
            var y = 600 + (i - instance.introStep) * 25;
            if (y <= 0) {
                x += y; 
                y = 0;
            }
            instance.drawLine(i * 25, 600, x, y);
            instance.drawLine(600, i * 25, y, x);
        }

        instance.introStep++;
        if (instance.introStep < 49 && instance.game.state !== 'running') {
            setTimeout(instance.renderIntro, 50);
        }
        else {
            instance.render();
        }
    }

    this.render = function () {
        //draw background
        instance.renderBackground();
        
        //draw players
        instance.renderPlayers();
    }

    this.renderBackground = function () {
        instance.ctx.fillStyle = colors[0];
        instance.ctx.fillRect(0, 0, instance.game.width * 5, instance.game.height * 5);
        instance.ctx.strokeStyle = 'DarkCyan';
        for (var i = 1; i < width; i++) {
            instance.drawLine(0, i * 25, 600, i * 25);
        }
        for (var i = 1; i < height; i++) {
            instance.drawLine(i * 25, 0, i * 25, 600);
        }
    }

    this.renderPlayers = function () {
        for (var x = 0; x < game.width; x++) {
            for (var y = 0; y < instance.game.width; y++) {
                var val = instance.game.getFieldValue(x, y);
                if (val != 0) {
                    var type = val % 10;
                    val = Math.floor(val / 10) + 1;
                    instance.ctx.fillStyle = colors[val];
                    
                    // 0 = empty
                    // val / 10 = playerNo
                    // val % 10 = type:
                    // 1 = l to r
                    // 2 = r to l
                    // 3 = u to d
                    // 4 = d to u
                    // 5 = left to top
                    // 6 = top to right
                    // 7 = right to bottom
                    // 8 = bottom to left
                    // 99 = wall
                    
                    //TODO ulo: adapt stroke colors
                    /*instance.ctx.strokeStyle = 'White';
                    if (type === 1 || type === 2) {
                        instance.drawLine(x * 5, y * 5, (x + 1) * 5, y * 5);
                    } else if (type === 3 || type === 4 || type === 8) {
                        instance.drawLine(x * 5, y * 5, x * 5, (y + 1) * 5);
                    } else if (type === 7) {
                        instance.drawLine(x * 5, y * 5, (x + 1) * 5, y * 5);
                        instance.drawLine(x * 5, y * 5, x * 5, (y + 1) * 5);
                    }*/

                    instance.ctx.fillRect(x * 5, y * 5, 5, 5);
                }        
            }
        }
        //render lightcycles
        instance.ctx.strokeStyle = 'Black';
        for (var i = 0; i < 4; i++) {
            instance.ctx.fillStyle = 'Black';
            var player = game.players[i];
            if (player != null && player.alive) {
                var x = player.x * 5;
                var y = player.y * 5;
                if (player.direction === 'U') {
                    instance.fillCircle(x + 1, y, 3);
                    instance.fillCircle(x + 1, y + 7, 3);
                } else if (player.direction === 'R') {
                    instance.fillCircle(x - 9, y + 2, 3);
                    instance.fillCircle(x + 2, y + 2, 3);
                    instance.drawLine(x - 4, y + 5, x + 2, y + 5);
                    instance.drawLine(x - 6, y, x + 3, y + 1);
                    instance.drawLine(x - 6, y - 1, x + 3, y);
                    instance.ctx.fillStyle = colors[player.number + 1];
                    instance.ctx.fillRect(x - 5, y, 5, 5);
                } else if (player.direction === 'D') {
                    instance.fillCircle(x + 1, y - 5, 3);
                    instance.fillCircle(x + 1, y + 2, 3);
                } else if (player.direction === 'L') {
                    instance.fillCircle(x - 2, y + 2, 3);
                    instance.fillCircle(x + 9, y + 2, 3);
                    instance.drawLine(x + 4, y + 5, x - 2, y + 5);
                    instance.drawLine(x + 6, y, x + 3, y + 1);
                    instance.drawLine(x + 6, y - 1, x + 3, y);
                    instance.ctx.fillStyle = colors[player.number + 1];
                    instance.ctx.fillRect(x, y, 5, 5);
                }
            }
        }
    }
    
    this.renderGameOver = function () {
        instance.render();
        instance.ctx.drawImage(img, 80, 200);
    }

    this.drawLine = function (x1, y1, x2, y2) {
        instance.ctx.beginPath();
        instance.ctx.moveTo(x1, y1);
        instance.ctx.lineTo(x2, y2);
        instance.ctx.stroke();
    }

    this.fillCircle = function (x, y, radius) {
        instance.ctx.beginPath();
        instance.ctx.arc(x + radius / 2, y + radius / 2, radius, 0, 2 * Math.PI, false);
        instance.ctx.fill();
    }

    this.drawCircle = function (x, y, radius) {
        instance.ctx.beginPath();
        instance.ctx.arc(x + radius / 2, y + radius / 2, radius, 0, 2 * Math.PI, false);
        instance.ctx.stroke();
    }
}