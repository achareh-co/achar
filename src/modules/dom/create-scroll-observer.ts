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

if (import.meta.vitest) {
  const { it, expect, vi, afterEach } = import.meta.vitest;

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('observes nodes and invokes callback, then disconnects', () => {
    const observe = vi.fn();
    const unobserve = vi.fn();
    const disconnect = vi.fn();
    let observerCallback: IntersectionObserverCallback = () => undefined;

    class MockIntersectionObserver {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }
      observe = observe;
      unobserve = unobserve;
      disconnect = disconnect;
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    const node = document.createElement('div');
    const onObserve = vi.fn();
    const disconnectFn = createScrollObserver([node], onObserve);

    expect(observe).toHaveBeenCalledWith(node);

    observerCallback([{ target: node } as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(onObserve).toHaveBeenCalledWith(expect.objectContaining({ target: node }), 0);

    disconnectFn();
    expect(unobserve).toHaveBeenCalledWith(node);
    expect(disconnect).toHaveBeenCalled();
  });
}
