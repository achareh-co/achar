# Achar API Reference

[فارسی](../fa/index.md)

Shared TypeScript utilities used across Achareh frontends: Persian text helpers, DOM scroll utilities, debounce/throttle, EventBus, and clipboard helpers.

## Install

```bash
npm install @achareh/achar
# or
yarn add @achareh/achar
```

## Import

All symbols are exported from a single package entry:

```ts
import { toPersianDigits, EventBus, scrollToElement } from '@achareh/achar'
```

## Modules

| Module | Description |
|--------|-------------|
| [text](./text.md) | Digits, slugs, thousand separators, HTML tagged template |
| [dom](./dom.md) | Scroll helpers, script injection, drag-to-scroll, window load |
| [helpers](./helpers.md) | Debounce, throttle, delay, query checks, retry |
| [patterns](./patterns.md) | EventBus pub/sub |
| [web-api](./web-api.md) | Clipboard write (modern + legacy) |
