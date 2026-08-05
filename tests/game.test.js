const game = require("../src/game.js");

describe("game module", () => {
	beforeEach(() => {
		jest.useFakeTimers();
		document.body.innerHTML = `
			<p id="score">0</p>
			<p id="timer">5</p>
			<button id="button-clicker" type="button">Click</button>
			<button id="button-reset" type="button">Reset</button>
		`;
		// Align with the teacher flow: bind handlers after DOM setup.
		game.initialize();
		game.handleGameButton();
		game.handleResetButton();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	test("increments score on click", () => {
		document.getElementById("button-clicker").click();
		expect(document.getElementById("score").textContent).toBe("1");
	});

	test("stops incrementing after 5 seconds", () => {
		const clicker = document.getElementById("button-clicker");
		clicker.click();
		jest.advanceTimersByTime(5000);
		clicker.click();
		expect(document.getElementById("score").textContent).toBe("1");
	});

	test("resets score and timer", () => {
		document.getElementById("button-clicker").click();
		document.getElementById("button-reset").click();
		expect(document.getElementById("score").textContent).toBe("0");
		expect(document.getElementById("timer").textContent).toBe("5");
	});
});
