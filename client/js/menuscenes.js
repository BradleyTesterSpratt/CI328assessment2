const textStyles = {
    "header":{
        fill: '#777',
        fontFamily: "arial",
        fontSize: "48px",
    },
    "button":{
        fill: '#999',
        fontFamily: "arial",
        fontSize: "32px",
    },
    "list-item":{
        fill: '#222',
        fontFamily: "arial",
        fontSize: "16px",
    },
    "list-header":{
        fill: '#333',
        fontFamily: "arial",
        fontSize: "18px",
    }

};
//https://www.kenney.nl/assets/game-icons
const characters = {"Big":{},"Medium":{}, "Small":{}};  // probably store this somewhere more relevant
const charactersArray = ["BIG","MEDIUM", "SMALL"]; //temp this could be constructed by the characters map or somehtign
var HUDBaseDepth = 10;

// audio
const sounds = {};
let deathSounds;
let volume = 1;

// consider making this screens a generic class
class LandingScene extends Phaser.Scene {
    constructor(){
        super({key: 'landing'});
    }
    preload(){
        this.load.image('playButton', 'assets/ui/playButton.png');
        this.load.image('UILeft', 'assets/ui/arrowLeft.png');
        this.load.image('UIRight', 'assets/ui/arrowRight.png');
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
        this.load.image('ball', 'assets/sprites/images/ball.png');
        this.load.image('eye', 'assets/sprites/images/eye.png');
        this.load.image('tick', 'assets/ui/tick.png');
        this.load.image('untick', 'assets/ui/untick.png');
        this.load.image('logo', 'assets/ui/logo.png');
        this.load.image('SMALL', 'assets/ui/zippy.png');
        this.load.image('BIG', 'assets/ui/slug.png');
        this.load.image('MEDIUM', 'assets/ui/clad.png');
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

        // audio
        this.load.audio('beep', 'assets/audio/beep.wav');               // button press     - https://freesound.org/people/OwlStorm/sounds/404793/          (cc0)
        this.load.audio('wilhelm', 'assets/audio/wilhelm.wav');         // player death     - https://freesound.org/people/JarredGibb/sounds/219453/        (cc0)
        this.load.audio('powerup', 'assets/audio/powerup.wav');         // collect powerup  - https://freesound.org/people/OwlStorm/sounds/404770/          (cc0)
        this.load.audio('pong', 'assets/audio/pong.wav');               // hit ball         - https://freesound.org/people/NoiseCollector/sounds/4359/      (by)
        this.load.audio('goal', 'assets/audio/goal.wav');               // score goal       - https://freesound.org/people/GameAudio/sounds/220173/         (cc0)
        this.load.audio('music', 'assets/audio/loop.wav');              // bg music         - https://freesound.org/people/Elder_Imp/sounds/233047/         (cc0)
        this.load.audio('death1', 'assets/audio/death1.wav');           // death sound      - https://freesound.org/people/zglar/sounds/232289/             (by)
        this.load.audio('death2', 'assets/audio/death2.wav');           // death sound      - https://freesound.org/people/Michael%20Klier/sounds/318320/   (by)
        this.load.audio('death3', 'assets/audio/death3.wav');           // death sound      - https://freesound.org/people/bananplyte/sounds/452166/        (cc0)
        this.load.audio('firstblood', 'assets/audio/firstblood.wav');   // firstblood       - https://freesound.org/people/snaginneb/sounds/111489/         (cc0)
        
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
        
        new Background(this, 5);


        // let title = this.add.text(gameCenterX(), gameCenterY() - 350, 'Best Pong', textStyles.header);
        let title = this.add.image(gameCenterX(), gameCenterY(), 'logo');
        
        // offsetByWidth(title);
        //this.ip = 'localhost';
        this.socket = '55000';
        //this.socket ="";
        this.ip = "localhost";

        if(!clientStarted){
            Client.start(this.ip, this.socket);
            clientStarted = true;
        }

        // error handle fained connection in lobby switch make sure this has happended

        let playBtnAction = () => {
            // error handle fained connection in lobby switch
            this.scene.start("lobbyselection");
        };


        // create the button object, no need for an icon, or UI text
        let playBtn = new ImageButton(
            gameCenterX(),
            game.config.height - 55,
            "playButton",
            this,
            playBtnAction,
            "Connect"
            );
        offsetByWidth(playBtn);

        deathSounds = [
            {key: 'wilhelm', name: 'death0'},
            {key: 'death1', name: 'death1'},
            {key: 'death2', name: 'death2'},
            {key: 'death3', name: 'death3'}
        ];
        deathSounds.forEach((sound)=> {
            sounds[sound.name] = game.sound.add(sound.key);
        })
        // add audio to global property
        sounds["beep"] = game.sound.add('beep');
        sounds["firstblood"] = game.sound.add('firstblood');
        sounds["powerup"] = game.sound.add('powerup');
        sounds["pong"] = game.sound.add('pong');
        sounds["goal"] = game.sound.add('goal');
        sounds["music"] = game.sound.add('music');
        sounds["music"].loop = true;
        




    }

