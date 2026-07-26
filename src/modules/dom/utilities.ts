export const supportsNativeSmoothScroll =
  typeof window !== 'undefined' && 'scrollBehavior' in document.documentElement.style;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('exposes a boolean for native smooth scroll support', () => {
    expect(typeof supportsNativeSmoothScroll).toBe('boolean');
  });
}
