async function proceed() {
	// 1. Zertifikat herunterladen
	const res = await fetch("/captive/YARHCA.crt");
  const blob = await res.blob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "YARHCA.crt";
  a.click();
  URL.revokeObjectURL(url);

	// 2. Backend Request an unlock.php
	fetch("unlock.php", { method: "POST" })
		.then(response => response.text())
		.then(data => {
			window.location.href = "https://yetanotheros.lan";
		})
}