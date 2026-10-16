module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', {
      babelrc: false,
      configFile: false,
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/test-utils/styleMock.cjs',
    '\\.(png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|mp4|mp3)$': '<rootDir>/src/test-utils/fileMock.cjs'
  },
  resetMocks: true,
  clearMocks: true
};
