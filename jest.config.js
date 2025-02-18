export default {
    transform: {}, // No need for Babel or other transforms
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.spec.js'],
    setupFiles: ['<rootDir>/tests/setup.js'],
};
