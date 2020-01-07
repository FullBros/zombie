'use strict';

class RoomState extends Phaser.Sprite {


	preload () {
	   // Joueur
	   this.load.spritesheet('player', 'assets/images/player.png', 80, 115);

	   // Zombies
	   this.load.image('zombie', 'assets/images/zombie.png');

	   // Carte
    	this.load.tilemap('map', 'assets/maps/tiles.json', null, Phaser.Tilemap.TILED_JSON);

    	// Sprites
    	this.load.image('tiles', 'assets/images/tiles.png');
	}


	create () {

	   this.map = this.add.tilemap('map', 64, 64);
	   this.map.addTilesetImage('map', 'tiles');

	   this.layer = this.map.createLayer('Floor');
	   this.walls  = this.map.createLayer('Wall');
		this.layer.resizeWorld();

		// Création du joueur
		this.game.player = this.add.sprite(200, 200, 'player');
		//this.player = this.add.sprite(200, 200, 'player');
		this.game.player.frame = 0;
		this.game.player.anchor.setTo(0.5, 0.5);

		// Animations
		this.game.player.animations.add('walk', [0, 1, 2, 3, 4, 5], 10, true);

		// Moteur de physique
   	this.physics.startSystem(Phaser.Physics.ARCADE);
   	this.physics.arcade.enable(this.game.player);
   	this.physics.arcade.enable(this.walls);

   	// Collisions
   	//this.map.setCollisionBetween(1,100000);
   	this.map.setCollisionBetween(0, 10000, true, this.walls);


    	// Zombies
    	this.zombies = this.game.add.group();
    	this.zombies.enableBody = true;
    	this.map.createFromObjects('Zombies', 'zombie', 'zombie', 0, true, false, this.zombies);


   	// Contrôles clavier
   	this.keyboard = this.input.keyboard.createCursorKeys();


   	// Create the shadow texture
   	this.shadowTexture = this.game.add.bitmapData(this.map.width * this.map.tileWidth, this.map.height * this.map.tileHeight);
    	var lightSprite = this.game.add.image(0, 0, this.shadowTexture);
    	lightSprite.blendMode = Phaser.blendModes.MULTIPLY;


   	// Contrôles souris
      //this.input.addMoveCallback(move, this);

 		// Caméra
   	this.camera.follow(this.game.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

   	    this.LIGHT_RADIUS = 250;

	}


	update () {

		// Draw shadow
   	this.shadowTexture.context.fillStyle = 'rgb(20, 20, 20)';
	   this.shadowTexture.context.fillRect(0, 0, this.map.width * this.map.tileWidth, this.map.height * this.map.tileHeight);

    // Draw circle of light with a soft edge
    var gradient = this.shadowTexture.context.createRadialGradient(
        this.game.player.x, this.game.player.y, 0,
        this.game.player.x, this.game.player.y, this.LIGHT_RADIUS);
    gradient.addColorStop(0, 'rgba(180, 180, 180, 1.0)');
    gradient.addColorStop(1, 'rgba(180, 180, 180, 0.0)');

    this.shadowTexture.context.beginPath();
    this.shadowTexture.context.fillStyle = gradient;
    this.shadowTexture.context.arc(this.game.player.x, this.game.player.y,
        this.LIGHT_RADIUS, 0, Math.PI*2);
    this.shadowTexture.context.fill();

    // This just tells the engine it should update the texture cache
    this.shadowTexture.dirty = true;



   	// Zombies
   	this.zombies.forEach( function (zombie) {
   		if (Phaser.Math.distance(this.game.player.x, this.game.player.y, zombie.x, zombie.y) < 250) {
   			zombie.rotation = this.game.physics.arcade.moveToObject(zombie, this.game.player, 180);
   		}
   	}, this );


		this.game.physics.arcade.collide(this.game.player, this.walls);

		this.game.player.rotation = Math.PI / 2 + this.physics.arcade.angleToPointer(this.game.player);

		this.game.player.body.velocity.x = 0;
		this.game.player.body.velocity.y = 0;

		// Haut bas
   	if (this.keyboard.up.isDown) {
   		this.game.player.body.velocity.y -= 256;
   	}
  		else if (this.keyboard.down.isDown) {
  			this.game.player.body.velocity.y += 256;
  		}

   	if (this.keyboard.left.isDown) {
   		this.game.player.body.velocity.x -= 256;
    	}
    	else if (this.keyboard.right.isDown) {
    		this.game.player.body.velocity.x += 256;
    	}

    	if (this.game.player.body.velocity.x == 0 && this.game.player.body.velocity.y == 0) {
    		this.game.player.animations.stop();
    	} else {
    		this.game.player.animations.play('walk');
    	}

	}


   render() {
      //this.game.debug.body(this.game.player);
	}


}