# patterns

[English](../en/patterns.md) · [فهرست API](./index.md)

ابزار سبک pub/sub.

```ts
import { EventBus } from '@achareh/achar'
import type { EventBusEvent } from '@achareh/achar'
```

---

## `EventBus`

**نوع:** class

```ts
new EventBus()
```

باس رویداد درون‌حافظه‌ای با **صف pre-emit**: اگر قبل از ثبت listener مقدار `emit` کنید، آرگومان‌ها صف می‌شوند و وقتی **اولین** مشترک آن رویداد `on` را صدا بزند، دوباره پخش می‌شوند.

### متدها

| متد | امضا | توضیح |
|-----|------|--------|
| `on` | `(event: string, callback: EventBusEvent): void` | اشتراک؛ pre-emitهای صف‌شده برای کلید جدید را replay می‌کند |
| `off` | `(event: string, callback: EventBusEvent): void` | لغو یک callback |
| `emit` | `(event: string, ...args: unknown[]): void` | انتشار، یا صف اگر هنوز listener نباشد |
| `once` | `(event: string, callback: EventBusEvent): void` | اشتراک یک‌باره |
| `clear` | `(): void` | پاک کردن همه listenerها و صف‌های pre-emit |
| `removeEvent` | `(event: string): void` | حذف listenerها و صف یک رویداد |

```ts
const bus = new EventBus()

bus.on('ready', (userId) => {
  console.log('ready', userId)
})

bus.emit('ready', 42)

bus.once('boot', () => console.log('once'))
bus.emit('boot')
bus.emit('boot') // توسط once نادیده گرفته می‌شود

bus.clear()
```

---

## `EventBusEvent`

**نوع:** type

```ts
type EventBusEvent = (...args: unknown[]) => void
```

نوع callback شنونده برای `EventBus`.
