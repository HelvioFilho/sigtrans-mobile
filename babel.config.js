module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [
            ".js",
            ".jsx",
            "ios.js",
            "android.js",
            ".ts",
            ".tsx",
            ".json",
          ],
          alias: {
            "@": "./src",
          },
        },
      ],
    ],
  };
};
