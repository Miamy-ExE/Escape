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
        this.dialog = config.dialog || [];
        this.dialogStep = 0;
        this.currentInput = "";
        this.active = false;
        this.onSuccess = config.onSuccess || function(){};
        this.cursorMode = config.cursorMode || TerminalUI.Cursor.LINE;
        this.inputDom = null;
				
				// visual config
        this.width = config.width || 600;
        this.height = config.height || 350;
        this.padding = config.padding || 20;
        this.maxLines = config.maxLines || 12;
        this.fontSize = config.fontSize || "18px";
        this.fontFamily = config.fontFamily || "monospace";
        this.color = config.color || "#00ff00";

        // Overlay (optional halbtransparent)
        this.overlay = scene.add.rectangle(
            cx, cy,
            scene.scale.width, scene.scale.height,
            0x000000, 0.5
        ).setDepth(9000).setVisible(false);

        // Terminal-Fenster (schwarzes Rechteck)
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

        // Cursor blink
        scene.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                if(this.active) this.cursor.setVisible(!this.cursor.visible);
            }
        });

        // Tastatureingaben
        scene.input.keyboard.on("keydown", (ev) => this.handleKey(ev));
    }

    // Terminal öffnen
    open() {
        this.active = true;
        this.dialogStep = 0;
        this.currentInput = "";

        this.overlay.setVisible(true);
        this.window.setVisible(true);
        this.promptText.setVisible(true);
        this.inputText.setVisible(true);
        this.cursor.setVisible(true);

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
    }

    // Aktuellen Dialogschritt starten
    startDialogStep() {
        const step = this.dialog[this.dialogStep];
        if(!step) return;
        this.currentInput = "";
        this.promptText.setText(step.prompt);
        this.updateInputText();
    }

    // Eingabetext + Cursor aktualisieren
    updateInputText() {
        const step = this.dialog[this.dialogStep];
        if(!step) return;
        const displayText = step.ispassword ? "*".repeat(this.currentInput.length) : this.currentInput;
        this.inputText.setText(displayText);

        // Cursor hinter Eingabetext positionieren
        this.cursor.setX(this.inputText.x + this.inputText.width + 2);
        this.cursor.setY(this.inputText.y);
    }

    // Tastatureingaben verarbeiten
    handleKey(event) {
        if(!this.active) return;

        if(event.key === "Enter") {
            this.checkAnswer();
        } else if(event.key === "Backspace") {
            this.currentInput = this.currentInput.slice(0, -1);
            this.updateInputText();
        } else if(event.key.length === 1) {
            this.currentInput += event.key;
            this.updateInputText();
        }
    }

    // Eingabe prüfen
    checkAnswer() {
        const step = this.dialog[this.dialogStep];
        if(!step) return;

        if(this.currentInput.toLowerCase() === step.answer.toLowerCase()) {
            this.dialogStep++;
            if(this.dialogStep >= this.dialog.length) {
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
