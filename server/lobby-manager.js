var gameManager = require('./game-manager.js');
let lobbySize = 4;
gameManager.createManager();
const lobbyManager = {
    lobbies:[],

    createLobby: function(){
        let lobbyLength = this.lobbies.length;
        let roomName = "room" + lobbyLength;
        let lobby = new Lobby(roomName);
        this.lobbies.push(lobby);
        return lobby;
    },

    joinLobby: function(client, lobbyID){
        let lobby = this.lobbies[lobbyID];
        if(lobby && !lobby.isfull() && !lobby.isStarted) lobby.join(client);
    },

    quickJoin: function(client){
        let lobbies = this.lobbies;
        for(let lobbyIncrementor = 0; lobbies.length > lobbyIncrementor; lobbyIncrementor++){

            let lobby = lobbies[lobbyIncrementor];
            if(!lobby.isFull() && !lobby.isStarted)
            {
                lobby.joinLobby(client);
                return lobby;
            }
        }

        let lobby = this.createLobby();
        lobby.joinLobby(client);
        return lobby;
    },

    destroyLobby: function(pos){
        delete this.lobbies[pos];
    }

};


class Lobby{
    constructor(roomID){
        this.id = roomID;
        this.members = [];
        this.isStarted = false;
        this.gameJoinedIncrementor = 0;
    }

    joinLobby(client){
        this.leaveAllRooms(client);
        client.game = null;
        client.player = null;
        client.lobby = null;
        client.member = null;

        client.join(this.id);
        let lobbyMember = new LobbyMember(this.members.length);
        this.members.push(lobbyMember);

        client.lobby = this;
        client.member = lobbyMember;

        this.notifyNewMember(client);
        this.sendMembersList(client);
    }

    leaveLobby(client){
        let clientPosition = client.member.position;
        this.members.splice(clientPosition, clientPosition);
        this.notifyMemberLeft(client);
    }

    changeCharacter(client, character){
        client.member.character = character;
        this.notifyCharacterChange(client);
    }


    leaveAllRooms(client) {
        let rooms = client.rooms;
        for (let key in rooms) {
            let roomid = rooms[key];
            client.leave(roomid);
        }
    }


    toggleReady(client){

        client.member.toggleReady();
        this.notifyMemberReadyChange(client);

        if(this.isReady()){
            this.isStarted = true;
            if(!this.loadTimeOut);
            this.loadTimeOut = setTimeout( () => {
                this.createGame();
                this.triggerLoad();
                this.loadTimeOut = null;
            }, 3000);
        }
    }

    sendMembersList(client){
        client.emit('alllobbymembers', this.members);
    }
    notifyMemberLeft(client){
        client.broadcast.to(this.id).emit('memberleft', {position: client.member.position });
    }
    notifyNewMember(client){
        client.broadcast.to(this.id).emit('newmember', {position: client.member.position, isReady: client.member.isReady, character: client.member.character });
    }

    notifyCharacterChange(client){
        io.sockets.in(this.id).emit('characterchange', {position:client.member.position, character: client.member.character})
    }

    notifyMemberReadyChange(client){
        io.sockets.in(this.id).emit('playerready', {position: client.member.position, isReady: client.member.isReady});
    }

    isFull(){
        return (this.members.length === lobbySize)
    }

    isReady(){
        if(this.members.length < 2) return;

        for(let key in this.members){
            let member = this.members[key];
            if(member.isReady != true){
                return false;
            }
        }

        return true;
    }

    createGame(){
        this.game = gameManager.createNewGame(this);
    }

    triggerLoad(){
        io.sockets.in(this.id).emit("loadgame");
    }

    joinGame(client){
        let playerPosition = this.gameJoinedIncrementor;
        client.game = this.game;
        client.player = this.game.players[playerPosition];
        this.gameJoinedIncrementor++
    }
}

class LobbyMember{
    constructor(position){
        this.isReady = false;
        this.position = position;
        this.character = "BIG"
    }
    toggleReady(){
        this.isReady = !this.isReady;
        return this.isReady;
    }
}

module.exports = {lobbyManager};