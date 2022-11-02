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
