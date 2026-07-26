# web-api

[English](../en/web-api.md) · [فهرست API](./index.md)

کمکی‌های کلیپ‌بورد برای مرورگر.

```ts
import { writeClipboardApi, legacyCopyText } from '@achareh/achar'
```

---

## `writeClipboardApi`

**نوع:** function

```ts
writeClipboardApi(text: string): Promise<void>
```

متن را با Clipboard API می‌نویسد (`navigator.clipboard.writeText`).

| پارامتر | نوع | توضیح |
|---------|-----|--------|
| `text` | `string` | متن برای کپی |

**خروجی:** Promise که بعد از به‌روز شدن کلیپ‌بورد resolve می‌شود.

اگر `navigator.clipboard.writeText` در دسترس نباشد، با `Error('No support for write clipboard API')` **reject** می‌شود.

```ts
await writeClipboardApi('hello world!')
```

---

## `legacyCopyText`

**نوع:** function

```ts
legacyCopyText(text: string): void
```

متن را با یک `<input>` موقت و `document.execCommand('copy')` کپی می‌کند. وقتی Clipboard API در دسترس نیست به‌عنوان fallback مفید است.

| پارامتر | نوع | توضیح |
|---------|-----|--------|
| `text` | `string` | متن برای کپی |

```ts
legacyCopyText('hello world!')
```
