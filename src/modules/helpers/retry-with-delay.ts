import delay from './delay';

type requestFn = () => Promise<void> | void;

export const maxRetryError = new Error('Max Retries Reached');
export const taskCanceledError = new Error('Task Cancelled');
/**
 * retry With Delay
 * @param {Function} requestFn
 * @param {Number} delayTime retry delay in milliseconds
 * @param {Number} maxRetries retry count
 * @param {AbortSignal} signal
 * @returns {Function}
 */
export function retryWithDelay(
  requestFn: requestFn,
  delayTime = 1000,
  maxRetries = 5,
  signal?: AbortSignal,
) {
  return async function retry(): Promise<void> {
    try {
      return await requestFn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e?.response?.status) throw e;
      if (maxRetries <= 0) throw maxRetryError;

      await delay(delayTime);

      // if task is cancelled
      if (signal?.aborted) throw taskCanceledError;

      return retryWithDelay(requestFn, delayTime * 2, maxRetries - 1, signal)();
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

  it('resolves on first successful attempt', async () => {
    const requestFn = vi.fn().mockResolvedValue(undefined);
    const retry = retryWithDelay(requestFn, 100, 3);

    await expect(retry()).resolves.toBeUndefined();
    expect(requestFn).toHaveBeenCalledTimes(1);
  });

  it('retries after failure and eventually succeeds', async () => {
    const requestFn = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(undefined);

    const retry = retryWithDelay(requestFn, 100, 3);
    const promise = retry();

    await vi.advanceTimersByTimeAsync(100);
    await expect(promise).resolves.toBeUndefined();
    expect(requestFn).toHaveBeenCalledTimes(2);
  });

  it('throws maxRetryError when retries are exhausted', async () => {
    const requestFn = vi.fn().mockRejectedValue(new Error('fail'));
    const retry = retryWithDelay(requestFn, 50, 1);
    const promise = retry();

    // Attach rejection handler early to avoid unhandled rejection
    const assertion = expect(promise).rejects.toBe(maxRetryError);
    await vi.advanceTimersByTimeAsync(50);
    await assertion;
    expect(requestFn).toHaveBeenCalledTimes(2);
  });

  it('rethrows errors that include response.status', async () => {
    const error = Object.assign(new Error('http'), { response: { status: 500 } });
    const requestFn = vi.fn().mockRejectedValue(error);
    const retry = retryWithDelay(requestFn, 50, 3);

    await expect(retry()).rejects.toBe(error);
    expect(requestFn).toHaveBeenCalledTimes(1);
  });

  it('throws taskCanceledError when signal is aborted during retry', async () => {
    const requestFn = vi.fn().mockRejectedValue(new Error('fail'));
    const controller = new AbortController();
    const retry = retryWithDelay(requestFn, 100, 3, controller.signal);
    const promise = retry();

    const assertion = expect(promise).rejects.toBe(taskCanceledError);
    controller.abort();
    await vi.advanceTimersByTimeAsync(100);
    await assertion;
  });
}
