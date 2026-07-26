# dom

[English](../en/dom.md) · [فهرست API](./index.md)

کمکی‌های DOM مرورگر: اسکرول نرم، تزریق اسکریپت، IntersectionObserver و drag-to-scroll.

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

**نوع:** const (`boolean`)

```ts
supportsNativeSmoothScroll: boolean
```

وقتی `window` وجود داشته باشد و `scrollBehavior` روی `document.documentElement.style` پشتیبانی شود `true` است. اسکرول‌هلپرها از آن برای انتخاب اسکرول نرم یا آنی استفاده می‌کنند.

---

## `createScript`

**نوع:** function

```ts
createScript(
  src: string,
  force?: boolean,
  attrs?: HTMLScriptOptions,
): Promise<HTMLScriptElement>
```

یک `<script>` داخل `document.head` تزریق می‌کند، یا مگر اینکه `force` برابر `true` باشد، از `script[src="…"]` موجود دوباره استفاده می‌کند. روی load resolve و روی error/abort (یا اسکریپت شکست‌خوردهٔ قبلی) reject می‌شود.

| پارامتر | نوع | پیش‌فرض | توضیح |
|---------|-----|---------|--------|
| `src` | `string` | — | آدرس اسکریپت |
| `force` | `boolean` | `false` | همیشه تگ اسکریپت جدید بساز |
| `attrs` | `HTMLScriptOptions` | — | attributeها و listenerهای `on*` |

```ts
const el = await createScript('https://example.com/widget.js', false, {
  async: true,
  onLoad: () => console.log('loaded'),
})
```

### `HTMLScriptOptions`

**نوع:** interface

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

کلیدهایی که با `on` شروع می‌شوند به‌عنوان event listener ثبت می‌شوند (مثلاً `onLoad` → `load`). مقادیر رشته‌ای attribute می‌شوند؛ `true` به‌صورت attribute خالی. پیش‌فرض `type` برابر `text/javascript` است.

---

## `getElementPosition`

**نوع:** function

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

جعبهٔ محدودکنندهٔ المان به‌همراه آفست نسبی به سند (`left/top + window.scrollX/Y`) را برمی‌گرداند.

اگر `el` نباشد یا `HTMLElement` نباشد، `Error('Element is not defined')` پرتاب می‌کند.

```ts
const { scrollY, width } = getElementPosition(document.querySelector('#hero')!)
```

---

## `scrollWindowToSection`

**نوع:** function

```ts
scrollWindowToSection(
  el?: HTMLElement | string,
  options?: { marginTop?: number },
): void
```

پنجره را تا یک المان (یا سلکتور CSS) اسکرول می‌کند. اگر `el` نباشد یا پیدا نشود به `document.body` برمی‌گردد. در صورت پشتیبانی، اسکرول نرم است.

| پارامتر | نوع | توضیح |
|---------|-----|--------|
| `el` | `HTMLElement \| string` | المان یا سلکتور |
| `options.marginTop` | `number` | مقدار کم‌شده از top هدف (پیش‌فرض `0`) |

```ts
scrollWindowToSection('#pricing', { marginTop: 64 })
```

---

## `scrollToElement`

**نوع:** function

```ts
scrollToElement(
  el: HTMLElement,
  parentEl: HTMLElement,
  options?: scrollToElementOptions,
): void
```

`parentEl` را طوری اسکرول می‌کند که `el` در موقعیت X/Y خواسته‌شده قرار بگیرد. اگر `parentEl` متد `scrollTo` نداشته باشد، خطا لاگ می‌کند و برمی‌گردد.

### `scrollToElementOptions`

```ts
interface scrollToElementOptions {
  x?: 'start' | 'center' | 'end'
  y?: 'start' | 'center' | 'end'
  marginX?: number
  marginY?: number
}
```

پیش‌فرض‌ها: `x='center'`، `y='center'`، `marginX=0`، `marginY=0`.

```ts
scrollToElement(child, container, { x: 'start', y: 'center', marginX: 8 })
```

---

## `scrollByAmount`

**نوع:** function

```ts
scrollByAmount(el: HTMLElement, left?: number, top?: number): void
```

`el` را به اندازهٔ دلتاهای داده‌شده اسکرول می‌کند (در صورت پشتیبانی، نرم). اگر `scrollBy` نباشد خطا لاگ می‌کند.

