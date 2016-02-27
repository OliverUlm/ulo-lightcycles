var controller;
var socket;
var game;
var renderer;
var thisPlayer;
var name;

$(document).ready(function (e) {
    if (location.search) {
        $('.overlay').hide();
        var parts = location.search.split('=');
        if (parts.length > 1) {
            name = decodeURIComponent(parts[1]);
        } else {
            name = 'Jane Doe';
        }
        init();
    } else {
        $('#name').focus();
        $('#join').click(function () {
            if ($('#name').val().length > 0) {
                window.location.href = './game?name=' + $('#name').val();
            } else {
                alert('Please enter a name under which to join the game.');
            }
        });
    }
});

function init() {
    socket = io("/");
    controller = new Controller();

    controller.oninput = doinput;
    
    socket.on('fail', fail);
    socket.on('anounce', anounce);
    socket.on('addPlayer', addPlayer);
    socket.on('registered', registered);
    socket.on('askReady', askReady);
    socket.on('startIntro', startIntro);
    socket.on('startGame', startGame);
    socket.on('tick', tick);
    socket.on('endGame', endGame);
    socket.on('connect', connected);
}

function anounce(msg) {
    responsiveVoice.speak(msg, 'UK English Male', { pitch: 0.7, rate: 1.1 });
}

function connected() {
    game = new Game();
    game.onKilled = onKilled;
    renderer = new FancyRenderer(document.getElementById('grid'), game);

    //TODO ulo: ask user for username
    socket.emit('register', { name: name });
    $('#msg').html('set');
    console.log('connected to server');
}

function fail(msg) {
    socket.disconnect();
    alert(msg);
    console.log('fail received from server: ' + msg);
}

function addPlayer(player) {
    game.addPlayer(player);
    //TODO ulo: add player to local game
    console.log('added player: ' + player.name)
    updatePlayerList();
}

function registered(player) {
    $('#msg').html('waiting for additional players...');
    //TODO ulo: add player to local game
    game.addPlayer(player);
    thisPlayer = player;
    console.log('registered as player: ' + player.name);
    updatePlayerList();
}

function updatePlayerList() {
    var text = "";
    for (var i = 0; i < 4; i++) {
        var player = game.players[i];
        if (player != null) {
            text += '<span class="playerLabel" style="color: ' + colors[player.number + 1];
            if (player === thisPlayer) {
                text += '; text-decoration: underline';
            }
            text += '">Player ' + (player.number + 1) + '</span><span class="playerName"'
            if (!player.alive) {
                text += 'style="text-decoration: line-through"' 
            }
            text += '>' + player.name + '</span><br>';
        }
    }
    if (text.length < 1) {
        text = 'no players';
    }
    $('#players').html(text);
}

function askReady() {
    $('#msg').html('ready');
    socket.emit('ready');
    console.log('ask ready - received');
}

function startIntro(data) {
    if (game.state !== 'intro') {
        game.state = 'intro';
        $('#msg').html('intro');
        
        if (data.p1 !== null && game.players[0] != null) {
            game.players[0].x = data.p1.x;
            game.players[0].y = data.p1.y;
            game.players[0].direction = data.p1.direction;
        //console.log('p1: x(' + game.players[0].x + '), y(' + game.players[0].y + '), direction(' + game.players[0].direction + ')');
        }
        if (data.p2 != null && game.players[1] != null) {
            game.players[1].x = data.p2.x;
            game.players[1].y = data.p2.y;
            game.players[1].direction = data.p2.direction;
        //console.log('p2: x(' + game.players[1].x + '), y(' + game.players[1].y + '), direction(' + game.players[1].direction + ')');
        }
        if (data.p3 != null && game.players[2] != null) {
            game.players[2].x = data.p3.x;
            game.players[2].y = data.p3.y;
            game.players[2].direction = data.p3.direction;
        }
        if (data.p4 != null && game.players[3] != null) {
            game.players[3].x = data.p4.x;
            game.players[3].y = data.p4.y;
            game.players[3].direction = data.p4.direction;
        }
        
        renderer.renderIntro();
        
        console.log('intro started');
    }
    else {
        console.log('duplicate request to start intro');
    }
}

function startGame(data) {
    game.state = 'running';

    console.log('game started');
}

function tick(data) {
    if (data.time <= game.time) {
        console.log("duplicate packet detected - time: " + data.time);
    }
    if (data.p1 != null && game.players[0] != null) {
        game.players[0].direction = data.p1;
    }
    if (data.p2 != null && game.players[1] != null) {
        game.players[1].direction = data.p2;
    }
    if (data.p3 != null && game.players[2] != null) {
        game.players[2].direction = data.p3;
    }
    if (data.p4 != null && game.players[3] != null) {
        game.players[3].direction = data.p4;
    }
    game.update();
    renderer.render();
}

function doinput(input) {
    socket.emit('input', { input: input });
}

function onKilled(player) {
    updatePlayerList();
}

function endGame(data) {
    console.log('game ended');
    console.log('Player1 x: ' + game.players[0].x + ' y: ' + game.players[0].y);
    console.log('Player2 x: ' + game.players[1].x + ' y: ' + game.players[1].y);
    $('#msg').html('Game has ended');
    renderer.renderGameOver();
    game = null;
}