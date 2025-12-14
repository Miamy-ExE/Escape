async function registerPlayer() {
    let nickname = prompt("Bitte Nickname eingeben:");

    const res = await fetch("/register.php", {
        method: "POST",
        body: JSON.stringify({ nickname }),
    });

    const data = await res.json();

    if (data.id) {
        localStorage.setItem("playerID", data.id);
        return data.id;
    }
}

async function addPoints(points) {
    let id = localStorage.getItem("playerID");
    if (!id) id = await registerPlayer();

    await fetch("/add_points.php", {
        method: "POST",
        body: JSON.stringify({ id, points }),
    });
}