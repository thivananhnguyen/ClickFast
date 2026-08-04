const api = require("../src/api.js");

describe("api", () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	test("fetchScores returns API payload when response is ok", async () => {
		const payload = [{ id: "1", username: "Alice", score: 10 }];
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: async () => payload,
		});

		const result = await api.fetchScores();
		expect(result).toEqual(payload);
		expect(global.fetch).toHaveBeenCalledTimes(1);
		expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining(api.API_URL));
	});

	test("fetchScores throws mapped error when response is not ok", async () => {
		global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, text: async () => "" });

		await expect(api.fetchScores()).rejects.toThrow("Fetch scores failed (500)");
	});

	test("submitScore posts sanitized payload", async () => {
		global.fetch = jest
			.fn()
			.mockResolvedValueOnce({ ok: true, json: async () => [] })
			.mockResolvedValueOnce({ ok: true });

		await api.submitScore({
			username: "  Neo  ",
			score: 7,
			avatar: "",
			websiteUrl: "example.com",
		});

		expect(global.fetch).toHaveBeenNthCalledWith(1, expect.stringContaining(api.API_URL));
		expect(global.fetch).toHaveBeenNthCalledWith(
			2,
			api.API_URL,
			expect.objectContaining({ method: "POST" })
		);
	});

	test("submitScore exposes API quota error details", async () => {
		global.fetch = jest
			.fn()
			.mockResolvedValueOnce({ ok: true, json: async () => [] })
			.mockResolvedValueOnce({
				ok: false,
				status: 400,
				text: async () => '"Max number of elements reached for this resource!"',
			});

		await expect(
			api.submitScore({
				username: "Neo",
				score: 8,
				avatar: "",
				websiteUrl: "example.com",
			})
		).rejects.toThrow("Submit score failed (400)");
	});
});
