// TerminalUI.js
// FramerWorks Terminal UI mit neuer Befehlslogik

class TerminalUI {
    // Error strings / categories
    static ERROR = {
        BASH_NOT_FOUND: "bash: command not found",
        USER_NOT_EXISTING: "User does not exist",
        ACCESS_DENIED: "Access denied",
        WRONG_PASSWORD: "Incorrect Password"
    };

    // Cursor visuals
    static Cursor = {
        BLOCK: "█",
        LINE: "|",
        UNDERSCORE: "_"
    };

    // Typen für Konfiguration
    static TYPES = {
        COMMAND: "command",
        LOGIN: "login",
        PASSWD: "passwd"
    };

    constructor(scene, config = {}) {
        this.scene = scene;
        this.width = config.width || 680;
        this.height = config.height || 360;
        this.fontSize = config.fontSize || "18px";
        this.fontFamily = config.fontFamily || "monospace";
        this.color = config.color || "#00ff00";
        this.cursorMode = config.cursorMode || TerminalUI.Cursor.BLOCK;
        this.maxLines = config.maxLines || 12;
        this.promptPrefix = config.promptPrefix || "FW@guest ~# ";
        this.topLine = config.topLine || "=== FramerWorks Terminal ===\ntry typing help";

        // Dialog / Commands
        this.commands = config.commands || [];
        this.active = false;
        this.currentInput = "";
        this.lines = [];
        this.activeCommand = null;
        this.activeStep = null;
        this.domInputActive = false;
        this.defaultPromptPrefix = this.promptPrefix;
				this.commandActive = false;
				this.commandPrompt = "";

        // UI
        const cx = scene.scale.width / 2;
        const cy = scene.scale.height / 2;

        this.overlay = scene.add.rectangle(cx, cy, scene.scale.width, scene.scale.height, 0x000000, 0.5)
            .setDepth(9000).setVisible(false);

        this.window = scene.add.rectangle(cx, cy, this.width, this.height, 0x000000, 1)
            .setOrigin(0.5).setDepth(9001).setVisible(false);

        const textX = cx - this.width/2 + 10;
        const textY = cy - this.height/2 + 10;

        this.outputText = scene.add.text(textX, textY, "", { fontFamily: this.fontFamily, fontSize: this.fontSize, color: this.color, wordWrap: { width: this.width - 20 }})
            .setDepth(9002).setVisible(false);

        this.inputText = scene.add.text(textX, textY, "", { fontFamily: this.fontFamily, fontSize: this.fontSize, color: this.color })
            .setDepth(9003).setVisible(false);

        this.cursor = scene.add.text(textX, textY, this.cursorMode, { fontFamily: this.fontFamily, fontSize: this.fontSize, color: this.color })
            .setDepth(9003).setVisible(false);

        // ---------------------------
        // DOM INPUT (für iPad Tastatur)
        // ---------------------------
        this.domInput = document.createElement("input");
        this.domInput.type = "text";
        this.domInput.autocomplete = "off";
        this.domInput.autocorrect = "off";
        this.domInput.autocapitalize = "none";
        this.domInput.spellcheck = false;

        this.domInput.style.position = "absolute";
        this.domInput.style.opacity = "0";          // unsichtbar
        this.domInput.style.pointerEvents = "none"; // nicht anklickbar
        this.domInput.style.zIndex = "999999";
        this.domInput.style.display = "none";       // zunächst aus

        document.body.appendChild(this.domInput);

        // DOM Input → Terminal Input übernehmen
        this.domInput.addEventListener("input", () => {
            this.currentInput = this.domInput.value;
            this._updateInputText();
        });

        // Enter aus DOM Input
        this.domInput.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") {
                ev.preventDefault();
                this._onEnter();
                this.domInput.value = "";
                this.currentInput = "";
                this._updateInputText();
            }
        });

        // ---------------------------

        // Standardbefehle
        this.standardCommands = {
            help: { return: () => this._generateHelp() },
            clear: { action: "CLEAR_SCREEN" },
            exit: { action: "CLOSE_TERMINAL" },
            version: { return: "Framerworks Shell v2.5.8" }
        };

        // Cursor blink
        this.cursorVisible = true;
        this.blinkEvent = scene.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                if (this.active) {
                    this.cursorVisible = !this.cursorVisible;
                    this.cursor.setVisible(this.cursorVisible);
                } else {
                    this.cursor.setVisible(false);
                }
            }
        });

        // Keyboard (Phaser)
        this.keyHandler = (ev) => this._handleKey(ev);
        scene.input.keyboard.on("keydown", this.keyHandler);

        // Resize → DOM Input mitbewegen
        window.addEventListener("resize", () => this._positionDomInput());
    }

    // ---------------- PUBLIC ----------------
    open() {
        this.active = true;
        this.lines = [];
        if (this.topLine) this.addOutput(this.topLine);

        this.overlay.setVisible(true);
        this.window.setVisible(true);
        this.outputText.setVisible(true);
        this.inputText.setVisible(true);
        this.cursor.setVisible(true);

        // DOM Input aktivieren
        this.domInput.value = "";
        this.domInput.style.display = "block";
        this._positionDomInput();

        setTimeout(() => this.domInput.focus(), 50); // iPad fix

        this._updateInputText();
    }

    close() {
        this.active = false;
        this.overlay.setVisible(false);
        this.window.setVisible(false);
        this.outputText.setVisible(false);
        this.inputText.setVisible(false);
        this.cursor.setVisible(false);

        // DOM Input verstecken
        this.domInput.blur();
        this.domInput.style.display = "none";
    }

    addOutput(text) {
        const lines = String(text).split("\n");
        this.lines.push(...lines);
        while (this.lines.length > this.maxLines) this.lines.shift();
        this.outputText.setText(this.lines.join("\n"));
        this._updateInputText();
    }

    clearOutput() {
        this.lines = [];
        this.outputText.setText("");
        this._updateInputText();
    }

    runCommand(input) {
        this.currentInput = input;
        this._onEnter();
    }

    // ---------------- INTERNAL ----------------

    _positionDomInput() {
        this.domInput.left = "297px";
 			  this.domInput.right = "297px";
 			  this.domInput.width = "678px";
 			  this.domInput.height = "430px";
    }

    _handleKey(ev) {
		    if (!this.active) return;

		    // Blockiere Terminal-Eingaben, wenn DOM Input aktiv ist
		    if (this.domInputActive) return;
	
		    if (ev.key === "Enter") this._onEnter();
		    else if (ev.key === "Backspace") {
		        this.currentInput = this.currentInput.slice(0, -1);
		        this._updateInputText();
		    } else if (ev.key.length === 1) {
		        this.currentInput += ev.key;
		        this._updateInputText();
		    }
		}

    _updateInputText() {
        const display =
            this.activeStep && this.activeStep.type === TerminalUI.TYPES.PASSWD
                ? "*".repeat(this.currentInput.length)
                : this.currentInput;

        this.inputText.setText(this.promptPrefix + display);

        const outBottom = this.outputText.y + this.outputText.height;
        this.inputText.setY(outBottom + 4);

        this.cursor.setX(this.inputText.x + this.inputText.width + 2);
        this.cursor.setY(this.inputText.y);
    }

    _onEnter() {
		    const raw = this.currentInput.trim();
		    if (!raw) {
		        this.currentInput = "";
		        this.domInput.value = "";
		        this._updateInputText();
		        return;
		    }

		    const parts = raw.split(/\s+/);
		    const cmd = parts[0].toLowerCase();
		    const args = parts.slice(1);
		
		    // --------------------------
		    // 1. Wenn ein LOGIN/PASSWD Step aktiv ist
		    // --------------------------
		    if (this.activeStep) {
		        this._processStep(raw, this.activeStep);
		
		        this.currentInput = "";
		        this.domInput.value = "";
		        this._updateInputText();
		        return;
		    }
		
		    // --------------------------
    		// 2. Standardbefehle (nur wenn KEIN commandActive)
    		// --------------------------
		    if (!this.commandActive && this.standardCommands[cmd]) {
    		    const def = this.standardCommands[cmd];
		
    		    if (def.return) {
    		        const out = (typeof def.return === "function")
    		            ? def.return(args)
    		            : def.return;
    		        this.addOutput(out);
    		    } else if (def.action === "CLEAR_SCREEN") {
    		        this.clearOutput();
    		    } else if (def.action === "CLOSE_TERMINAL") {
		            this.close();
		        }
		
		        this.currentInput = "";
		        this.domInput.value = "";
		        this._updateInputText();
		        return;
		    }

		    // --------------------------
		    // 3. Benutzerdefinierte Commands
		    // --------------------------
		
		    // Wenn bereits ein Command läuft → keine neuen Commands
		    if (this.commandActive) {
		        this.addOutput("A command is already running.");
		        this.currentInput = "";
		        this.domInput.value = "";
		        this._updateInputText();
		        return;
		    }
		
		    // Command lookup
		    const cmdDef = this.commands.find(c => c.command === cmd);
		    if (cmdDef) {
		        this._startCommand(cmdDef);
		    } else {
		        this.addOutput(TerminalUI.ERROR.BASH_NOT_FOUND);
		    }

		    // --------------------------
		    // Cleanup input
		    // --------------------------
		    this.currentInput = "";
		    this.domInput.value = "";
		    this._updateInputText();
		}


    _startCommand(cmdDef) {
		    // Command darf nur starten, wenn keiner aktiv ist
    		if (this.commandActive) {
    		    this.addOutput("A command is already running.");
    		    return;
    		}

    		this.commandActive = true;
    		this.commandPrompt = (cmdDef.promptOverride || (cmdDef.command + ": "));

    		// Prompt ersetzen
    		this.promptPrefix = this.commandPrompt;

		    // LOGIN-TYPE startet mit Schritt 1
		    if (cmdDef.type === TerminalUI.TYPES.LOGIN) {
		        this.activeStep = cmdDef;
		    }

		    // COMMAND mit sofortiger Antwort
		    else if (cmdDef.type === TerminalUI.TYPES.COMMAND) {
		        if (typeof cmdDef.answer === "function") {
		            const res = cmdDef.answer(this);
		            if (typeof res === "string") this.addOutput(res);
		        } else {
		            this.addOutput(cmdDef.answer);
		        }
		        this._endCommand();
		    }

    this._updateInputText();
}


    _processStep(input, step) {
		    const ok = String(input).toLowerCase() === String(step.awaits).toLowerCase();

		    if (ok) {
		        // Ausgabe des Erfolgs
		        if (typeof step.answer === "string") this.addOutput(step.answer);
		        else if (typeof step.answer === "function") {
		            const res = step.answer(this);
		            if (typeof res === "string") this.addOutput(res);
		        }

		        // Weiterer Schritt?
		        if (step.onsuccess) {
		            this.activeStep = step.onsuccess;
		        } else {
		            this.activeStep = null;
		            this._endCommand();
		        }
		    } else {
		        this.addOutput(step.errtype || TerminalUI.ERROR.WRONG_PASSWORD);
		    }
		}
		
		_endCommand() {
 		   this.commandActive = false;
 		   this.activeStep = null;

 		   // Prompt zurücksetzen
 		   this.promptPrefix = this.defaultPromptPrefix;

 		   this._updateInputText();
		}

		

}
