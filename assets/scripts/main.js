window.onload = function() {

	// Jeu
	var game = new Phaser.Game(800, 600, Phaser.CANVAS, "game");

	// Premier état
	game.state.add('RoomState', RoomState);
	game.state.start('RoomState');

	game.state.onStateChange.add((newState) => {
	    console.debug('State was changed:', newState);
	});

}