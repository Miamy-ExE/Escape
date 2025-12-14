class Level1 extends Phaser.Scene {
	constructor() {
		super("Level1");
	}
	
	preload() {
		this.load.setBaseURL("assets/level1/");
		this.load.image("mansion", "mansion.png");
		this.load.image("forest", "forest.png");
		this.load.image("beach", "beach.jpeg");
		
		this.load.image("note", "note.png");
		
		this.grass = 2;
		for (let i = 0; i < this.grass; i++) {
			this.load.image("grass"+i, "grass.png");
		}
	}
	
	create() {
		this.add.image(30,250,"beach")
			.setOrigin(0,0)
			.setScale(1.5)
			.setRotation(0.35);
		this.add.image(500,250,"mansion")
			.setOrigin(0,0)
			.setScale(1);
		
		const gp = [
			{x:0, y:0,scale:[0.01,0.03], flip:true, rotation:90},
			{x:160, y:550,scale:[0.1,0.25], flip:false, rotation:3}
		]; let g=null;
		for (let i = 0; i < this.grass; i++) {
			let p = gp[i];
			g = this.add.image(p.x, p.y, "grass"+i)
				.setOrigin(0.5,0.5);
			if (Array.isArray(p.scale)) g.setScale(...p.scale);
			else g.setScale(p.scale || 0.3);
			g.setFlipY(p.flip);
			if (p.rotation) g.setRotation(Phaser.Math.Angle.Normalize(p.rotation));
			
		/*const dialog = [
		    {
		        prompt: "Username:",
		        answer: "admin",
		        ispassword: false
		    },
		    {
				    prompt: "Password:",
    		    answer: "1234",
    		    ispassword: true
    		}
		];*/
		
		/*const dialog = [
    {
        trigger: "login",
        steps: [
            { prompt: "Username:", answer: "admin", ispassword: false },
            { prompt: "Password:", answer: "1234", ispassword: true, errtype: TerminalUI.ERROR.ACCESS_DENIED }
        ]
    },
    {
        trigger: "run",
        steps: [
            { prompt: "Run task? (yes/no):", answer: "yes", ispassword: false }
        ]
    },
    {
        trigger: "status",
        steps: [
            { prompt: "Show system status?", answer: "status", ispassword: false }
        ]
    }
];

const terminal = new TerminalUI(this, {
    dialog: dialog
});

terminal.open();*/

		const dialog = [
    {
        trigger: "login",
        steps: [
            { prompt: "Username:", answer: "admin" },
            { prompt: "Password:", answer: "1234", errtype: TerminalUI.ERROR.ACCESS_DENIED }
        ]
    },
    {
        trigger: "status",
        steps: [
            { prompt: "Checking system...", answer: "" }
        ]
    }
];

const terminal = new TerminalUI(this, {
    dialog,
    promptPrefix: "FW@guest ~# "
}); terminal.open();

		
	/*	this.terminal = new TerminalUI(
			this,
			{
				dialog: dialog,
				onSuccess: () => {
					console.log("Login erfolgreich!");
				}
			}
		);
		this.add.image(130,130,"note")
				.setOrigin(0,0)
				.on("pointerdown", 
					() => {
						this.terminal.open("run");
				})
				.setInteractive();
			*/	
		}
		
		this.inventory = new Inventory(this);
	}
}