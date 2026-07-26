/**
 * snap scroll
 * @param scrollParent scrollable element
 * @param {number} scrollLeft scrollable element scroll left value
 * @returns {number} scroll left value
 */
export default function scrollSnap(scrollParent: HTMLElement, scrollLeft: number): number {
  if (!scrollParent) return 0;

  scrollParent.style.removeProperty('pointer-events');
  scrollParent.style.setProperty('scroll-behavior', 'smooth');

  const scrollElementChild = scrollParent.children?.[0];

  if (!scrollElementChild) return 0;

  const scrollElementChildInnerWidth = scrollElementChild.clientWidth;
  const scrollElementChildMarginLeft = parseInt(getComputedStyle(scrollElementChild).marginLeft);
  const scrollElementChildMarginRight = parseInt(getComputedStyle(scrollElementChild).marginRight);
  const scrollElementChildMarginX = scrollElementChildMarginLeft + scrollElementChildMarginRight;

  const scrollElementChildWidth = scrollElementChildInnerWidth + scrollElementChildMarginX;

  let offsetCount = Math.floor(-scrollLeft / scrollElementChildWidth);
  const remainingOffset = -scrollLeft % (scrollElementChildWidth - scrollElementChildMarginX);

  if (scrollElementChildWidth / 2 < remainingOffset) {
    offsetCount++;
  }

  const maxScroll = -(scrollParent.scrollWidth - scrollParent.clientWidth);

  /* The scrollLeft value is negative because the rtl direction
        and the scroll move in the opposite direction of the X axis. */
  if (maxScroll - scrollLeft >= -scrollElementChildMarginX) {
    scrollLeft = maxScroll;
  } else {
    scrollLeft = -(offsetCount * scrollElementChildWidth);
  }

  scrollParent.scrollTo(scrollLeft, 0);

  return scrollLeft;
}

if (import.meta.vitest) {
  const { it, expect, vi, afterEach } = import.meta.vitest;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 0 when parent is missing or has no children', () => {
    expect(scrollSnap(null as unknown as HTMLElement, -10)).toBe(0);

    const empty = document.createElement('div');
    expect(scrollSnap(empty, -10)).toBe(0);
  });

  it('snaps scroll position based on child width', () => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    parent.appendChild(child);

    Object.defineProperty(child, 'clientWidth', { value: 100 });
    Object.defineProperty(parent, 'clientWidth', { value: 200 });
    Object.defineProperty(parent, 'scrollWidth', { value: 500 });
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      marginLeft: '10px',
      marginRight: '10px',
    } as CSSStyleDeclaration);

    const scrollTo = vi.fn();
    Object.defineProperty(parent, 'scrollTo', { value: scrollTo });

    const result = scrollSnap(parent, -60);
    expect(typeof result).toBe('number');
    expect(scrollTo).toHaveBeenCalledWith(result, 0);
  });
}
