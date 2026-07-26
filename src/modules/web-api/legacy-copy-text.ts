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

if (import.meta.vitest) {
  const { it, expect, vi, afterEach } = import.meta.vitest;

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('copies text via temporary input and execCommand', () => {
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommand,
    });

    legacyCopyText('copied text');

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(document.getElementById('legacy-copy-text-input')).toBeNull();
    expect(document.body.children.length).toBe(0);
  });
}
