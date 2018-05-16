import Phaser from "phaser";
import sky from "../assets/sky.png";
import bomb from "../assets/bomb.png";
import platform from "../assets/platform.png";
import star from "../assets/star.png";
import dude from "../assets/dude.png";

var player;
var platforms;
var cursors;
var stars;
var spaceKey;

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
        this.add.image(400, 300, 'sky');
        
        platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        player = this.physics.add.sprite(100, 450, 'dude');
        
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

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

        cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(player, platforms);

        // stars = this.physics.add.group({
        //     key : 'star',
        //     repeat: 11,
        //     setXY: {x: 12, y: 0, stepX: 70}
        // })
        
        // stars.children.iterate(function (child) {
        //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        // })

        // this.physics.add.collider(stars, platforms);
        // this.physics.add.overlap(player, stars, 
        //                         (player, star)=>star.disableBody(true, true), 
        //                         null, this);

        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(){
        if (cursors.left.isDown){
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown){
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else{
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down){
            player.setVelocityY(-330);
        }

        if(Phaser.Input.Keyboard.JustDown(spaceKey)){
            let sx = player.x
            let sy = player.y
            let b = this.physics.add.sprite(sx, sy, 'bomb');
            let currentPos = player.anims.currentFrame.textureFrame;
            if (currentPos < 4){
                b.setVelocityX(-500);
            }
            else {
                b.setVelocityX(500);
            }
            this.physics.add.collider(b, platforms);
        }
    }
}