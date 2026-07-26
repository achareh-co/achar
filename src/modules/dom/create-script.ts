export interface HTMLScriptOptions {
  async?: boolean;
  crossorigin?: string;
  defer?: boolean;
  integrity?: string;
  nomodule?: boolean;
  nonce?: string;
  referrerpolicy?: string;
  type?: string;
  onLoad?: EventListenerOrEventListenerObject;
  onError?: EventListenerOrEventListenerObject;
  onAbort?: EventListenerOrEventListenerObject;
  [key: string]: unknown;
  [event: `on${string}`]: EventListenerOrEventListenerObject | undefined;
}

export default function createScript(
  src: string,
  force = false,
  attrs?: HTMLScriptOptions,
): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;

    const isNew = force || existingScript === null;
    const el = isNew ? createScriptElement(src, attrs) : existingScript;

    if (el.getAttribute('data-status') === 'pending') {
      attachEvents(el, resolve, reject, isNew);
    } else if (el.getAttribute('data-status') === 'load') {
      resolve(el);
    } else {
      reject(new ErrorEvent('Script tag failed to load'));
    }

    if (isNew) {
      document.head.appendChild(el);
    }
  });
}

function createScriptElement(src: string, attrs: HTMLScriptOptions = {}): HTMLScriptElement {
  const el = document.createElement('script');
  el.src = src;

  // add attributes
  attrs.type = attrs.type || 'text/javascript';
  Object.entries(attrs).forEach(([key, value]) => {
    if (/^on/.test(key)) {
      // eslint-disable-next-line prettier/prettier
      el.addEventListener(key.replace(/^on/, '').toLowerCase(), value as EventListenerOrEventListenerObject);
    } else if (typeof value === 'string') {
      el.setAttribute(key, value);
    } else if (value === true) {
      el.setAttribute(key, '');
    }
  });

  el.setAttribute('data-status', 'pending');
  return el;
}

function attachEvents(
  el: HTMLScriptElement,
  resolve: (value: HTMLScriptElement | PromiseLike<HTMLScriptElement>) => void,
  reject: (reason: unknown) => void,
  setStatus = false,
) {
  const eventOptions = { once: true };
  const events = ['load', 'error', 'abort'];
  const createEventHandler = (name: string) => (e: Event) => {
    if (setStatus) el.setAttribute('data-status', name);

    if (name === 'load') {
      resolve(el);
    } else {
      reject(e);
    }
  };

  events.forEach((name) => el.addEventListener(name, createEventHandler(name), eventOptions));
}

if (import.meta.vitest) {
  const { it, expect, vi, afterEach } = import.meta.vitest;

  afterEach(() => {
    document.head.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('creates a script and resolves on load', async () => {
    vi.spyOn(document.head, 'appendChild').mockImplementation((node) => node);

    const promise = createScript('https://example.com/app.js', true, {
      async: true,
      type: 'module',
    });

    const appended = (document.head.appendChild as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as HTMLScriptElement;
    expect(appended.getAttribute('data-status')).toBe('pending');
    expect(appended.getAttribute('async')).toBe('');
    expect(appended.type).toBe('module');

    appended.dispatchEvent(new Event('load'));
    await expect(promise).resolves.toBe(appended);
    expect(appended.getAttribute('data-status')).toBe('load');
  });

  it('rejects when script fails to load', async () => {
    vi.spyOn(document.head, 'appendChild').mockImplementation((node) => node);

    const promise = createScript('https://example.com/fail.js', true);
    const appended = (document.head.appendChild as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as HTMLScriptElement;

    appended.dispatchEvent(new Event('error'));
    await expect(promise).rejects.toBeTruthy();
  });

  it('reuses an already loaded script', async () => {
    const existing = document.createElement('script');
    existing.setAttribute('src', 'https://example.com/cached.js');
    existing.setAttribute('data-status', 'load');
    vi.spyOn(document, 'querySelector').mockReturnValue(existing);

    await expect(createScript('https://example.com/cached.js')).resolves.toBe(existing);
  });
}
