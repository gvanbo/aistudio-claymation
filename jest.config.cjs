/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.ts'
  ],
  collectCoverageFrom: [
    'utils/**/*.ts',
    'services/**/*.ts',
    '!**/*.d.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts']
};
