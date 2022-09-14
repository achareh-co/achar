/**
 * snap scroll
 * @param scrollParent scrollable element
 * @param {number} scrollLeft scrollable element scroll left value
 * @returns {number} scroll left value
 */
export default function scrollSnap(scrollParent: HTMLElement, scrollLeft: number): number {
  if (!scrollParent) return 0;

  scrollParent.style.removeProperty('pointer-events');

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
