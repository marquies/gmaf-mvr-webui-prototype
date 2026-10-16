import '@testing-library/jest-dom';

// A forgotten mock must fail immediately instead of contacting a real backend.
beforeEach(() => {
  global.fetch = jest.fn(() => {
    throw new Error('Unexpected network request: mock fetch in this test');
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
