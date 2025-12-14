<?php
$db = new PDO("sqlite:leaderboard.db");

// Tabelle erstellen (einmalig)
$db->exec("
    CREATE TABLE IF NOT EXISTS leaderboard (
        id TEXT PRIMARY KEY,
        nickname TEXT NOT NULL,
        points INTEGER DEFAULT 0,
        time INTEGER NOT NULL
    )
");
?>
