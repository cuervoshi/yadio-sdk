# yadio-sdk

A lightweight SDK for interacting with the [Yadio](https://yadio.io) public API, featuring real-time and cached currency exchange functionality.

## Features

- Fetch exchange rates with any base currency
- Convert amounts between any two currencies
- View historical and comparison data
- Use an in-memory converter that caches rates from USD for efficient, offline-friendly conversions

---

## Installation

```bash
npm install yadio-sdk
```

---

## YadioAPI

### Initialization

```ts
import { YadioAPI } from 'yadio-sdk'

const api = new YadioAPI()
```

### Methods

- `ping(): Promise<string>` — Check if the API is alive.
- `getExchangeRates(base?: string): Promise<ExchangeRatesResponse>` — Get exchange rates using optional base.
- `convert(amount, source, target): Promise<ConvertResponse>` — Convert a currency amount.
- `getRate(quote, base): Promise<CurrencyRateResponse>` — Get the exchange rate between two currencies.
- `getCurrencies(): Promise<string[]>` — Get all supported currency codes.
- `getExchanges(): Promise<string[]>` — Get supported exchanges.
- `getToday(range, currency): Promise<any>` — Get today’s price data for a currency.
- `getHistory(range, currency): Promise<any>` — Get historical price data.
- `getComparison(range, currency): Promise<any>` — Compare past and current prices.
- `getMarketAds(currency, side, limit?): Promise<MarketAd[]>` — Get market ads.
- `getMarketStats(currency, side): Promise<MarketStats>` — Get stats for market ads.

---

## YadioConverter

A smart converter that uses USD as a pivot currency and caches values in memory.

### Initialization

```ts
import { YadioConverter } from 'yadio-sdk'

const converter = new YadioConverter()
```

### Features

- Automatically fetches rates from `/exrates/USD`
- Converts between any two currencies using cached rates
- Refreshes rates only when needed (default: every 60s)

### Usage

```ts
// Convert 100 ARS to EUR
const result = await converter.convertCurrency(100, 'ARS', 'EUR')

// Get a cached rate
const rate = converter.getCachedRate('BTC')
```
