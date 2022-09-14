import scrollSnap from './scroll-snap';
import { delay } from '../helpers';
/**
 * mouse moving
 * @param el scrollable element
 * @param {boolean} snapedScroll snaped scroll
 */
export default function mouseMoving(el: HTMLElement, snapedScroll = true) {
  if (!el) throw Error('element not found!');

  const parentEl = el.parentElement;
  if (!parentEl) throw Error('parentElement not found!');

  let isOnMoving = false;
  let scrollLeft = 0;

  const startMoving = () => {
    isOnMoving = true;
    el.style.removeProperty('scroll-behavior');
    parentEl.style.cursor = 'grabbing';

    events.start?.(scrollLeft);
  };

  const endedMoving = () => {
    isOnMoving = false;
    el.style.scrollBehavior = 'smooth';
    parentEl.style.removeProperty('cursor');

    if (snapedScroll) {
      delay(1).then(() => {
        scrollLeft = scrollSnap(el, scrollLeft);
        events.end?.(scrollLeft);
      });
    } else {
      delay(1).then(() => {
        el.style.removeProperty('pointer-events');
      });
    }
    events.end?.(scrollLeft);
  };

  const onMouseMoving = (event: MouseEvent) => {
    if (!isOnMoving) return;
    el.style.pointerEvents = 'none';

    scrollLeft += -event.movementX;

    const maxScroll = -(el.scrollWidth - el.clientWidth);

    if (maxScroll > scrollLeft) {
      scrollLeft = maxScroll;
    }

    if (scrollLeft > 0) {
      scrollLeft = 0;
    }

    events.moving?.(scrollLeft);

    el.scrollTo(scrollLeft, 0);
  };

  const scrollTo = (currentScrollLeft: number) => {
    if (snapedScroll) {
      scrollLeft = scrollSnap(el, currentScrollLeft);
    } else {
      el.scrollTo(currentScrollLeft, 0);
      scrollLeft = currentScrollLeft;
    }
    events.end?.(scrollLeft);
  };

  const returnHelpers = () => ({
    destroy,
    on,
    off,
    snap,
    scrollTo,
  });

  parentEl.addEventListener('mousedown', startMoving);
  parentEl.addEventListener('mouseup', endedMoving);
  parentEl.addEventListener('mouseleave', endedMoving);
  parentEl.addEventListener('mousemove', onMouseMoving);

  type cbEvents = (scrollLeft: number) => void;

  const events: { [key: string]: null | cbEvents } = {
    strat: null,
    end: null,
    moving: null,
  };

  const snap = () => {
    scrollLeft = scrollSnap(el, scrollLeft);
    events.end?.(scrollLeft);
  };

  const destroy = () => {
    parentEl.removeEventListener('mousedown', startMoving);
    parentEl.removeEventListener('mouseup', endedMoving);
    parentEl.removeEventListener('mouseleave', endedMoving);
    parentEl.removeEventListener('mousemove', onMouseMoving);

    return returnHelpers();
  };

  const on = (key: keyof typeof events, cb: cbEvents) => {
    events[key] = cb;

    return returnHelpers();
  };

  const off = (key: keyof typeof events) => {
    events[key] = null;

    return returnHelpers();
  };

  return returnHelpers();
}
