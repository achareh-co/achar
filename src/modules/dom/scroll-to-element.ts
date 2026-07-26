import { supportsNativeSmoothScroll } from './utilities';

export interface scrollToElementOptions {
  x?: 'start' | 'center' | 'end';
  y?: 'start' | 'center' | 'end';
  marginX?: number;
  marginY?: number;
}

export default function scrollToElement(
  el: HTMLElement,
  parentEl: HTMLElement,
  options?: scrollToElementOptions,
): void {
  if (!('scrollTo' in parentEl)) {
    console.error('scrollTo is not supported');
    return;
  }

  const { x = 'center', y = 'center', marginX = 0, marginY = 0 } = options || {};

  let offsetLeft: number;
  if (x === 'start') {
    offsetLeft = el.offsetLeft + el.clientWidth - parentEl.clientWidth + marginX;
  } else if (x === 'end') {
    offsetLeft = el.offsetLeft - marginX;
  } else {
    offsetLeft = el.offsetLeft + el.clientWidth / 2 - parentEl.clientWidth / 2;
  }

  let offsetTop: number;
  if (y === 'start') {
    offsetTop = el.offsetTop - marginY;
  } else if (y === 'end') {
    offsetTop = el.offsetTop + el.clientHeight - parentEl.clientHeight + marginY;
  } else {
    offsetTop = el.offsetTop + el.clientHeight / 2 - parentEl.clientHeight / 2;
  }

  if (supportsNativeSmoothScroll) {
    parentEl.scrollTo({
      top: offsetTop,
      left: offsetLeft,
      behavior: 'smooth',
    });
  } else {
    parentEl.scrollTo(offsetLeft, offsetTop);
  }
}

if (import.meta.vitest) {
  const { it, expect, vi, afterEach } = import.meta.vitest;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createElements() {
    const parentEl = document.createElement('div');
    const el = document.createElement('div');
    Object.defineProperty(parentEl, 'clientWidth', { value: 200 });
    Object.defineProperty(parentEl, 'clientHeight', { value: 100 });
    Object.defineProperty(el, 'offsetLeft', { value: 50 });
    Object.defineProperty(el, 'offsetTop', { value: 40 });
    Object.defineProperty(el, 'clientWidth', { value: 20 });
    Object.defineProperty(el, 'clientHeight', { value: 10 });
    const scrollTo = vi.fn();
    Object.defineProperty(parentEl, 'scrollTo', { value: scrollTo });
    return { parentEl, el, scrollTo };
  }

  it('scrolls to center by default', () => {
    const { parentEl, el, scrollTo } = createElements();

    scrollToElement(el, parentEl);

    expect(scrollTo).toHaveBeenCalled();
    const call = scrollTo.mock.calls[0][0];
    if (typeof call === 'object') {
      expect(call.left).toBe(50 + 10 - 100);
      expect(call.top).toBe(40 + 5 - 50);
    }
  });

  it('scrolls using start and end alignments', () => {
    const { parentEl, el, scrollTo } = createElements();

    scrollToElement(el, parentEl, { x: 'start', y: 'start', marginX: 2, marginY: 3 });
    expect(scrollTo).toHaveBeenCalled();

    scrollTo.mockClear();
    scrollToElement(el, parentEl, { x: 'end', y: 'end', marginX: 2, marginY: 3 });
    expect(scrollTo).toHaveBeenCalled();
  });

  it('logs error when scrollTo is unsupported', () => {
    const parentEl = {} as HTMLElement;
    const el = document.createElement('div');
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    scrollToElement(el, parentEl);

    expect(error).toHaveBeenCalledWith('scrollTo is not supported');
  });
}
