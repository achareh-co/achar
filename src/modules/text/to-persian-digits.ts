/**
 * Convert English and Arabic digits to Persian digits
 * @param text entry text, ex: 123456
 * @returns formatted text, ex: ۱۲۳۴۵۶
 */
export default function toPersianDigits(text: string | number): string {
  if (!text) return '';

  text = text.toString();

  // English to Persian
  text = text.replace(/[0-9]/g, function (c) {
    return String.fromCharCode(c.charCodeAt(0) + 1728);
  });

  // Arabic to Persian
  return text.replace(/[٠-٩]/g, function (c) {
    return String.fromCharCode(c.charCodeAt(0) + 144);
  });
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('convert English digits to Persian digits', () => {
    const digits = '1234567890';
    const persianDigits = '۱۲۳۴۵۶۷۸۹۰';

    expect(toPersianDigits(digits)).to.be.equal(persianDigits);
  });

  it('convert Arabic digits to Persian digits', () => {
    const digits = '١٢٣٤٥٦٧٨٩٠';
    const persianDigits = '۱۲۳۴۵۶۷۸۹۰';

    expect(toPersianDigits(digits)).to.be.equal(persianDigits);
  });

  it('convert digits inside a text to Persian digits', () => {
    const text = 'This is text containing 1234567890 and ١٢٣٤٥٦٧٨٩٠ for testing.';
    const persianDigitsText = 'This is text containing ۱۲۳۴۵۶۷۸۹۰ and ۱۲۳۴۵۶۷۸۹۰ for testing.';

    expect(toPersianDigits(text)).to.be.equal(persianDigitsText);
  });
}
