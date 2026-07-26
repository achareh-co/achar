/**
 * Checks whether a given attribute exists on a newly created element of tag `el`.
 * @param {string} attr attribute name to detect
 * @param {K} el HTML tag name
 * @returns {boolean} `true` when the attribute is supported; `false` when `document` is unavailable
 */
export default function attrSupport<K extends keyof HTMLElementTagNameMap>(
  attr: string,
  el: K,
): boolean {
  if (typeof document === 'undefined') return false;
  return attr in document.createElement(el);
}

if (import.meta.vitest) {
  const { it, expect, vi, afterEach } = import.meta.vitest;

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('detects supported attributes on an element', () => {
    expect(attrSupport('src', 'img')).toBe(true);
  });

  it('returns false when document is unavailable', () => {
    vi.stubGlobal('document', undefined);
    expect(attrSupport('src', 'img')).toBe(false);
  });
}
