<?php

$file = $__DIR__ . "/YARHCA.crt";   // Pfad zu deinem Zertifikat

header("Content-Type: application/x-x509-ca-cert");
header("Content-Disposition: attachment; filename=YARHCA.crt");
header("Content-Length: " . filesize($file));

readfile($file);
exit;

// 1. IP des Clients auslesen
$clientIp = $_SERVER['REMOTE_ADDR'];

// 2. MAC aus dnsmasq-Leasefile auslesen
$leaseFile = "/var/lib/misc/dnsmasq.leases";
$mac = null;

if (file_exists($leaseFile)) {
    $lines = file($leaseFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        $parts = explode(" ", $line);
        if (count($parts) < 3) continue;
        if ($parts[2] === $clientIp) {
            $mac = $parts[1];
            break;
        }
    }
}

// 3. Wenn MAC nicht gefunden, Abbruch
if (!$mac) {
    exit;
}

// 4. MAC in Whitelist schreiben
$whitelistFile = "/escape/allowed_macs.txt";
file_put_contents($whitelistFile, strtolower($mac) . "\n", FILE_APPEND);

// 5. iptables-Umleitung für diesen Client entfernen
shell_exec("iptables -t nat -D PREROUTING -m mac --mac-source $mac -p tcp --dport 80 -j DNAT --to-destination 192.168.50.1:80 2>&1");
shell_exec("iptables -t nat -D PREROUTING -m mac --mac-source $mac -p tcp --dport 443 -j DNAT --to-destination 192.168.50.1:443 2>&1");

?>
