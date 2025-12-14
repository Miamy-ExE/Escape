async function registerPlayer() {
	let nickname = await Prompt("Please enter your nickname:");
	if (!nickname) return false;

	const res = await fetch("/leaderboard/db.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ nickname }),
	});
	const data = await res.json();

	if (data.exists) {
		const confirmDelete = await Confirm(
			"You already have a nickname. Do you want to reset your entry and use the new one?"
		);
		if (confirmDelete) {
			await fetch("/leaderboard/db.php", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: data.id, nickname })
			});
			return await registerPlayer();
		} else return false;
	}

	if (data.id) {
		localStorage.setItem("playerID", data.id);
		return true;
	}

	return false;
}

async function addPoints(points) {
	let id = localStorage.getItem("playerID");
	if (!id) id = await registerPlayer();
	if (!id) return;

	await fetch("/db.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id, points }),
	});
}

async function loadLeaderboard() {
	const res = await fetch("/leaderboard/db.php");
	const data = await res.json();

	const tbody = document.querySelector("#leaderboard tbody");
	tbody.innerHTML = "";

	data.forEach((row, i) => {
		const timeStr = row.nickname !== "Marlon" ? formatTime(row.elapsed_seconds) : "-:--:--";
		const place = row.nickname !== "Marlon" ? i + 1 : "Developer";
		const points = row.nickname !== "Marlon" ? row.points : "&infin;";
		const css = row.nickname !== "Marlon" ? "" : " style=\"color:pink\""
		tbody.innerHTML += `
			<tr${css}>
				<td>${place}</td>
				<td>${row.nickname}</td>
				<td>${points}</td>
				<td>${timeStr}</td>
			</tr>
		`;
	});
}

function formatTime(startTime) {
	if (!startTime) return "-";

	// "YYYY-MM-DD HH:MM:SS" → Date
	const start = new Date(startTime.replace(" ", "T"));
	if (isNaN(start)) return "-";

	const now = new Date();
	let seconds = Math.floor((now - start) / 1000);
	if (seconds < 0) seconds = 0;

	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;

	if (h > 0) {
		return `${h}:${String(m).padStart(2, "0")}`;
	}
	return `${m}:${String(s).padStart(2, "0")}`;
}
