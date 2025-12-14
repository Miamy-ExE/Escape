const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: 'game-container',
	physics: { default: 'arcade' },
	scene: [ MainMenu, Level1, Level2, Room2 ],
	backgroundColor: "rgba(255,255,255,1)",
	min: {
		width: 480,
		height: 720,
	},
	max: {
		width: 1024,
		height: 1280,
	},
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
	},
	dom: {
		createContainer: true
	},
};

game = new Phaser.Game(config);
