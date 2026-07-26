/**
 * Decodes a URI component repeatedly until it no longer changes.
 * Useful for values that were percent-encoded more than once.
 * @param {string} uri encoded URI component
 * @returns {string} fully decoded string
 */
export default function decodeURIComponentBetter(uri: string): string {
  let component = uri;

  while (component !== decodeURIComponent(component)) {
    component = decodeURIComponent(component);
  }

  return component;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('returns a plain string unchanged', () => {
    expect(decodeURIComponentBetter('hello')).toBe('hello');
  });

  it('decodes a single encoding pass', () => {
    expect(decodeURIComponentBetter('hello%20world')).toBe('hello world');
  });

  it('decodes multiple encoding passes', () => {
    expect(decodeURIComponentBetter('hello%2520world')).toBe('hello world');
  });
}
