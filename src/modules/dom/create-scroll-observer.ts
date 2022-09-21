type CbFunctionType = (entry: IntersectionObserverEntry, entryIndex: number) => void;
type ReturnFunctionType = () => void;

/**
 * Create debouncing function
 * @param nodes IntersectionObserver node elements
 * @param onObserve intersection observer callback function
 * @param options Intersection observer init options
 * @returns {function} disconnect intersection observer
 */
export default function createScrollObserver(
  nodes: Element[],
  onObserve: CbFunctionType,
  options = {},
): ReturnFunctionType {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const entryIndex = nodes.indexOf(entry.target);
      onObserve(entry, entryIndex);
    });
  }, options);

  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }

  nodes.forEach((node) => {
    observer.observe(node);
  });

  return () => {
    nodes.forEach((node) => {
      observer.unobserve(node);
    });
    observer.disconnect();
  };
}
