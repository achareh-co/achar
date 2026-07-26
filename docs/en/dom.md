# dom

[فارسی](../fa/dom.md) · [API index](./index.md)

Browser DOM helpers: smooth scroll, script injection, intersection observing, drag-to-scroll, and attribute feature detection.

```ts
import {
  supportsNativeSmoothScroll,
  createScript,
  getElementPosition,
  scrollWindowToSection,
  scrollToElement,
  scrollByAmount,
  createScrollObserver,
  scrollSnap,
  MouseMoving,
  waitWindowLoad,
  attrSupport,
} from '@achareh/achar'
import type {
  HTMLScriptOptions,
  scrollToElementOptions,
  MouseMovingOptions,
  MouseMovingEventCallback,
  MouseMovingEvents,
} from '@achareh/achar'
```

---

## `supportsNativeSmoothScroll`

**Kind:** const (`boolean`)

```ts
supportsNativeSmoothScroll: boolean
```

`true` when `window` exists and `scrollBehavior` is supported on `document.documentElement.style`. Used internally by scroll helpers to choose smooth vs instant scrolling.

---

## `createScript`

**Kind:** function

```ts
createScript(
  src: string,
  force?: boolean,
  attrs?: HTMLScriptOptions,
): Promise<HTMLScriptElement>
```

Injects a `<script>` into `document.head`, or reuses an existing `script[src="…"]` unless `force` is `true`. Resolves on load; rejects on error/abort or a previously failed script.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `src` | `string` | — | Script URL |
| `force` | `boolean` | `false` | Always create a new script tag |
| `attrs` | `HTMLScriptOptions` | — | Attributes and `on*` listeners |

```ts
const el = await createScript('https://example.com/widget.js', false, {
  async: true,
  onLoad: () => console.log('loaded'),
})
```

### `HTMLScriptOptions`

**Kind:** interface

```ts
interface HTMLScriptOptions {
  async?: boolean
  crossorigin?: string
  defer?: boolean
  integrity?: string
  nomodule?: boolean
  nonce?: string
  referrerpolicy?: string
  type?: string
  onLoad?: EventListenerOrEventListenerObject
  onError?: EventListenerOrEventListenerObject
  onAbort?: EventListenerOrEventListenerObject
  [key: string]: unknown
  [event: `on${string}`]: EventListenerOrEventListenerObject | undefined
}
```

Keys starting with `on` are registered as event listeners (e.g. `onLoad` → `load`). String values become attributes; `true` boolean values become empty attributes. Default `type` is `text/javascript`.

---

## `getElementPosition`

**Kind:** function

```ts
getElementPosition(el: HTMLElement): {
  width: number
  height: number
  left: number
  top: number
  scrollX: number
  scrollY: number
}
```

Returns the element’s bounding box plus document-relative offsets (`left/top + window.scrollX/Y`).

Throws `Error('Element is not defined')` if `el` is missing or not an `HTMLElement`.

```ts
const { scrollY, width } = getElementPosition(document.querySelector('#hero')!)
```

---

## `scrollWindowToSection`

**Kind:** function

```ts
scrollWindowToSection(
  el?: HTMLElement | string,
  options?: { marginTop?: number },
): void
```

Scrolls the window to an element (or CSS selector). Falls back to `document.body` when `el` is omitted or not found. Uses smooth scroll when supported.

| Param | Type | Description |
|-------|------|-------------|
| `el` | `HTMLElement \| string` | Element or selector |
| `options.marginTop` | `number` | Offset subtracted from target top (default `0`) |

```ts
scrollWindowToSection('#pricing', { marginTop: 64 })
```

---

## `scrollToElement`

**Kind:** function

```ts
scrollToElement(
  el: HTMLElement,
  parentEl: HTMLElement,
  options?: scrollToElementOptions,
): void
```

Scrolls `parentEl` so that `el` aligns to the requested X/Y position. Logs an error and returns if `parentEl` has no `scrollTo`.

### `scrollToElementOptions`

```ts
interface scrollToElementOptions {
  x?: 'start' | 'center' | 'end'
  y?: 'start' | 'center' | 'end'
  marginX?: number
  marginY?: number
}
```

Defaults: `x='center'`, `y='center'`, `marginX=0`, `marginY=0`.

```ts
scrollToElement(child, container, { x: 'start', y: 'center', marginX: 8 })
```

---

## `scrollByAmount`

**Kind:** function

```ts
scrollByAmount(el: HTMLElement, left?: number, top?: number): void
```

