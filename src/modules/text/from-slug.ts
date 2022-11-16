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

  it('convert slug to snake_case', () => {
    const slug = 'slug-to-snake-case';
    const snakeCaseSlug = 'slug_to_snake_case';

    expect(fromSlug(slug)).to.be.equal(snakeCaseSlug);
  });
}
