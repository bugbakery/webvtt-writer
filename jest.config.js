/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  testEnvironment: 'node',
  testPathIgnorePatterns:  ["<rootDir>/dist/", "<rootDir>/node_modules/"]
};
