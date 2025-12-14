<!DOCTYPE html>
<!-- Thank you for choosing Framer -->
<!--
	You may use Framer for open or free projects as long as you credit us.
	For commertial usage, you may use the paid version of FramerWorks accordingly to our 
-->
<!-- © 2013 FramerWorks Studio Inc.-->
<!-- end of auto-inserted paragraph -->
<?php
	header("Content-type: text/html");
	$c = rand(3, 6);
?>
<html>
<head>
<title>Escape</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
<link rel="stylesheet" href="style.php?c=<?= $c ?>" />
<script src="FramerWorks/Framer.js"></script>
<script defer src="/js/utils/backArrow.js"></script>
<script defer src="/js/utils/note.js"></script>
<script defer src="/js/utils/TerminalUI.js"></script>
<script defer src="/js/utils/BrowserUI.js"></script>
<!--<script src="/js/utils/fetch.js"></script>-->
<script src="/js/utils/Prompt.js"></script>
<script src="/js/utils/Confirm.js"></script>
<script src="/js/utils/item.js"></script>
<script defer src="/js/utils/fav.js"></script>
<script defer src="/leaderboard/leaderboard.js"></script>
<script defer src="/js/inventory.js"></script>
<script src="/js/mainmenu.js"></script>
<script src="/js/level1.js"></script>
<script src="/js/level2.js"></script>
<!--<script src="/js/level2rooms/room1.js"></script>-->
<script src="/js/level2rooms/room2.js"></script>
<!--<script src="/js/level2rooms/room3.js"></script>-->
<!--<script src="/js/level3.js"></script>-->
<script src="/js/main.js"></script>
</head>
<body>
<div class="favicon-background">
<?php for ($i = 0; $i < $c; $i++): ?>
<img src="favicon.png" class="icon<?= $i ?>" alt="Favicon" />
<?php endfor; ?>
</div>
</body>
<?php if(rand(0, 4)==0&&false) : ?>
<p style="width: 100%; position: absolute; top: 95%; text-align:center; color:grey;"><a href="inspect/">Developer inspections</a><br>remove before release!</p>
<?php endif; ?>
</html>