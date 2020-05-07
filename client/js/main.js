
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

window.addEventListener('load', (event) => {
    game = new Phaser.Game(config);

});

