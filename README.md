# yadio-sdk

Simple and efficient currency conversion using [Yadio.io](https://yadio.io/) exchange rates.

## Features

- Periodic caching of exchange rates from USD to all supported currencies.
- Lightweight converter with offline calculations.
- Synchronous or asynchronous conversion between currencies.
- No API key required.

## Installation

```bash
npm install yadio-sdk
```

## Usage

```ts
import { YadioConverter } from 'yadio-sdk'

const converter = new YadioConverter()

await converter.start()

// Synchronous conversion (only works after start)
const amountInEUR = converter.convertCurrency(100, 'USD', 'EUR')

// Async conversion (waits for rates to be available if not yet ready)
const amountInBTC = await converter.convertCurrencyAsync(100, 'ARS', 'BTC')
```

## API

### `new YadioConverter(api?: YadioAPI, refreshIntervalMs?: number)`

Creates a new converter instance. By default, exchange rates are refreshed every 60 seconds.

### `await converter.start()`

Starts fetching exchange rates from Yadio (`exrates/USD`) and populates the internal cache.

### `converter.stop()`

Stops the refresh polling.

### `converter.convertCurrency(amount, from, to)`

Performs a conversion using cached rates. Returns `NaN` if rates are missing.

### `await converter.convertCurrencyAsync(amount, from, to)`

Same as above, but waits for rates to be available before performing the conversion.

### `converter.getCachedRate(currency)`

Returns the cached rate relative to USD.