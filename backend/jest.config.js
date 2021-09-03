// jest.config.js
const { pathsToModuleNameMapper } = require("ts-jest/utils");
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require("./tsconfig");

module.exports = {
  rootDir: ".",
  preset: "ts-jest",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths , { prefix: '<rootDir>/' }  ),
  testMatch: [
    "<rootDir>/tests/**/*.test.ts?(x)",
  ],
  coverageDirectory: `coverage/${process.env.NODE_ENV}`,
  testTimeout: 15000,
  coverageReporters: ["lcov"],
  setupFilesAfterEnv: ["jest-extended"]
};