Scrolls `el` by the given deltas (smooth when supported). Logs an error if `scrollBy` is unavailable.

| Param | Type | Default |
|-------|------|---------|
| `el` | `HTMLElement` | — |
| `left` | `number` | `0` |
| `top` | `number` | `0` |

```ts
scrollByAmount(container, 200, 0)
```

---

## `createScrollObserver`

**Kind:** function

```ts
createScrollObserver(
  nodes: Element[],
  onObserve: (entry: IntersectionObserverEntry, entryIndex: number) => void,
  options?: IntersectionObserverInit,
): () => void
```

Observes elements with `IntersectionObserver`. Returns a cleanup function that unobserves all nodes and disconnects the observer.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `nodes` | `Element[]` | — | Elements to observe |
| `onObserve` | `(entry, entryIndex) => void` | — | Called per intersecting entry; `entryIndex` is index in `nodes` |
| `options` | `IntersectionObserverInit` | `{}` | Passed to `IntersectionObserver` |

```ts
const stop = createScrollObserver(
  [...document.querySelectorAll('.section')],
  (entry, index) => {
    if (entry.isIntersecting) console.log('visible', index)
  },
  { threshold: 0.5 },
)

// later
stop()
```

---

## `scrollSnap`

**Kind:** function

```ts
scrollSnap(scrollParent: HTMLElement, scrollLeft: number): number
```

Snaps horizontal scroll to the nearest child slot (RTL-oriented: `scrollLeft` is treated as negative). Applies smooth `scroll-behavior`, updates `scrollParent` via `scrollTo`, and returns the final `scrollLeft`. Returns `0` if `scrollParent` or its first child is missing.

```ts
const next = scrollSnap(track, track.scrollLeft)
```

---

## `MouseMoving`

**Kind:** class

```ts
new MouseMoving(el: HTMLElement, options?: MouseMovingOptions)
```

Drag-to-scroll for a horizontally scrollable element. Listens on `el.parentElement`. Throws if `el` or its parent is missing. Calls `mount()` from the constructor.

### Public fields

| Field | Type | Description |
|-------|------|-------------|
| `el` | `HTMLElement` | Scrollable element |
| `parentElement` | `HTMLElement` | Drag listener host |
| `options` | `MouseMovingOptions` | Config |
| `isOnMoving` | `boolean` | Whether a drag is active |
| `scrollX` | `number` | Current scroll X (RTL-negative convention) |
| `scrollXStartMoving` | `number` | Scroll X at drag start |
| `events` | `Record<MouseMovingEvents, MouseMovingEventCallback \| null>` | Event callbacks |

### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `on` | `(event: MouseMovingEvents, callback: MouseMovingEventCallback): void` | Subscribe (one callback per event) |
| `off` | `(event: MouseMovingEvents): void` | Unsubscribe |
| `scrollXTo` | `(amount: number): void` | Programmatic scroll (snap-aware) |
| `mount` | `(): void` | Attach listeners |
| `destroy` | `(): void` | Detach listeners |

```ts
const mm = new MouseMoving(track, { snap: true })

mm.on('update', (x) => console.log(x))
mm.on('end', () => console.log('done'))

// cleanup
mm.destroy()
```

### `MouseMovingOptions`

```ts
interface MouseMovingOptions {
  snap: boolean
}
```

Default: `{ snap: false }`. When `snap` is `true`, release / `scrollXTo` use [`scrollSnap`](#scrollsnap).

### `MouseMovingEvents`

```ts
type MouseMovingEvents = 'start' | 'end' | 'moving' | 'snap' | 'update'
```

### `MouseMovingEventCallback`

```ts
type MouseMovingEventCallback = (scrollX?: number) => void
```


---

## `waitWindowLoad`

**Kind:** function

```ts
waitWindowLoad(): Promise<void>
```

Resolves immediately if `document.readyState === 'complete'`, otherwise on `window` `load`. Rejects if neither `document` nor `window` is available.

```ts
await waitWindowLoad()
```

---

## `attrSupport`

**Kind:** function

```ts
attrSupport<K extends keyof HTMLElementTagNameMap>(
  attr: string,
  el: K,
): boolean
```

Returns whether `attr` exists on a newly created element of tag `el`. Returns `false` when `document` is unavailable.

| Param | Type | Description |
|-------|------|-------------|
| `attr` | `string` | Attribute name to detect |
| `el` | `keyof HTMLElementTagNameMap` | HTML tag name |

```ts
attrSupport('loading', 'img') // true in modern browsers
```
