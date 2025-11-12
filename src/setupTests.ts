import '@testing-library/jest-dom';

// Polyfill for structuredClone (required by Chakra UI in JSDOM)
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = function <T>(value: T): T {
    if (value === undefined) return undefined as T;
    if (value === null) return null as T;
    if (typeof value !== 'object') return value;

    // Use JSON for simple deep cloning (good enough for Chakra UI)
    try {
      return JSON.parse(JSON.stringify(value)) as T;
    } catch {
      // Fallback for non-serializable objects
      return value;
    }
  };
}
