export default function getElementPosition(el: HTMLElement) {
  if (!el || !(el instanceof HTMLElement)) {
    throw new Error('Element is not defined');
  }

  const elementRect = el.getBoundingClientRect();

  return {
    width: elementRect.width,
    height: elementRect.height,
    left: elementRect.left,
    top: elementRect.top,
    scrollX: elementRect.left + window.scrollX,
    scrollY: elementRect.top + window.scrollY,
  };
}

if (import.meta.vitest) {
  const { it, expect, vi, afterEach } = import.meta.vitest;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws when element is invalid', () => {
    expect(() => getElementPosition(null as unknown as HTMLElement)).toThrow(
      'Element is not defined',
    );
  });

  it('returns position based on bounding client rect', () => {
    const el = document.createElement('div');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      width: 100,
      height: 50,
      left: 10,
      top: 20,
      right: 110,
      bottom: 70,
      x: 10,
      y: 20,
      toJSON: () => ({}),
    });
    vi.spyOn(window, 'scrollX', 'get').mockReturnValue(5);
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(15);

    expect(getElementPosition(el)).toEqual({
      width: 100,
      height: 50,
      left: 10,
      top: 20,
      scrollX: 15,
      scrollY: 35,
    });
  });
}
