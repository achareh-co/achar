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
