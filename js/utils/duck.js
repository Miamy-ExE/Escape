function setduck() {
    const response = await fetch("/favicon.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "icon=" + encodeURIComponent("ducks")
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Favicon setzen
    const link = document.querySelector('link[rel="icon"]') || document.createElement("link");
    link.rel = "icon";
    link.href = url;
    document.head.appendChild(link);
}
}

export function duck(scene) {

scene.spawnObject = function(x, y) {
		
	const response = await fetch("/assets/EasterEggs.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: "icon=" + encodeURIComponent("duck")
	});

	const blob = await response.blob();
	const url = URL.createObjectURL(blob);

		
	const obj = this.add.image(x, y, "/assets/").setInteractive();
	obj.on("pointerdown", setduck);
	return obj;
};

}

document.getElementsByTagName("script");
for (let i of e) { 
if (i.attributes.getNamedItem("src").value=="/js/duck.js") document.head.removeChild(i); 
}