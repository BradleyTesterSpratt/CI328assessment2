
const config = {
    type: Phaser.AUTO,
    width:800,
    height: 800,
    parent:'phaser',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    dom: {
        createContainer: true
    },
    scene: [LandingScene,LobbySelectionScene, LobbyScene,GameScene],
};

var game;
var canvas; //temp
var canvasContext;
window.addEventListener('load', (event) => {
    game = new Phaser.Game(config);
    canvas = game.canvas;//temp
    canvasContext = canvas.getContext('2d');
});

