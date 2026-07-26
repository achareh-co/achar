/**
 * wait window load
 * @returns {Promise} void Promise
 */
export default function waitWindowLoad(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (typeof document !== 'undefined' && document.readyState === 'complete') {
      resolve();
    } else if (typeof window !== 'undefined') {
      window.addEventListener('load', () => resolve());
    } else {
      reject();
    }
  });
}

if (import.meta.vitest) {
  const { it, expect, vi, afterEach } = import.meta.vitest;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves immediately when document is already complete', async () => {
    Object.defineProperty(document, 'readyState', {
      configurable: true,
      get: () => 'complete',
    });

    await expect(waitWindowLoad()).resolves.toBeUndefined();
  });

  it('resolves on window load when document is not complete', async () => {
    Object.defineProperty(document, 'readyState', {
      configurable: true,
      get: () => 'loading',
    });

    const promise = waitWindowLoad();
    window.dispatchEvent(new Event('load'));
    await expect(promise).resolves.toBeUndefined();
  });
}
