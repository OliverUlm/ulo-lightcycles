var colors = [ '#000030', 'DeepSkyBlue', 'OrangeRed', 'Orange', 'Lime' ];

function Renderer(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    this.ctx = canvas.getContext('2d');
    var instance = this;

    this.render = function () {
        //draw background
        instance.ctx.fillStyle = colors[0];
        instance.ctx.fillRect(0, 0, instance.game.width * 5, instance.game.height * 5);
        
        //draw players
        for (var x = 0; x < game.width; x++) {
            for (var y = 0; y < instance.game.width; y++) {
                var val = instance.game.getFieldValue(x, y);
                if (val != 0) {
                    val = Math.floor(val / 10) + 1;
                    instance.ctx.fillStyle = colors[val];
                    instance.ctx.fillRect(x * 5, y * 5, 5, 5);
                }
                
            }
        }
    }
}