    update(){

    }
}

let clientStarted = false;

class LobbySelectionScene extends Phaser.Scene {
    constructor() {
        super({key: 'lobbyselection'});
    }

    create() {
        let title = this.add.text(gameCenterX(), gameCenterY(), 'LobbySelection - Stubbed', textStyles.header);
        offsetByWidth(title);
        new Background(this, 5);
        let playBtnAction =  () => {
           this.scene.start("lobby");
        };


        // create the button object, no need for an icon, or UI text
        let playBtn = new ImageButton(
            gameCenterX(),
            game.config.height - 55,
            "playButton",
            this,
            playBtnAction,
            "ignore this screen"
        );
        offsetByWidth(playBtn);
    }

    update(){

    }
}

var Lobby = {};


class LobbyCard {

    constructor(x,y,scene, isReady, character) {
        this.readyText = scene.add.text(x + 150, y, 'not ready', textStyles.header);
        this.playerText = scene.add.text(x - 150, y, 'playerimage', textStyles.header);
        this.readyState = isReady;
        this.character = character;
    }
    destroy(){
        this.readyText.destroy();
        this.playerText.destroy();
    }
    set readyState(val){
        this.isReady = val;
        if(val){
            this.readyText.text = "ready";
        }
        else{
            this.readyText.text = "not ready";
        }
    }

    set character(val){
        this.selectedCharacter = val;
        this.playerText.text = val;
    }
}


class LobbyScene extends Phaser.Scene {
    constructor() {
        super({key: 'lobby'});
        this.selectedCharacter = 0;
        this.doodads = 3;
    }

    create() {
        this.joinLobby();
        new Background(this, 5);

        this.lobbyCards =  [];
        this.listPos = gameCenterY() - 150;//temp

        let header = this.add.text(gameCenterX(), gameCenterY() - 350, 'Lobby', textStyles.header);
        offsetByWidth(header);

        let playBtnAction = () => {
            Client.memberReadyToggle();
        };

        // create the button object, no need for an icon, or UI text
        this.playBtn = new ImageButton(
            game.config.width -100,
            game.config.height - 55,
            "playButton",
            this,
            playBtnAction,
            "PLAY"
        );
        offsetByWidth(this.playBtn);

        // mute audio - make checkbox sprites and button
        let audioUntick = this.add.sprite(game.config.width - 120, 50, 'untick').setScale(0.2);
        let audioTick = this.add.sprite(game.config.width - 120, 50, 'tick').setScale(0.2);
        audioTick.alpha = volume ? 0 : 1; // use current volume
        let muteBtnAction = ()=> {
            audioTick.alpha = audioTick.alpha ? 0 : 1;
            setTimeout(()=> {
            volume = volume ? 0 : 1;
                game.sound.volume = volume;
            }, sounds["beep"].duration + 500); // always over duration

        };
        let muteBtn = new ImageButton(
            game.config.width - 125,
            55,
            undefined,
            this,
            muteBtnAction,
            "             Mute" // slightly overlay checkbox sprites with this button
        );

        let doodadUntick = this.add.sprite(game.config.width - 120, 100, 'untick').setScale(0.2);
        let doodadTick = this.add.sprite(game.config.width - 120, 100, 'tick').setScale(0.2);
        doodadTick.alpha = this.doodads ? 1 : 0;
        let doodadBtnAction = ()=> {
            doodadTick.alpha = doodadTick.alpha ? 0 : 1;
            setTimeout(()=> {
                this.doodads = doodadTick.alpha ? 3 : 0;
            }, sounds["beep"].duration + 500); // always over duration

        };
        let doodadBtn = new ImageButton(
            game.config.width - 125,
            105,
            undefined,
            this,
            doodadBtnAction,
            "             Doodads"
        );

        this.createCharacterSelectionControls();

    }

    newLobbyMember(pos, isReady, character){
        let newCard = new LobbyCard(gameCenterX(), this.listPos, this, isReady,  character);
        this.lobbyCards[pos] = newCard;
        this.listPos += 25;
    }

    changeLobbyCharacter(position, character){
        let lobbyCard = this.lobbyCards[position];
        lobbyCard.character = character;
    }

    lobbyMemberReadied(position, isReady){
        let memberCard = this.lobbyCards[position].readyState = isReady;
    }

    triggerGameLoad(){
        Game.triggerGame = null;
        this.scene.start("maingame", { doodads: this.doodads });
        this.playBtn.active = false;
    }

    joinLobby(){
        if(this.lobbyCards) this.removeLobbyCards();
        this.listPos = gameCenterY() - 150;
        lobbyClient.setScene(this);
    }

