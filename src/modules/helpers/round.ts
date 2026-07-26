/**
 * Rounds a value to `exp` decimal places (ported from legacy `round`).
 * @param {number} value number to round
 * @param {number} [exp] decimal places; omit or `0` for `Math.round`
 * @returns {number} rounded value, or `NaN` for invalid inputs
 */
export default function round(value: number, exp?: number): number {
  if (typeof exp === 'undefined' || +exp === 0) return Math.round(value);

  value = +value;
  exp = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) return NaN;

  let parts = value.toString().split('e');
  value = Math.round(+(parts[0] + 'e' + (parts[1] ? +parts[1] + exp : exp)));

  parts = value.toString().split('e');
  return +(parts[0] + 'e' + (parts[1] ? +parts[1] - exp : -exp));
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('rounds to nearest integer when exp is omitted or 0', () => {
    expect(round(1.4)).toBe(1);
    expect(round(1.5)).toBe(2);
    expect(round(1.6, 0)).toBe(2);
  });

  it('rounds to the given decimal places', () => {
    expect(round(1.2345, 2)).toBe(1.23);
    expect(round(1.2355, 2)).toBe(1.24);
    expect(round(10.55, 1)).toBe(10.6);
  });

  it('returns NaN for invalid inputs', () => {
    expect(round(Number.NaN, 2)).toBeNaN();
    expect(round(1.5, 1.5)).toBeNaN();
  });
}
