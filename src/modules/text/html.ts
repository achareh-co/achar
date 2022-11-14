type Template = typeof String.raw extends (arg1: infer U) => unknown ? U : unknown;

/**
 * html template literals
 * @param Template
 * @param substitution
 * @returns string minified html
 */
export default function html(template: Template, ...substitution: unknown[]) {
  return String.raw(template, ...substitution)
    .trim()
    .replace(/\s\s+/g, ' ');
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('process a simple paragraph', () => {
    const entry = '<p>this is simple html paragraph with some texts</p>';
    const result = entry;

    expect(html`${entry}`).to.be.equal(result);
  });

  it('process a simple paragraph with attributes', () => {
    const entry = '<p id="text" class="normal-text">this is simple html paragraph</p>';
    const result = entry;

    expect(html`${entry}`).to.be.equal(result);
  });

  it('process a simple paragraph with attributes and extra spaces', () => {
    const entry = `
      <p id="text"  class="normal-text">
        this is simple html paragraph
      </p>
    `;
    const result = '<p id="text" class="normal-text"> this is simple html paragraph </p>';

    expect(html`${entry}`).to.be.equal(result);
  });
}
