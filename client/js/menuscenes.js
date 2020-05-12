const textStyles = {
  "title": {
    fill: '#222',
    fontFamily: "monster_font",
    fontSize: "84px",
  },
  "header": {
    fill: '#222',
    fontFamily: "monster_font",
    fontSize: "54px",
  },
  "button": {
    fill: '#fff',
    fontFamily: "arial",
    fontSize: "32px",
  },
  "menu-cards": {
    fill: '#444',
    fontFamily: "monster_font",
    fontSize: "32px",
  },

  "list-item": {
    fill: '#333',
    fontFamily: "monster_font",
    fontSize: "16px",
  },
  "list-header": {
    fill: '#555',
    fontFamily: "monster_font",
    fontSize: "18px",
  },
  "toggle-label": {
    fill: '#000',
    fontFamily: "arial",
    fontSize: "18px",
  }
};

const characters = { "Big": {}, "Medium": {}, "Small": {} };
const charactersArray = ["BIG", "MEDIUM", "SMALL"];
var HUDBaseDepth = 10;

const sounds = {};
let deathSounds;
let volume = 1;

/* INITIAL SCENE */
class LandingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'landing' });
  }

  preload() {
    this.load.html('serverSocketInput', 'assets/text/serverSocketInput.html');

    // menu
    this.load.image('playButton', 'assets/ui/playButton.png');
    this.load.image('UILeft', 'assets/ui/arrowLeft.png');
    this.load.image('UIRight', 'assets/ui/arrowRight.png');
    this.load.image('tick', 'assets/ui/tick.png');
    this.load.image('untick', 'assets/ui/untick.png');
    this.load.image('logo', 'assets/ui/logo.png');
    this.load.image('SMALL', 'assets/ui/zippy.png');
    this.load.image('BIG', 'assets/ui/slug.png');
    this.load.image('MEDIUM', 'assets/ui/clad.png');

    // arena
    this.load.image('sand', 'assets/backdrops/sand.png');
    this.load.image('grass', 'assets/backdrops/grass.png');
    this.load.image('metalPosts', 'assets/backdrops/metalPosts.png');
    this.load.image('treePosts', 'assets/backdrops/treePosts.png');
    this.load.image('doodad1', 'assets/backdrops/doodad1.png');
    this.load.image('doodad2', 'assets/backdrops/doodad2.png');
    this.load.image('doodad3', 'assets/backdrops/doodad3.png');
    this.load.image('doodad4', 'assets/backdrops/doodad4.png');
    this.load.image('doodad5', 'assets/backdrops/doodad5.png');
    this.load.image('doodad6', 'assets/backdrops/doodad6.png');
    this.load.image('doodad7', 'assets/backdrops/doodad7.png');
    this.load.image('doodad8', 'assets/backdrops/doodad8.png');
    this.load.image('doodad9', 'assets/backdrops/doodad9.png');
    this.load.image('doodad10', 'assets/backdrops/doodad10.png');
    this.load.image('doodad11', 'assets/backdrops/doodad11.png');

    // sprites
    this.load.image('ball', 'assets/sprites/images/ball.png');
    this.load.image('eye', 'assets/sprites/images/eye.png');
    this.load.atlasXML('zippyMiddle', 'assets/sprites/images/ZippyMiddle.png', 'assets/sprites/xml/ZippyMiddle.xml');
    this.load.atlasXML('zippyLeft', 'assets/sprites/images/ZippyLeft.png', 'assets/sprites/xml/ZippyLeft.xml');
    this.load.atlasXML('zippyRight', 'assets/sprites/images/ZippyRight.png', 'assets/sprites/xml/ZippyRight.xml');
    this.load.atlasXML('slimeMiddle', 'assets/sprites/images/SlimeMiddle.png', 'assets/sprites/xml/SlimeMiddle.xml');
    this.load.atlasXML('slimeLeft', 'assets/sprites/images/slimeLeft.png', 'assets/sprites/xml/slimeLeft.xml');
    this.load.atlasXML('slimeRight', 'assets/sprites/images/slimeRight.png', 'assets/sprites/xml/slimeRight.xml');
    this.load.atlasXML('metalMiddle', 'assets/sprites/images/MetalMiddle.png', 'assets/sprites/xml/MetalMiddle.xml');
    this.load.atlasXML('metalLeft', 'assets/sprites/images/metalLeft.png', 'assets/sprites/xml/metalLeft.xml');
    this.load.atlasXML('metalRight', 'assets/sprites/images/metalRight.png', 'assets/sprites/xml/metalRight.xml');
    this.load.atlasXML('socket', 'assets/sprites/images/socket.png', 'assets/sprites/xml/socket.xml');
    this.load.atlasXML('multiball', 'assets/sprites/images/multiball.png', 'assets/sprites/xml/multiball.xml');

    // audio
    this.load.audio('beep', 'assets/audio/beep.wav');
    this.load.audio('wilhelm', 'assets/audio/wilhelm.wav');
    this.load.audio('powerup', 'assets/audio/powerup.wav');
    this.load.audio('pong', 'assets/audio/pong.wav');
    this.load.audio('goal', 'assets/audio/goal.wav');
    this.load.audio('music', 'assets/audio/loop.wav');
    this.load.audio('death1', 'assets/audio/death1.wav');
    this.load.audio('death2', 'assets/audio/death2.wav');
    this.load.audio('death3', 'assets/audio/death3.wav');
    this.load.audio('firstblood', 'assets/audio/firstblood.wav');
  }

  createAnimation(key, repeat, frameRate, spriteSheet, animationName, startFrame, endFrame, yoyo) {
    this.anims.create({
      key: key,
      repeat: repeat,
      frameRate: frameRate,
      yoyo: (yoyo || false),
      frames: this.anims.generateFrameNames(spriteSheet, {
        prefix: animationName,
        suffix: '',
        start: startFrame,
        end: endFrame
      })
    });
  }

  create() {
    // sprite animations
    this.createAnimation('slimeMiddleLeft', -1, 5, 'slimeMiddle', 'SlimeMiddle', 0, 1);
    this.createAnimation('slimeMiddleIdle', -1, 5, 'slimeMiddle', 'SlimeMiddle', 1, 1);
    this.createAnimation('slimeMiddleRight', -1, 5, 'slimeMiddle', 'SlimeMiddle', 1, 2);
    this.createAnimation('slimeLeftLeft', -1, 5, 'slimeLeft', 'SlimeLeft', 0, 1);
    this.createAnimation('slimeLeftIdle', -1, 5, 'slimeLeft', 'SlimeLeft', 1, 1);
    this.createAnimation('slimeLeftRight', -1, 5, 'slimeLeft', 'SlimeLeft', 1, 2);
    this.createAnimation('slimeRightLeft', -1, 5, 'slimeRight', 'SlimeRight', 0, 1);
    this.createAnimation('slimeRightIdle', -1, 5, 'slimeRight', 'SlimeRight', 1, 1);
    this.createAnimation('slimeRightRight', -1, 5, 'slimeRight', 'SlimeRight', 1, 2);

    this.createAnimation('zippyMiddleLeft', -1, 20, 'zippyMiddle', 'ZippyMiddle', 0, 1);
    this.createAnimation('zippyMiddleIdle', -1, 20, 'zippyMiddle', 'ZippyMiddle', 1, 1);
    this.createAnimation('zippyMiddleRight', -1, 20, 'zippyMiddle', 'ZippyMiddle', 1, 2);
    this.createAnimation('zippyLeftLeft', -1, 20, 'zippyLeft', 'ZippyLeft', 0, 1);
    this.createAnimation('zippyLeftIdle', -1, 20, 'zippyLeft', 'ZippyLeft', 1, 1);
    this.createAnimation('zippyLeftRight', -1, 20, 'zippyLeft', 'ZippyLeft', 1, 2);
    this.createAnimation('zippyRightLeft', -1, 20, 'zippyRight', 'ZippyRight', 0, 1);
    this.createAnimation('zippyRightIdle', -1, 20, 'zippyRight', 'ZippyRight', 1, 1);
    this.createAnimation('zippyRightRight', -1, 20, 'zippyRight', 'ZippyRight', 1, 2);

    this.createAnimation('metalMiddleLeft', -1, 5, 'metalMiddle', 'MetalMiddle', 0, 1);
    this.createAnimation('metalMiddleIdle', -1, 5, 'metalMiddle', 'MetalMiddle', 1, 1);
    this.createAnimation('metalMiddleRight', -1, 5, 'metalMiddle', 'MetalMiddle', 1, 2);
    this.createAnimation('metalLeftLeft', -1, 5, 'metalLeft', 'MetalLeft', 0, 2);
    this.createAnimation('metalLeftIdle', -1, 5, 'metalLeft', 'MetalLeft', 2, 2);
    this.createAnimation('metalLeftRight', -1, 5, 'metalLeft', 'MetalLeft', 2, 4);
    this.createAnimation('metalRightLeft', -1, 5, 'metalRight', 'MetalRight', 0, 2);
    this.createAnimation('metalRightIdle', -1, 5, 'metalRight', 'MetalRight', 2, 2);
    this.createAnimation('metalRightRight', -1, 5, 'metalRight', 'MetalRight', 2, 4);

    this.createAnimation('multiball', -1, 5, 'multiball', 'multiball', 0, 3);

    // setup menu
    new Background(this, 0);

    let title = this.add.text(gameCenterX(), gameCenterY() - 100, 'Ultra Death', textStyles.header);
    let title2 = this.add.text(gameCenterX(), gameCenterY() - 45, 'Monster', textStyles.header);
    let title3 = this.add.text(gameCenterX(), gameCenterY() + 10, 'Pong', textStyles.header);

    offsetByWidth(title);
    offsetByWidth(title2);
    offsetByWidth(title3);

    let playBtnAction = () => {
      this.startClient();
      // error handle fained connection in lobby switch
      this.scene.start("lobbyselection");
    };

    let playBtn = new ImageButton(
      gameCenterX(),
      game.config.height - 55,
      "playButton",
      this,
      playBtnAction,
      "Connect"
    );

    offsetByWidth(playBtn);

    // audio
    deathSounds = [
      { key: 'wilhelm', name: 'death0' },
      { key: 'death1', name: 'death1' },
      { key: 'death2', name: 'death2' },
      { key: 'death3', name: 'death3' }
    ];

    deathSounds.forEach((sound) => {
      sounds[sound.name] = game.sound.add(sound.key);
    });

    // add to global
    sounds["beep"] = game.sound.add('beep');
    sounds["firstblood"] = game.sound.add('firstblood');
    sounds["powerup"] = game.sound.add('powerup');
    sounds["pong"] = game.sound.add('pong');
    sounds["goal"] = game.sound.add('goal');
    sounds["music"] = game.sound.add('music');
    sounds["music"].loop = true;

    this.ipInputForm = this.add.dom(400, 600).createFromCache('serverSocketInput');
  }

  startClient() {
    let hostField = this.ipInputForm.getChildByName('ip');
    let socketField = this.ipInputForm.getChildByName('socket');
    this.socket = socketField.value;

    this.ip = hostField.value;

    client.start(this.ip, this.socket);
  }

  update() { }
}

