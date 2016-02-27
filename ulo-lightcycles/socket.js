var sio = require('socket.io');
var model = require('./model');
var game = null;
var io;

var waitForPlayersTime = 10000;//10 seconds
var waitForIntroTime = 5000;
var tickTime = 33;//33ms => 30 fps

function socket(server) {
    io = sio.listen(server);
    io.sockets.on('connection', function (ws) {
        console.log('NEW CONNECTION');

        ws.on('register', register);
        ws.on('ready', ready);
        ws.on('input', input);
        ws.on('myPing', ping);
        
        ws.on('disconnect', disconnect);
    });
}

function ping(msg) {
    this.emit('myPong', msg);
}

function register(data) {
    
    if (game != null && game.numPlayers >= 4) {
        this.emit('fail', 'The maximum number of players has been reached. Please try again later.');
    }
    else if (game != null && game.state != 'initial') {
        this.emit('fail', 'The game is already in progress. Please try again later.');
    }
    else {
        if (game == null) {
            game = model.createGame();
            game.onKilled = onKilled;
        }
        var player = model.createPlayer();
        player.name = data.name;
        // send all previously registered players to sending player
        for (var i = 0; i < 4; i++) {
            if (game.players[i] != null) {
                this.emit('addPlayer', game.players[i]);
            }
        }
        game.addPlayer(player, this);
        console.log('Player registered ' + player.name + ' as player ' + player.number);
        this.emit('registered', player);//this points to active socket
        //send new player to all other players
        for (var i = 0; i < 4; i++) {
            if (game.players[i] != null && game.players[i] !== player) {
                game.sockets[i].emit('addPlayer', player);
            }
        }
        
        //start wait for more players
        if (game.numPlayers > 1) {
            setTimeout(function () {
                if (game != null && game.numPlayers > 1) {
                    askReady();
                }
            }, waitForPlayersTime);
        }
    }
}

function askReady() {
    io.emit('askReady');
}

function ready() {
    var player = game.getPlayer(this);//get player for current socket
    player.ready = true;
    if (game.areAllReady()) {
        console.log('all players ready');
        startIntro();
    }
}

function startIntro() {
    if (game.state !== 'intro' && game.state !== 'running') {
        game.state = 'intro';
        console.log('starting intro');

        game.initPositions();
        var p1 = null, p2 = null, p3 = null, p4 = null;
        if (game.players[0] != null) { p1 = { x: game.players[0].x, y: game.players[0].y, direction: game.players[0].direction }; }
        if (game.players[1] != null) { p2 = { x: game.players[1].x, y: game.players[1].y, direction: game.players[1].direction }; }
        if (game.players[2] != null) { p3 = { x: game.players[2].x, y: game.players[2].y, direction: game.players[2].direction }; }
        if (game.players[3] != null) { p4 = { x: game.players[3].x, y: game.players[3].y, direction: game.players[3].direction }; }
        
        io.emit('startIntro', { p1: p1, p2: p2, p3: p3, p4: p4 });
        io.emit('anounce', 'Put him on the grid and have him participate in the games until he dies playing. End of Line')
        setTimeout(startGame, waitForIntroTime);
    }
}

function startGame() {
    if (game != null && game.state === 'intro') {
        game.state = 'running';
        io.emit('startGame');
        console.log('starting game');
        setTimeout(tick, 100);
    }
}

function tick() {
    if (game != null) {
        var p1 = null, p2 = null, p3 = null, p4 = null;
        if (game.players[0] != null) { p1 = game.players[0].direction; }
        if (game.players[1] != null) { p2 = game.players[1].direction; }
        if (game.players[2] != null) { p3 = game.players[2].direction; }
        if (game.players[3] != null) { p4 = game.players[3].direction; }
        
        game.update();
        
        io.emit('tick', { time: game.time, p1: p1, p2: p2, p3: p3, p4: p4 });
        
        if (game.isFinished()) {
            endGame();
        }
        else {
            setTimeout(tick, tickTime);
        }
    }
}

function input(data) {
    if (game != null) {
        var player = game.getPlayer(this);
        console.log('Input received from ' + player.name + ': ' + data.input);
        //check if turn is possible
        var possible = true;
        if (data.input === 'U') {
            possible = game.getFieldValue(player.x, player.y - 1) === 0;
        } else if (data.input === 'R') {
            possible = game.getFieldValue(player.x + 1, player.y) === 0;
        } else if (data.input === 'D') {
            possible = game.getFieldValue(player.x, player.y + 1) === 0;
        } else if (data.input === 'L') {
            possible = game.getFieldValue(player.x - 1, player.y) === 0;
        }
        if (possible) {
            player.direction = data.input;
        }
    }
}

function onKilled(player) {
    var text = 'Player ' + (player.number + 1) + ': ' + player.name + ' derezzed';
    player.direction = 'X';
    io.emit('anounce', text);
}

function endGame() {
    io.emit('endGame');
    console.log('game has ended');
    game = null;
}

function disconnect() {
    if (game != null) {
        game.removePlayer(this);
    }
}

module.exports = socket;