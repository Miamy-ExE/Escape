<?php
header('Content-Type: text/plain');

if (!$_POST["data"]) {
	header("Location: /404/", true, 404);
	exit;
}

$file = '.devlog.txt'; 

$count = 5;
$allowCut = true;

if (!file_exists($file)) {
    echo "File not found";
    exit;
}

// Zeilen einlesen
$lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
if (!$lines) {
    echo "";
    exit;
}

$total = count($lines);
$output = [];

// Zufällige Zeilen auswählen
for ($i = 0; $i < $count; $i++) {
    $line = $lines[array_rand($lines)];

    if ($allowCut && strlen($line) > 10) {
        $cutPos = rand(5, strlen($line));
        $line = substr($line, 0, $cutPos);
    }

    $output[] = $line;
}

echo implode(" ", $output);
?>