/* SELECT LOBBY SCENE */
class LobbySelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'lobbyselection' });
  }

  create() {
    new Background(this, 0);
    let title = this.add.text(gameCenterX(), gameCenterY(), 'LobbySelection - Stubbed', textStyles.header);
    offsetByWidth(title);

    let playBtnAction = () => {
      this.scene.start("lobby");
    };

    let playBtn = new ImageButton(
      gameCenterX(),
      game.config.height - 55,
      "playButton",
      this,
      playBtnAction,
      "Quick Join"
    );
    offsetByWidth(playBtn);
  }

  update() { }
}

var Lobby = {};

/* UI ELEMENT FOR MEMBER LIST */
class LobbyCard {
  constructor(x, y, scene, isReady, character) {
    this.readyText = scene.add.text(x, y, 'not ready', textStyles["list-header"]);
    this.playerText = scene.add.text(x - 150, y, 'playerimage', textStyles["menu-cards"]);
    this.readyState = isReady;
    this.character = character;
  }

  set readyState(val) {
    this.isReady = val;
    if (val) {
      this.readyText.text = "ready";
    }
    else {
      this.readyText.text = "not ready";
    }
  }

  set character(val) {
    this.selectedCharacter = val;
    this.playerText.text = this.getCharacterName(val);
  }

