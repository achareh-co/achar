# مرجع API آچار

[English](../en/index.md)

مجموعه ابزارهای TypeScript مشترک در فرانت‌اندهای آچاره: کمکی‌های متن فارسی، اسکرول DOM، debounce/throttle، EventBus و کلیپ‌بورد.

## نصب

```bash
npm install @achareh/achar
# یا
yarn add @achareh/achar
```

## ایمپورت

همه نمادها از یک ورودی پکیج export می‌شوند:

```ts
import { toPersianDigits, EventBus, scrollToElement } from '@achareh/achar'
```

## ماژول‌ها

| ماژول | توضیح |
|--------|--------|
| [text](./text.md) | ارقام، اسلاگ، جداکننده هزارگان، تگ تمپلیت HTML |
| [dom](./dom.md) | اسکرول، تزریق اسکریپت، drag-to-scroll، لود پنجره |
| [helpers](./helpers.md) | Debounce، throttle، delay، query، retry |
| [patterns](./patterns.md) | EventBus برای pub/sub |
| [web-api](./web-api.md) | نوشتن در کلیپ‌بورد (مدرن و legacy) |
