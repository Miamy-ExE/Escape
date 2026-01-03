class TerminalUI {
	static ERROR = {
		BASH_NOT_FOUND: "bash: command not found",
		USER_NOT_FOUND: "User does not exist",
		ACCESS_DENIED: "Access denied",
		HTTP_404_NOT_FOUND: "404 Not Found",
		WRONG_PASSWORD: "Incorrect Password",
		GREP_NO_MATCH: "grep: no match found",
		READFILE_NO_FILE: "readfile: there is no such file"
	};

	static CURSOR = {
		BLOCK: "█",
		LINE: "|",
		UNDERSCORE: "_",
		LOADING: {
			SPINNER: [ 
				"⠋", "⠛", "⠙", "⠹", 
				"⠸", "⠼", "⠴", "⠶", 
				"⠦", "⠧", "⠇", "⠏" 
			],
			BASIC: [
				"□□□",
				"■□□",
				"■■□",
				"■■■"
			],
			BASIC_LOOP: [
				"□□□",
				"■□□",
				"■■□",
				"■■■",
				"■■□ ",
				"■□□ "
			],
			CLI_SPINNER: [ 
				"–", "\\", "|", "/" 
			],
			DOT_CIRCLE: [
				"⠂", "⠐", "⠠", "⠄"
			],
			PROGRESS_BAR: [
				"[□□□□□]",
				"[■□□□□]",
				"[■■□□□]",
				"[■■■□□]",
				"[■■■■□]",
				"[■■■■■]"
			],
			PROGRESS_BAR_LOOP: [
				"[□□□□□]",
				"[■□□□□]",
				"[■■□□□]",
				"[■■■□□]",
				"[■■■■□]",
				"[■■■■■]",
				"[■■■■□] ",
				"[■■■□□] ",
				"[■■□□□] ",
				"[■□□□□] "
			],
			PULSE_BLOCK: [
				"░", "▒", "▓", "█",  
				"▓ ", "▒ "
			],
			MATRIX: [
				"ｱ", "ｳ", "ｴ", "ｵ", 
				"ｶ", "ｷ", "ｸ", "ｹ", 
				"ｺ"
			],
			LOADING_BAR: [
				"[     ]",
				"[>    ]",
				"[=>   ]",
				"[==>  ]",
				"[====>]",
				"[=====]"
			],
			MINI_BAR: [
				"[    ]",
				"[=   ]",
				"[==  ]",
				"[=== ]",
				"[====]"
			],
			MINI_ARROW: [
				"[    ]",
				"[>   ]",
				"[=>  ]",
				"[ => ]",
				"[  =>]",
				"[   =]"
			]
		}
	};
	
	static SUCCESS = {
		FUNC: () => { console.log("terminal closed"); },
		TEXT: (r) => { return r; }
	};
	
	static COMMAND = {
		TYPE: { 
			LOGIN: {
				promptPrefix: "Login:",
				cursorType: TerminalUI.CURSOR.LINE,
				loadingCursor: TerminalUI.CURSOR.LOADING.SPINNER,
				loadingDuration: 2,
				errType: TerminalUI.ERROR.USER_NOT_FOUND,
				successType: TerminalUI.SUCCESS.TEXT("Logged in")
			},
			READFILE: {
				promptPrefix: "File:",
				cursorType: TerminalUI.CURSOR.BLOCK,
				loadingCursor: TerminalUI.CURSOR.LOADING.LOADING_BAR,
				loadingDuration: 2
			},
			SEARCH: 3,
			BASH: 4
		},
		PRESET: {
			clear: {
				run: (t) => {
					t.history = [];
					t.inputText.setText("");
					t.historyText.setText("");
					t.updateInput();
				}
			},
			help: {
				run: (t) => {
					const triggerList = t.commands.map(c => c.trigger).join(", ");
					t.addHistory("try one of the following commands:");
					t.addHistory("clear, help, echo <phrase>");
					if (triggerList !== "undefined") t.addHistory(triggerList);
				}
			},
			echo: {
				run: (t) => { 
					let cmd = t.inputText.text;
					let phrase = cmd.substring(12+5);
					t.addHistory(phrase);
				}
			}
		}
	};
	
	static isLoadingCursor(cursorType) {
		return Object.values(TerminalUI.CURSOR.LOADING)
			.includes(cursorType);
	}


	constructor(scene, config = {}) {
		this.scene = scene;
		this.commands = config.commands || [];

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

		this.cursorType = config.cursorType || TerminalUI.CURSOR.BLOCK;
		this.cursorDisp = TerminalUI.isLoadingCursor(this.cursorType)
    	? " "
    	: this.cursorType;


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

		this.cursor = scene.add.text(0, 0, this.cursorDisp, this.textStyle)
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

		this.cursorTick = scene.time.addEvent({
			delay: 500,
			loop: true,
			callback: () => {
				if (!this.active) {
					this.cursor.setVisible(false);
					this.cursorTick.paused = true;
					return;
				}
				if (TerminalUI.isLoadingCursor(this.cursorType)) {
					this.cursorTick.delay = 100;
					if (
						this.cursorType == TerminalUI.CURSOR.LOADING.CLI_SPINNER 
							|| 
						this.cursorType == TerminalUI.CURSOR.LOADING.DOT_CIRCLE) 
							this.cursorTick.delay = 80;
					let s = this.cursorType; 
					let p = this.cursorDisp;
					let n;
					n = s.indexOf(p);
					if (n === -1) n = 0;
					this.cursorDisp = s[(n + 1) % s.length];
					if (!this.cursorDisp) this.cursorDisp = s[0];
					
					this.cursor.setText(this.cursorDisp);
					this.cursor.setVisible(true);
				} else {
					this.cursorTick.delay = 500;
					this.cursor.setVisible(!this.cursor.visible);
					this.cursorDisp = this.cursorType;
					this.cursor.setText(this.cursorDisp);
				}
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
		this.cursorTick.paused = false;
		this.domInput.style.display = "block";
		this.domInput.focus();

		const triggerList = this.commands.map(c => c.trigger).join(", ");
		this.addHistory("try one of the following commands:");
		this.addHistory("clear, help, echo <phrase>");
		if (triggerList !== "undefined") this.addHistory(triggerList);

		this.updateInput();
	}

	close() {
		this.active = false;
		this.overlay.setVisible(false);
		this.window.setVisible(false);
		this.historyText.setVisible(false);
		this.inputText.setVisible(false);
		this.cursor.setVisible(false);
		this.cursorTick.paused = true;
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
		
		this.updateInput();
	}


	// -------- INPUT --------
	updateInput() {
		this.inputText.setText(this.promptPrefix + this.currentInput);
		// Input immer unter History
		this.inputText.setY(
			(this.historyText.text == "") ? this.historyText.y : (this.historyText.y + this.historyText.height + 6)
		);
		this.cursor.setX(this.inputText.x + this.inputText.width + 2);
		this.cursor.setY(this.inputText.y);
	}

	handleInput() {
		if (TerminalUI.isLoadingCursor(this.cursorType)) return
		const raw = this.currentInput.trim();
		if (!raw) {
			this.addHistory(this.promptPrefix);
			return;
		}
		
		if (this.activeCommand) return;
		
		this.addHistory(this.promptPrefix + raw);
		
		if (this.detectStdCommand(raw)) return;

		this.handleCommand(raw);
	}
	
	handleCommand() {
		
	}
	
	detectStdCommand(trigger) {
		for (const [stdTrigger, cmd] of Object.entries(TerminalUI.COMMAND.PRESET)) {
  		if (trigger.includes(stdTrigger)) {
  			if (typeof cmd.run === "function") cmd.run(this);
				else if (typeof cmd.msg === "string") this.addHistory(cmd.msg);
  			return true;
  		}
  	}
  	return false;
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