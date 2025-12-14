// TerminalUI.js
// FramerWorks friendly Terminal UI for games

class TerminalUI {
    // Error strings / categories
    static ERROR = {
        BASH_NOT_FOUND: "bash: command not found",
        USER_NOT_EXISTING: "User does not exist",
        ACCESS_DENIED: "Access denied",
        HTTP_404: "404 Not Found",
        WRONG_PASSWORD: "Incorrect Password",
        GREP_NO_MATCH: "grep: no match found"
    };

    // Cursor visuals
    static Cursor = {
        BLOCK: "█",
        LINE: "|",
        UNDERSCORE: "_"
    };

    // Some built-in commands
    static COMMANDS = {
        help: {
            return: () => "Available commands: help, clear, exit, version"
        },
        clear: {
            action: "CLEAR_SCREEN"
        },
        version: {
            return: () => "Framerworks Shell v2.5.8"
        },
        exit: {
            action: "CLOSE_TERMINAL"
        }
    };

    constructor(scene, config = {}) {
        this.scene = scene;
        this.dialog = config.dialog || [];
        this.onSuccess = config.onSuccess || function(){};
        this.active = false;
        this.closeEvent = null;
        this.inputDom = null;
        this.backArrow = null;

        // visual config
        this.width = config.width || 600;
        this.height = config.height || 350;
        this.padding = config.padding || 20;
        this.maxLines = config.maxLines || 12;
        this.fontSize = config.fontSize || "18px";
        this.fontFamily = config.fontFamily || "monospace";
        this.color = config.color || "#00ff00";

        // cursor mode
        this.cursorMode = config.cursorMode || TerminalUI.Cursor.LINE;

        // normalize dialog
        this.normalizedDialog = this._normalizeDialog(this.dialog);
        this.outerIndex = 0;
        this.innerIndex = 0;

        // input state
        this.currentInput = "";
        this.isPassword = false;
        this.activeStep = null;

        // output buffer
        this.lines = [];

        // create UI elements
        const cx = scene.scale.width / 2;
        const cy = scene.scale.height / 2;

        this.overlay = scene.add.rectangle(
            cx, cy,
            scene.scale.width, scene.scale.height,
            0x000000, 0.5
        ).setDepth(9000).setVisible(false);

        this.window = scene.add.rectangle(
            cx, cy,
            this.width, this.height,
            0x000000, 1
        ).setOrigin(0.5).setDepth(9001).setVisible(false);

        const textX = cx - this.width/2 + this.padding;
        const textY = cy - this.height/2 + this.padding;

        this.outputText = scene.add.text(
            textX, textY, "",
            { fontFamily: this.fontFamily, fontSize: this.fontSize, color: this.color, wordWrap: { width: this.width - 2*this.padding } }
        ).setDepth(9002).setVisible(false);

        this.promptText = scene.add.text(
            textX,
            textY + (this.maxLines * (parseInt(this.fontSize) + 2)),
            "",
            { fontFamily: this.fontFamily, fontSize: this.fontSize, color: this.color }
        ).setDepth(9003).setVisible(false);

        this.inputText = scene.add.text(
            textX,
            this.promptText.y + (parseInt(this.fontSize) + 6),
            "",
            { fontFamily: this.fontFamily, fontSize: this.fontSize, color: this.color }
        ).setDepth(9003).setVisible(false);

        this.cursor = scene.add.text(
            this.inputText.x,
            this.inputText.y,
            this.cursorMode,
            { fontFamily: this.fontFamily, fontSize: this.fontSize, color: this.color }
        ).setDepth(9003).setVisible(false);

        // blink timer
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

        // keyboard input
        this.keyHandler = (ev) => this.handleKey(ev);
        scene.input.keyboard.on("keydown", this.keyHandler);

        // finished setup
        this.clearOutput();
    }

    // normalize dialog
    _normalizeDialog(dialog) {
        const out = [];
        if (!Array.isArray(dialog)) return out;
        for (let el of dialog) {
            if (Array.isArray(el)) out.push(el.map(s => this._normalizeStep(s)));
            else out.push([ this._normalizeStep(el) ]);
        }
        return out;
    }

    _normalizeStep(step) {
        if (!step) return null;
        return {
            prompt: step.prompt || "",
            awaits: (typeof step.awaits !== "undefined") ? step.awaits : null,
            ispassword: !!step.ispassword,
            answer: step.answer || "",
            errtype: step.errtype || TerminalUI.ERROR.WRONG_PASSWORD
        };
    }

