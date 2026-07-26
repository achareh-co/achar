/**
 * find key in query string
 * @param {string} query entry string
 * @returns {boolean} return boolean
 */
export default function queryInclude(query: string, routeString?: string): boolean {
  if (typeof location === 'object') {
    return typeof location.search === 'string' && location.search.includes(query);
  } else if (typeof routeString === 'string') {
    return routeString.includes(query);
  } else {
    return false;
  }
}

if (import.meta.vitest) {
  const { it, expect, vi, afterEach } = import.meta.vitest;

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('checks location.search when location exists', () => {
    vi.stubGlobal('location', { search: '?foo=1&bar=2' });

    expect(queryInclude('foo=1')).toBe(true);
    expect(queryInclude('missing')).toBe(false);
  });

  it('falls back to routeString when location is unavailable', () => {
    vi.stubGlobal('location', undefined);

    expect(queryInclude('foo', '?foo=1')).toBe(true);
    expect(queryInclude('bar', '?foo=1')).toBe(false);
    expect(queryInclude('foo')).toBe(false);
  });
}
