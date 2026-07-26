# patterns

[فارسی](../fa/patterns.md) · [API index](./index.md)

Lightweight pub/sub utilities.

```ts
import { EventBus } from '@achareh/achar'
import type { EventBusEvent } from '@achareh/achar'
```

---

## `EventBus`

**Kind:** class

```ts
new EventBus()
```

In-memory event bus with optional **pre-emit queue**: if you `emit` before any listener is registered, those arguments are queued and replayed when the **first** subscriber for that event calls `on`.

### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `on` | `(event: string, callback: EventBusEvent): void` | Subscribe; replays queued pre-emits for a newly created event key |
| `off` | `(event: string, callback: EventBusEvent): void` | Unsubscribe one callback |
| `emit` | `(event: string, ...args: unknown[]): void` | Publish, or queue if no listeners yet |
| `once` | `(event: string, callback: EventBusEvent): void` | One-shot subscription |
| `clear` | `(): void` | Clear all listeners and pre-emit queues |
| `removeEvent` | `(event: string): void` | Remove one event’s listeners and queue |

```ts
const bus = new EventBus()

bus.on('ready', (userId) => {
  console.log('ready', userId)
})

bus.emit('ready', 42)

bus.once('boot', () => console.log('once'))
bus.emit('boot')
bus.emit('boot') // ignored by once listener

bus.clear()
```

---

## `EventBusEvent`

**Kind:** type

```ts
type EventBusEvent = (...args: unknown[]) => void
```

Listener callback type for `EventBus`.
