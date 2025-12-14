async function loadLeaderboard() {
    const res = await fetch("/leaderboard.php");
    const data = await res.json();

    const tbody = document.querySelector("#leaderboard tbody");
    tbody.innerHTML = "";

    data.forEach((row, i) => {

        const timeStr = formatTime(row.elapsed_seconds);
				const place = (row.nickname != "Marlon") ? i + 1 : "Developer";
        tbody.innerHTML += `
            <tr>
                <td>${place}</td>
                <td>${row.nickname}</td>
                <td>${row.points}</td>
                <td>${timeStr}</td>
            </tr>
        `;
    });
}