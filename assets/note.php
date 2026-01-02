<?php
	header("Content-type: image/png");
	
	$normal = rand(0, 20) > 5;
	if ($normal) {
		readfile("notes/note.png");
	} else {
		readfile("notes/note.gif");
	}
?>