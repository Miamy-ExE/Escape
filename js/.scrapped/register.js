async function registerPlayer() {
    let nickname = prompt("Please enter your nickname:");
    if (!nickname) return null;

    const res = await fetch("/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
    });

    const data = await res.json();

    if (data.exists) {
        // Warnung, Englisch
        const confirmDelete = confirm(
            "You already have a nickname. Do you want to delete it and use the new one?"
        );
        if (confirmDelete) {
            // Nick löschen
            await fetch("/register.php", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: data.id, nickname })
            });
            // neuen Nick anlegen
            return await registerPlayer();
        } else {
            return null;
        }
    }

    if (data.id) {
        localStorage.setItem("playerID", data.id);
        return data.id;
    }

    return null;
}

async function addPoints(points) {
    let id = localStorage.getItem("playerID");
    if (!id) id = await registerPlayer();
    if (!id) return; // Abbruch, falls Spieler nicht registriert

    await fetch("/add_points.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, points }),
    });
}
