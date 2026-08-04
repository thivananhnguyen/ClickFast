const js = require("@eslint/js");

module.exports = [
	{
		ignores: ["node_modules/**", "coverage/**"],
	},
	js.configs.recommended,
	{
		files: ["src/**/*.js"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "script",
			globals: {
				window: "readonly",
				document: "readonly",
				fetch: "readonly",
				module: "readonly",
				require: "readonly",
				globalThis: "readonly",
				setInterval: "readonly",
				clearInterval: "readonly",
				URL: "readonly",
				console: "readonly",
			},
		},
		rules: {
			"no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
		},
	},
	{
		files: ["tests/**/*.js"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "script",
			globals: {
				jest: "readonly",
				describe: "readonly",
				test: "readonly",
				expect: "readonly",
				beforeEach: "readonly",
				afterEach: "readonly",
				document: "readonly",
				Event: "readonly",
				setTimeout: "readonly",
				clearTimeout: "readonly",
				Promise: "readonly",
				require: "readonly",
				global: "readonly",
			},
		},
	},
];
