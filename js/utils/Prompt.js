async function Prompt(message) {
    return new Promise(resolve => {

      /* ---------- STYLE ---------- */
      const style = document.createElement('style');
      style.textContent = `
        .fw-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.65);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .fw-box {
          background: #141414;
          border: 1px solid #1f1f1f;
          border-radius: 8px;
          padding: 24px;
          width: 320px;
          color: #e6e6e6;
          font-family: Arial, sans-serif;
          box-shadow: 0 20px 60px rgba(0,0,0,.6);
        }
        .fw-box h2 {
          margin: 0 0 16px;
          font-size: 1.2rem;
          color: #6bc4ff;
        }
        .fw-box input {
          width: 93.5%;
          padding: 10px;
          background: #0d0d0d;
          border: 1px solid #1f1f1f;
          border-radius: 4px;
          color: #fff;
          outline: none;
        }
        .fw-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 16px;
        }
        .fw-actions button {
          padding: 8px 14px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-weight: bold;
        }
        .fw-cancel {
          background: #1f1f1f;
          color: #ccc;
        }
        .fw-ok {
          background: #6bc4ff;
          color: #000;
        }
      `;

      /* ---------- HTML ---------- */
      const overlay = document.createElement('div');
      overlay.className = 'fw-overlay';

      const box = document.createElement('div');
      box.className = 'fw-box';

      const title = document.createElement('h2');
      title.textContent = message;

      const input = document.createElement('input');
      input.type = 'text';

      const actions = document.createElement('div');
      actions.className = 'fw-actions';

      const cancel = document.createElement('button');
      cancel.textContent = 'Cancel';
      cancel.className = 'fw-cancel';

      const ok = document.createElement('button');
      ok.textContent = 'OK';
      ok.className = 'fw-ok';

      actions.append(cancel, ok);
      box.append(title, input, actions);
      overlay.appendChild(box);

      /* ---------- CLEANUP ---------- */
      function close(value) {
        document.removeEventListener('keydown', keyHandler);
        overlay.remove();
        style.remove();
        resolve(value);
      }

      /* ---------- EVENTS ---------- */
      ok.onclick = () => close(input.value);
      cancel.onclick = () => close(null);

      function keyHandler(e) {
        if (e.key === 'Enter') close(input.value);
        if (e.key === 'Escape') close(null);
      }

      document.addEventListener('keydown', keyHandler);

      /* ---------- MOUNT ---------- */
      document.head.appendChild(style);
      document.body.appendChild(overlay);
      input.focus();
    });
  };