    open(startAtDialogIndex = 0) {
        this.active = true;
        this.outerIndex = startAtDialogIndex || 0;
        this.innerIndex = 0;
        this.currentInput = "";
        this.clearOutput();

        this.overlay.setVisible(true);
        this.window.setVisible(true);
        this.outputText.setVisible(true);
        this.promptText.setVisible(true);
        this.inputText.setVisible(true);
        this.cursor.setVisible(true);

        // ESC Listener
        this.closeEvent = this.scene.input.keyboard.addKey('ESC');
        this.closeEvent.on('down', () => this.close());

        // Overlay blockiert Hintergrund
        this.overlay.setInteractive();

        // Dialog starten
        this._startCurrentStep();

        // DOM Input für iPad / Mobile
            if (!this.inputDom) {
            		// dom <input> element
                const domInput = document.createElement('input');
                domInput.type = 'text';
                domInput.autocomplete = 'off';
                domInput.spellcheck = false;
                domInput.style.position = 'absolute';
                domInput.style.opacity = 0.01;
                domInput.style.left = '0px';
                domInput.style.top = '50px';
                domInput.style.width = '1px';
                domInput.style.height = '1px';
                domInput.style.zIndex = 10000;
                domInput.style.pointerEvents = 'auto';
                document.body.appendChild(domInput);
                
                // backarrow for exit
                this.backArrow = BackArrow(this.scene, 50,50, 
									() => this.close());

                domInput.addEventListener('input', e => {
                    const value = e.target.value;
                    if (value.length > this.currentInput.length) {
                        const newChars = value.slice(this.currentInput.length);
                        this.currentInput += newChars;
                    } else {
                        this.currentInput = value;
                    }
                    this._updateInputText();
                });

                domInput.addEventListener('keydown', ev => {
                    if (ev.key === 'Enter') {
                        ev.preventDefault();
                        this._onEnter();
                        domInput.value = '';
                    } else if (ev.key === 'Backspace') {
                        this.currentInput = this.currentInput.slice(0, -1);
                        this._updateInputText();
                    }
                });

                this.inputDom = domInput;

            // Terminal-Fenster klickbar -> Input fokussieren
            this.window.setInteractive().on('pointerdown', () => {
                this.inputDom.focus();
            });

            // direkt Fokus beim Öffnen
            this.inputDom.focus();
        }
    }

    close() {
        this.active = false;
        this.overlay.setVisible(false);
        this.window.setVisible(false);
        this.outputText.setVisible(false);
        this.promptText.setVisible(false);
        this.inputText.setVisible(false);
        this.cursor.setVisible(false);

        if (this.closeEvent) {
            this.closeEvent.destroy();
            this.closeEvent = null;
        }

        if (this.inputDom) {
            this.inputDom.blur();
            this.inputDom.style.pointerEvents = 'none';
        }
    }

    addOutput(line) {
        if (typeof line !== "string") line = String(line);
        const wrapped = line.split("\n");
        for (let l of wrapped) this.lines.push(l);
        while (this.lines.length > this.maxLines) this.lines.shift();
        this.outputText.setText(this.lines.join("\n"));
        this._repositionPromptAndInput();
    }

    clearOutput() {
        this.lines = [];
        this.outputText.setText("");
        this._repositionPromptAndInput();
    }

    _repositionPromptAndInput() {
        const outBottom = this.outputText.y + this.outputText.height;
        const gap = 6;
        this.promptText.setY(outBottom + gap);
        this.inputText.setY(this.promptText.y + (parseInt(this.fontSize) + 6));
        this.cursor.setY(this.inputText.y);
        this._updateCursorX();
    }

    _updateCursorX() {
        this.cursor.setText(this.cursorMode);
        this.cursor.setX(this.inputText.x + this.inputText.width + 2);
    }

    _startCurrentStep() {
        const step = this._getActiveStep();
        if (step) {
            this.activeStep = step;
            this.currentInput = "";
            this.isPassword = !!step.ispassword;
            this.promptText.setText(step.prompt);
            this.inputText.setText("");
            this._updateCursorX();
        } else {
            this.activeStep = null;
            this.isPassword = false;
            this.promptText.setText("> ");
            this.inputText.setText("");
            this._updateCursorX();
        }
    }

    _getActiveStep() {
        const out = this.normalizedDialog;
        if (!out || out.length === 0) return null;
        if (this.outerIndex >= out.length) return null;
        const inner = out[this.outerIndex];
        if (!inner || this.innerIndex >= inner.length) return null;
        return inner[this.innerIndex];
    }

