async function fav(iconName) {
    const response = await fetch("/favicon.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "icon=" + encodeURIComponent(iconName)
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.querySelector('link[rel="icon"]') || document.createElement("link");
    link.rel = "icon";
    link.href = url;
    document.head.appendChild(link);
}