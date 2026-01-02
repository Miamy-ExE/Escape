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
		this.commands = config.dialog || [];

		this.activeCommand = null;
		this.stepIndex = 0;
		this.currentInput = "";
		this.active = false;

		// -------- HISTORY + PROMPT PREFIX --------
		this.history = [];
		this.promptPrefix = config.promptPrefix || "FW@guest ~# ";
		this.defaultPromptPrefix = this.promptPrefix;
		this.maxLines = 13;
		// ----------------------------------------

		this.cursorMode = config.cursorMode || TerminalUI.Cursor.LINE;

		// Visuals
		this.width = config.width || 680;
		this.height = config.height || 360;
		this.padding = config.padding || 20;
		this.fontSize = config.fontSize || "18px";
		this.fontFamily = config.fontFamily || "monospace";
		this.color = config.color || "#00ff00";

		const cx = scene.scale.width / 2;
		const cy = scene.scale.height / 2;

		this.overlay = scene.add.rectangle(cx, cy, scene.scale.width, scene.scale.height, 0x000000, 0.5)
			.setDepth(9000).setVisible(false);

		this.window = scene.add.rectangle(cx, cy, this.width, this.height, 0x000000, 1)
			.setOrigin(0.5).setDepth(9001).setVisible(false);

		this.textStyle = {
			fontFamily: this.fontFamily,
			fontSize: this.fontSize,
			color: this.color,
			wordWrap: { width: this.width - this.padding * 2 }
		};

		// HISTORY
		this.historyText = scene.add.text(
			cx - this.width/2 + this.padding,
			cy - this.height/2 + this.padding,
			"",
			this.textStyle
		).setDepth(9002).setVisible(false);

		// INPUT
		this.inputText = scene.add.text(
			cx - this.width/2 + this.padding,
			cy - this.height/2 + this.padding,
			"",
			this.textStyle
		).setDepth(9003).setVisible(false);

		this.cursor = scene.add.text(0, 0, this.cursorMode, this.textStyle)
			.setDepth(9003).setVisible(false);

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

		this.domInput.addEventListener("input", () => {
			this.currentInput = this.domInput.value;
			this.updateInput();
		});

		this.domInput.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				this.handleInput();
				this.domInput.value = "";
				this.currentInput = "";
				this.updateInput();
			}
		});

		scene.time.addEvent({
			delay: 500,
			loop: true,
			callback: () => {
				if (this.active) this.cursor.setVisible(!this.cursor.visible);
			}
		});
	}

	open() {
		this.active = true;
		this.activeCommand = null;
		this.stepIndex = 0;
		this.history = [];
		this.promptPrefix = this.defaultPromptPrefix;

		this.overlay.setVisible(true);
		this.window.setVisible(true);
		this.historyText.setVisible(true);
		this.inputText.setVisible(true);
		this.cursor.setVisible(true);
		this.domInput.style.display = "block";
		this.domInput.focus();

		const triggerList = this.commands.map(c => c.trigger).join(", ");
		this.addHistory(`try ${triggerList}`);

		this.updateInput();
	}

	close() {
		this.active = false;
		this.overlay.setVisible(false);
		this.window.setVisible(false);
		this.historyText.setVisible(false);
		this.inputText.setVisible(false);
		this.cursor.setVisible(false);
		this.domInput.style.display = "none";
		this.domInput.blur();
	}

	// -------- HISTORY --------	
	addHistory(text) {
		this.history.push(String(text));

    while (this.history.length > this.maxLines) {
        this.history.shift();
    }

    this.historyText.setText(this.history.join("\n"));
    
    // Input immer unter History
		this.inputText.setY(this.historyText.y + this.historyText.height + 6);
		this.updateInput();
	}


	// -------- INPUT --------
	updateInput() {
		this.inputText.setText(this.promptPrefix + this.currentInput);
		this.cursor.setX(this.inputText.x + this.inputText.width + 2);
		this.cursor.setY(this.inputText.y);
	}

	handleInput() {
		const raw = this.currentInput.trim();
		if (!raw) return;

		// Eingabe in History echoen (wie echtes Terminal)
		this.addHistory(this.promptPrefix + raw);

		if (!this.activeCommand) {
			const cmd = this.commands.find(c => c.trigger === raw.toLowerCase());
			if (cmd) {
				this.activeCommand = cmd;
				this.stepIndex = 0;
				this.processStep();
			} else {
				this.addHistory(TerminalUI.ERROR.BASH_NOT_FOUND);
			}
		} else {
			this.processStep();
		}
	}

	processStep() {
		const step = this.activeCommand.steps[this.stepIndex];
		if (!step) {
			this.activeCommand = null;
			this.stepIndex = 0;
			this.promptPrefix = this.defaultPromptPrefix;
			return;
		}

		const input = this.currentInput.trim();

		if (input.toLowerCase() === step.answer.toLowerCase()) {
			this.stepIndex++;
			if (this.stepIndex >= this.activeCommand.steps.length) {
				this.activeCommand = null;
				this.stepIndex = 0;
				this.promptPrefix = this.defaultPromptPrefix;
			} else {
				this.addHistory(this.activeCommand.steps[this.stepIndex].prompt);
			}
		} else {
			this.addHistory(step.errtype || TerminalUI.ERROR.BASH_NOT_FOUND);
		}
	}
}
