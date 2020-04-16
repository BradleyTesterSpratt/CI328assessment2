

const PORT = 55000;

var lobbies = require('./lobby-manager.js');



var server = require('http').createServer();
global.io = require('socket.io')(server);
io = global.io;
var game;
let lobby = {}; //temp
lobby.members = {};

server.lastMemberID = 0;
server.lastPlayerID = 0;

// here for now as we only have one lobby
// only the collection needs to be up here in future



io.on('connection', function(client) {


    client.on('playerreadytoggle', function(){
        client.lobby.toggleReady(client);
    });

    client.on('changecharacter', function(data) {
        let character = data.character;
        client.lobby.changeCharacter(client, character);
    });

    client.on('joinlobby', function(){
        lobbies.lobbyManager.quickJoin(client);
    });




    client.on('gameconnect', function() {
        client.lobby.joinGame(client);

        client.emit('initgame', { players:getAllPlayers(client.game), balls:getAllBalls(client.game)});

        client.on('disconnect',function() {
            // handel this?
     //       io.emit('remove', client.player.id);
            //console.log('killPlayer: ' + client.player.id);
        });

    });

    client.on('stopmove',function() {
        if(client.player)
        client.player.stop();
    });


    client.on('move',function(data) {
        let direction = Math.sign(data.direction);
        if(client.player)
        client.player.move(direction);
    });

});

server.listen(PORT, function(){
    console.log('Listening on ' + server.address().port);
});



function getAllPlayers(game){
    var players = [];
    Object.keys(game.players).forEach(function(key){
        var player = game.players[key];
        if(player) players.push(player);
    });
    return players;
}
function getAllBalls(game){
    var balls = [];
    Object.keys(game.balls).forEach(function(key){
        var player = game.balls[key];
        if(player) balls.push(player);
    });
    return balls;
}