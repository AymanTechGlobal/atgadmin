module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.js",
    "@lottiefiles/dotlottie-react":
      "<rootDir>/__mocks__/@lottiefiles/dotlottie-react.js",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      { configFile: "./babel.config.js" },
    ],
  },
  testMatch: [
    "<rootDir>/tests/**/*.test.js",
    "<rootDir>/tests/**/*.test.jsx",
    "<rootDir>/src/**/*.test.js",
    "<rootDir>/src/**/*.test.jsx",
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/index.js",
    "!src/reportWebVitals.js",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  verbose: true,
  watchAll: false,
  transformIgnorePatterns: [
    "/node_modules/(?!(@babel/runtime|@emotion|@mui|@lottiefiles)/)",
  ],
};
