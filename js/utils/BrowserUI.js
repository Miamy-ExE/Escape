// BrowserUI.js
// FramerWorks embedded browser UI for games
// Supports real iframe mode and mock-mode (predefined pages).

class BrowserUI {
  static ERRORS = {
    HTTP_404: "404 Not Found",
    ACCESS_DENIED: "Access denied",
    NETWORK_ERROR: "Network error",
    BLOCKED: "Blocked by policy"
  };

  constructor(scene, config = {}) {
    this.scene = scene;
    this.closeEvent = null;

    // visual config
    this.width = config.width || 680;
    this.height = config.height || 360;
    this.x = (typeof config.x === "number") ? config.x : (scene.scale.width / 2);
    this.y = (typeof config.y === "number") ? config.y : (scene.scale.height / 2);
    this.padding = config.padding || 12;
    this.fontSize = config.fontSize || "16px";
    this.fontFamily = config.fontFamily || "Arial, sans-serif";
    this.textColor = config.textColor || "#ffffff";
    this.bgColor = config.bgColor || 0x111111;
    this.overlayAlpha = (typeof config.overlayAlpha === "number") ? config.overlayAlpha : 0.6;

    // behavior config
    this.mode = config.mode === "iframe" ? "iframe" : "mock"; // default mock
    this.mockPages = config.mockPages || {}; // { url: htmlString }
    this.onClose = config.onClose || function(){};

    // internal state
    this.history = [];
    this.historyIndex = -1;
    this.currentURL = "";
    this.isOpen = false;
    this.loading = false;

    // build UI
    const cx = this.x;
    const cy = this.y;

    // overlay
    this.overlay = scene.add.rectangle(
    	cx, 
    	cy, 
    	scene.scale.width, 
    	scene.scale.height, 
    	0x000000, 
    	this.overlayAlpha
    )
    	.setDepth(10000)
    	.setVisible(false);

    // window
    this.window = scene.add.rectangle(
    	cx, 
    	cy, 
    	this.width, 
    	this.height, 
    	this.bgColor, 
    	1
    )
    	.setOrigin(0.5)
    	.setDepth(10001)
    	.setVisible(false);

    // top bar (for controls)
    const topBarHeight = 44;
    const left = cx - this.width / 2 + this.padding;
    const top = cy - this.height / 2 + this.padding;

    // Buttons (Back, Forward, Reload, Close) - use simple text buttons
    const btnStyle = { 
    	fontFamily: this.fontFamily, 
    	fontSize: this.fontSize, 
    	color: this.textColor
    };

    this.btnBack = scene.add.text(
    	left + 5, 
    	top + 5, 
    	"←", 
    	btnStyle
    )
    	.setDepth(10002)
    	.setVisible(false)
    	.setInteractive({ useHandCursor: true });
    	
    this.btnForward = scene.add.text(
    	left + 35, 
    	top + 5, 
    	"→", 
    	btnStyle
    )
    	.setDepth(10002)
    	.setVisible(false)
    	.setInteractive({ useHandCursor: true });
    	
    this.btnReload = scene.add.text(
    	left + 65, 
    	top + 7, 
    	"⟳", 
    	btnStyle
    )
    .setDepth(10002)
    .setVisible(false)
    .setInteractive({ useHandCursor: true });
    
    this.btnClose = scene.add.text(
    	cx + this.width/2 - this.padding - 25, 
    	top + 7, 
    	"✕", 
    	btnStyle
    )
    	.setDepth(10002)
    	.setVisible(false)
    	.setInteractive({ useHandCursor: true });

    // address bar: we create a DOM <input> for proper keyboard on mobile
    // If DOM not available (e.g., running in headless), fall back to Phaser Text input simulation.
    this.addressInput = null;
    this.addressDom = null;
    this._createAddressBar(
    	left + 110, 
    	top - 3, 
    	this.width - 110 - 110
    ); // leave space for buttons on right

    // loading indicator (simple text)
    this.loadingText = scene.add.text(
    	cx - this.width/2 + this.padding, 
    	top + 28, 
    	"", 
    	{ 
    		fontFamily: this.fontFamily, 
    		fontSize: "14px", 
    		color: this.textColor
    	})
      	.setDepth(10002)
      	.setVisible(false);

    // content area (below topbar)
    const contentY = cy - this.height/2 + topBarHeight + this.padding;
    const contentHeight = this.height - topBarHeight - this.padding*2;

    // We'll either create an iframe (DOM) or a Phaser container to show mock HTML
    this.contentContainer = scene.add.container(
    	cx - this.width/2 + this.padding, 
    	contentY
    )
    	.setDepth(10002)
    	.setVisible(false);

    // background rect for content (so text is readable)
    this.contentBg = scene.add.rectangle(
    	0, 
    	0, 
    	this.width - this.padding*2, 
    	contentHeight, 
    	0x000000, 
    	1
    )
    	.setOrigin(0,0);
    this.contentContainer.add(this.contentBg);

    // text object for mock pages
    this.mockText = scene.add.text(
    	8, 
    	8, 
    	"", 
    	{ 
    		fontFamily: this.fontFamily, 
    		fontSize: "14px", 
    		color: this.textColor, 
    		wordWrap: { width: this.width - this.padding*2 - 16 }
    	}
    );
    this.contentContainer.add(this.mockText);

    // iframe DOM (only created if mode === "iframe")
    this.iframeDom = null;
    if (this.mode === "iframe") {
      this._createIframe(
      	cx - this.width/2 + this.padding, 
      	contentY, 
      	this.width - this.padding*2, 
      	contentHeight
      );
    }

    // interactions
    this.btnBack.on('pointerdown', () => this.back());
    this.btnForward.on('pointerdown', () => this.forward());
    this.btnReload.on('pointerdown', () => this.reload());
    this.btnClose.on('pointerdown', () => { this.close(); });

    // initial visuals hidden already
  }

