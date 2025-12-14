class Inventory {
	constructor(scene) {
		this.scene = scene;
		this.items = [];
		this.itemSprites = scene.add.container(0, 0);

		this.bar = scene.add.container(0, scene.game.config.height - 60);
		const barBg = scene.add.rectangle(
				scene.game.config.width/2, 30,
				scene.game.config.width, 60,
				0x000000, 0.5
		).setOrigin(0.5);

		this.bar.add(barBg);

		// Scroll-Container in die Leiste einfügen
		this.bar.add(this.itemSprites);

		// Mask (scrollen)
		const maskGfx = scene.add.graphics();
		maskGfx.fillRect(0, scene.game.config.height - 60, scene.game.config.width, 60);
		const mask = maskGfx.createGeometryMask();
		this.itemSprites.setMask(mask);

		// Scroll per Drag
		this.itemSprites.setInteractive(new Phaser.Geom.Rectangle(
				0, 0, scene.game.config.width, 60
		), Phaser.Geom.Rectangle.Contains);

		this.itemSprites.on("pointerdown", (p) => {
				this.dragStartX = p.x;
				this.startScrollX = this.itemSprites.x;
		});

		this.scene.input.on("pointermove", (p) => {
				if (p.isDown && this.dragStartX !== undefined) {
						const dx = p.x - this.dragStartX;
						this.itemSprites.x = this.startScrollX + dx;
				}
		});
	}
	
	addItem(item) {
		if (!item.scene) {
			this.scene.add.existing(item);
		}

		this.items.push(item);

		const xOffset = 40 + (this.itemSprites.length * 50);
		const targetY = 30;

		this.scene.tweens.add({
				targets: item,
				x: xOffset,
				y: targetY,
				scaleX: 0.4,
				scaleY: 0.4,
				duration: 400,
				ease: 'Power2'
		});

		item.setDepth(500);
		item.setInteractive({ useHandCursor: true });

		item.on("pointerdown", () => {
				this.showItemLarge(item);
		});

		this.itemSprites.add(item);
	}

		showItemLarge(item) {
			if (item.onDisplay) return;

				// Overlay
				const overlay = this.scene.add.rectangle(
						this.scene.game.config.width/2,
						this.scene.game.config.height/2,
						this.scene.game.config.width,
						this.scene.game.config.height,
						0x000000,
						0.6
				).setDepth(900);
				
				item._origX = item.x;
				item._origY = item.y;
				item._origScaleX = item.scaleX;
				item._origScaleY = item.scaleY;
				item._origDepth = item.depth;
				item._origParent = item.parentContainer;
				item.onDisplay = true;
				
		   	item._origParent.remove(item);
		   	this.scene.add.existing(item);
				
				// overlay öffnen
			  item.setDepth(1000);
				this.scene.tweens.add({
						targets: item,
						x: this.scene.cameras.main.centerX,
						y: this.scene.cameras.main.centerY,
						scaleX: item.scaleX * 5,
						scaleY: item.scaleY * 5,
						duration: 400,
						ease: 'Power2',
						onComplete: () => {
							overlay.setInteractive()
						}
				});
				
				// overlay schließen
				overlay.on("pointerdown",
					() => {
						overlay.destroy();
						this.scene.tweens.add({
							targets: item,
							x: item._origX,
							y: item._origY,
							scaleX: item._origScaleX,
							scaleY: item._origScaleY,
							duration: 400,
							ease: 'Power2',
							onComplete: () => {
								item._origParent.add(item);
								item.setDepth(item._origDepth);
								item.onDisplay = false;
							}
						});
					});
		}
}