  set y(val) {
    this.readyText.y = val;
    this.playerText.y = val;
  }

  getCharacterName(val) {
    switch (val) {
      case "BIG": return "Slug";
      case "MEDIUM": return "Clad";
      case "SMALL": return "Zippy";
    }
    return "no name";
  }

  destroy() {
    this.readyText.destroy();
    this.playerText.destroy();
  }
}

/* JOINED LOBBY SCENE */
class LobbyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'lobby' });
    this.selectedCharacter = 0;
    this.doodads = 3;
    let listPos = gameCenterY() - 150;
    let cardOffset = 45;
    this.memberPositions = [listPos, listPos + cardOffset, listPos + (cardOffset * 2), listPos + (cardOffset * 3)]
  }

  create() {
    this.joinLobby();

    new Background(this, 0);

    this.lobbyCards = [];

    let header = this.add.text(gameCenterX(), gameCenterY() - 350, 'Lobby', textStyles.header);
    offsetByWidth(header);

    let playBtnAction = () => {
      client.memberReadyToggle();
    };

    this.playBtn = new ImageButton(
      game.config.width - 100,
      game.config.height - 55,
      "playButton",
      this,
      playBtnAction,
      "PLAY"
    );
    offsetByWidth(this.playBtn);

    this.createToggleButtons();
    this.createCharacterSelectionControls();
  }

  createToggleButtons() {
    // mute audio - make checkbox sprites and button
    let audioUntick = this.add.sprite(game.config.width - 250, 50, 'untick').setScale(0.2);
    let audioTick = this.add.sprite(game.config.width - 250, 50, 'tick').setScale(0.2);

    // use current volume for visibility
    audioTick.alpha = volume ? 0 : 1;

    let muteBtnAction = () => {
      audioTick.alpha = audioTick.alpha ? 0 : 1;
      setTimeout(() => {
        volume = volume ? 0 : 1;
        game.sound.volume = volume;
      }, sounds["beep"].duration + 500); // always mute after duration
    };

    let muteBtn = new ImageButton(
      game.config.width - 125,
      55,
      "playButton",
      this,
      muteBtnAction,
      "Mute"
    );

    // hide doodads - make checkbox sprites and button
    let doodadUntick = this.add.sprite(game.config.width - 250, 100, 'untick').setScale(0.2);
    let doodadTick = this.add.sprite(game.config.width - 250, 100, 'tick').setScale(0.2);

    doodadTick.alpha = this.doodads ? 1 : 0;

    let doodadBtnAction = () => {
      doodadTick.alpha = doodadTick.alpha ? 0 : 1;
      setTimeout(() => {
        this.doodads = doodadTick.alpha ? 3 : 0;
      }, sounds["beep"].duration + 500);

    };

    let doodadBtn = new ImageButton(
      game.config.width - 125,
      105,
      "playButton",
      this,
      doodadBtnAction,
      "Doodads"
    );
  }

  removeLobbyMember(pos) {
    let card = this.lobbyCards[pos];
    this.lobbyCards.splice(pos, 1);
    card.destroy();
  }

  newLobbyMember(pos, isReady, character) {
    let newCard = new LobbyCard(gameCenterX(), this.memberPositions[pos], this, isReady, character);
    this.lobbyCards[pos] = newCard;
  }

  changeLobbyCharacter(position, character) {
    let lobbyCard = this.lobbyCards[position];
    lobbyCard.character = character;
  }

  lobbyMemberReadied(position, isReady) {
    let memberCard = this.lobbyCards[position].readyState = isReady;
  }

  triggerGameLoad() {
    Game.triggerGame = null;
    this.scene.start("maingame", { doodads: this.doodads });
    this.playBtn.active = false;
  }

  joinLobby() {
    if (this.lobbyCards) this.removeLobbyCards();
    this.listPos = gameCenterY() - 150;
    lobbyClient.setScene(this);
  }

  removeLobbyCards() {
    for (let key in this.lobbyCards) {
      this.lobbyCards[key].destroy();
      delete this.lobbyCards[key]
    }
  }

  createCharacterSelectionControls() {
    this.selectedCharacter = 0;
    this.selectedCharacterImage = this.add.image(gameCenterX(), game.config.height - 200, `${charactersArray[this.selectedCharacter]}`);
    this.selectedCharacterImage.setScale(0.8);

    let leftButtonAction = () => {
      // error handle fained connection in lobby switch
      this.selectCharacter(-1);
    };

    let leftButton = new ImageButton(
      gameCenterX() - 200,
      game.config.height - 200,
      "UILeft",
      this,
      leftButtonAction
    );

    let rightButtonAction = () => {
      this.selectCharacter(+1);
    };

    let rightButton = new ImageButton(
      gameCenterX() + 200,
      game.config.height - 200,
      "UIRight",
      this,
      rightButtonAction
    );
  }

  selectCharacter(direction) {
    this.selectedCharacter = this.selectedCharacter + direction;
    if (this.selectedCharacter < 0) this.selectedCharacter = charactersArray.length - 1;
    if (this.selectedCharacter > charactersArray.length - 1) this.selectedCharacter = 0;
    this.changeCharacter();
  }

  changeCharacter() {
    let characterMapKey = charactersArray[this.selectedCharacter]
    this.selectedCharacterImage.setTexture(`${charactersArray[this.selectedCharacter]}`);

    client.sendChangeCharacter(characterMapKey);
  }

  update() { }
}

