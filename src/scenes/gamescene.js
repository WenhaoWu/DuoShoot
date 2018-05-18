import Phaser from "phaser";
import sky from "../assets/sky.png";
import bomb from "../assets/bomb.png";
import platform from "../assets/platform.png";
import star from "../assets/star.png";
import dude from "../assets/dude.png";

var firstPlayer;
var secondPlayer;

var platforms;
var cursors;
var stars;

var firstPlayerShootKey;
var secondPlayerShootKey;
var secondPlayerLeftKey;
var secondPlayerRightKey;
var secondPlayerUpKey;

export default class GameScene extends Phaser.Scene{
    
    constructor(){
        super({key: 'GameScene'});
    }

    preload(){
        this.load.image('sky', sky);
        this.load.image('ground', platform);
        this.load.image('star', star);
        this.load.image('bomb', bomb);
        this.load.spritesheet('dude', 
            dude,
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create(){

        // Scene background
        this.sceneBackgroundSetup()

        // First player
        firstPlayer = this.physics.add.sprite(100, 450, 'dude');
        this.playerSetup(firstPlayer)

        // Second player
        secondPlayer = this.physics.add.sprite(600, 450, 'dude2')
        this.playerSetup(secondPlayer)

        // Anims, what are thoooose? :D 
        this.setSomeAnims()

        // Player 1 keys
        cursors = this.input.keyboard.createCursorKeys();
        firstPlayerShootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Player 2 keys
        secondPlayerShootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
        secondPlayerLeftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        secondPlayerRightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        secondPlayerUpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    }

    update(){

        // Left - Right movement

        if (cursors.left.isDown || cursors.right.isDown) {
            this.movePlayerLeft(cursors.left.isDown, firstPlayer)
        } else { firstPlayer.setVelocityX(0) }
        if (secondPlayerLeftKey.isDown || secondPlayerRightKey.isDown) {
            this.movePlayerLeft(secondPlayerLeftKey.isDown, secondPlayer) // TODO: second player
        } else { secondPlayer.setVelocityX(0) }

        // Jump

        var firstPlayerShouldJump = firstPlayer.body.touching.down && cursors.up.isDown
        var secondPlayerShouldJump = secondPlayer.body.touching.down && secondPlayerUpKey.isDown // TODO:

        if (firstPlayerShouldJump) { this.movePlayerUp(firstPlayer) }
        if (secondPlayerShouldJump) { this.movePlayerUp(secondPlayer) } // TODO:

        // Shoot

        if (Phaser.Input.Keyboard.JustDown(firstPlayerShootKey)){
            this.shootFrom(firstPlayer)
        } else if (Phaser.Input.Keyboard.JustDown(secondPlayerShootKey)) {
            this.shootFrom(secondPlayer)
        }
    }

    // Private action methods

    movePlayerLeft(isLeft, player) {
        var offsetAndDirection = isLeft == true ? [-160, "left"] : [160, "right"]
        player.setVelocityX(offsetAndDirection[0]);

        player.anims.play(offsetAndDirection[1], true);
    }

    movePlayerUp(player) {
        player.setVelocityY(-330);
    }

    /// Crashes if player hasn't moved left or right before moving.
    /// Some issue on .currentFrame call.
    shootFrom(player) {
        let bomb = this.physics.add.sprite(player.x, player.y, 'bomb');
        let currentPos = player.anims.currentFrame.textureFrame;
        bomb.setVelocityX(currentPos < 4 ? -500 : 500)
        this.physics.add.collider(bomb, platforms);
    }

    // Private set-up methods

    sceneBackgroundSetup() {
        this.add.image(400, 300, 'sky');
        
        platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');
    }

    playerSetup(player) {
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        this.physics.add.collider(player, platforms);
    }

    setSomeAnims() {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{key: 'dude', frame: 4}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });
    }
}