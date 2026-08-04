function resolveModules() {
	if (typeof module !== "undefined" && module.exports) {
		return {
			game: require("./game.js"),
			api: require("./api.js"),
			normalizer: require("./scoreNormalizer.js"),
			leaderboardView: require("./leaderboardView.js"),
		};
	}

	return {
		game: globalThis.ClickFastGame,
		api: globalThis.ClickFastApi,
		normalizer: globalThis.ClickFastScoreNormalizer,
		leaderboardView: globalThis.ClickFastLeaderboardView,
	};
}

function getWebsiteUrl() {
	if (typeof window === "undefined" || !window.location) {
		return "";
	}

	return `${window.location.origin}${window.location.pathname}`;
}

function initializeGame() {
	const modules = resolveModules();
	if (!modules.game || !modules.api || !modules.normalizer || !modules.leaderboardView) {
		return;
	}

	modules.game.initialize();
	modules.game.handleGameButton();
	modules.game.handleResetButton();

	modules.leaderboardView.initialize({
		fallbackAvatar: modules.normalizer.DEFAULT_AVATAR,
		onLoad: async () => {
			const records = await modules.api.fetchScores();
			return modules.normalizer
				.dedupeScoresByUser(records)
				.sort((a, b) => b.score - a.score);
		},
		onSubmit: async (formData) => {
			const username = modules.normalizer.sanitizeUsername(formData.username);
			if (!username) {
				throw new Error("Please enter a username.");
			}

			const currentScore = modules.game.getScore();
			if (currentScore <= 0) {
				throw new Error("Play the game first to submit a positive score.");
			}

			await modules.api.submitScore({
				username,
				avatar: formData.avatar,
				score: currentScore,
				websiteUrl: getWebsiteUrl(),
			});
		},
	});
}

if (typeof module !== "undefined" && module.exports) {
	const modules = resolveModules();
	module.exports = {
		initializeGame,
		dedupeScoresByUser: modules.normalizer.dedupeScoresByUser,
		normalizeScore: modules.normalizer.normalizeScore,
		sanitizeUsername: modules.normalizer.sanitizeUsername,
	};
}

if (typeof document !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initializeGame);
	} else {
		initializeGame();
	}
}
