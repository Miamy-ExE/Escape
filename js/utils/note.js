class Note extends Phaser.GameObjects.Container {

    constructor(scene, x, y, text, tkey) {
        super(scene, x, y);
				
        this.bg = scene.add.image(0, 0, tkey).setOrigin(0.5, 0.5);
        
        // Text
        this.text = scene.add.text(0, 0, text, {
            fontSize: "12px",
            color: "#000",
            wordWrap: { width: 100 },
            align: "left"
        }).setOrigin(0.5, 0.5);

        // in Container packen
        this.text.rotation = Phaser.Math.DegToRad(-10);
        this.add([this.bg, this.text]);

        // Interaktiv machen
        this.setSize(this.bg.width, this.bg.height);
        this.setInteractive({ useHandCursor: true });

        // zur Scene hinzufügen
        scene.add.existing(this);
    }
}