/* CUSTOM BUTTON CLASS */
class ImageButton {
  // final 2 parameters are optional
  constructor(xPos, yPos, imageRef, scene, action, text, buttonIcon) {
    // create the image defined
    this.newBtn = scene.add.image(xPos, yPos, imageRef);
    this.initialTint = -1;

    // if instantiated with text option create a text UI  object
    if (text && text.length > 0) {
      this.newTxt = scene.add.text(xPos, yPos, text, textStyles.button);

      // offset by its height and width in order to centre it in the middle of the button
      offsetByHeight(this.newTxt);
      offsetByWidth(this.newTxt);

      this.newTxt.depth = HUDBaseDepth + 2;
    }

    // create a button icon if instantiated with a reference
    if (buttonIcon) {
      this.btnIcon = scene.add.image(xPos, yPos, buttonIcon);
      this.btnIcon.depth = HUDBaseDepth + 2;
    }

    this.newBtn.setInteractive();
    this.newBtn.depth = HUDBaseDepth + 1;

    // add a call to the defined action to DOM click event
    this.newBtn.on('pointerdown', () => {
      sounds["beep"].play();
      action();
    });

    // show the player the click action will be performed on this button
    this.newBtn.on('pointerover', (pointer) => {
      if (this.btnIcon) this.btnIcon.tint = 0xeeeeee;
      this.newBtn.tint = 0xeeeeee;
    });

    // reset the tint to the base one, allow external control for example on settings screen
    this.newBtn.on('pointerout', (pointer) => {
      this.newBtn.tint = this.initialTint;
    });

    return this;
  }

