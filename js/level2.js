class Level2 extends Phaser.Scene {

	isHatchOpen = false;
	doors = [];
	doorOpen = [false, true, false, false];

	constructor() {
		super("Level2");
	}

	preload() {
		this.load.setBaseURL("assets/level2/");
		//this.load.audio("bg","background.mp3")
		
		this.load.image("note", "note.png");
		this.load.image("terminal", "note.png");
		this.load.image("iframe browser", "note.png");
		
		this.load.image("l2-bg", "background.png");
		this.load.image("hatch-closed", "hatch-closed.png");
 		this.load.image("hatch-open", "hatch-open.png");
		this.load.image("hatch-focus", "hatch-inside.png");
		
		this.load.image("door1-closed", "doors/door1-closed.png");
		this.load.image("door1-open", "doors/door1-open.png");
		this.load.image("door2-closed", "doors/door2-closed.png");
		this.load.image("door2-open", "doors/door2-open.png");
		this.load.image("door3-closed", "doors/door3-closed.png");
		this.load.image("door3-open", "doors/door3-open.png");
		this.load.image("door4-closed", "doors/door4-closed.png");
		this.load.image("door4-open", "doors/door4-open.png");
		this.load.image("door", "doors/door.png");
	}

	create() {
		this.add.image(0,0,"l2-bg")
			.setOrigin(0,0)
			.setDepth(200);
			
		this.hatch = this.add.image(370,125,"hatch-closed")
			.setInteractive({ useHandCursor: true })
			.setOrigin(0,0)
			.setInteractive();
		this.hatch.on("pointerdown", 
			() => this.interactHatch());
			
		this.backArrow = BackArrow(this, 50,50, 
			() => this.closeCeilingView());
		
		this.hatch_inside = this.add.image(
			150,100,"hatch-focus")
			.setOrigin(0,0)
			.setScale(4)
			.setDepth(400)
			.setVisible(false);
		
		this.note = new Note(this, 300,350, "this is a note", "note")
			.setVisible(false)
			.setScale(0.6)
			.setDepth(401)
			.setInteractive()
			.on("pointerdown", 
				() => {
					addPoints(15);
					this.inventory.addItem(this.note);
				});
		
		let door = this.add.image(318,241,"door")
			.setOrigin(0,0.5)
			.setInteractive()
			.on("pointerdown", () => {
				let r=Math.floor(Math.random() * 11);
				if (Math.floor(Math.random() * 11)<5) this.thisdoorislocked+=r;
			});
			
		this.doors[0] = [
			this.add.image(184, 81, "door1-closed")
				.setOrigin(0,0), 
			this.add.image(0, 0, "door1-open")
				.setOrigin(0,0)
		];
		this.doors[1] = [
			this.add.image(250, 140, "door2-closed")
				.setOrigin(0,0),
			this.add.image(260, 140, "door2-open")
				.setOrigin(0,0)
		];
		this.doors[2] = [
			this.add.image(428, 145, "door3-closed")
				.setOrigin(0,0),
			this.add.image(390, 140, "door3-open")
				.setOrigin(0,0)
		];
		this.doors[3] = [
			this.add.image(468, 85, "door4-closed")
				.setOrigin(0,0),
			this.add.image(475, 85, "door4-open")
				.setOrigin(0,0)
		];
		for (let doors in this.doors) this.setDoorTrigger(doors);
		
		const trigger = this.add.graphics({fillstyle: {color: 0x555555}})
			.fillRectShape(new Phaser.Geom.Rectangle(500,100,20,20));
		
		this.inventory = new Inventory(this);
	
	this.thisdoorislocked
=		
		0	;
		
		//this.sound.pauseOnBlur = false;
		//this.sound.play("bg");
   		
   	this.browseri = new BrowserUI(this, {
	    mode: "iframe"
		});
		
		this.testBrowserI =  new Note(this, 400,200, "iframe browser")
			.setScale(0.7)
			.setInteractive()
			.on("pointerup", () => {
   			this.browseri.open("/FramerWorks/");
   		});

		const roomCam = this.scene.get("Level2Room1").camera.main;

		roomCam.setZoom(0.5);
		roomCam.setScroll(250, 140);
		roomCam.setAlpha(1);
  	
	}

	setDoorTrigger(doors, open=false) {
		doors[0]
			.setInteactive()
			.setVisible(true)
			.on("pointerdown", 
				() => {
					if (doors[0]._locked) return;
				}
		doors[1]
			.setInteractive()
			.setVisible(false)
			.on("pointerdown", 
				() => {
					if (doors[1]._closed) return;
				}
	}
	
	updateDoors() {
		for (let i = 0; i < 4; i++) {
			let open = this.doorOpen[i];
			
			this.doors[i][0].setVisible(!open);
			this.doors[i][1].setVisible(open);
			if (this.doorLocked[i]) continue;
			this.doors[i][0].removeAllListeners("pointerdown");
			this.doors[i][1].removeAllListeners("pointerdown");
			if (open) {
				this.doors[i][0].on("pointerdown", () => {})
					.disableInteractive();
				this.doors[i][1].on("pointerdown", 
					() => {
						this.doorOpen[i] = false;
						this.updateDoors();
					})
					.setInteractive();
			} else {
				this.doors[i][0].on("pointerdown", 
					() => {
						this.doorOpen[i] = true;
						this.updateDoors();
					})
					.setInteractive();
				this.doors[i][1].on("pointerdown", () => {})
					.disableInteractive();
			}
		}
	}

 interactHatch() {
 	if (!this.isHatchOpen) {
 		this.hatch.setTexture("hatch-open");
 		this.isHatchOpen = true;
 		addPoints(5);
 		return;
 	}
 	this.openCeilingView()
 	if (this.thisdoorislocked%2==0&&this.thisdoorislocked>3&&this.thisdoorislocked<20){fav("gflaivtischo1n");delay(180).then(()=>{fav("nfoacviivcaofn");delay(180).then(()=>{ fav("gflaivtischo1n");delay(180).then(()=>{fav("nfoacviivcaofn");delay(180).then(()=>{ fav("gnloicticvha1f");delay(180).then(()=>{fav("nocivaf");delay(1000).then(()=>{ fav("gnloicticvha1f");delay(180).then(()=>{fav("nfoacviivcaofn");delay(180).then(()=>{ fav("gflaivtischo1n");delay(180).then(()=>{fav("nfoacviivcaofn");delay(180).then(()=>{ fav("gflaivtischo1n");delay(180).then(()=>{fav("favicon");});});});});});});});});});});});}
	}
 
 openCeilingView() {
        this.children.list.forEach(child => {
            child.setVisible(false) && child.disableInteractive();
        });

				this.hatch_inside.setVisible(true);
        this.backArrow.setVisible(true);
				this.note.setVisible(true);
				this.inventory.bar.setVisible(true);

				this.backArrow.setInteractive();
				this.note.setInteractive();
				this.inventory.bar.list.forEach(child => {
					if (child.setInteractive) child.setInteractive();
    		});

    }

    closeCeilingView() {
        this.children.list.forEach(child => {
            child.setVisible(true) && child.setInteractive();
        });

        this.hatch_inside.setVisible(false);
        this.backArrow.setVisible(false);
        if (this.note.y==350) this.note.setVisible(false);
        
        this.backArrow.disableInteractive();
    }
}
