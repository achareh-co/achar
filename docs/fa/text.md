# text

[English](../en/text.md) · [فهرست API](./index.md)

تبدیل ارقام فارسی/عربی، فرمت عدد، اسلاگ، و تگ تمپلیت HTML.

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

**نوع:** function

```ts
toPersianDigits(text: string | number): string
```

ارقام انگلیسی و عربی را به ارقام فارسی تبدیل می‌کند. ورودی falsy مقدار `''` برمی‌گرداند.

| پارامتر | نوع | توضیح |
|---------|-----|--------|
| `text` | `string \| number` | متن یا عدد ورودی |

**خروجی:** رشتهٔ فرمت‌شده (مثلاً `123456` → `۱۲۳۴۵۶`)

```ts
toPersianDigits(123456) // '۱۲۳۴۵۶'
toPersianDigits('١٢٣') // '۱۲۳'
```

---

## `toEnglishDigits`

**نوع:** function

```ts
toEnglishDigits(text: string | number): string
```

ارقام فارسی و عربی را به ارقام انگلیسی تبدیل می‌کند. ورودی falsy مقدار `''` برمی‌گرداند.

| پارامتر | نوع | توضیح |
|---------|-----|--------|
| `text` | `string \| number` | متن یا عدد ورودی |

**خروجی:** رشتهٔ فرمت‌شده (مثلاً `۱۲۳۴۵۶` → `123456`)

```ts
toEnglishDigits('۱۲۳۴۵۶') // '123456'
toEnglishDigits('١٢٣') // '123'
```

---

## `thousandSeparator`

**نوع:** function

```ts
thousandSeparator(text: string | number, separator?: string): string
```

جداکنندهٔ هزارگان را داخل دنباله‌های رقم در رشته یا عدد قرار می‌دهد. `null`/`undefined` مثل `''` در نظر گرفته می‌شوند.

| پارامتر | نوع | پیش‌فرض | توضیح |
|---------|-----|---------|--------|
| `text` | `string \| number` | — | متن یا عدد ورودی |
| `separator` | `string` | `','` | کاراکتر جداکننده |

**خروجی:** رشتهٔ فرمت‌شده (مثلاً `300000` → `300,000`)

```ts
thousandSeparator(123456) // '123,456'
thousandSeparator('1234567890', '/') // '1/234/567/890'
thousandSeparator('price 12345') // 'price 12,345'
```

---

## `toSlug`

**نوع:** function

```ts
toSlug(value: string): string
```

آندرلاین‌ها را با خط تیره عوض می‌کند (`snake_case` → اسلاگ). ورودی falsy مقدار `''` برمی‌گرداند.

| پارامتر | نوع | توضیح |
|---------|-----|--------|
| `value` | `string` | رشتهٔ ورودی |

```ts
toSlug('slug_to_snake_case') // 'slug-to-snake-case'
```

---

## `fromSlug`

**نوع:** function

```ts
fromSlug(value: string): string
```

خط تیره‌ها را با آندرلاین عوض می‌کند (اسلاگ → `snake_case`). ورودی falsy مقدار `''` برمی‌گرداند.

| پارامتر | نوع | توضیح |
|---------|-----|--------|
| `value` | `string` | رشتهٔ ورودی |

```ts
fromSlug('slug-to-snake-case') // 'slug_to_snake_case'
```

---

## `html`

**نوع:** function (tagged template)

```ts
html(template: TemplateStringsArray, ...substitution: unknown[]): string
```

تگ تمپلیتی که HTML را trim می‌کند و فاصله‌های پشت‌سرهم را به یک فاصله تبدیل می‌کند.

```ts
const markup = html`
  <p id="text" class="normal-text">
    hello
  </p>
`
// '<p id="text" class="normal-text"> hello </p>'
```
