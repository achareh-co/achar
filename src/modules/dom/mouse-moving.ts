import scrollSnap from './scroll-snap';
import { delay, createThrottle } from '../helpers';

export interface MouseMovingOptions {
  snap: boolean;
}
export type MouseMovingEventCallback = (scrollX?: number) => void;
export type MouseMovingEvents = 'start' | 'end' | 'moving' | 'snap' | 'update';

export default class MouseMoving {
  el: HTMLElement;
  parentElement: HTMLElement;
  options: MouseMovingOptions;
  isOnMoving = false;

  scrollX = 0;
  events: Record<MouseMovingEvents, MouseMovingEventCallback | null> = {
    start: null,
    moving: null,
    snap: null,
    end: null,
    update: null,
  };

  constructor(el: HTMLElement, options?: MouseMovingOptions) {
    if (!el) throw Error('Element not found!');
    if (!el.parentElement) throw Error('Element Parent not found!');

    this.el = el;
    this.parentElement = el.parentElement;
    this.options = options || { snap: false };

    this.mount();
  }

  on(event: MouseMovingEvents, callback: MouseMovingEventCallback): void {
    this.events[event] = callback;
  }

  off(event: MouseMovingEvents): void {
    this.events[event] = null;
  }

  scrollXTo(amount: number) {
    if (this.options.snap) {
      this.scrollX = scrollSnap(this.el, amount);
      this.events.snap?.();
    } else {
      this.el.scrollTo(amount, 0);
      this.scrollX = amount;
    }

    this.events.update?.(this.scrollX);
  }

  mount() {
    this.parentElement.addEventListener('mousedown', this.startMoving);
    this.parentElement.addEventListener('mouseup', this.endedMoving);
    this.parentElement.addEventListener('mouseleave', this.endedMoving);
    this.parentElement.addEventListener('mousemove', this.mouseMoving);
    this.parentElement.addEventListener('dragstart', this.dragstart, true);

    this.el.addEventListener('scroll', this.throttleScrollHandler, { passive: true });
    window.addEventListener('resize', this.throttleScrollHandler, { passive: true });
  }

  destroy() {
    this.parentElement.removeEventListener('mousedown', this.startMoving);
    this.parentElement.removeEventListener('mouseup', this.endedMoving);
    this.parentElement.removeEventListener('mouseleave', this.endedMoving);
    this.parentElement.removeEventListener('mousemove', this.mouseMoving);
    this.parentElement.removeEventListener('dragstart', this.dragstart, true);

    this.el.removeEventListener('scroll', this.throttleScrollHandler);
    window.removeEventListener('resize', this.throttleScrollHandler);
  }

  private startMoving = () => {
    this.isOnMoving = true;
    this.el.style.removeProperty('scroll-behavior');
    this.parentElement.style.setProperty('cursor', 'grabbing');

    this.events.start?.();
    this.events.update?.(this.scrollX);
  };

  private endedMoving = () => {
    this.isOnMoving = false;
    this.el.style.setProperty('scroll-behavior', 'smooth');
    this.parentElement.style.removeProperty('cursor');

    if (this.options.snap) {
      delay(0).then(() => {
        this.scrollX = scrollSnap(this.el, this.scrollX);
        this.events.snap?.();
        this.events.update?.(this.scrollX);
      });
    } else {
      delay(0).then(() => {
        this.el.style.removeProperty('pointer-events');
      });
    }

    this.events.end?.();
    this.events.update?.(this.scrollX);
  };

  private mouseMoving = (event: MouseEvent) => {
    if (!this.isOnMoving) return;

    this.el.style.setProperty('pointer-events', 'none');
    this.scrollX += -event.movementX;

    const maxScroll = -(this.el.scrollWidth - this.el.clientWidth);
    if (maxScroll > this.scrollX) {
      this.scrollX = maxScroll;
    }

    if (this.scrollX > 0) {
      this.scrollX = 0;
    }

    this.events.moving?.();
    this.events.update?.(this.scrollX);
    this.el.scrollTo(this.scrollX, 0);
  };

  private dragstart(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  private throttleScrollHandler = createThrottle(this.scroll.bind(this));

  private scroll() {
    this.scrollX = this.el.scrollLeft;
    this.events.update?.(this.scrollX);
  }
}
