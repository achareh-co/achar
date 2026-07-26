# helpers

[English](../en/helpers.md) · [فهرست API](./index.md)

ابزارهای زمان‌بندی، بررسی query و retry با backoff.

```ts
import {
  createDebounce,
  createThrottle,
  delay,
  queryInclude,
  retryWithDelay,
  maxRetryError,
  taskCanceledError,
} from '@achareh/achar'
```

---

## `createDebounce`

**نوع:** function

```ts
createDebounce(
  cb: (...args: unknown[]) => void,
  delay: number,
  immediate?: boolean,
): (...args: unknown[]) => void
```

یک wrapper با debounce دور `cb` می‌سازد.

| پارامتر | نوع | پیش‌فرض | توضیح |
|---------|-----|---------|--------|
| `cb` | `(...args: unknown[]) => void` | — | تابعی که debounce می‌شود |
| `delay` | `number` | — | تأخیر به میلی‌ثانیه |
| `immediate` | `boolean` | `false` | اگر `true` باشد، در لبهٔ ابتدایی صدا زده می‌شود |

```ts
const save = createDebounce(() => console.log('saved'), 300)
save()
```

---

## `createThrottle`

**نوع:** function

```ts
createThrottle(
  cb: (...args: unknown[]) => void,
  delay?: number,
  leading?: boolean,
): (...args: unknown[]) => void
```

یک wrapper با throttle دور `cb` می‌سازد.

| پارامتر | نوع | پیش‌فرض | توضیح |
|---------|-----|---------|--------|
| `cb` | `(...args: unknown[]) => void` | — | تابعی که throttle می‌شود |
| `delay` | `number` | `-1` | تأخیر به ms؛ اگر `< 0` باشد از `requestAnimationFrame` استفاده می‌کند |
| `leading` | `boolean` | `false` | اگر `true` باشد، در لبهٔ ابتدایی صدا زده می‌شود |

```ts
const onScroll = createThrottle(() => console.log('tick'), 100)
window.addEventListener('scroll', onScroll)
```

---

## `delay`

**نوع:** function

```ts
delay(delay: number): Promise<void>
```

خواب مبتنی بر Promise.

| پارامتر | نوع | توضیح |
|---------|-----|--------|
| `delay` | `number` | میلی‌ثانیهٔ انتظار |

```ts
await delay(1000)
```

---

## `queryInclude`

**نوع:** function

```ts
queryInclude(query: string, routeString?: string): boolean
```

بررسی می‌کند آیا `query` داخل `location.search` هست. اگر `location` در دسترس نباشد، از `routeString` استفاده می‌کند. وقتی هیچ‌کدام قابل استفاده نباشند `false` برمی‌گرداند.

| پارامتر | نوع | توضیح |
|---------|-----|--------|
| `query` | `string` | زیررشتهٔ مورد جستجو |
| `routeString` | `string` | رشتهٔ جایگزین اختیاری (مثلاً query یک route) |

```ts
queryInclude('debug=1')
queryInclude('foo', '?foo=1&bar=2') // true
```

---

## `retryWithDelay`

**نوع:** function

```ts
retryWithDelay(
  requestFn: () => Promise<void> | void,
  delayTime?: number,
  maxRetries?: number,
  signal?: AbortSignal,
): () => Promise<void>
```

یک runner ناهمگام برمی‌گرداند که `requestFn` را صدا می‌زند و در صورت شکست با exponential backoff (`delayTime * 2` در هر retry) دوباره تلاش می‌کند.

| پارامتر | نوع | پیش‌فرض | توضیح |
|---------|-----|---------|--------|
| `requestFn` | `() => Promise<void> \| void` | — | وظیفه‌ای که اجرا می‌شود |
| `delayTime` | `number` | `1000` | تأخیر اولیهٔ retry (ms) |
| `maxRetries` | `number` | `5` | تعداد retry باقی‌مانده بعد از شکست |
| `signal` | `AbortSignal` | — | لغو بین retryها |

**نکات:**

- خطاهایی که `e.response.status` دارند بلافاصله throw می‌شوند (بدون retry).
- اتمام retryها [`maxRetryError`](#maxretryerror) پرتاب می‌کند.
- abort شدن `signal` مقدار [`taskCanceledError`](#taskcancelederror) پرتاب می‌کند.

```ts
const run = retryWithDelay(async () => {
  await fetch('/api/ping')
}, 500, 3)

await run()
```

---

## `maxRetryError`

**نوع:** error (`Error`)

```ts
maxRetryError // Error: 'Max Retries Reached'
```

وقتی retryهای `retryWithDelay` تمام شود پرتاب می‌شود.

---

## `taskCanceledError`

**نوع:** error (`Error`)

```ts
taskCanceledError // Error: 'Task Cancelled'
```

وقتی در حین انتظار، `signal` abort شود توسط `retryWithDelay` پرتاب می‌شود.
