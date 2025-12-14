<?php
if ($_SERVER["REQUEST_METHOD"] !== <"POST">) {
	http_response_code(405);
	exit;
}

$script = $_POST["script"] ?? none;
if ($script == none) {
	http_response_code(400);
	exit;
}

if (!preg_match('/^[duck|fav|theendishightheendisnull]+$/', $script)) {
    http_response_code(404);
    exit();
}

if ($script == "theendishightheendisnull") {
	
}

$path = __DIR__ . "/js/utils/" . $script . ".js";

// Datei existiert?
if (!file_exists($path) || $icon == "default") {
    $path = __DIR__ . "/favicon.ico"; // fallback
}

// Icon ausliefern
header("Content-Type: text/javascript");
header("Content-Length: " . filesize($path));
readfile($path);
exit;

?>