# text

[فارسی](../fa/text.md) · [API index](./index.md)

Persian/Arabic digit conversion, number formatting, slug helpers, and an HTML tagged template.

```ts
import {
  thousandSeparator,
  toEnglishDigits,
  toPersianDigits,
  toSlug,
  fromSlug,
  html,
} from '@achareh/achar'
```

---

## `toPersianDigits`

**Kind:** function

```ts
toPersianDigits(text: string | number): string
```

Converts English and Arabic digits to Persian digits. Falsy input returns `''`.

| Param | Type | Description |
|-------|------|-------------|
| `text` | `string \| number` | Input text or number |

**Returns:** formatted string (e.g. `123456` → `۱۲۳۴۵۶`)

```ts
toPersianDigits(123456) // '۱۲۳۴۵۶'
toPersianDigits('١٢٣') // '۱۲۳'
```

---

## `toEnglishDigits`

**Kind:** function

```ts
toEnglishDigits(text: string | number): string
```

Converts Persian and Arabic digits to English digits. Falsy input returns `''`.

| Param | Type | Description |
|-------|------|-------------|
| `text` | `string \| number` | Input text or number |

**Returns:** formatted string (e.g. `۱۲۳۴۵۶` → `123456`)

```ts
toEnglishDigits('۱۲۳۴۵۶') // '123456'
toEnglishDigits('١٢٣') // '123'
```

---

## `thousandSeparator`

**Kind:** function

```ts
thousandSeparator(text: string | number, separator?: string): string
```

Inserts a thousand separator into digit runs inside a string or number. `null`/`undefined` are treated as `''`.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `text` | `string \| number` | — | Input text or number |
| `separator` | `string` | `','` | Separator character |

**Returns:** formatted string (e.g. `300000` → `300,000`)

```ts
thousandSeparator(123456) // '123,456'
thousandSeparator('1234567890', '/') // '1/234/567/890'
thousandSeparator('price 12345') // 'price 12,345'
```

---

## `toSlug`

**Kind:** function

```ts
toSlug(value: string): string
```

Replaces underscores with hyphens (`snake_case` → slug). Falsy input returns `''`.

| Param | Type | Description |
|-------|------|-------------|
| `value` | `string` | Input string |

```ts
toSlug('slug_to_snake_case') // 'slug-to-snake-case'
```

---

## `fromSlug`

**Kind:** function

```ts
fromSlug(value: string): string
```

Replaces hyphens with underscores (slug → `snake_case`). Falsy input returns `''`.

| Param | Type | Description |
|-------|------|-------------|
| `value` | `string` | Input string |

```ts
fromSlug('slug-to-snake-case') // 'slug_to_snake_case'
```

---

## `html`

**Kind:** function (tagged template)

```ts
html(template: TemplateStringsArray, ...substitution: unknown[]): string
```

Tagged template that returns trimmed HTML with consecutive whitespace collapsed to a single space.

```ts
const markup = html`
  <p id="text" class="normal-text">
    hello
  </p>
`
// '<p id="text" class="normal-text"> hello </p>'
```
