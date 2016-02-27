var height = 120;
var width = 120;

function Player() {
    this.number = 0;
    this.name = "";
    this.alive = true;
    this.ready = false;
    this.x = 0;
    this.y = 0;
    this.direction = 'X';
}

function Game() {
    this.players = [null, null, null, null];
    //this.sockets = [null, null, null, null];
    this.state = 'initial';
    this.numPlayers = 0;
    this.width = width;
    this.height = height;
    this.field = new Array(width * height);
    this.onKilled = null;
    this.time = 10000;
    var instance = this;
    
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

    for (var i = 0; i < width * height; i++) {
        this.field[i] = 0;
    }
    
    this.addPlayer = function (player) {
        instance.players[player.number] = player;
    }

    /* not done on client */
    /*this.addPlayer = function (player, socket) {
        if (instance.numPlayers < 4) {
            instance.numPlayers++;
            var i;
            //find first free player field
            for (i = 0; i < 4; i++) {
                if (instance.players[i] == null) {
                    break;
                }
            }
            player.number = i;
            instance.players[player.number] = player;
            instance.sockets[player.number] = socket;
        }
    }*/

    /* not done on client */
   /* this.getPlayer = function (socket) {
        for (var i = 0; i < 4; i++) {
            if (instance.sockets[i] === socket) {
                return instance.players[i];
            }
        }
    }*/
    
    /* not done on client */
    /*this.removePlayer = function (socket) {
        for (var i = 0; i < 4; i++) {
            if (instance.sockets[i] === socket) {
                instance.numPlayers--;
                instance.players[i] = null;
                instance.sockets[i] = null;
                break;
            }
        }
    }*/
    
    //not done on client
    /*this.areAllReady = function () {
        var result = true;
        for (var i = 0; i < 4; i++) {
            if (instance.players[i] != null) {
                result = result && instance.players[i].ready;
            }
        }
        return result;
    }*/
    
    /* not done on client */
    /*this.initPositions = function () {
        if (instance.numPlayers == 2) {
            var found = 0;
            for (var i = 0; i < 4; i++) {
                if (instance.players[i] != null) {
                    if (found == 0) {
                        instance.players[i].x = Math.floor(instance.width / 6);
                        instance.players[i].y = Math.floor(instance.height / 2);
                        instance.players[i].direction = 'R';
                        found++;
                    }
                    else {
                        instance.players[i].x = Math.floor((instance.width / 6) * 5);
                        instance.players[i].y = Math.floor(instance.height / 2);
                        instance.players[i].direction = 'L';
                    }
                }
            }
        }
        else if (instance.numPlayers == 3) {
            var found = 0;
            for (var i = 0; i < 4; i++) {
                if (instance.players[i] != null) {
                    if (found == 0) {
                        instance.players[i].x = Math.floor(instance.width / 6);
                        instance.players[i].y = Math.floor(instance.height / 3);
                        instance.players[i].direction = 'R';
                        found++;
                    }
                    else if (found == 1) {
                        instance.players[i].x = Math.floor(instance.width / 6);
                        instance.players[i].y = Math.floor((instance.height / 3) * 2);
                        instance.players[i].direction = 'R';
                        found++;
                    }
                    else {
                        instance.players[i].x = Math.floor((instance.width / 6) * 5);
                        instance.players[i].y = Math.floor(instance.height / 2);
                        instance.players[i].direction = 'L';
                    }
                }
            }
        }
        else if (instance.numPlayers == 4) {
            var found = 0;
            for (var i = 0; i < 4; i++) {
                if (instance.players[i] != null) {
                    if (found == 0) {
                        instance.players[i].x = Math.floor(instance.width / 6);
                        instance.players[i].y = Math.floor(instance.height / 3);
                        instance.players[i].direction = 'R';
                        found++;
                    }
                    else if (found == 1) {
                        instance.players[i].x = Math.floor(instance.width / 6);
                        instance.players[i].y = Math.floor((instance.height / 3) * 2);
                        instance.players[i].direction = 'R';
                        found++;
                    }
                    else if (found == 2) {
                        instance.players[i].x = Math.floor((instance.width / 6) * 5);
                        instance.players[i].y = Math.floor(instance.height / 3);
                        instance.players[i].direction = 'L';
                        found++;
                    }
                    else if (found == 3) {
                        instance.players[i].x = Math.floor((instance.width / 6) * 5);
                        instance.players[i].y = Math.floor((instance.height / 3) * 2);
                        instance.players[i].direction = 'L';
                        found++;
                    }
                }
            }
        }
        else {
            console.log("Tried to init positions for invalid number of players.")
        }
    }*/
    
    this.update = function () {
        instance.time++;
        for (var i = 0; i < 4; i++) {
            //first increase all player positions to equalize crash check
            if (instance.players[i] != null && instance.players[i].alive) {
                var player = instance.players[i];
                var oldField = instance.getFieldValue(player.x, player.y);
                var oldPos = { x: player.x, y: player.y };
                if (player.direction === 'U') {
                    player.y--;
                }
                else if (player.direction === 'R') {
                    player.x++;
                }
                else if (player.direction === 'D') {
                    player.y++;
                }
                else if (player.direction === 'L') {
                    player.x--;
                }
                //check if player is still inside field
                if (player.x > -1 && player.x < instance.width && player.y > -1 && player.y < instance.height) {
                    var newField = instance.getFieldValue(player.x, player.y);
                    if (newField !== 0) {//crashed into something
                        player.alive = false;
                        if (instance.onKilled != null) {
                            instance.onKilled(player);
                        }
                    }
                    else {
                        var oldType = oldField % 10;
                        if (player.direction === 'U') {
                            if (oldType === 1) {// left to right
                                instance.setFieldValue(oldPos.x, oldPos.y, player.number * 10 + 5);//left to up
                            } else if (oldType === 2) {//right to left
                                instance.setFieldValue(oldPos.x, oldPos.y, player.number * 10 + 6);//up to right
                            }
                            instance.setFieldValue(player.x, player.y, player.number * 10 + 4);//down to up
                        } else if (player.direction === 'R') {
                            if (oldType === 3) {// up to down
                                instance.setFieldValue(oldPos.x, oldPos.y, player.number * 10 + 6);//up to right
                            } else if (oldType === 4) {//down to up
                                instance.setFieldValue(oldPos.x, oldPos.y, player.number * 10 + 7);//down to right
                            }
                            instance.setFieldValue(player.x, player.y, player.number * 10 + 1);//left to right
                        } else if (player.direction === 'D') {
                            if (oldType === 1) {//left to right
                                instance.setFieldValue(oldPos.x, oldPos.y, player.number * 10 + 8);//left to down
                            } else if (oldType === 2) {//right to left
                                instance.setFieldValue(oldPos.x, oldPos.y, player.number * 10 + 7);//right to down
                            }
                            instance.setFieldValue(player.x, player.y, player.number * 10 + 3);//up to down
                        } else if (player.direction === 'L') {
                            if (oldType === 3) {//up to down
                                instance.setFieldValue(oldPos.x, oldPos.y, player.number * 10 + 5);//up to left
                            } else if (oldType === 4) {//down to up
                                instance.setFieldValue(oldPos.x, oldPos.y, player.number * 10 + 8);//down to left
                            }
                            instance.setFieldValue(player.x, player.y, player.number * 10 + 2);//right to left
                        } else {
                            console.log("player traveling in unknown direction '" + player.direction + "' - please debug");
                        }
                    }
                }
                else {//crashed into wall
                    player.alive = false;
                    if (instance.onKilled != null) {
                        instance.onKilled(player);
                    }
                }
            }
        }
        var alive = 0;
        for (var i = 0; i < 4; i++) {
            if (instance.players[i] != null && instance.players[i].alive) {
                alive++;
            }
        }
        if (alive <= 1) {
            instance.state = 'finished';
        }
    }
    
    this.getFieldValue = function (x, y) {
        return instance.field[y * instance.width + x];
    }
    
    this.setFieldValue = function (x, y, val) {
        instance.field[y * instance.width + x] = val;
    }
    
    this.isFinished = function () {
        return instance.state === 'finished';
    }
}