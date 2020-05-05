var Client = {};
//Client.socket = io('http://localhost:55000');

Client = {
    listenersSet: false,
    start: function(ip, socket){
        Client.socket = io('http://' + ip + ":" + socket);
        this.setListeners();

    },
    sendMove: function (direction){
        Client.socket.emit('move', {direction:direction});
    },
    sendChangeCharacter: function(characterID){
        Client.socket.emit("changecharacter", {character: characterID});
    },
    askGameConnect:  function(){
        Client.socket.emit('gameconnect');
    },
    sendStopMove: function () {
        Client.socket.emit('stopmove');
    },
    askJoinLobby: function(){
        Client.socket.emit('joinlobby');
        // extend this by passing in lobby id or something
    },
    memberReadyToggle: function(){
        Client.socket.emit('playerreadytoggle');
    },
    setListeners:function(){
        if(this.listenersSet === true) return;
        this.listenersSet = true;

        Client.socket.on('newplayer',function(data){
            gameClient.addNewPlayer(data.id, data.characterID, data.x, data.y);
        });

        Client.socket.on('collisionplayer',function(data){
            gameClient.onCollisionPlayerBall(data.ball, data.player);
        });

        Client.socket.on('initgame',function(data){
            let players = data.players;
            let balls = data.balls;

            for(let key in players){
                let player = players[key];
                gameClient.addNewPlayer(player.id, player.characterID,player.x ,player.y);
            }
            for(let key in balls){
                let ball = balls[key];
                gameClient.addNewBall(key, ball.x, ball.y);
            }
        });

        Client.socket.on('move',function(data){
            gameClient.movePlayer(data.id,data.x,data.y);
        });

        Client.socket.on('remove',function(id){
            gameClient.removePlayer(id);
        });

        Client.socket.on('goalscored',function(data){
            gameClient.goalScored(data.id);
        });

        Client.socket.on('playerdeath',function(data){
            gameClient.playerDeath(data.id);
        });

        Client.socket.on('powerupcollected',function(){
            gameClient.powerUpCollected();
        });

        Client.socket.on('endgame',function(data){
            gameClient.endGame(data.id);
        });
        Client.socket.on('newball',function(data){
            gameClient.addNewBall(data.key, data.x,data.y);
        });


        Client.socket.on('moveball',function(data){
            gameClient.moveBall(data.key, data.x, data.y);
        });

        Client.socket.on('loadgame',function(data){
            lobbyClient.triggerGame();
        });


        Client.socket.on('newmember',function(data){
            lobbyClient.newLobbyMember(data.position, data.isReady, data.character);
        });

        Client.socket.on('playerready', function(data){
            lobbyClient.memberReadied(data.position, data.isReady);
        });

        Client.socket.on('characterchange', function (data) {
            lobbyClient.changeLobbyCharacter(data.position, data.character);
        });

        Client.socket.on('memberleft', function(data){
            lobbyClient.memberLeft(data.position);
        });


        Client.socket.on('spawnpowerup', function(data){
            gameClient.spawnPowerUp(data.x,data.y);
        });


        // this could target a specific lobby?
        Client.socket.on('alllobbymembers',function (data) {
            console.log('alllobbymemebrs');
            for(let key in data){
                let member = data[key];
                lobbyClient.newLobbyMember(key, member.isReady, member.character, member.position);
            }
        });

    }
};

const lobbyClient = {
    setScene: function(scene){
        this.scene = scene;
        Client.askJoinLobby();
    },
    triggerGame: function(){
        this.scene.triggerGameLoad();
    },
    changeLobbyCharacter: function(position,character) {
        this.scene.changeLobbyCharacter(position,character);
    },
    memberReadied: function(position, isReady, ){
        this.scene.lobbyMemberReadied(position,isReady);
    },
    newLobbyMember: function(pos, isReady, character)  {
        this.scene.newLobbyMember(pos, isReady, character);
    },
    memberLeft: function (pos) {
        this.scene.removeLobbyMember(pos);
    }
};


const gameClient =  {
    setScene: function(scene){
        this.scene = scene;
        console.log(scene);
        Client.askGameConnect();
    },

    addNewPlayer: function(id, character, x, y){
        console.log(character);
        this.scene.addNewPlayer(id, character, x, y);
    },

    movePlayer: function(id,x,y){
        this.scene.movePlayer(id, x, y);
    },

    goalScored: function(id){
        this.scene.goalScored(id);
    },
    powerUpCollected: function(){
      this.scene.collectPowerUp();
    },

    playerDeath: function(id){
        this.scene.killPlayer(id);
    },

    endGame: function(winnerId){
        this.scene.endGame(winnerId);
    },

    addNewBall: function(key, x, y){
        this.scene.spawnBall(key, x, y);
    },
    moveBall: function(key, x, y){
        this.scene.moveBall(key, x, y);
    },

    onCollisionPlayerBall: function(ball, player){
        this.scene.onCollisionPlayerBall(ball, player);
    },
    spawnPowerUp: function(x,y){
        this.scene.spawnPowerUp(x,y);
        console.log("spawning powerup");
        console.log(`${x},${y}`);
    }
};



