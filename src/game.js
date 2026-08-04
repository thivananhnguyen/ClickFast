(function (root, factory) {
	if (typeof module !== "undefined" && module.exports) {
		module.exports = factory();
	} else {
		root.ClickFastGame = factory();
	}
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
	const INITIAL_TIME = 5;

	let score = 0;
	let timeLeft = INITIAL_TIME;
	let isRunning = false;
	let timerId = null;

	let scoreElement = null;
	let timerElement = null;
	let clickButton = null;
	let resetButton = null;

	function cacheElements(config) {
		scoreElement = document.getElementById(config.scoreElementId);
		timerElement = document.getElementById(config.timerElementId);
		clickButton = document.getElementById(config.clickButtonId);
		resetButton = document.getElementById(config.resetButtonId);
	}

	function render() {
		if (!scoreElement || !timerElement) {
			return;
		}

		scoreElement.textContent = String(score);
		timerElement.textContent = String(timeLeft);
	}

	function stopTimer() {
		if (timerId !== null) {
			clearInterval(timerId);
			timerId = null;
		}
		isRunning = false;
	}

	function startTimer() {
		if (isRunning) {
			return;
		}

		isRunning = true;
		timerId = setInterval(() => {
			timeLeft -= 1;
			if (timeLeft <= 0) {
				timeLeft = 0;
				stopTimer();
			}
			render();
		}, 1000);
	}

	function handleClick() {
		if (timeLeft <= 0) {
			return;
		}

		startTimer();
		score += 1;
		render();
	}

	function resetGame() {
		stopTimer();
		score = 0;
		timeLeft = INITIAL_TIME;
		render();
	}

	function handleGameButton() {
		if (!clickButton) {
			return;
		}

		clickButton.addEventListener("click", handleClick);
	}

	function handleResetButton() {
		if (!resetButton) {
			return;
		}

		resetButton.addEventListener("click", resetGame);
	}

	function initialize(config) {
		const safeConfig = {
			scoreElementId: "score",
			timerElementId: "timer",
			clickButtonId: "button-clicker",
			resetButtonId: "button-reset",
			...config,
		};

		cacheElements(safeConfig);
		resetGame();
	}

	function getScore() {
		return score;
	}

	return {
		INITIAL_TIME,
		initialize,
		resetGame,
		handleGameButton,
		handleResetButton,
		getScore,
	};
});
