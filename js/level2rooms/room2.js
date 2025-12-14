class Room2 extends Phaser.Scene {
	
	constructor() {
		super("Level2Room2");
	}
	
	preload() {
		this.load.setBaseURL("assets/level2/");
		this.load.image("r1-bg", "rooms/cady/room-cady.png");
		this.load.image("desk-close", "rooms/cady/desk-close.png");
		
		
		this.notes = 0;
		for (let i = 0; i < this.notes; i++) {
			this.load.image("note"+i, "note.png");
		}
	}
	
	create() {
		this.add.image(0,0,"r1-bg")
			.setOrigin(0,0)
			.setScale(3);
		
		const notes = [
			{x:0, y:0}
		];
		
		this.add.rectangle(20, 50, 180, 120)
			.setOrigin(0, 0)
			.setInteractive({ useHandCursor: true });
			//.setAlpha(0);
	}
}