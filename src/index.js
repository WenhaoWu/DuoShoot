import Phaser from "phaser";
import GameScene from "./scenes/gamescene";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [GameScene]
};

const game = new Phaser.Game(config)

if (module.hot) {
    module.hot.accept(()=>{});
    
    module.hot.dispose(()=>{
        window.location.reload();
    })
}