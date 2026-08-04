(function (root, factory) {
	if (typeof module !== "undefined" && module.exports) {
		module.exports = factory(require("./scoreNormalizer.js"));
	} else {
		root.ClickFastApi = factory(root.ClickFastScoreNormalizer);
	}
})(typeof globalThis !== "undefined" ? globalThis : this, function (normalizer) {
	const API_URL = "https://672e1217229a881691eed80f.mockapi.io/scores";

	async function mapHttpError(response, action) {
		let details = "";
		try {
			details = (await response.text()).trim();
		} catch {
			details = "";
		}

		if (details) {
			throw new Error(`${action} failed (${response.status}): ${details}`);
		}

		throw new Error(`${action} failed (${response.status})`);
	}

	async function fetchScores() {
		const response = await fetch(API_URL);
		if (!response.ok) {
			await mapHttpError(response, "Fetch scores");
		}

		return response.json();
	}

	async function deleteUserRecords(username) {
		const target = normalizer.sanitizeUsername(username).toLowerCase();
		if (!target) {
			return;
		}

		const records = await fetchScores();
		const toDelete = Array.isArray(records)
			? records.filter((record) => normalizer.sanitizeUsername(record.username).toLowerCase() === target)
			: [];

		await Promise.all(
			toDelete
				.map((record) => String(record.id || ""))
				.filter(Boolean)
				.map(async (id) => {
					const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
					if (!response.ok) {
						await mapHttpError(response, "Delete score");
					}
				})
		);
	}

	async function submitScore(payload) {
		const username = normalizer.sanitizeUsername(payload.username);
		const score = normalizer.normalizeScore(payload.score);
		if (!username || score === null || score <= 0) {
			throw new Error("Invalid score payload");
		}

		await deleteUserRecords(username);

		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				createdAt: new Date().toISOString(),
				username,
				avatar: normalizer.normalizeAvatar(payload.avatar),
				score,
				website_url: normalizer.normalizeUrl(payload.websiteUrl),
			}),
		});

		if (!response.ok) {
			await mapHttpError(response, "Submit score");
		}
	}

	return {
		API_URL,
		fetchScores,
		submitScore,
		deleteUserRecords,
	};
});
