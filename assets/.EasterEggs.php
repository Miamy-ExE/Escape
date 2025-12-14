<?php
// Nur POST akzeptieren
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(404);
    exit;
}

// POST-Daten lesen
$ee = $_POST["easterEgg"] ?? "";

// Nur erlaubte Zeichen (Sicherheit!)
if (!preg_match('/^[a-z0-9_-]+$/', $ee)) {
    http_response_code(404);
    exit;
}

$path = __DIR__ . "/.EasterEggs/" . $ee . ".png";

// Datei existiert?
if (!file_exists($path) || $ee == "") {
    http_response_code(404);
}

// Icon ausliefern
header("Content-Type: image/x-png");
header("Content-Length: " . filesize($path));
readfile($path);
exit;
?>