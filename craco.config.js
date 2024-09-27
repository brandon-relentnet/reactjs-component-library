module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const oneOfRule = webpackConfig.module.rules.find((rule) =>
        Array.isArray(rule.oneOf)
      );

      if (oneOfRule) {
        oneOfRule.oneOf.unshift({
          test: /\.(js|jsx)$/,
          resourceQuery: /raw/, // Only use raw-loader if query param ?raw is present
          use: "raw-loader",
          exclude: /node_modules/,
        });
      }

      return webpackConfig;
    },
  },
};
