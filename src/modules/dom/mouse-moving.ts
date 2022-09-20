import scrollSnap from './scroll-snap';
import { delay } from '../helpers';

type MouseMovingEvent = (scrollLeft: number) => void;
type MouseMovingEvents = 'start' | 'end' | 'moving';

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

  const onDragstart = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
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

  parentEl.addEventListener('mousedown', startMoving);
  parentEl.addEventListener('mouseup', endedMoving);
  parentEl.addEventListener('mouseleave', endedMoving);
  parentEl.addEventListener('mousemove', onMouseMoving);
  parentEl.addEventListener('dragstart', onDragstart, true);

  const events: Record<MouseMovingEvents, MouseMovingEvent | null> = {
    start: null,
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
    parentEl.removeEventListener('dragstart', onDragstart, true);
  };

  const on = (key: MouseMovingEvents, callback: MouseMovingEvent) => {
    events[key] = callback;
  };

  const off = (key: MouseMovingEvents) => {
    events[key] = null;
  };

  return {
    destroy,
    on,
    off,
    snap,
    scrollTo,
  };
}
