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
