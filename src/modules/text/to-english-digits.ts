/**
 * Convert Persian and Arabic digits to English digits
 * @param text entry text, ex: ۱۲۳۴۵۶
 * @returns formatted text, ex: 123456
 */
export default function toEnglishDigits(text: string | number): string {
  if (!text) return '';

  text = text.toString();

  // Persian To English
  text = text.replace(/[۰-۹]/g, function (c) {
    return String.fromCharCode(c.charCodeAt(0) - 1728);
  });

  // Arabic to English
  return text.replace(/[٠-٩]/g, function (c) {
    return String.fromCharCode(c.charCodeAt(0) - 1584);
  });
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('convert Persian digits to English digits', () => {
    const digits = '۱۲۳۴۵۶۷۸۹۰';
    const englishDigits = '1234567890';

    expect(toEnglishDigits(digits)).to.be.equal(englishDigits);
  });

  it('convert Arabic digits to English digits', () => {
    const digits = '١٢٣٤٥٦٧٨٩٠';
    const englishDigits = '1234567890';

    expect(toEnglishDigits(digits)).to.be.equal(englishDigits);
  });

  it('convert digits inside a text to English digits', () => {
    const text = 'This is text containing ۱۲۳۴۵۶۷۸۹۰ and ١٢٣٤٥٦٧٨٩٠ for testing.';
    const englishDigitsText = 'This is text containing 1234567890 and 1234567890 for testing.';

    expect(toEnglishDigits(text)).to.be.equal(englishDigitsText);
  });
}
