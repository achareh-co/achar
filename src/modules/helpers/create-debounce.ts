type FunctionType = (...args: unknown[]) => void;

/**
 * Create debouncing function
 * @param cb callback function that you want to debounce
 * @param delay debounce delay in milliseconds
 * @param immediate if true, the callback will be called immediately
 * @returns debounced function
 */
export default function createDebounce(
  cb: FunctionType,
  delay: number,
  immediate = false,
): FunctionType {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: unknown[]): void {
    const boundedCb = cb.bind(this, ...args);

    const doAfterTimeout = (): void => {
      if (!immediate) boundedCb();
      timer = null;
    };

    const callItNow = immediate && !timer;

    // clear previous timer if setted already
    if (timer) clearTimeout(timer);

    // set new timer
    timer = setTimeout(doAfterTimeout, delay);

    if (callItNow) boundedCb();
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

  it('calls callback once after trailing delay', () => {
    const cb = vi.fn();
    const debounced = createDebounce(cb, 100);

    debounced('a');
    debounced('b');
    debounced('c');

    expect(cb).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith('c');
  });

  it('calls immediately when immediate is true', () => {
    const cb = vi.fn();
    const debounced = createDebounce(cb, 100, true);

    debounced('first');
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith('first');

    debounced('second');
    expect(cb).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    debounced('third');
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenCalledWith('third');
  });
}
