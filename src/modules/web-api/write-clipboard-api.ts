/**
 * Writes the specified text string to the system clipboard.
 * @param {string} text entry string, ex: "hello world!"
 * @returns {Promise} promise is resolved the clipboard's contents updated, promise is rejected the not write clipboard's
 */
export default function writeClipboardApi(text: string): Promise<void> {
  if ('clipboard' in navigator && 'writeText' in navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    return Promise.reject(new Error('No support for write clipboard API'));
  }
}

if (import.meta.vitest) {
  const { it, expect, vi, afterEach } = import.meta.vitest;

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('writes text using clipboard API', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    await expect(writeClipboardApi('hello')).resolves.toBeUndefined();
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('rejects when clipboard API is unavailable', async () => {
    vi.stubGlobal('navigator', {});

    await expect(writeClipboardApi('hello')).rejects.toThrow('No support for write clipboard API');
  });
}
