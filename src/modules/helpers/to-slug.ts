/**
 * to slug
 * @param {string} value entry string to slug
 * @returns {string} return a string to slug
 */
export default function toSlug(value: string): string {
  return value ? value.replace(/_/g, '-') : '';
}
