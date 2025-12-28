module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    testMatch: ['**/*.test.js', '**/*.test.jsx'],
    moduleFileExtensions: ['js', 'jsx']
}
