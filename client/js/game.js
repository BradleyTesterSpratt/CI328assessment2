var Game = {};

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'maingame' });
    this.balls = {};
    this.ballTrailParticles = [];
    this.firstBlood = false;
  }

  init(data) {
    this.doodads = data.doodads;
  }

  create() {
    gameClient.setScene(this);

    Game.playerMap = {};

    var leftKey = this.input.keyboard.addKey("LEFT");
    var rightKey = this.input.keyboard.addKey("RIGHT");

    leftKey.on('down', function (event) {
      Client.sendMove(-1);
    });

    rightKey.on('down', function (event) {
      Client.sendMove(1);
    });

    leftKey.on('up', function (event) {
      Client.sendStopMove();
    });

    rightKey.on('up', function (event) {
      Client.sendStopMove();
    });

    this.characters = {
      "BIG": { size: 6, eyes: 4, colour: 0x00ffff, type: 'slime' },
      "MEDIUM": { size: 3, eyes: 3, colour: null, type: 'metal' },
      "SMALL": { size: 1, eyes: 4, colour: 0x00FF00, type: 'zippy' }
    }

    // set number of doodads with option menu, default at 3
    new Background(this, this.doodads);

    // remove any possible leftover trails
    this.removeTrails();

    sounds["music"].play();
  }

  spawnBall(key, x, y) {
    let newBall = this.add.sprite(x, y, "ball");
    this.balls[key] = newBall;
    newBall.newx = x;
    newBall.newy = y;

    this.createBallTrail(newBall);

    newBall.update = () => {
      newBall.x = newBall.newx;
      newBall.y = newBall.newy;
    }
  }

  spawnPowerUp(x, y) {
    this.powerUp = this.add.sprite(x, y, "multiball");
    this.powerUp.anims.play("multiball", true);
  }

  collectPowerUp() {
    this.powerUp.destroy();

    sounds["powerup"].play();
  }

  createBallTrail(ball) {
    let particles = this.add.particles('ball');
    particles.setDepth(2);

    let ballTrail = particles.createEmitter({
      x: 0,
      y: 0,
      on: true,
      follow: ball,
      speed: { min: -100, max: 100 },
      angle: { min: -120, max: -60 },
      lifespan: { min: 80, max: 200 },
      blendMode: 'ADD',
      scale: { start: 0.7, end: 0.1 },
      quantity: 1,
    });

    this.ballTrailParticles.push(particles);
  }

  goalScored(id) {
    let player = Game.playerMap[id];
    player.loseLife();

    if (!this.firstBlood) { this.firstBlood = true; sounds["firstblood"].play(); }

    sounds["goal"].play();
  }

  killPlayer(id) {
    let player = Game.playerMap[id];
    this.removePlayer(id);

    // 10% chance of wilhelm scream (0)
    let max = 9;
    let min = 0;
    let rand = Math.floor(Math.random() * (max - min + 1)) + min; // inclusive

    if (rand > 0) {
      // not wilhelm, choose between others
      max = deathSounds.length - 1;
      min = 1;
      rand = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let file = 'death' + rand;

    sounds[file].play();
  }

  endGame(winnerID) {
    let winnerNumber = winnerID + 1;
    this.winText = this.add.text(gameCenterX(), gameCenterY(), `Player ${winnerNumber} wins!!`, textStyles.header);
    offsetByWidth(this.winText);

    let playBtnAction = () => {
      this.scene.switch("lobby");
      this.cleanGameScene();
    };

    this.playBtn = new ImageButton(
      gameCenterX() - 155,
      game.config.height - 55,
      "playButton",
      this,
      playBtnAction,
      "Again?"
    );

    let lobbySelectionBtnAction = () => {
      // error handle fained connection in lobby switch
      this.scene.switch("lobbyselection");
      this.cleanGameScene();
      this.scene.stop("maingame");
    };

    this.lobbySelectionBtn = new ImageButton(
      gameCenterX() + 155,
      game.config.height - 55,
      "playButton",
      this,
      lobbySelectionBtnAction,
      "Selection"
    );

    sounds["music"].stop();
  }

  cleanGameScene() {
    this.winText.destroy();
    this.playBtn.destroy();
    this.lobbySelectionBtn.destroy();
    this.removeTrails();
  }

  removeTrails() {
    this.ballTrailParticles.forEach((trail) => {
      if (trail) trail.emitters.first.remove();
    });
    this.ballTrailParticles = [];
  }

  onCollisionPlayerBall(ball, player) {
    sounds["pong"].play();
  }

  moveBall(key, x, y) {
    let ball = this.balls[key];
    ball.newx = x;
    ball.newy = y;
  }

  preload() { }

  update() {
    for (let ballKey in this.balls) {
      let ball = this.balls[ballKey];
      ball.update();
    }

    for (let playerKey in Game.playerMap) {
      let player = Game.playerMap[playerKey];
      player.update();
    }
  }

  addNewPlayer(id, character, x, y) {
    if (Game.playerMap[id]) {
      //
    } else {
      let selectedCharacter = character.toUpperCase();
      let newPlayer = new Player(this, this.characters[selectedCharacter], x, y);
      Game.playerMap[id] = newPlayer;

      newPlayer.newx = x;
      newPlayer.newy = y;

      newPlayer.update = function () {
        this.x = this.newx;
        this.y = this.newy;
      }
    }
  }

  movePlayer(id, x, y) {
    let player = Game.playerMap[id];
    player.move(x, y);
  }

  removePlayer(id) {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
  }
}

