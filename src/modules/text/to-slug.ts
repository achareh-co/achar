/**
 * to slug
 * @param {string} value entry string to slug
 * @returns {string} return a string to slug
 */
export default function toSlug(value: string): string {
  return value ? value.replace(/_/g, '-') : '';
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('convert string to slug', () => {
    const string = 'to_slug';
    const stringToSlug = 'to-slug';

    expect(toSlug(string)).to.be.equal(stringToSlug);
  });

  it('convert string to slug (multi slug)', () => {
    const string = 'to_slug_';
    const stringToSlug = 'to-slug-';
    const string2 = '_to_slug_';
    const stringToSlug2 = '-to-slug-';
    const string3 = '-to_slug_';
    const stringToSlug3 = '-to-slug-';

    expect(toSlug(string)).to.be.equal(stringToSlug);
    expect(toSlug(string2)).to.be.equal(stringToSlug2);
    expect(toSlug(string3)).to.be.equal(stringToSlug3);
  });
}
