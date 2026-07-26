# آچار (Achar)

[![npm version](https://img.shields.io/npm/v/@achareh/achar.svg)](https://www.npmjs.com/package/@achareh/achar)
[![npm downloads](https://img.shields.io/npm/dm/@achareh/achar.svg)](https://www.npmjs.com/package/@achareh/achar)
[![CI](https://github.com/achareh-co/achar/actions/workflows/ci.yml/badge.svg)](https://github.com/achareh-co/achar/actions/workflows/ci.yml)
[![node](https://img.shields.io/node/v/@achareh/achar.svg)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/@achareh/achar.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue.svg)](https://www.typescriptlang.org/)

مجموعه ابزارهای TypeScript مشترک برای فرانت‌اندهای آچاره: کمکی‌های متن فارسی، اسکرول DOM، debounce/throttle، EventBus و APIهای کلیپ‌بورد.

[English](./README.md) · [مرجع کامل API](./docs/fa/index.md)

## نصب

```bash
npm install @achareh/achar
# یا
yarn add @achareh/achar
```

## استفاده

```ts
import { toPersianDigits, EventBus, createDebounce } from '@achareh/achar'

toPersianDigits(123456) // '۱۲۳۴۵۶'

const bus = new EventBus()
bus.on('ready', () => console.log('ready'))
bus.emit('ready')

const save = createDebounce(() => console.log('saved'), 300)
```

## ماژول‌ها

| ماژول | مستندات |
|--------|----------|
| **text** — ارقام، اسلاگ، هزارگان، تمپلیت HTML | [fa](./docs/fa/text.md) · [en](./docs/en/text.md) |
| **dom** — اسکرول، اسکریپت، observer، drag-to-scroll | [fa](./docs/fa/dom.md) · [en](./docs/en/dom.md) |
| **helpers** — debounce، throttle، delay، retry | [fa](./docs/fa/helpers.md) · [en](./docs/en/helpers.md) |
| **patterns** — EventBus | [fa](./docs/fa/patterns.md) · [en](./docs/en/patterns.md) |
| **web-api** — کلیپ‌بورد | [fa](./docs/fa/web-api.md) · [en](./docs/en/web-api.md) |

## توسعه

نیازمند Node `>=20.19.0` و Yarn 4.

```bash
yarn
yarn test
yarn build
yarn dev   # playground
```

تاریخچهٔ نسخه‌ها در [CHANGELOG.md](./CHANGELOG.md).

## مجوز

MIT © Mohammad Saleh Fadaei
