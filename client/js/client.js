//var Client = {};

const client = {
  listenersSet: false,
  start: function (ip, socket) {
    client.socket = io('http://' + ip + ":" + socket);
    this.setListeners();
  },
  sendMove: function (direction) {
    client.socket.emit('move', { direction: direction });
  },
  sendChangeCharacter: function (characterID) {
    client.socket.emit("changecharacter", { character: characterID });
  },
  askGameConnect: function () {
    client.socket.emit('gameconnect');
  },
  sendStopMove: function () {
    client.socket.emit('stopmove');
  },
  askJoinLobby: function () {
    client.socket.emit('joinlobby');
  },
  memberReadyToggle: function () {
    client.socket.emit('playerreadytoggle');
  },
  setListeners: function () {
    if (this.listenersSet === true) return;
    this.listenersSet = true;

    client.socket.on('newplayer', function (data) {
      gameClient.addNewPlayer(data.id, data.characterID, data.x, data.y);
    });

    client.socket.on('collisionplayer', function (data) {
      gameClient.onCollisionPlayerBall(data.ball, data.player);
    });

    client.socket.on('initgame', function (data) {
      let players = data.players;
      let balls = data.balls;

      for (let key in players) {
        let player = players[key];
        gameClient.addNewPlayer(player.id, player.characterID, player.x, player.y);
      }
      for (let key in balls) {
        let ball = balls[key];
        gameClient.addNewBall(key, ball.x, ball.y);
      }
    });

    client.socket.on('move', function (data) {
      gameClient.movePlayer(data.id, data.x, data.y);
    });

    client.socket.on('remove', function (id) {
      gameClient.removePlayer(id);
    });

    client.socket.on('goalscored', function (data) {
      gameClient.goalScored(data.id);
    });

    client.socket.on('playerdeath', function (data) {
      gameClient.playerDeath(data.id);
    });

    client.socket.on('powerupcollected', function () {
      gameClient.powerUpCollected();
    });

    client.socket.on('endgame', function (data) {
      gameClient.endGame(data.id);
    });

    client.socket.on('newball', function (data) {
      gameClient.addNewBall(data.key, data.x, data.y);
    });

    client.socket.on('moveball', function (data) {
      gameClient.moveBall(data.key, data.x, data.y);
    });

    client.socket.on('loadgame', function (data) {
      lobbyClient.triggerGame();
    });

    client.socket.on('newmember', function (data) {
      lobbyClient.newLobbyMember(data.position, data.isReady, data.character);
    });

    client.socket.on('playerready', function (data) {
      lobbyClient.memberReadied(data.position, data.isReady);
    });

    client.socket.on('characterchange', function (data) {
      lobbyClient.changeLobbyCharacter(data.position, data.character);
    });

    client.socket.on('memberleft', function (data) {
      lobbyClient.memberLeft(data.position);
    });

    client.socket.on('spawnpowerup', function (data) {
      gameClient.spawnPowerUp(data.x, data.y);
    });

    client.socket.on('alllobbymembers', function (data) {
      for (let key in data) {
        let member = data[key];
        lobbyClient.newLobbyMember(key, member.isReady, member.character, member.position);
      }
    });
  }
};

const lobbyClient = {
  setScene: function (scene) {
    this.scene = scene;
    client.askJoinLobby();
  },
  triggerGame: function () {
    this.scene.triggerGameLoad();
  },
  changeLobbyCharacter: function (position, character) {
    this.scene.changeLobbyCharacter(position, character);
  },
  memberReadied: function (position, isReady, ) {
    this.scene.lobbyMemberReadied(position, isReady);
  },
  newLobbyMember: function (pos, isReady, character) {
    this.scene.newLobbyMember(pos, isReady, character);
  },
  memberLeft: function (pos) {
    this.scene.removeLobbyMember(pos);
  }
};


const gameClient = {
  setScene: function (scene) {
    this.scene = scene;
    client.askGameConnect();
  },
  addNewPlayer: function (id, character, x, y) {
    this.scene.addNewPlayer(id, character, x, y);
  },
  movePlayer: function (id, x, y) {
    this.scene.movePlayer(id, x, y);
  },
  goalScored: function (id) {
    this.scene.goalScored(id);
  },
  powerUpCollected: function () {
    this.scene.collectPowerUp();
  },
  playerDeath: function (id) {
    this.scene.killPlayer(id);
  },
  endGame: function (winnerId) {
    this.scene.endGame(winnerId);
  },
  addNewBall: function (key, x, y) {
    this.scene.spawnBall(key, x, y);
  },
  moveBall: function (key, x, y) {
    this.scene.moveBall(key, x, y);
  },
  onCollisionPlayerBall: function (ball, player) {
    this.scene.onCollisionPlayerBall(ball, player);
  },
  spawnPowerUp: function (x, y) {
    this.scene.spawnPowerUp(x, y);
  }
};