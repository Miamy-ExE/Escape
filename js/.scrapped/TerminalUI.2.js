class TerminalUI {
    static ERROR = {
        BASH_NOT_FOUND: "bash: command not found",
        USER_NOT_EXISTING: "User does not exist",
        ACCESS_DENIED: "Access denied",
        HTTP_404: "404 Not Found",
        WRONG_PASSWORD: "Incorrect Password",
        GREP_NO_MATCH: "grep: no match found"
    };

    static Cursor = {
        BLOCK: "█",
        LINE: "|",
        UNDERSCORE: "_"
    };

    constructor(scene, config = {}) {
        this.scene = scene;
        this.dialogTriggers = config.dialog || [];  // Array von Triggern
        this.activeTrigger = null;                 // Aktiver Trigger
        this.dialogStep = 0;
        this.currentInput = "";
        this.active = false;
        this.history = [];                         // Verlauf speichern
        this.onSuccess = config.onSuccess || function(){};
        this.cursorMode = config.cursorMode || TerminalUI.Cursor.LINE;
        this.inputDom = null;
        
        // Visual config
        this.width = config.width || 680;
        this.height = config.height || 360;
        this.padding = config.padding || 20;
        this.maxLines = config.maxLines || 12;
        this.fontSize = config.fontSize || "18px";
        this.fontFamily = config.fontFamily || "monospace";
        this.color = config.color || "#00ff00";

        const cx = scene.scale.width / 2;
        const cy = scene.scale.height / 2;

        // Overlay (halbtransparent)
        this.overlay = scene.add.rectangle(
            cx, cy,
            scene.scale.width, scene.scale.height,
            0x000000, 0.5
        ).setDepth(9000).setVisible(false);

        // Terminal-Fenster
        this.window = scene.add.rectangle(
            cx, cy,
            this.width, this.height,
            0x000000, 1
        ).setOrigin(0.5).setDepth(9001).setVisible(false);

        // Textstil
        this.textStyle = {
            fontFamily: "monospace",
            fontSize: "20px",
            color: "#00ff00"
        };

        // Prompt-Text
        this.promptText = scene.add.text(
            cx - this.width/2 + 20,
            cy - this.height/2 + 20,
            "",
            this.textStyle
        ).setDepth(9002).setVisible(false);

        // Eingabetext
        this.inputText = scene.add.text(
            cx - this.width/2 + 20,
            cy - this.height/2 + 55,
            "",
            this.textStyle
        ).setDepth(9002).setVisible(false);

        // Cursor
        this.cursor = scene.add.text(
            cx - this.width/2 + 20,
            cy - this.height/2 + 55,
            this.cursorMode,
            this.textStyle
        ).setDepth(9002).setVisible(false);

        // ---------------- DOM INPUT ----------------
        this.domInput = document.createElement("input");
        this.domInput.type = "text";
        this.domInput.autocomplete = "off";
        this.domInput.spellcheck = false;
        this.domInput.style.position = "absolute";
        this.domInput.style.opacity = "0";
        this.domInput.style.pointerEvents = "auto";
        this.domInput.style.zIndex = "999999";
        this.domInput.style.display = "none";
        this.domInput.style.left = "297px";
        this.domInput.style.right = "296px";
        this.domInput.style.width = "678px";
        this.domInput.style.height = "430px";
        this.domInput.style.top = "212px";

        document.body.appendChild(this.domInput);

        // Input-Event
        this.domInput.addEventListener("input", () => {
            this.currentInput = this.domInput.value;
            this.updateInputText();
        });

        // Enter-Taste
        this.domInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                this.checkAnswer();
                this.domInput.value = "";
                this.currentInput = "";
                this.updateInputText();
            }
        });

        // Cursor blink
        scene.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                if(this.active) this.cursor.setVisible(!this.cursor.visible);
            }
        });
    }

    // Terminal öffnen
    open(triggerName = null) {
        this.active = true;
        this.dialogStep = 0;
        this.currentInput = "";
        this.history = [];

        // Trigger auswählen
        this.activeTrigger = this.dialogTriggers.find(t => t.trigger === triggerName) || null;
        if(!this.activeTrigger) return;

        this.overlay.setVisible(true);
        this.window.setVisible(true);
        this.promptText.setVisible(true);
        this.inputText.setVisible(true);
        this.cursor.setVisible(true);

        this.domInput.style.display = "block";
        this.domInput.value = "";
        this.domInput.focus();

        this.startDialogStep();
    }

    // Terminal schließen
    close() {
        this.active = false;
        this.overlay.setVisible(false);
        this.window.setVisible(false);
        this.promptText.setVisible(false);
        this.inputText.setVisible(false);
        this.cursor.setVisible(false);

        this.domInput.style.display = "none";
        this.domInput.blur();
    }

    // Aktuellen Dialogschritt starten
    startDialogStep() {
        if(!this.activeTrigger) return;
        const step = this.activeTrigger.steps[this.dialogStep];
        if(!step) return;
        this.currentInput = "";
        this.promptText.setText(step.prompt);
        this.updateInputText();
    }

    // Eingabetext + Cursor aktualisieren
    updateInputText() {
        if(!this.activeTrigger) return;
        const step = this.activeTrigger.steps[this.dialogStep];
        if(!step) return;
        const displayText = step.ispassword ? "*".repeat(this.currentInput.length) : this.currentInput;
        this.inputText.setText(displayText);

        // Cursor hinter Eingabetext positionieren
        this.cursor.setX(this.inputText.x + this.inputText.width + 2);
        this.cursor.setY(this.inputText.y);
    }

    // Eingabe prüfen
    checkAnswer() {
        if(!this.activeTrigger) return;
        const step = this.activeTrigger.steps[this.dialogStep];
        if(!step) return;

        this.history.push({ prompt: step.prompt, input: this.currentInput });

        if(this.currentInput.toLowerCase() === step.answer.toLowerCase()) {
            this.dialogStep++;
            if(this.dialogStep >= this.activeTrigger.steps.length) {
                this.close();
                this.onSuccess();
            } else {
                this.startDialogStep();
            }
        } else {
            // Falsche Eingabe → reset
            this.currentInput = "";
            this.updateInputText();
        }
    }
}
