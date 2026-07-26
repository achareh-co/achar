# web-api

[فارسی](../fa/web-api.md) · [API index](./index.md)

Clipboard helpers for the browser.

```ts
import { writeClipboardApi, legacyCopyText } from '@achareh/achar'
```

---

## `writeClipboardApi`

**Kind:** function

```ts
writeClipboardApi(text: string): Promise<void>
```

Writes text via the Clipboard API (`navigator.clipboard.writeText`).

| Param | Type | Description |
|-------|------|-------------|
| `text` | `string` | Text to copy |

**Returns:** Promise that resolves when the clipboard is updated.

**Rejects** with `Error('No support for write clipboard API')` when `navigator.clipboard.writeText` is unavailable.

```ts
await writeClipboardApi('hello world!')
```

---

## `legacyCopyText`

**Kind:** function

```ts
legacyCopyText(text: string): void
```

Copies text using a temporary `<input>` and `document.execCommand('copy')`. Useful as a fallback when the Clipboard API is unavailable.

| Param | Type | Description |
|-------|------|-------------|
| `text` | `string` | Text to copy |

```ts
legacyCopyText('hello world!')
```
