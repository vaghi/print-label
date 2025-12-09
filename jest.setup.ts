import '@testing-library/jest-dom'

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  }),
) as jest.Mock;

// JSDOM does not implement requestSubmit (or throws Not Implemented)
Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
  writable: true,
  configurable: true,
  value: function() {
    this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }
});
