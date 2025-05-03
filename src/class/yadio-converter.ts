import { YadioAPI } from './yadio-api.js'

interface CachedRates {
  [currency: string]: number
}

/**
 * A currency converter that uses Yadio's exchange rates with USD as the base currency.
 * Rates are fetched periodically and stored in memory for offline conversions.
 */
export class YadioConverter {
  private rates: CachedRates = {}
  private intervalId?: NodeJS.Timeout
  private ready = false
  private pendingReady?: Promise<void>

  constructor(
    private api: YadioAPI = new YadioAPI(),
    private refreshIntervalMs: number = 60_000,
  ) {}

  /**
   * Starts polling exchange rates from Yadio with USD as the base.
   * All fetched rates are stored in memory and updated periodically.
   */
  async start(): Promise<void> {
    const fetchRates = async () => {
      const result = await this.api.getExchangeRates('USD')

      const usdRates = result?.USD
      if (!usdRates || typeof usdRates !== 'object') return

      for (const [currency, value] of Object.entries(usdRates)) {
        if (typeof value === 'number') {
          this.rates[currency] = value
        }
      }

      this.rates['USD'] = 1
      this.ready = true
    }

    this.pendingReady = fetchRates()
    await this.pendingReady

    this.intervalId = setInterval(fetchRates, this.refreshIntervalMs)
  }

  /**
   * Stops polling exchange rates.
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }

  /**
   * Converts an amount from one currency to another using cached exchange rates.
   * All conversions are routed through USD.
   *
   * @param amount - The amount to convert.
   * @param from - The source currency code (e.g., 'ARS', 'EUR').
   * @param to - The target currency code (e.g., 'USD', 'BTC').
   * @returns The converted amount, or NaN if rates are missing.
   */
  convertCurrency(amount: number, from: string, to: string): number {
    const fromRate = this.rates[from]
    const toRate = this.rates[to]
    if (typeof fromRate !== 'number' || typeof toRate !== 'number') {
      return NaN
    }
    const usdAmount = amount / fromRate
    return usdAmount * toRate
  }

  /**
   * Same as convertCurrency but waits until rates are available.
   *
   * @param amount - The amount to convert.
   * @param from - The source currency code.
   * @param to - The target currency code.
   * @returns The converted amount, or NaN if rates couldn't be loaded.
   */
  async convertCurrencyAsync(amount: number, from: string, to: string): Promise<number> {
    if (!this.ready && this.pendingReady) {
      await this.pendingReady
    }

    return this.convertCurrency(amount, from, to)
  }

  /**
   * Returns the current cached rate for a given currency relative to USD.
   *
   * @param currency - The currency code.
   * @returns The exchange rate or undefined if not available.
   */
  getCachedRate(currency: string): number | undefined {
    return this.rates[currency]
  }
}
