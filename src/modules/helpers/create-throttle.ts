type FunctionType = (...args: unknown[]) => void;

/**
 * Create throttling function
 * @param cb callback function that you want to throttle
 * @param delay throttle delay in milliseconds
 * @param leading if true, the callback will be called on the leading edge of the timeout
 * @returns throttled function
 */
export default function createThrottle(
  cb: FunctionType,
  delay = -1,
  leading = false,
): FunctionType {
  // throttle flag to prevent run
  let isThrottling = false;

  return function (this: unknown, ...args: unknown[]): void {
    if (!isThrottling) {
      const boundedCb = cb.bind(this, ...args);

      const doAfterTimeout = (): void => {
        if (!leading) boundedCb();
        isThrottling = false;
      };

      if (delay < 0) {
        // use requestAnimationFrame for negative delay
        requestAnimationFrame(doAfterTimeout);
      } else {
        // use setTimeout for positive delay
        setTimeout(doAfterTimeout, delay);
      }

      isThrottling = true;

      // call immediately if leading is enabled
      if (leading) boundedCb();
    }
  };
}

if (import.meta.vitest) {
  const { it, expect, vi, beforeEach, afterEach } = import.meta.vitest;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throttles trailing calls with positive delay', () => {
    const cb = vi.fn();
    const throttled = createThrottle(cb, 100);

    throttled('a');
    throttled('b');
    expect(cb).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith('a');
  });

  it('calls immediately when leading is true', () => {
    const cb = vi.fn();
    const throttled = createThrottle(cb, 100, true);

    throttled('a');
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith('a');

    throttled('b');
    expect(cb).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttled('c');
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenCalledWith('c');
  });

  it('uses requestAnimationFrame when delay is negative', () => {
    const cb = vi.fn();
    const raf = vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((fn) => {
      fn(0);
      return 1;
    });

    const throttled = createThrottle(cb, -1);
    throttled('a');

    expect(raf).toHaveBeenCalled();
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith('a');

    raf.mockRestore();
  });
}
