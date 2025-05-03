# yadio-sdk

A lightweight SDK for interacting with the [Yadio](https://yadio.io) public API, featuring real-time and cached currency exchange functionality.

## Features

- Fetch exchange rates using any base currency
- Convert amounts between any two currencies using cached data
- View historical, market and comparison data
- Use an in-memory converter with smart refresh logic

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

A currency converter that uses cached exchange rates and lazy refresh logic based on the last access time.

### Initialization

```ts
import { YadioConverter } from 'yadio-sdk'

// Base currency is optional (default is 'USD'), refreshInterval is optional (default is 60_000 ms)
const converter = new YadioConverter('EUR', 120_000) // base currency: EUR, refresh every 2 minutes
```

### Features

- Fetches rates from `/exrates/{base}`
- Automatically refreshes when cache expires
- Uses base currency (e.g., USD, EUR) to convert between any two others

### Usage

```ts
// Convert 100 ARS to EUR
const result = await converter.convertCurrency(100, 'ARS', 'EUR')

// Get all cached rates
const rates = converter.getRates()
```

## Supported Currencies

Yadio currently supports a wide range of fiat and crypto currencies such as USD, EUR, ARS, BTC, and many more.
You can find the full list of supported currencies [in this file](./SUPPORTED_CURRENCIES.md).

> ⚠️ This list may become outdated. To get the most accurate and up-to-date currencies, use `YadioAPI.getCurrencies()` at runtime.
