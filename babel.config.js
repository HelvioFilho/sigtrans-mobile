module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["inline-dotenv", { path: ".env" }],
      ["nativewind/babel"],
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
