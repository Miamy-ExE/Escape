<?php
// Nur POST akzeptieren
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(404);
    exit();
}

// POST-Daten lesen
$icon = $_POST["icon"] ?? "default";

// Nur erlaubte Zeichen (Sicherheit!)
if (!preg_match('/^[a-z0-9_-]+$/', $icon)) {
    http_response_code(404);
    exit();
}

$path = __DIR__ . "/.favicon/" . $icon . ".ico";

// Datei existiert?
if (!file_exists($path) || $icon == "default") {
    $path = __DIR__ . "/favicon.ico"; // fallback
}

// Icon ausliefern
header("Content-Type: image/x-icon");
header("Content-Length: " . filesize($path));
readfile($path);
exit;
?>