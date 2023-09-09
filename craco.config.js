const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  // typescript에서 path alias를 사용하게 하는 webpack plugin 설정
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({}));
          return webpackConfig;
        },
      },
    },
  ],
  // jest에서 path alias를 사용하기 위한 설정
  jest: {
    configure: {
      moduleNameMapper: {
        "^\\@components/(.*)$": "<rootDir>/src/components/$1",
        "^\\@contexts/(.*)$": "<rootDir>/src/contexts/$1",
        "^\\@layouts/(.*)$": "<rootDir>/src/layouts/$1",
        "^\\@pages/(.*)$": "<rootDir>/src/pages/$1",
        "^\\@styles/(.*)$": "<rootDir>/src/styles/$1",
        "^\\@utils/(.*)$": "<rootDir>/src/utils/$1",
      },
    },
  },
};
