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

  it('convert snake_case to slug', () => {
    const snakeCaseSlug = 'slug_to_snake_case';
    const slug = 'slug-to-snake-case';

    expect(toSlug(snakeCaseSlug)).to.be.equal(slug);
  });
}
