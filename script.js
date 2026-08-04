const INITIAL_TIME = 5;

let score = 0;
let timeLeft = INITIAL_TIME;
let isRunning = false;
let timerId = null;

const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const clickButton = document.getElementById("button-clicker");
const resetButton = document.getElementById("button-reset");

function render() {
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

clickButton.addEventListener("click", handleClick);
resetButton.addEventListener("click", resetGame);

render();
