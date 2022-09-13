/**
 * Create Sleeper
 * @param {number} delay sleep time in milliseconds
 * @returns {Promise<void>} return a promise from the then handler that waits
 */
export default function delay(delay: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
