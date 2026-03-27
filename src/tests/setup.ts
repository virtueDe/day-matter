import '@testing-library/jest-dom/vitest';

beforeEach(() => {
  globalThis.__DAYMARK_TEST_TODAY__ = '2026-03-27';
  window.localStorage.clear();
});

afterEach(() => {
  delete globalThis.__DAYMARK_TEST_TODAY__;
});
