function BackArrow(scene, x = 50, y = 50, onClick = () => {}) {
    const container = scene.add.container(x, y).setDepth(10000);

    // Pfeil: linkspfeil (grünlich, passt zu Terminal)
    const arrow = scene.add.polygon(0, 0, [
        -12, 0,    // Spitze links
        8, -8,     // oben rechts
        8, -3,     // innen oben
        20, -3,
        20, 3,
        8, 3,      // innen unten
        8, 8       // unten rechts
    ], 0xc5c4c4).setOrigin(0.5); // Farbe grün

    container.add(arrow);

    // HitArea für Interaktion
    container.setSize(40, 40);
    container.setInteractive(new Phaser.Geom.Rectangle(-20, -20, 40, 40), Phaser.Geom.Rectangle.Contains);

    // Hover Effekt
    container.on('pointerover', () => {
        container.setScale(1.05);
    });
    container.on('pointerout', () => {
        container.setScale(1);
    });

    // Klick
    container.on('pointerdown', () => {
        scene.tweens.add({ targets: container, scale: 0.9, yoyo: true, duration: 80 });
        onClick();
    });

    // Start unsichtbar
    container.setVisible(false);

    return container;
}
