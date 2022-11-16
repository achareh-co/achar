/**
 * Thousand Separator
 * @param text entry text, ex: 300000
 * @param separator separator character, ex: ,
 * @returns string formatted text, ex: 300,000
 */
export default function thousandSeparator(text: string | number, separator = ','): string {
  if (!text) return '';

  return text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('separate thousands with comma in a text', () => {
    expect(thousandSeparator('1')).to.be.equal('1');
    expect(thousandSeparator('123')).to.be.equal('123');
    expect(thousandSeparator('1234')).to.be.equal('1,234');
    expect(thousandSeparator('123456')).to.be.equal('123,456');
    expect(thousandSeparator('1234567890')).to.be.equal('1,234,567,890');
    expect(thousandSeparator('this a text with 1 and 12345')).to.be.equal(
      'this a text with 1 and 12,345',
    );
  });

  it('separate thousands with slash in a text', () => {
    expect(thousandSeparator('1', '/')).to.be.equal('1');
    expect(thousandSeparator('123', '/')).to.be.equal('123');
    expect(thousandSeparator('1234', '/')).to.be.equal('1/234');
    expect(thousandSeparator('123456', '/')).to.be.equal('123/456');
    expect(thousandSeparator('1234567890', '/')).to.be.equal('1/234/567/890');
    expect(thousandSeparator('this a text with 1 and 12345', '/')).to.be.equal(
      'this a text with 1 and 12/345',
    );
  });
}
