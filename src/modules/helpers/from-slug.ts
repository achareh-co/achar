/**
 * from slug
 * @param {string} value entry string from slug
 * @returns {string} return a string from slug
 */
export default function fromSlug(value: string): string {
  return value ? value.replace(/-/g, '_') : '';
}
