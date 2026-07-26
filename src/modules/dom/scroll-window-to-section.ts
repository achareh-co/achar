import getElementPosition from './get-element-position';
import { supportsNativeSmoothScroll } from './utilities';

export default function scrollWindowToSection(
  el?: HTMLElement | string,
  options?: { marginTop?: number },
): void {
  // eslint-disable-next-line prettier/prettier
  const element = (typeof el === 'string' ? document.querySelector(el) : el) || window.document.body;
  const { marginTop = 0 } = options || {};

  let offsetTop = getElementPosition(element as HTMLElement).scrollY - marginTop;
  offsetTop = offsetTop < 0 ? 0 : offsetTop;

  if (supportsNativeSmoothScroll) {
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });
  } else {
    window.scrollTo(0, offsetTop);
  }
}

if (import.meta.vitest) {
  const { it, expect, vi, afterEach } = import.meta.vitest;

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('scrolls window to element position with marginTop', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      width: 10,
      height: 10,
      left: 0,
      top: 100,
      right: 10,
      bottom: 110,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    });
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0);
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

    scrollWindowToSection(el, { marginTop: 20 });

    expect(scrollTo).toHaveBeenCalled();
  });

  it('accepts a selector string', () => {
    const el = document.createElement('section');
    el.id = 'target';
    document.body.appendChild(el);
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      width: 10,
      height: 10,
      left: 0,
      top: 50,
      right: 10,
      bottom: 60,
      x: 0,
      y: 50,
      toJSON: () => ({}),
    });
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

    scrollWindowToSection('#target');

    expect(scrollTo).toHaveBeenCalled();
  });
}
