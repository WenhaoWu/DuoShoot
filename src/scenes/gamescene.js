import Phaser from "phaser";
import background from "../assets/bg_star.jpg";
import bomb from "../assets/bomb.png";
import platform from "../assets/platform.png";
import star from "../assets/star.png";
import ironman from "../assets/ironman.png";
import hulk from "../assets/hulk.png"

var player1;
var player2;

var platforms;
var stars;

var wKey, aKey, sKey, dKey, qKey;
var iKey, jKey, kKey, lKey, uKey;

export default class GameScene extends Phaser.Scene{
    
    constructor(){
        super({key: 'GameScene'});
    }

    preload(){
        this.load.image('background', background);
        this.load.image('ground', platform);
        this.load.image('star', star);
        this.load.image('bomb', bomb);
        this.load.spritesheet('ironman', 
            ironman,
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.spritesheet('hulk', 
            hulk,
            { frameWidth: 40, frameHeight: 56 }
        );

        wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        
        iKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        jKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        kKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        lKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        uKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
    }

    create(){
        this.add.image(400, 300, 'background');
        
        platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        player1 = this.physics.add.sprite(100, 450, 'ironman');
        
        player1.setBounce(0.2);
        player1.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left1',
            frames: this.anims.generateFrameNumbers('ironman', {start: 4, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn1',
            frames: [{key: 'ironman', frame: 0}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right1',
            frames: this.anims.generateFrameNumbers('ironman', {start: 8, end: 11}),
            frameRate: 10,
            repeat: -1
        });

        player2 = this.physics.add.sprite(500, 450, 'hulk');
        
        player2.setBounce(0.2);
        player2.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left2',
            frames: this.anims.generateFrameNumbers('hulk', {start: 4, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn2',
            frames: [{key: 'hulk', frame: 0}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right2',
            frames: this.anims.generateFrameNumbers('hulk', {start: 8, end: 11}),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(player1, platforms);
        this.physics.add.collider(player2, platforms);

        //Set initial ammo
        player1.ammo = 3;
        player2.ammo = 3;

        //  Create 10 random stars pick-ups
        this.randomizeStars();

        this.physics.add.overlap(player1, stars, this.pylayerEnergy);
        this.physics.add.overlap(player2, stars, this.pylayerEnergy);
    }

    pylayerEnergy(p, s){
        p.ammo += 1;

        var children = stars.getChildren();

        for (var i = 0; i < children.length; i++){
            var x = Phaser.Math.Between(50, 750);
            var y = Phaser.Math.Between(50, 550);
    
            children[i].setPosition(x, y);
        }
    
        stars.refresh();
    }

    randomizeStars(){
        stars = this.physics.add.staticGroup({
            key: 'star',
            frameQuantity: 3,
            immovable: true
        });

        var children = stars.getChildren();

        for (var i = 0; i < children.length; i++){
            var x = Phaser.Math.Between(50, 750);
            var y = Phaser.Math.Between(50, 550);
    
            children[i].setPosition(x, y);
        }
    
        stars.refresh();
    }

    update(){        
        this.actionPlayer1();
        this.actionPlayer2();
    }

    actionPlayer1(){
        if (aKey.isDown){
            player1.setVelocityX(-160);
            player1.anims.play('left1', true);
        }
        else if (dKey.isDown){
            player1.setVelocityX(160);
            player1.anims.play('right1', true);
        }
        else{
            player1.setVelocityX(0);
            player1.anims.play('turn1');
        }

        if (wKey.isDown && player1.body.touching.down){
            player1.setVelocityY(-330);
        }

        if(Phaser.Input.Keyboard.JustDown(sKey)){
            this.shootBullet(player1)
        }
    }

    actionPlayer2(){
        if (jKey.isDown){
            player2.setVelocityX(-160);
            player2.anims.play('left2', true);
        }
        else if (lKey.isDown){
            player2.setVelocityX(160);
            player2.anims.play('right2', true);
        }
        else{
            player2.setVelocityX(0);
            player2.anims.play('turn2');
        }

        if (iKey.isDown && player2.body.touching.down){
            player2.setVelocityY(-330);
        }

        if(Phaser.Input.Keyboard.JustDown(kKey)){
            this.shootBullet(player2)
        }
    }

    shootBullet(p){

        let currentPos = p.anims.currentFrame.textureFrame;

        if (currentPos == 0 || p.ammo<=0) return;

        let sx = p.x
        let sy = p.y
        let b = this.physics.add.sprite(sx, sy, 'bomb');
        b.body.allowGravity = false;

        if (currentPos < 8){
            b.setVelocityX(-500);
        }
        else {
            b.setVelocityX(500);
        }
        this.physics.add.collider(b, platforms);

        p.ammo -= 1;
    }
}