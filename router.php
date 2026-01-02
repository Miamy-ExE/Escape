<?php

$requested = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
if (str_contains($requested, "README")) {
		http_response_code(404);
		exit;
}
$path = __DIR__ . $requested;
if ($requested === '/assets/note.png') {
    require __DIR__ . '/assets/note.php';
    exit;
}
if (file_exists($path)) {
    return false;
} elseif (str_ends_with($requested, ".css") || str_ends_with($requested, ".js")) {
		http_response_code(404);
		exit;
} else {
		header("location: /404");
		//include __DIR__ . "/404/";
}

?>