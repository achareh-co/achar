/**
 * Generate a RFC 4122 version 4 UUID using `crypto.getRandomValues`.
 * @returns {string} UUID string, e.g. `"550e8400-e29b-41d4-a716-446655440000"`
 */
export default function generateV4UUID(): string {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (
      Number(c) ^
      ((crypto.getRandomValues(new Uint8Array(1))[0] ?? 0) & (15 >> (Number(c) / 4)))
    ).toString(16),
  );
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  const uuidV4Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  it('returns a valid UUID v4 string', () => {
    expect(generateV4UUID()).toMatch(uuidV4Pattern);
  });

  it('returns unique values across calls', () => {
    const a = generateV4UUID();
    const b = generateV4UUID();
    expect(a).not.toBe(b);
  });
}
