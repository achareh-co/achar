/**
 * find key in query string
 * @param {string} query entry string
 * @returns {boolean} return boolean
 */
export default function queryInclude(query: string, routeString?: string): boolean {
  return (
    (typeof location !== 'undefined' && Boolean(location) && location.search.includes(query)) ||
    (typeof routeString !== 'undefined' && Boolean(routeString) && routeString.includes(query))
  );
}
