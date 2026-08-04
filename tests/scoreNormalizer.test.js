const {
	sanitizeUsername,
	normalizeScore,
	normalizeUrl,
	dedupeScoresByUser,
} = require("../src/scoreNormalizer.js");

describe("scoreNormalizer", () => {
	test("sanitizes username by trimming spaces", () => {
		expect(sanitizeUsername("  Alice  ")).toBe("Alice");
	});

	test("returns null for invalid score", () => {
		expect(normalizeScore("bad-value")).toBeNull();
		expect(normalizeScore(-2)).toBeNull();
	});

	test("normalizes URL by injecting https protocol", () => {
		expect(normalizeUrl("example.com")).toBe("https://example.com/");
	});

	test("dedupes users and keeps highest score", () => {
		const records = [
			{ username: "Bob", score: 12, createdAt: "2025-01-01T00:00:00.000Z" },
			{ username: "Bob", score: 20, createdAt: "2025-01-01T00:00:01.000Z" },
			{ username: "Eve", score: "bad" },
		];

		const result = dedupeScoresByUser(records);
		expect(result).toHaveLength(1);
		expect(result[0].username).toBe("Bob");
		expect(result[0].score).toBe(20);
	});
});
