/**
 * from slug
 * @param {string} value entry string from slug
 * @returns {string} return a string from slug
 */
export default function fromSlug(value: string): string {
  return value ? value.replace(/-/g, '_') : '';
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('convert string from slug', () => {
    const string = 'from-slug';
    const stringFromSlug = 'from_slug';

    expect(fromSlug(string)).to.be.equal(stringFromSlug);
  });

  it('convert string from slug (multi slug)', () => {
    const string = 'from-slug-';
    const stringFromSlug = 'from_slug_';
    const string2 = '-from-slug-';
    const stringFromSlug2 = '_from_slug_';
    const string3 = '_from-slug-';
    const stringFromSlug3 = '_from_slug_';

    expect(fromSlug(string)).to.be.equal(stringFromSlug);
    expect(fromSlug(string2)).to.be.equal(stringFromSlug2);
    expect(fromSlug(string3)).to.be.equal(stringFromSlug3);
  });
}
