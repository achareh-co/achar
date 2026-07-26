/**
 * Create Sleeper
 * @param {number} delay sleep time in milliseconds
 * @returns {Promise<void>} return a promise from the then handler that waits
 */
export default function delay(delay: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

if (import.meta.vitest) {
  const { it, expect, vi, beforeEach, afterEach } = import.meta.vitest;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves after the given delay', async () => {
    const promise = delay(100);
    let resolved = false;
    promise.then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(99);
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await promise;
    expect(resolved).toBe(true);
  });
}
