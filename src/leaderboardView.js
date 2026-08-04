(function (root, factory) {
	if (typeof module !== "undefined" && module.exports) {
		module.exports = factory();
	} else {
		root.ClickFastLeaderboardView = factory();
	}
})(typeof globalThis !== "undefined" ? globalThis : this, function () {

	let scoreForm = null;
	let usernameInput = null;
	let avatarInput = null;
	let submitButton = null;
	let submitStatus = null;
	let leaderboardBody = null;
	let isSubmitting = false;

	function cacheElements() {
		scoreForm = document.getElementById("score-form");
		usernameInput = document.getElementById("username-input");
		avatarInput = document.getElementById("avatar-input");
		submitButton = document.getElementById("submit-score");
		submitStatus = document.getElementById("submit-status");
		leaderboardBody = document.getElementById("leaderboard-body");
	}

	function setStatus(message, isError) {
		if (!submitStatus) {
			return;
		}

		submitStatus.textContent = message;
		submitStatus.style.color = isError ? "#b91c1c" : "#2f3949";
	}

	function createCell(text) {
		const cell = document.createElement("td");
		cell.textContent = text;
		return cell;
	}

	function renderLeaderboard(records, fallbackAvatar) {
		if (!leaderboardBody) {
			return;
		}

		leaderboardBody.innerHTML = "";
		if (records.length === 0) {
			const emptyRow = document.createElement("tr");
			const emptyCell = document.createElement("td");
			emptyCell.colSpan = 4;
			emptyCell.textContent = "No scores available yet.";
			emptyRow.appendChild(emptyCell);
			leaderboardBody.appendChild(emptyRow);
			return;
		}

		records.forEach((record, index) => {
			const row = document.createElement("tr");
			row.appendChild(createCell(String(index + 1)));

			const playerCell = document.createElement("td");
			const playerWrap = document.createElement("div");
			playerWrap.className = "player-cell";
			const avatar = document.createElement("img");
			avatar.src = record.avatar;
			avatar.alt = `${record.username} avatar`;
			avatar.addEventListener("error", () => {
				avatar.src = fallbackAvatar;
			});
			const usernameText = document.createElement("span");
			usernameText.textContent = record.username;
			playerWrap.appendChild(avatar);
			playerWrap.appendChild(usernameText);
			playerCell.appendChild(playerWrap);
			row.appendChild(playerCell);

			row.appendChild(createCell(String(record.score)));

			const websiteCell = document.createElement("td");
			if (record.websiteUrl) {
				const link = document.createElement("a");
				link.href = record.websiteUrl;
				link.target = "_blank";
				link.rel = "noopener noreferrer";
				link.className = "website-link";
				link.textContent = "visit";
				websiteCell.appendChild(link);
			} else {
				websiteCell.textContent = "-";
			}
			row.appendChild(websiteCell);

			leaderboardBody.appendChild(row);
		});
	}

	async function initialize(options) {
		cacheElements();
		if (!options) {
			return;
		}

		if (leaderboardBody && typeof options.onLoad === "function") {
			try {
				setStatus("Loading leaderboard...", false);
				const records = await options.onLoad();
				renderLeaderboard(records, options.fallbackAvatar);
				setStatus("", false);
			} catch (error) {
				renderLeaderboard([], options.fallbackAvatar);
				setStatus(error && error.message ? error.message : "Could not load leaderboard.", true);
			}
		}

		if (!scoreForm || typeof options.onSubmit !== "function") {
			return;
		}

		scoreForm.addEventListener("submit", async (event) => {
			event.preventDefault();
			if (isSubmitting) {
				return;
			}

			isSubmitting = true;
			if (submitButton) {
				submitButton.disabled = true;
			}

			try {
				setStatus("Submitting score...", false);
				await options.onSubmit({
					username: usernameInput ? usernameInput.value : "",
					avatar: avatarInput ? avatarInput.value : "",
				});

				if (typeof options.onLoad === "function") {
					const records = await options.onLoad();
					renderLeaderboard(records, options.fallbackAvatar);
				}
				setStatus("Score submitted successfully.", false);
			} catch (error) {
				setStatus(error && error.message ? error.message : "Submit failed.", true);
			} finally {
				isSubmitting = false;
				if (submitButton) {
					submitButton.disabled = false;
				}
			}
		});
	}

	return {
		initialize,
		renderLeaderboard,
	};
});
