describe("ClickFast UI integration", () => {
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
		({ initializeGame } = require("../src/script.js"));
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

	test("works after DOMContentLoaded event is dispatched", () => {
		document.dispatchEvent(new Event("DOMContentLoaded"));
		clickButton.click();
		expect(scoreElement.textContent).toBe("1");
	});
});

describe("ClickFast submit integration", () => {
	let initializeGame;

	function setupSubmitDOM() {
		document.body.innerHTML = `
			<div id="main">
				<div id="container">
					<p class="timer-label">Time left: <span id="timer">5</span>s</p>
					<p id="score" class="number">0</p>
					<button id="button-clicker" type="button">Click me!</button>
					<button id="button-reset" type="button">Reset</button>
					<form id="score-form">
						<input id="username-input" name="username" type="text" />
						<input id="avatar-input" name="avatar" type="url" />
						<button id="submit-score" type="submit">Submit score</button>
					</form>
					<p id="submit-status"></p>
					<table>
						<tbody id="leaderboard-body"></tbody>
					</table>
				</div>
			</div>
		`;
	}

	beforeEach(() => {
		jest.resetModules();
		setupSubmitDOM();
		global.fetch = jest
			.fn()
			.mockResolvedValueOnce({ ok: true, json: async () => [] })
			.mockResolvedValueOnce({ ok: true, json: async () => [] })
			.mockResolvedValueOnce({ ok: true, json: async () => [] })
			.mockResolvedValueOnce({
				ok: false,
				status: 400,
				text: async () => '"Max number of elements reached for this resource!"',
			});
		({ initializeGame } = require("../src/script.js"));
		initializeGame();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	test("shows a clear error message when score submit fails", async () => {
		document.getElementById("button-clicker").click();
		document.getElementById("username-input").value = "Player One";

		document.getElementById("score-form").dispatchEvent(
			new Event("submit", {
				bubbles: true,
				cancelable: true,
			})
		);

		await new Promise((resolve) => setTimeout(resolve, 0));
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(document.getElementById("submit-status").textContent).toContain("Submit score failed (400)");
	});
});
