(function(){
  const codeText = document.getElementById('code').textContent.trim();
  const copyBtn = document.getElementById('copyBtn');
  const copyStatus = document.getElementById('copyStatus');

  async function copyToClipboard(text) {
    // moderne API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        return false;
      }
    }
    // Fallback: temporäres textarea
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      // avoid scrolling to bottom
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  copyBtn.addEventListener('click', async () => {
    copyStatus.textContent = 'Kopiere …';
    const ok = await copyToClipboard(codeText);
    if (ok) {
      copyStatus.textContent = 'Copied';
      copyBtn.textContent = '&check; Copied';
      setTimeout(() => { copyBtn.textContent = '&#x1F4CB; Copy Bookmarklet'; copyStatus.textContent = 'Bereit'; }, 2500);
    } else {
      copyStatus.textContent = 'Fehler: Kopieren nicht möglich';
      alert('Automatisches Kopieren nicht unterstützt. Markiere den Text manuell und kopiere ihn (lange drücken auf iPad).');
    }
  });

  // Allow easy text selection on touch devices
  const codeEl = document.getElementById('code');
  codeEl.addEventListener('touchstart', () => {
    // no-op, but allows selection on some iOS versions
  });
})();
