# helpers

[فارسی](../fa/helpers.md) · [API index](./index.md)

Timing helpers, query checks, and retry with backoff.

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
