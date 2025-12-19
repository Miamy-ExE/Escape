<?php
	header("Content-type: text/css; charset=UTF-8");
?>

.favicon-background {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: -1;
	background: #0d0d0d;
}

<?php
$data = [
	"data" => 1
];
ob_start();
include __DIR__ . '/devlogs.php';
$text = ob_get_clean();
echo "/* \n" . $text . "\n */" . "\n";
?>

.favicon-background img {
	position: absolute;
	width: 64px;
	height: 64px;
	opacity: 0.45;
}

<?php
$count = isset($_GET["c"])||$_GET["c"]<2 ? $_GET["c"] : 2;
$count = max($count, 1); // mind. 1

for ($i = 0; $i < $count; $i++) {
    $top = ($i*100/($count-1)) + rand(-8,10);
    $side = ($i % 2 === 0) ? 'left' : 'right'; 
    $sideVal = rand(-2,6);
    $rotate = rand(-25,25);
    echo ".favicon-background .icon$i { top: {$top}%; {$side}: {$sideVal}%; transform: rotate({$rotate}deg); }\n";
}
?>