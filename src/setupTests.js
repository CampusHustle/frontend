import '@testing-library/jest-dom'

class MockIntersectionObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
  takeRecords() {
    return []
  }
}

class MockResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}

globalThis.IntersectionObserver ??= MockIntersectionObserver
globalThis.ResizeObserver ??= MockResizeObserver

// jsdom ships with a localStorage stub but some environments don't wire it up.
// This ensures localStorage.clear/getItem/setItem/removeItem always exist.
if (typeof globalThis.localStorage === 'undefined' || globalThis.localStorage === null) {
  const store = {}
  globalThis.localStorage = {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v) },
    removeItem: (k) => { delete store[k] },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]) },
  }
}
