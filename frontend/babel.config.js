const removeConsolePlugin = [];
if (process.env.NODE_ENV === "production") {
	removeConsolePlugin.push([
		"transform-remove-console",
		{ exclude: ["error", "warn"] },
	]);
}

module.exports = {
	presets: ["@babel/preset-env"],
	plugins: removeConsolePlugin,
};
