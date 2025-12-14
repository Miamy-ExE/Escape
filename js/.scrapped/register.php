<?php
header("Content-Type: application/json");

$pdo = new PDO("sqlite:leaderboard");

// JSON Input lesen
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nickname = trim($data["nickname"] ?? "");

    if ($nickname === "") {
        echo json_encode([
        	"error" => "no_nickname", 
        	"msg" => "Fehlender Nickname"
        ]);
        exit;
    }

    // Prüfen ob Nick existiert
    $stmt = $pdo->prepare("
    	SELECT 
    		id 
    	FROM 
    		leaderboard 
    	WHERE 
    		nickname=?
    ");
    $stmt->execute([$nickname]);
    $existing = $stmt->fetchColumn();

    if ($existing) {
        echo json_encode([
        	"id" => $existing, 
        	"msg" => "Nickname existiert",
        	"exists" => true
        ]);
        exit;
    }

    // Zufällige 128-bit Hex-ID erzeugen
    $id = bin2hex(random_bytes(16)); // → 32 Hex-Zeichen

    $stmt = $pdo->prepare("
    	INSERT INTO 
    		leaderboard 
    		(id, nickname) 
    	VALUES 
    		(?, ?)"
    );
    $stmt->execute([$id, $nickname]);

    setcookie("leaderboardID", $id);

    echo json_encode(["id" => $id]);

}

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {

    $id = trim($data["id"] ?? "");
    $nickname = trim($data["nickname"] ?? "");

    if ($id === "" || $nickname === "") {
        echo json_encode(["error" => "missing_fields"]);
        exit;
    }

    $stmt = $pdo->prepare("
    	DELETE FROM 
    		leaderboard 
    	WHERE 
    		id=? 
    	AND 
    		nickname=?
    ");
    $stmt->execute([$id, $nickname]);

    echo json_encode(["deleted" => true]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "DUMP") {
    // Alle Einträge als JSON ausgeben
    $stmt = $pdo->query("
    	SELECT 
    		id, 
    		nickname, 
    		points, 
    		time 
    	FROM 
    		leaderboard 
    	ORDER BY 
    		points 
    	DESC
   	");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($rows);
    exit;
}
?>
