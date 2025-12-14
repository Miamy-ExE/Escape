class MainMenu extends Phaser.Scene {
	constructor() {
		super("MainMenu")
	}

	preload() {
	this.load.setBaseURL("assets/mainmenu/");
	//this.load.audio("bgMusic", "background.mp3");
	
	this.load.image("main-bg", "background.png");
	this.load.image("startbutton", "startbutton.png");
	this.load.image("nicknamebutton", "nicknamebutton.png");
	this.load.image("grass", "grass.png");
	this.load.image("forest", "forest.png");
	this.load.image("forest2", "forest.png");
	this.load.image("forest3", "forest.png");
	this.load.image("mansion", "mansion.png");
	}

	create() {
	
	this.input.keyboard.on("keydown-ONE", 
		() => {
			this.scene.sleep();
			this.scene.start("Level1");
		});
	this.input.keyboard.on("keydown-TWO", 
		() => {
			this.scene.sleep();
			this.scene.start("Level2");
		});
	this.input.keyboard.on("keydown-A", 
		() => {
			this.scene.sleep();
			this.scene.start("Level2Room1");
		});
	
	
	
	
	this.add.image(0,0,"main-bg")
		.setOrigin(0,0)
		.setScale(0.5)
		.setDepth(100);
	this.add.image(0,0,"grass")
		.setOrigin(0,0)
		.setScale(0.5)
		.setDepth(102);
	this.add.image(-50,200,"forest")
		.setOrigin(0,0)
		.setScale(2.4,1.5)
		.setDepth(104)
		.setFlipX(true);
	this.add.image(-150,170,"forest3")
		.setOrigin(0,0)
		.setScale(1.8,1.3)
		.setDepth(101)
		.setFlipX(true);
	this.add.image(250,170,"forest3")
		.setOrigin(0,0)
		.setScale(1.8,1.3)
		.setDepth(101);
	this.add.image(500,115,"mansion")
		.setOrigin(0,0)
		.setDepth(102);
		
	let startButton = this.add.image(60,160,"startbutton")
			.setInteractive()
		.setOrigin(0,0)
		.setScale(0.5)
		.setDepth(200)
		.on("pointerdown", 
			() => this.scene.start("Level2Room2"));
	let nicknameButton = this.add.image(60,250,"nicknamebutton")
		.setInteractive({ useHandCursor: true })
		.setOrigin(0,0)
		.setScale(0.5)
		.setDepth(200)
		.on("pointerdown", 
			() => {
				if (!registerPlayer()) return;
				startButton.setInteractive({ useHandCursor: true });
			});
		
		//this.sound.pauseOnBlur = false;
		//this.sound.play("bgMusic", { loop: true});
	
	//this.scene.start("Level2");
	}
}