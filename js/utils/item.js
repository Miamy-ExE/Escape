class Item extends Phaser.GameObjects.Image {

	constructor(scene, x, y, texture, id) {
		super(scene, x, y, texture);

		this.id = id;

		scene.add.existing(this);
		
	}
	
	setDraggable() {
		this.setInteractive({ draggable: true, useHandCursor: true });
		this.on("dragstart", () => {
			this.setDepth(9999);
			this._origX = this.x;
			this._origY = this.y;
		}, this);
		this.on("drag", () => {
			this.x = dragX;
			this.y = dragY;
		}, this);
		this.on("dragend", () => {
			if (!dropped) {
				this.setPosition(this._origX, this._origY);
			}
		}, this);
		return this;
	}
	
	disableDraggable() {
		this.events.off("dragstart");
		this.events.off("drag");
		this.events.off("dragged");
		return this;
	}
	
	setDropZone() {
		this.setInteractive({ dropZone: true});
		return this;
	}
	
	setDropInteraction(config = {}) {
		const {
			accepts = [],
			onDrop = null,
			highlight = true
		} = config;

		// Meta
		this.accepts = accepts;
		this._onDrop = onDrop;

		// Highlight beim Hover (optional)
		if (highlight) {
			this.on('pointerover', () => {
				this.setTint(0x00ff00);
			});

			this.on('pointerout', () => {
				this.clearTint();
			});
		}

		// Globales Drop-Event NUR EINMAL binden
		if (!this.scene.__dropHookInstalled) {
			this.scene.__dropHookInstalled = true;

			this.scene.input.on('drop', (pointer, dragged, dropZone) => {
				if (!dropZone || !dropZone._onDrop) return;
				if (!dragged || !dragged.id) return;

				if (
					dropZone.accepts.length === 0 ||
					dropZone.accepts.includes(dragged.id)
				) {
					dropZone._onDrop(dragged, dropZone);
				}
			});
		}

		return this;
	}

}
