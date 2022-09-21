/**
 * find key in query string
 * @param {string} query entry string
 * @returns {boolean} return boolean
 */
export default function queryInclude(query: string, routeString?: string): boolean {
  if (typeof location === 'object') {
    return typeof location.search === 'string' && location.search.includes(query);
  } else if (typeof routeString === 'string') {
    return routeString.includes(query);
  } else {
    return false;
  }
}
