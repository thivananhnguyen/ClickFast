describe("ClickFast game", () => {
	let scoreElement;
	let timerElement;
	let clickButton;
	let resetButton;
	let initializeGame;

	function setupDOM() {
		document.body.innerHTML = `
			<div id="main">
				<div id="container">
					<p class="timer-label">Time left: <span id="timer">5</span>s</p>
					<p id="score" class="number">0</p>
					<button id="button-clicker" type="button">Click me!</button>
					<button id="button-reset" type="button">Reset</button>
				</div>
			</div>
		`;
	}

	function loadGameModule() {
		jest.resetModules();
		({ initializeGame } = require("./script.js"));
		initializeGame();
		scoreElement = document.getElementById("score");
		timerElement = document.getElementById("timer");
		clickButton = document.getElementById("button-clicker");
		resetButton = document.getElementById("button-reset");
	}

	beforeEach(() => {
		jest.useFakeTimers();
		setupDOM();
		loadGameModule();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	test("increments score when click button is pressed", () => {
		clickButton.click();
		expect(scoreElement.textContent).toBe("1");
	});

	test("counts down timer to zero in five seconds", () => {
		clickButton.click();
		jest.advanceTimersByTime(5000);
		expect(timerElement.textContent).toBe("0");
	});

	test("does not increment score after timer reaches zero", () => {
		clickButton.click();
		jest.advanceTimersByTime(5000);
		clickButton.click();
		expect(scoreElement.textContent).toBe("1");
	});

	test("resets score and timer when reset button is pressed", () => {
		clickButton.click();
		clickButton.click();
		resetButton.click();
		expect(scoreElement.textContent).toBe("0");
		expect(timerElement.textContent).toBe("5");
	});
});