    handleKey(event) {
        if (!this.active) return;
        const key = event.key;
        if (key === "Enter") this._onEnter();
        else if (key === "Backspace") {
            if (this.currentInput.length > 0) {
                this.currentInput = this.currentInput.slice(0, -1);
                this._updateInputText();
            }
        } else if (key.length === 1) {
            this.currentInput += key;
            this._updateInputText();
        }
    }

    _updateInputText() {
        const displayText = this.isPassword ? "*".repeat(this.currentInput.length) : this.currentInput;
        this.inputText.setText(displayText);
        this._updateCursorX();
    }
    
    _isMainCommand(input) {
		    if (!input) return false;
		    const cmd = input.split(/\s+/)[0].toLowerCase();
		    return TerminalUI.COMMANDS.hasOwnProperty(cmd);
		}


    _onEnter() {
        const raw = this.currentInput;
        const input = (raw || "").trim();

		    // 1️⃣ Prüfe zuerst Standardbefehle
   			if (this._isMainCommand(input)) {
    	    	this._processMainCommand(input);
      	  	this.currentInput = "";
    		    this._updateInputText();
      		  return;
    		}

    		// 2️⃣ Dialogmodus
        const step = this._getActiveStep();
        if (step) this._processDialogInput(input, step);
        else this._processMainCommand(input);

				
        this.currentInput = "";
        this._updateInputText();
    }

    _processDialogInput(input, step) {
    		if (!input || input.length === 0) {
            this.addOutput(step.prompt);
            this._startCurrentStep();
            return;
        }
    		
        const ok = this._matchAwait(input, step.awaits);

        if (ok) {
            this._handleAnswer(step.answer);
            this.innerIndex++;
            const inner = (this.normalizedDialog[this.outerIndex] || []);
            if (this.innerIndex >= inner.length) {
                this.outerIndex++;
                this.innerIndex = 0;
            }

            if (this.outerIndex >= this.normalizedDialog.length) {
                this.addOutput("[dialog complete]");
                this.close();
                this.onSuccess();
            } else this._startCurrentStep();
        } else {
            const err = step.errtype || TerminalUI.ERROR.WRONG_PASSWORD;
            this.addOutput(err);
            this.currentInput = "";
            this._updateInputText();
            this.promptText.setText(step.prompt);
        }
    }

    _matchAwait(input, awaits) {
        if (typeof awaits === "function") {
            try { return !!awaits(input); } catch(e) { return false; }
        }
        if (Array.isArray(awaits)) return awaits.some(a => String(a).toLowerCase() === String(input).toLowerCase());
        if (awaits === null || typeof awaits === "undefined") return true;
        return String(input).toLowerCase() === String(awaits).toLowerCase();
    }

    _handleAnswer(answer) {
        if (!answer) return;
        if (typeof answer === "string") this.addOutput(">> " + answer);
        else if (typeof answer === "function") {
            try {
                const res = answer(this);
                if (typeof res === "string") this.addOutput(">> " + res);
            } catch(e) { this.addOutput("Error executing action"); }
        } else this.addOutput(">> " + String(answer));
    }

    _processMainCommand(input) {
        if (!input || input.length === 0) {
            this.addOutput("");
            this._startCurrentStep();
            return;
        }

        const parts = input.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        const commandDef = TerminalUI.COMMANDS[cmd];
        if (!commandDef) {
            this.addOutput(TerminalUI.ERROR.BASH_NOT_FOUND);
            this._startCurrentStep();
            return;
        }

        if (commandDef.return) {
            const out = (typeof commandDef.return === "function") ? commandDef.return(args, this) : commandDef.return;
            this.addOutput(String(out));
            this._startCurrentStep();
            return;
        }

        if (commandDef.action) {
            switch(commandDef.action) {
                case "CLEAR_SCREEN":
                    this.clearOutput();
                    this._startCurrentStep();
                    break;
                case "CLOSE_TERMINAL":
                    this.addOutput("Exiting...");
                    this.close();
                    this.onSuccess();
                    break;
                default:
                    this.addOutput("[action: " + commandDef.action + "]");
                    this._startCurrentStep();
                    break;
            }
            return;
        }

        this.addOutput(TerminalUI.ERROR.BASH_NOT_FOUND);
        this._startCurrentStep();
    }

    runCommand(cmdString) {
        if (!this.active) this.open();
        this.currentInput = cmdString;
        this._onEnter();
    }

    destroy() {
        this.scene.input.keyboard.off("keydown", this.keyHandler);
        this.blinkEvent.remove(false);
        this.overlay.destroy();
        this.window.destroy();
        this.outputText.destroy();
        this.promptText.destroy();
        this.inputText.destroy();
        this.cursor.destroy();
        if (this.inputDom) document.body.removeChild(this.inputDom);
    }
}
