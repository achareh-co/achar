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
      return requestFn();
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
