import Phaser from "phaser";
import sky from "../assets/sky.png";
import bomb from "../assets/bomb.png";
import platform from "../assets/platform.png";
import star from "../assets/star.png";
import ironman from "../assets/ironman.png";
import hulk from "../assets/hulk.png"

var player;
var platforms;
var cursors;
var stars;
var spaceKey;

var leftKey;
var rightKey;
var upKey;
var downKey;

export default class GameScene extends Phaser.Scene{
    
    constructor(){
        super({key: 'GameScene'});
    }

    preload(){
        this.load.image('sky', sky);
        this.load.image('ground', platform);
        this.load.image('star', star);
        this.load.image('bomb', bomb);
        this.load.spritesheet('ironman', 
            ironman,
            { frameWidth: 32, frameHeight: 48 }
        );

        cursors = this.input.keyboard.createCursorKeys();
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    create(){
        this.add.image(400, 300, 'sky');
        
        platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        player = this.physics.add.sprite(100, 450, 'ironman');
        
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('ironman', {start: 4, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{key: 'ironman', frame: 0}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('ironman', {start: 8, end: 11}),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(player, platforms);
    }

    movePlayerLeft(p) {
        p.setVelocityX(-160);
        p.anims.play('left', true);
    }

    movePlayerRight(p){
        p.setVelocityX(160);
        p.anims.play('right', true);
    }
    
    stillPlayer(p){
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    update(){
        
        if (cursors.left.isDown){
            this.movePlayerLeft(player)
        }
        else if (cursors.right.isDown){
            this.movePlayerRight(player)
        }
        else{
           this.stillPlayer(player)
        }

        if (cursors.up.isDown && player.body.touching.down){
            player.setVelocityY(-330);
        }

        if(Phaser.Input.Keyboard.JustDown(spaceKey)){
            this.shootBullet(player)
        }
    }

    shootBullet(p){

        let currentPos = p.anims.currentFrame.textureFrame;

        if (currentPos == 0) return;

        let sx = p.x
        let sy = p.y
        let b = this.physics.add.sprite(sx, sy, 'bomb');

        if (currentPos < 8){
            b.setVelocityX(-500);
        }
        else {
            b.setVelocityX(500);
        }
        this.physics.add.collider(b, platforms);
    }
}