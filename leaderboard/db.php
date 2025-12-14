<?php
header("Content-Type: application/json");

$pdo = new PDO("sqlite:leaderboard.db");

// JSON Input lesen
$data = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER["REQUEST_METHOD"];

// -----------------------------------
// POST → Spieler registrieren / Nickname prüfen
// -----------------------------------
if ($method === "POST") {

    $nickname = trim($data["nickname"] ?? "");
    $points   = $data["points"] ?? null;
    $id       = trim($data["id"] ?? "");

    // Registrierung
    if ($nickname) {
        // Prüfen ob Nick existiert
        $stmt = $pdo->prepare("SELECT id FROM leaderboard WHERE nickname=?");
        $stmt->execute([$nickname]);
        $existing = $stmt->fetchColumn();

        if ($existing) {
            echo json_encode([
                "id" => $existing,
                "msg" => "Nickname exists",
                "exists" => true
            ]);
            exit;
        }

        // Zufällige 128-bit Hex-ID erzeugen
        $newId = bin2hex(random_bytes(16));
        $stmt = $pdo->prepare("INSERT INTO leaderboard (id, nickname, time) VALUES (?, ?, CURRENT_TIMESTAMP)");
        $stmt->execute([$newId, $nickname]);

        setcookie("leaderboardID", $newId);

        echo json_encode(["id" => $newId]);
        exit;
    }

    // Punkte hinzufügen
    if ($id && $points !== null) {
        $stmt = $pdo->prepare("UPDATE leaderboard SET points = COALESCE(points,0) + ? WHERE id=?");
        $stmt->execute([$points, $id]);
        echo json_encode(["updated" => true]);
        exit;
    }

    echo json_encode(["error" => "invalid_post"]);
    exit;
}

// -----------------------------------
// DELETE → Spieler löschen
// -----------------------------------
if ($method === "DELETE") {
    $id = trim($data["id"] ?? "");
    $nickname = trim($data["nickname"] ?? "");

    if ($id === "" || $nickname === "") {
        echo json_encode(["error" => "missing_fields"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM leaderboard WHERE id=? AND nickname=?");
    $stmt->execute([$id, $nickname]);

    echo json_encode(["deleted" => true]);
    exit;
}

// -----------------------------------
// GET → Leaderboard auslesen
// -----------------------------------
if ($method === "GET") {
    $stmt = $pdo->query("
    	SELECT
    		id, 
    		nickname, 
    		points, 
    		time AS elapsed_seconds 
    	FROM 
    		leaderboard 
    	ORDER BY
    		(nickname = 'Marlon') ASC, 
    		points DESC");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rows);
    exit;
}

// -----------------------------------
// DUMP → komplette DB
// -----------------------------------
if ($method === "DUMP") {
    $stmt = $pdo->query("SELECT * FROM leaderboard");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rows);
    exit;
}

echo json_encode(["error" => "unknown_method"]);
?>
