(function (root, factory) {
	if (typeof module !== "undefined" && module.exports) {
		module.exports = factory();
	} else {
		root.ClickFastScoreNormalizer = factory();
	}
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
	const DEFAULT_AVATAR = "https://w7.pngwing.com/pngs/364/361/png-transparent-account-avatar-profile-user-avatars-icon-thumbnail.png";

	function sanitizeUsername(value) {
		return String(value || "").trim();
	}

	function normalizeScore(value) {
		const numericScore = Number(value);
		if (!Number.isFinite(numericScore) || numericScore < 0) {
			return null;
		}

		return Math.floor(numericScore);
	}

	function normalizeUrl(value) {
		const rawUrl = String(value || "").trim();
		if (!rawUrl) {
			return "";
		}

		try {
			const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
			const parsed = new URL(withProtocol);
			return parsed.href;
		} catch {
			return "";
		}
	}

	function normalizeAvatar(value) {
		const avatarUrl = normalizeUrl(value);
		return avatarUrl || DEFAULT_AVATAR;
	}

	function normalizeRecord(record) {
		if (!record || typeof record !== "object") {
			return null;
		}

		const username = sanitizeUsername(record.username);
		const score = normalizeScore(record.score);
		if (!username || score === null) {
			return null;
		}

		return {
			id: String(record.id || ""),
			createdAt: String(record.createdAt || ""),
			username,
			avatar: normalizeAvatar(record.avatar),
			score,
			websiteUrl: normalizeUrl(record.website_url),
		};
	}

	function pickBestRecord(current, candidate) {
		if (!current) {
			return candidate;
		}

		if (candidate.score > current.score) {
			return candidate;
		}

		if (candidate.score < current.score) {
			return current;
		}

		const currentDate = Date.parse(current.createdAt) || 0;
		const candidateDate = Date.parse(candidate.createdAt) || 0;
		return candidateDate >= currentDate ? candidate : current;
	}

	function dedupeScoresByUser(records) {
		if (!Array.isArray(records)) {
			return [];
		}

		const byUser = new Map();
		for (const item of records) {
			const normalized = normalizeRecord(item);
			if (!normalized) {
				continue;
			}

			const key = normalized.username.toLowerCase();
			const existing = byUser.get(key);
			byUser.set(key, pickBestRecord(existing, normalized));
		}

		return Array.from(byUser.values());
	}

	return {
		DEFAULT_AVATAR,
		sanitizeUsername,
		normalizeScore,
		normalizeUrl,
		normalizeAvatar,
		normalizeRecord,
		dedupeScoresByUser,
	};
});
