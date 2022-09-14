import scrollSnap from './scroll-snap';

/**
 * mouse moving
 * @param el scrollable element
 * @param {number} scrollLeft scrollable element scroll left value
 * @param {boolean} snapedScroll snaped scroll
 * @returns {Function} unmounte scroll move
 */
export default function mouseMoving(el: HTMLElement, scrollLeft: number, snapedScroll = true) {
  if (!el) throw Error('el');

  let isOnMoving = false;

  const startMoving = () => {
    isOnMoving = true;
    el.style.removeProperty('scrollBehavior');
    el.style.cursor = 'grabbing';
  };

  const endedMoving = () => {
    isOnMoving = false;
    el.style.scrollBehavior = 'smooth';
    el.style.removeProperty('grabbing');

    if (snapedScroll) {
      setTimeout(() => {
        scrollLeft = scrollSnap(el, scrollLeft);
      }, 1);
    }
  };

  const onMouseMoving = (event: MouseEvent) => {
    if (isOnMoving) {
      el.style.pointerEvents = 'none';

      scrollLeft += -event.movementX;

      const maxScroll = -(el.scrollWidth - el.clientWidth);

      if (maxScroll > scrollLeft) {
        scrollLeft = maxScroll;
      }

      if (scrollLeft > 0) {
        scrollLeft = 0;
      }
      el.scrollTo(scrollLeft, 0);
    }
  };

  el.addEventListener('mousedown', startMoving);
  el.addEventListener('mouseup', endedMoving);
  el.addEventListener('mouseleave', endedMoving);
  el.addEventListener('mousemove', onMouseMoving);

  return () => {
    el.removeEventListener('mousedown', startMoving);
    el.removeEventListener('mouseup', endedMoving);
    el.removeEventListener('mouseleave', endedMoving);
    el.removeEventListener('mousemove', onMouseMoving);
  };
}
