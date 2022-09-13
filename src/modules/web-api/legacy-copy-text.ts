/**
 * Writes the specified text string to the system clipboard.
 * @param {string} text entry string, ex: "hello world!"
 * @returns {undefined}
 */
export default function legacyCopyText(text: string): void {
  const dummy = document.createElement('input');
  document.body.appendChild(dummy);

  dummy.setAttribute('id', 'legacy-copy-text-input');
  const getDummy = document.getElementById('legacy-copy-text-input') as HTMLInputElement;

  if (getDummy) {
    getDummy.value = text;
  }

  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
}
