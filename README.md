# Achar

[![npm version](https://img.shields.io/npm/v/@achareh/achar.svg)](https://www.npmjs.com/package/@achareh/achar)
[![npm downloads](https://img.shields.io/npm/dm/@achareh/achar.svg)](https://www.npmjs.com/package/@achareh/achar)
[![CI](https://github.com/achareh-co/achar/actions/workflows/ci.yml/badge.svg)](https://github.com/achareh-co/achar/actions/workflows/ci.yml)
[![node](https://img.shields.io/node/v/@achareh/achar.svg)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/@achareh/achar.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue.svg)](https://www.typescriptlang.org/)

Shared TypeScript utilities for Achareh frontends: Persian text helpers, DOM scroll tools, debounce/throttle, EventBus, and clipboard APIs.

[فارسی](./README.fa.md) · [Full API reference](./docs/en/index.md)

## Install

```bash
npm install @achareh/achar
# or
yarn add @achareh/achar
```

## Usage

```ts
import { toPersianDigits, EventBus, createDebounce } from '@achareh/achar'

toPersianDigits(123456) // '۱۲۳۴۵۶'

const bus = new EventBus()
bus.on('ready', () => console.log('ready'))
bus.emit('ready')

const save = createDebounce(() => console.log('saved'), 300)
```

## Modules

| Module | Docs |
|--------|------|
| **text** — digits, slugs, thousand separators, HTML template | [en](./docs/en/text.md) · [fa](./docs/fa/text.md) |
| **dom** — scroll, scripts, observers, drag-to-scroll | [en](./docs/en/dom.md) · [fa](./docs/fa/dom.md) |
| **helpers** — debounce, throttle, delay, retry | [en](./docs/en/helpers.md) · [fa](./docs/fa/helpers.md) |
| **patterns** — EventBus | [en](./docs/en/patterns.md) · [fa](./docs/fa/patterns.md) |
| **web-api** — clipboard | [en](./docs/en/web-api.md) · [fa](./docs/fa/web-api.md) |

## Development

Requires Node `>=20.19.0` and Yarn 4.

```bash
yarn
yarn test
yarn build
yarn dev   # playground
```

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## License

MIT © Mohammad Saleh Fadaei
