import { supportsNativeSmoothScroll } from './utilities';

export default function scrollByAmount(el: HTMLElement, left = 0, top = 0): void {
  if (!('scrollBy' in el)) {
    console.error('scrollBy is not supported');
    return;
  }

  if (supportsNativeSmoothScroll) {
    el.scrollBy({
      left,
      top,
      behavior: 'smooth',
    });
  } else {
    el.scrollBy(left || 0, top || 0);
  }
}

if (import.meta.vitest) {
  const { it, expect, vi, afterEach } = import.meta.vitest;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls scrollBy on the element', () => {
    const el = document.createElement('div');
    const scrollBy = vi.fn();
    Object.defineProperty(el, 'scrollBy', { value: scrollBy });

    scrollByAmount(el, 10, 20);

    expect(scrollBy).toHaveBeenCalled();
  });

  it('logs error when scrollBy is unsupported', () => {
    const el = {} as HTMLElement;
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    scrollByAmount(el, 10, 20);

    expect(error).toHaveBeenCalledWith('scrollBy is not supported');
  });
}
