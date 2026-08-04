const INITIAL_TIME = 5;

let score = 0;
let timeLeft = INITIAL_TIME;
let isRunning = false;
let timerId = null;

let scoreElement = null;
let timerElement = null;
let clickButton = null;
let resetButton = null;

function cacheElements() {
	scoreElement = document.getElementById("score");
	timerElement = document.getElementById("timer");
	clickButton = document.getElementById("button-clicker");
	resetButton = document.getElementById("button-reset");
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
	// Start countdown only once per game session.
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
	// Ignore clicks when the game is over.
	if (timeLeft <= 0) {
		return;
	}

	startTimer();
	score += 1;
	render();
}

function resetGame() {
	// Clear any running interval before resetting the state.
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

function initializeGame() {
	cacheElements();
	handleGameButton();
	handleResetButton();
	resetGame();
}

if (typeof module !== "undefined") {
	module.exports = {
		INITIAL_TIME,
		handleClick,
		resetGame,
		handleGameButton,
		handleResetButton,
		initializeGame,
	};
}

if (typeof document !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initializeGame);
	} else {
		initializeGame();
	}
}
