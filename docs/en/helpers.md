# helpers

[فارسی](../fa/helpers.md) · [API index](./index.md)

Timing helpers, query checks, retry with backoff, UUID, rounding, and URI decoding.

```ts
import {
  createDebounce,
  createThrottle,
  delay,
  queryInclude,
  retryWithDelay,
  maxRetryError,
  taskCanceledError,
  generateV4UUID,
  round,
  getFormattedTime,
  decodeURIComponentBetter,
} from '@achareh/achar'
```

---

## `createDebounce`

**Kind:** function

```ts
createDebounce(
  cb: (...args: unknown[]) => void,
  delay: number,
  immediate?: boolean,
): (...args: unknown[]) => void
```

Returns a debounced wrapper around `cb`.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `cb` | `(...args: unknown[]) => void` | — | Function to debounce |
| `delay` | `number` | — | Delay in milliseconds |
| `immediate` | `boolean` | `false` | If `true`, call on the leading edge |

```ts
const save = createDebounce(() => console.log('saved'), 300)
save()
```

---

## `createThrottle`

**Kind:** function

```ts
createThrottle(
  cb: (...args: unknown[]) => void,
  delay?: number,
  leading?: boolean,
): (...args: unknown[]) => void
```

Returns a throttled wrapper around `cb`.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `cb` | `(...args: unknown[]) => void` | — | Function to throttle |
| `delay` | `number` | `-1` | Delay in ms; if `< 0`, uses `requestAnimationFrame` |
| `leading` | `boolean` | `false` | If `true`, call on the leading edge |

```ts
const onScroll = createThrottle(() => console.log('tick'), 100)
window.addEventListener('scroll', onScroll)
```

---

## `delay`

**Kind:** function

```ts
delay(delay: number): Promise<void>
```

Promise-based sleep.

| Param | Type | Description |
|-------|------|-------------|
| `delay` | `number` | Milliseconds to wait |

```ts
await delay(1000)
```

---

## `queryInclude`

**Kind:** function

```ts
queryInclude(query: string, routeString?: string): boolean
```

Checks whether `query` appears in `location.search`. If `location` is unavailable, falls back to `routeString`. Returns `false` when neither is usable.

| Param | Type | Description |
|-------|------|-------------|
| `query` | `string` | Substring to find |
| `routeString` | `string` | Optional fallback string (e.g. a route query) |

```ts
queryInclude('debug=1')
queryInclude('foo', '?foo=1&bar=2') // true
```

---

## `retryWithDelay`

**Kind:** function

```ts
retryWithDelay(
  requestFn: () => Promise<void> | void,
  delayTime?: number,
  maxRetries?: number,
  signal?: AbortSignal,
): () => Promise<void>
```

Returns an async runner that calls `requestFn` and retries on failure with exponential backoff (`delayTime * 2` each retry).

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `requestFn` | `() => Promise<void> \| void` | — | Task to run |
| `delayTime` | `number` | `1000` | Initial retry delay (ms) |
| `maxRetries` | `number` | `5` | Remaining retries after a failure |
| `signal` | `AbortSignal` | — | Abort between retries |

**Notes:**

- Errors with `e.response.status` are rethrown immediately (no retry).
- Exhausted retries throw [`maxRetryError`](#maxretryerror).
- Aborted `signal` throws [`taskCanceledError`](#taskcancelederror).

```ts
const run = retryWithDelay(async () => {
  await fetch('/api/ping')
}, 500, 3)

await run()
```

---

## `maxRetryError`

**Kind:** error (`Error`)

```ts
maxRetryError // Error: 'Max Retries Reached'
```

Thrown by `retryWithDelay` when retries are exhausted.

---

## `taskCanceledError`

**Kind:** error (`Error`)

```ts
taskCanceledError // Error: 'Task Cancelled'
```

Thrown by `retryWithDelay` when `signal` is aborted during a wait.

---

## `generateV4UUID`

**Kind:** function

```ts
generateV4UUID(): string
```

Generates an RFC 4122 version 4 UUID via `crypto.getRandomValues`.

```ts
const id = generateV4UUID()
// e.g. "550e8400-e29b-41d4-a716-446655440000"
```

---

## `round`

**Kind:** function

```ts
round(value: number, exp?: number): number
```

Rounds `value` to `exp` decimal places. When `exp` is omitted or `0`, uses `Math.round`. Returns `NaN` for invalid inputs.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `value` | `number` | — | Number to round |
| `exp` | `number` | — | Decimal places |

```ts
round(1.2345, 2) // 1.23
round(1.5) // 2
```

---

## `getFormattedTime`

**Kind:** function

```ts
getFormattedTime(timeInSeconds: number): string
```

Formats a duration in seconds as `mm':ss"`, or `hh:mm':ss"` when the duration is at least one hour.

| Param | Type | Description |
|-------|------|-------------|
| `timeInSeconds` | `number` | Total seconds |

```ts
getFormattedTime(65) // "01':05\""
getFormattedTime(3661) // "01:01':01\""
```

---

## `decodeURIComponentBetter`

**Kind:** function

```ts
decodeURIComponentBetter(uri: string): string
```

Decodes a URI component repeatedly until it no longer changes (handles double-encoding).

| Param | Type | Description |
|-------|------|-------------|
| `uri` | `string` | Encoded URI component |

```ts
decodeURIComponentBetter('hello%2520world') // "hello world"
```