  // create address bar DOM input (preferred for mobile keyboard)
  _createAddressBar(x, y, widthPx) {
    // Phaser DOM requires the game canvas to have 'dom' element enabled in config.
    // create native input element so mobile shows keyboard.
    try {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'https://';
      input.style.width = widthPx + 'px';
      input.style.height = '20px';
      input.style.fontSize = '14px';
      input.style.padding = '2px';
      input.style.borderRadius = '4px';

      // wrap in DOM element and add to scene
      this.addressDom = this.scene.add.dom(
      	x, 
      	y + 6, 
      	input
      )
      	.setOrigin(0,0)
      	.setDepth(10002)
      	.setVisible(false);
      this.addressInput = input;

      // handle Enter on input
      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          this.navigate(input.value);
          // blur to close virtual keyboard on mobile
          input.blur();
        }
      });

    } catch (e) {
      // fallback to Phaser Text input simulation (less ideal for mobile)
      const txt = this.scene.add.text(
      	x, 
      	y, 
      	"enter url...", 
      	{ 
      		fontFamily: this.fontFamily, 
      		fontSize: "14px", 
      		color: this.textColor 
      	}
      )
      	.setDepth(10002)
      	.setVisible(false)
      	.setInteractive({ useHandCursor: true })
      	.on('pointerdown', () => {
        const fake = prompt("Enter URL");
        if (fake !== null) this.navigate(fake);
      });
      this.addressInput = null;
      this.addressDom = txt;
    }
  }

  _createIframe(x, y, w, h) {
    // create a container DOM element that holds the iframe (for sizing)
    try {
      const wrapper = document.createElement('div');
      wrapper.style.width = w + 'px';
      wrapper.style.height = h + 'px';
      wrapper.style.overflow = 'hidden';
      wrapper.style.background = '#ffffff';
      wrapper.style.border = '0px';

      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups'); // constrained
      wrapper.appendChild(iframe);

      this.iframeDom = this.scene.add.dom(
      	x, 
      	y, 
      	wrapper
      )
      	.setOrigin(0,0)
      	.setDepth(10002)
      	.setVisible(false);
      this.iframeElement = iframe;

      // attach load & error listeners
      iframe.addEventListener('load', () => {
        this.loading = false;
        this._setLoading(false);
      });
      iframe.addEventListener('error', () => {
        this.loading = false;
        this._setLoading(false);
        this._showError(BrowserUI.ERRORS ? BrowserUI.ERRORS.NETWORK_ERROR : "Network error");
      });
    } catch (e) {
      this.iframeDom = null;
      this.iframeElement = null;
    }
  }

  // PUBLIC API

  open(initialURL) {
    this.isOpen = true;
    this.overlay.setVisible(true);
    this.window.setVisible(true);
    this.btnBack.setVisible(true);
    this.btnForward.setVisible(true);
    this.btnReload.setVisible(true);
    this.btnClose.setVisible(true);
    if (this.addressDom) this.addressDom.setVisible(true);
    if (this.addressDom && initialURL) this.addressInput.value = initialURL;
    if (this.contentContainer) this.contentContainer.setVisible(true);
    if (this.iframeDom) this.iframeDom.setVisible(true);
    this.loadingText.setVisible(true);

    if (initialURL) this.navigate(initialURL);
    else this._showHome();
    
    // ESC Listener hinzufügen
    this.closeEvent = this.scene.input.keyboard.addKey('ESC');
    this.closeEvent.on('down', () => this.close());
  }

  close() {
    this.isOpen = false;
    this.overlay.setVisible(false);
    this.window.setVisible(false);
    this.btnBack.setVisible(false);
    this.btnForward.setVisible(false);
    this.btnReload.setVisible(false);
    this.btnClose.setVisible(false);
    if (this.addressDom) this.addressDom.setVisible(false);
    this.contentContainer.setVisible(false);
    if (this.iframeDom) this.iframeDom.setVisible(false);
    this.loadingText.setVisible(false);
    this.onClose();
    
    // ESC Listener wieder entfernen (wichtig!)
    if (this.closeEvent) {
      	this.closeEvent.destroy();
      	this.closeEvent = null;
    }
  }

  navigate(url) {
    if (!url || typeof url !== 'string') return;
    // normalize
    const u = url.trim();

    // update address bar
    if (this.addressInput) this.addressInput.value = u;
    else if (this.addressDom && this.addressDom.setText) this.addressDom.setText(u);

    // push history (truncate forward)
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    this.history.push(u);
    this.historyIndex = this.history.length - 1;

    this.currentURL = u;
    this._loadURL(u);
    this._updateButtons();
  }

  back() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const u = this.history[this.historyIndex];
      this.currentURL = u;
      if (this.addressInput) this.addressInput.value = u;
      this._loadURL(u);
    }
    this._updateButtons();
  }

  forward() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      const u = this.history[this.historyIndex];
      this.currentURL = u;
      if (this.addressInput) this.addressInput.value = u;
      this._loadURL(u);
    }
    this._updateButtons();
  }

  reload() {
    if (this.currentURL) this._loadURL(this.currentURL, true);
  }

  setMockPages(pages) {
    // pages: { url: htmlString }
    this.mockPages = Object.assign({}, this.mockPages, pages || {});
  }

  // INTERNAL

  _updateButtons() {
    this.btnBack.setAlpha(this.historyIndex > 0 ? 1 : 0.4);
    this.btnForward.setAlpha(this.historyIndex < this.history.length -1 ? 1 : 0.4);
  }

  _setLoading(v) {
    this.loading = !!v;
    this.loadingText.setText(this.loading ? "Loading..." : "");
    this.loadingText.setVisible(this.loading);
  }

  _showHome() {
    // default home content
    if (this.mode === "mock") {
      this.mockText.setText("<FramerWorks browser>\nEnter a URL or click a link.");
    } else {
      // try to load about:blank
      if (this.iframeElement) {
        this.iframeElement.src = 'about:blank';
      }
    }
  }

  _loadURL(url, force=false) {
    this._setLoading(true);

    if (this.mode === "mock") {
      // look up mockPages
      const html = this.mockPages[url];
      if (typeof html === 'string') {
        // simple rendering: strip tags and show text for simplicity, or show raw html
        // We'll show the HTML as text
        // For nicer effect, remove tags for plain text
        const stripped = html.replace(/<?[^>]+(>|$)/g, "");
        this.mockText.setText(stripped);
        this._setLoading(false);
      } else {
        // not found
        this.mockText.setText(BrowserUI.ERRORS ? BrowserUI.ERRORS.HTTP_404 : BrowserUI.ERROR.HTTP_404);
        this._setLoading(false);
      }
      return;
    }

    // iframe mode: navigate the iframe
    if (this.iframeElement) {
      try {
        // set src
        this.iframeElement.src = url;
        // loading indicator will be turned off on load event
      } catch (e) {
        this._setLoading(false);
        this._showError(BrowserUI.ERRORS ? BrowserUI.ERRORS.NETWORK_ERROR : BrowserUI.ERROR.NETWORK_ERROR);
      }
    } else {
      // iframe not available (platform limitation) -> show fallback
      this.mockText.setText(BrowserUI.ERRORS ? BrowserUI.ERRORS.BLOCKED : BrowserUI.ERROR.BLOCKED);
      this._setLoading(false);
    }
  }

  _showError(errString) {
    // show error in content area
    if (this.mode === "mock") {
      this.mockText.setText(errString);
    } else {
      if (this.iframeDom) this.iframeDom.setVisible(false);
      this.mockText.setText(errString);
    }
  }

  // programmatic helper: open and navigate quickly
  openAndNavigate(url) {
    this.open(url);
  }

  destroy() {
    // cleanup DOM listeners and Phaser objects
    if (this.addressInput && this.addressInput.removeEventListener) {
      try { this.addressInput.removeEventListener('keydown', ()=>{}); } catch(e){}
    }
    if (this.iframeElement) {
      try { this.iframeElement.src = 'about:blank'; } catch(e){}
    }
    // destroy phaser objects
    this.overlay.destroy();
    this.window.destroy();
    this.btnBack.destroy();
    this.btnForward.destroy();
    this.btnReload.destroy();
    this.btnClose.destroy();
    if (this.addressDom && this.addressDom.destroy) this.addressDom.destroy();
    this.loadingText.destroy();
    this.contentBg.destroy();
    this.mockText.destroy();
    if (this.iframeDom && this.iframeDom.destroy) this.iframeDom.destroy();
  }
}