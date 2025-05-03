/**
 * Response from /convert endpoint.
 */
export interface ConvertResponse {
  /** Converted value */
  value: number
  /** Exchange rate used for conversion */
  rate: number
  /** Source currency code (e.g., 'USD') */
  source: string
  /** Target currency code (e.g., 'EUR') */
  target: string
}

/**
 * Response from /exrates or /exrates/:base endpoint.
 * Maps currency codes to their value in relation to the base currency.
 */
export interface ExchangeRatesResponse {
  [currency: string]: number
}

/**
 * Response from /rate/:quote/:base endpoint.
 */
export interface CurrencyRateResponse {
  /** The rate value */
  value: number
  /** The quote currency (e.g., 'USD') */
  quote: string
  /** The base currency (e.g., 'BTC') */
  base: string
}

/**
 * A market ad representing a buy or sell offer.
 */
export interface MarketAd {
  /** Market name (e.g., 'Binance') */
  name: string
  /** Price offered in the specified currency */
  price: number
  /** Currency code (e.g., 'ARS') */
  currency: string
  /** Side of the market ('buy' or 'sell') */
  side: 'buy' | 'sell'
  /** Volume of the asset available */
  volume: number
  [key: string]: any
}

/**
 * Aggregated market statistics for buy/sell offers.
 */
export interface MarketStats {
  /** Minimum price */
  min: number
  /** Maximum price */
  max: number
  /** Average price */
  avg: number
  /** Currency code (e.g., 'ARS') */
  currency: string
  /** Side of the market ('buy' or 'sell') */
  side: 'buy' | 'sell'
}

/**
 * Wrapper around the Yadio public API.
 */
export class YadioAPI {
  private baseUrl = 'https://api.yadio.io'

  /**
   * Pings the API to check if it's alive.
   */
  async ping(): Promise<string> {
    return this.get('/ping')
  }

  /**
   * Gets exchange rates for the given base currency.
   * @param baseCurrency - The base currency to use (default is USD).
   */
  async getExchangeRates(baseCurrency?: string): Promise<ExchangeRatesResponse> {
    const url = baseCurrency ? `/exrates/${baseCurrency}` : '/exrates'
    return this.get(url)
  }

  /**
   * Converts an amount from source to target currency.
   * @param amount - The amount to convert.
   * @param source - Source currency code.
   * @param target - Target currency code.
   */
  async convert(amount: number, source: string, target: string): Promise<ConvertResponse> {
    return this.get(`/convert/${amount}/${source}/${target}`)
  }

  /**
   * Gets the exchange rate between two currencies.
   * @param quote - The quote currency code.
   * @param base - The base currency code.
   */
  async getRate(quote: string, base: string): Promise<CurrencyRateResponse> {
    return this.get(`/rate/${quote}/${base}`)
  }

  /**
   * Gets the list of supported currencies.
   */
  async getCurrencies(): Promise<string[]> {
    return this.get('/currencies')
  }

  /**
   * Gets the list of supported exchanges.
   */
  async getExchanges(): Promise<string[]> {
    return this.get('/exchanges')
  }

  /**
   * Gets today’s price range data for a given currency.
   * @param range - Number of past days to include.
   * @param currency - The currency code to fetch data for.
   */
  async getToday(range: number, currency: string): Promise<any> {
    return this.get(`/today/${range}/${currency}`)
  }

  /**
   * Gets historical price data for a currency.
   * @param range - Number of past days to include.
   * @param currency - The currency code.
   */
  async getHistory(range: number, currency: string): Promise<any> {
    return this.get(`/hist/${range}/${currency}`)
  }

  /**
   * Compares current and past prices for a currency.
   * @param range - Number of past days to include.
   * @param currency - The currency code.
   */
  async getComparison(range: number, currency: string): Promise<any> {
    return this.get(`/compare/${range}/${currency}`)
  }

  /**
   * Gets active market ads (buy/sell offers).
   * @param currency - The currency for which ads are requested.
   * @param side - Whether to fetch buy or sell offers.
   * @param limit - Max number of ads to fetch (default: 20).
   */
  async getMarketAds(currency: string, side: 'buy' | 'sell', limit = 20): Promise<MarketAd[]> {
    return this.get(`/market/ads?currency=${currency}&side=${side}&limit=${limit}`)
  }

  /**
   * Gets market stats for buy/sell offers of a currency.
   * @param currency - The currency code.
   * @param side - Whether to fetch stats for 'buy' or 'sell' offers.
   */
  async getMarketStats(currency: string, side: 'buy' | 'sell'): Promise<MarketStats> {
    return this.get(`/market/stats?currency=${currency}&side=${side}`)
  }

  /**
   * Internal GET helper.
   * @param path - Path to append to base URL.
   */
  private async get<T = any>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`)
    if (!res.ok) throw new Error(`Failed to fetch ${path}`)
    return (await res.json()) as T
  }
}
