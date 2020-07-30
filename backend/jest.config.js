// jest.config.js
const { pathsToModuleNameMapper } = require("ts-jest/utils");
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require("./tsconfig");

module.exports = {
  rootDir: ".",
  testMatch: ["**/tests/**/*.test.(ts|tsx|js|jsx)"],
  verbose: false,
  clearMocks: true,
  resetModules: true,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/__fixtures__/",
    "/__tests__/",
    "/tests/",
    "/(__)?mock(s__)?/",
    "/__jest__/",
    ".?.min.js",
  ],
  moduleDirectories: ["node_modules", "src"],
  transform: { "^.+\\.(ts|tsx)$": "ts-jest" },
  moduleFileExtensions: ["js", "jsx", "json", "ts"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths , { prefix: '<rootDir>/' }  ),
};