    removeLobbyCards(){
        for(let key in this.lobbyCards){
            this.lobbyCards[key].destroy();
            delete this.lobbyCards[key]
        }
    }
    createCharacterSelectionControls(){
        // this will probably be a sprite
        this.selectedCharacterImage = this.add.image(gameCenterX(), game.config.height - 200, `${charactersArray[this.selectedCharacter]}`);
        let leftButtonAction = () => {
            // error handle fained connection in lobby switch
            this.selectCharacter(-1);
        };


        // create the button object, no need for an icon, or UI text
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


        // create the button object, no need for an icon, or UI text
        let rightButton = new ImageButton(
            gameCenterX() + 200,
            game.config.height - 200,
            "UIRight",
            this,
            rightButtonAction
        );
    }

    selectCharacter(direction){
        this.selectedCharacter = this.selectedCharacter + direction;
        if(this.selectedCharacter < 0) this.selectedCharacter = charactersArray.length - 1;
        if(this.selectedCharacter > charactersArray.length -1) this.selectedCharacter = 0;
        this.changeCharacter();
    }

    // if we switch to a map maybe use a key
    changeCharacter(){
        let characterMapKey = charactersArray[this.selectedCharacter]
        this.selectedCharacterImage.setTexture(`${charactersArray[this.selectedCharacter]}`);
        // and send message
        Client.sendChangeCharacter(characterMapKey);
    }

    update(){

    }
}

// ***** from a1

// probably dont need anything this complicated, icon functinality is pretty useful for mobile friendlyness
// class to allow for the simple creation of buttons
// allows buttons to be definied with an action background, icon and text
class ImageButton {

    // final 2 parameters are optional
    constructor(xPos, yPos, imageRef, scene, action, text, buttonIcon) {

        // create the image defined
        this.newBtn = scene.add.image(xPos, yPos, imageRef);
        this.initialTint = -1;

        // if instantiated with text option create a text UI  object
        if (text && text.length > 0) {
            this.newTxt = scene.add.text(xPos, yPos, text, textStyles.button);
            // make the text appear in the centre of the button

            // offset by its height and width in order to centre it in the middle of the button
            offsetByHeight(this.newTxt);
            offsetByWidth(this.newTxt);
            this.newTxt.depth = HUDBaseDepth + 2;
        }

        // create a button icon if instantiated with a reference.
        if(buttonIcon){
            this.btnIcon = scene.add.image(xPos, yPos, buttonIcon);
            this.btnIcon.depth = HUDBaseDepth + 2;
        }

        this.newBtn.setInteractive();
        this.newBtn.depth = HUDBaseDepth + 1;


        // add a call to the defined action to DOM click event
        this.newBtn.on('pointerdown', () => {
            // feedback for button presses
            sounds["beep"].play();
            action();
            console.log("btn-clicked");
        });

        // show the player the click action will be performed on this button
        this.newBtn.on('pointerover', (pointer) => {
            if(this.btnIcon) this.btnIcon.tint = 0xeeeeee;
            this.newBtn.tint = 0xeeeeee;
        });

        // reset the tint to the base one, allow external control for example on settings screen
        this.newBtn.on('pointerout', (pointer) => {
            this.newBtn.tint = this.initialTint;
        });

        return this;
    }


    // hide and show both text and image components of the button
    set visible(isVisible){
        if(this.newTxt) this.newTxt.visible = isVisible;
        if(this.btnIcon) this.btnIcon.visibile = isVisible;

        this.newBtn.visible = isVisible;

    }

    // allow the base tint to be change externaly and propergate to memeber variables
    set baseTint(tint){
        this.initialTint = tint;
        this.newBtn.tint = tint;
    }
    get baseTint(){
        return this.initialTint;
    }


    //disable all components of the button
    set active(isActive){
        if(this.newTxt)this.newTxt.active = isActive;
        if(this.btnIcon) this.btnIcon.active = isActive;
        this.newBtn.active = isActive;
    }

    // rescale all components of the button
    set scale(scale){
        if(this.btnIcon) {this.btnIcon.size(scale)};
        this.newBtn.setScale(scale);
    }
    destroy(){
        this.newBtn.destroy();
        if(this.btnIcon)
        this.btnIcon.destroy();

        if(this.newTxt)
        this.newTxt.destroy();
    }
    // reset the tint to no tint
    resetTint(){
        this.baseTint = -1;
        this.newBtn.tint = this.baseTint;
    }
}



// UI helper functions
function offsetByHeight(UIObject){
    UIObject.y = UIObject.y - (UIObject.height /2)
}

function offsetByWidth(UIObject){
    UIObject.x = UIObject.x - (UIObject.width /2)
}
function gameCenterX ()
{
    return game.config.width / 2;
}
function gameCenterY ()
{
    return game.config.height / 2;
}