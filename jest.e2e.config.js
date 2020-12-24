// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  testMatch: ["<rootDir>/test/e2e/**/*.spec.js"],
  // testMatch: ["<rootDir>/test/e2e/**/web-tutorial-files-watch.spec.js"],

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // The test environment that will be used for testing
  testEnvironment: "node",
};
