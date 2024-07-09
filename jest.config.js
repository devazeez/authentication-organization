module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    transform: {
      '^.+\\.ts$': 'ts-jest'
    },
    testMatch: ['**/*.spec.ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node']
  };
  