  // hide and show both text and image components of the button
  set visible(isVisible) {
    if (this.newTxt) this.newTxt.visible = isVisible;
    if (this.btnIcon) this.btnIcon.visibile = isVisible;

    this.newBtn.visible = isVisible;

  }

  // allow the base tint to be change externaly and propergate to memeber variables
  set baseTint(tint) {
    this.initialTint = tint;
    this.newBtn.tint = tint;
  }

  get baseTint() {
    return this.initialTint;
  }

  // disable all components of the button
  set active(isActive) {
    if (this.newTxt) this.newTxt.active = isActive;
    if (this.btnIcon) this.btnIcon.active = isActive;
    this.newBtn.active = isActive;
  }

  // rescale all components of the button
  set scale(scale) {
    if (this.btnIcon) { this.btnIcon.size(scale) };
    this.newBtn.setScale(scale);
  }

  // reset the tint to no tint
  resetTint() {
    this.baseTint = -1;
    this.newBtn.tint = this.baseTint;
  }

  destroy() {
    this.newBtn.destroy();
    if (this.btnIcon)
      this.btnIcon.destroy();

    if (this.newTxt)
      this.newTxt.destroy();
  }
}

// UI helper functions
function offsetByHeight(UIObject) {
  UIObject.y = UIObject.y - (UIObject.height / 2)
}

function offsetByWidth(UIObject) {
  UIObject.x = UIObject.x - (UIObject.width / 2)
}

function gameCenterX() {
  return game.config.width / 2;
}

function gameCenterY() {
  return game.config.height / 2;
}