| پارامتر | نوع | پیش‌فرض |
|---------|-----|---------|
| `el` | `HTMLElement` | — |
| `left` | `number` | `0` |
| `top` | `number` | `0` |

```ts
scrollByAmount(container, 200, 0)
```

---

## `createScrollObserver`

**نوع:** function

```ts
createScrollObserver(
  nodes: Element[],
  onObserve: (entry: IntersectionObserverEntry, entryIndex: number) => void,
  options?: IntersectionObserverInit,
): () => void
```

المان‌ها را با `IntersectionObserver` مشاهده می‌کند. یک تابع cleanup برمی‌گرداند که همه nodeها را unobserve و observer را disconnect می‌کند.

| پارامتر | نوع | پیش‌فرض | توضیح |
|---------|-----|---------|--------|
| `nodes` | `Element[]` | — | المان‌های مورد مشاهده |
| `onObserve` | `(entry, entryIndex) => void` | — | برای هر entry؛ `entryIndex` ایندکس در `nodes` است |
| `options` | `IntersectionObserverInit` | `{}` | پاس‌داده‌شده به `IntersectionObserver` |

```ts
const stop = createScrollObserver(
  [...document.querySelectorAll('.section')],
  (entry, index) => {
    if (entry.isIntersecting) console.log('visible', index)
  },
  { threshold: 0.5 },
)

// بعداً
stop()
```

---

## `scrollSnap`

**نوع:** function

```ts
scrollSnap(scrollParent: HTMLElement, scrollLeft: number): number
```

اسکرول افقی را به نزدیک‌ترین اسلات فرزند snap می‌کند (محور RTL: `scrollLeft` منفی در نظر گرفته می‌شود). `scroll-behavior` نرم اعمال می‌کند، با `scrollTo` آپدیت می‌کند و `scrollLeft` نهایی را برمی‌گرداند. اگر `scrollParent` یا اولین فرزندش نباشد `0` برمی‌گرداند.

```ts
const next = scrollSnap(track, track.scrollLeft)
```

---

## `MouseMoving`

**نوع:** class

```ts
new MouseMoving(el: HTMLElement, options?: MouseMovingOptions)
```

کشیدن برای اسکرول افقی روی یک المان اسکرول‌پذیر. listenerها روی `el.parentElement` ثبت می‌شوند. اگر `el` یا parent نباشد throw می‌کند. از سازنده `mount()` را صدا می‌زند.

### فیلدهای عمومی

| فیلد | نوع | توضیح |
|------|-----|--------|
| `el` | `HTMLElement` | المان اسکرول‌پذیر |
| `parentElement` | `HTMLElement` | میزبان listenerهای drag |
| `options` | `MouseMovingOptions` | تنظیمات |
| `isOnMoving` | `boolean` | آیا drag فعال است |
| `scrollX` | `number` | اسکرول X فعلی (قرارداد منفی RTL) |
| `scrollXStartMoving` | `number` | اسکرول X در شروع drag |
| `events` | `Record<MouseMovingEvents, MouseMovingEventCallback \| null>` | callbackهای رویداد |

### متدها

| متد | امضا | توضیح |
|-----|------|--------|
| `on` | `(event: MouseMovingEvents, callback: MouseMovingEventCallback): void` | اشتراک (یک callback برای هر رویداد) |
| `off` | `(event: MouseMovingEvents): void` | لغو اشتراک |
| `scrollXTo` | `(amount: number): void` | اسکرول برنامه‌ای (با آگاهی از snap) |
| `mount` | `(): void` | اتصال listenerها |
| `destroy` | `(): void` | جدا کردن listenerها |

```ts
const mm = new MouseMoving(track, { snap: true })

mm.on('update', (x) => console.log(x))
mm.on('end', () => console.log('done'))

// پاک‌سازی
mm.destroy()
```

### `MouseMovingOptions`

```ts
interface MouseMovingOptions {
  snap: boolean
}
```

پیش‌فرض: `{ snap: false }`. وقتی `snap` برابر `true` باشد، رها کردن / `scrollXTo` از [`scrollSnap`](#scrollsnap) استفاده می‌کنند.

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

**نوع:** function

```ts
waitWindowLoad(): Promise<void>
```

اگر `document.readyState === 'complete'` باشد بلافاصله resolve می‌شود؛ وگرنه روی رویداد `load`ی `window`. اگر نه `document` و نه `window` در دسترس باشد reject می‌شود.

```ts
await waitWindowLoad()
```
