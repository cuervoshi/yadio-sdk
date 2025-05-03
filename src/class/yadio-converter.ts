import { YadioAPI } from './yadio-api.js'

interface CachedRates {
  [currency: string]: number
}

/**
 * A currency converter that uses Yadio's exchange rates with a configurable base currency.
 * Rates are fetched on demand and stored in memory for offline conversions.
 */
export class YadioConverter {
  private rates: CachedRates = {}
  private lastUpdated = 0
  private pendingFetch?: Promise<void>

  constructor(
    private baseCurrency: string = 'USD',
    private refreshIntervalMs: number = 60_000,
    private api: YadioAPI = new YadioAPI(),
  ) {
    this.ensureRatesLoaded()
  }

  /**
   * Loads exchange rates if they are expired or have never been fetched.
   */
  private async ensureRatesLoaded(): Promise<void> {
    const now = Date.now()

    if (now - this.lastUpdated < this.refreshIntervalMs) return

    if (!this.pendingFetch) {
      this.pendingFetch = this.fetchRates()
    }

    await this.pendingFetch
  }

  /**
   * Fetches and caches exchange rates from Yadio with the specified base currency.
   */
  private async fetchRates(): Promise<void> {
    try {
      const result = await this.api.getExchangeRates(this.baseCurrency)
      const rates = result?.[this.baseCurrency]

      if (!rates || typeof rates !== 'object') return

      for (const [currency, value] of Object.entries(rates)) {
        if (typeof value === 'number') {
          this.rates[currency] = value
        }
      }

      this.rates[this.baseCurrency] = 1
      this.lastUpdated = Date.now()
    } finally {
      this.pendingFetch = undefined
    }
  }

  /**
   * Converts an amount from one currency to another using cached exchange rates.
   * All conversions are routed through the configured base currency.
   *
   * @param amount - The amount to convert.
   * @param from - The source currency code (e.g., 'ARS', 'EUR').
   * @param to - The target currency code (e.g., 'USD', 'BTC').
   * @returns The converted amount, or NaN if rates are missing.
   */
  async convertCurrency(amount: number, from: string, to: string): Promise<number> {
    await this.ensureRatesLoaded()

    const fromRate = this.rates[from]
    const toRate = this.rates[to]

    if (typeof fromRate !== 'number' || typeof toRate !== 'number') {
      return NaN
    }

    const baseAmount = amount / fromRate
    return baseAmount * toRate
  }

  /**
   * Returns the current cached exchange rates relative to the base currency.
   */
  getRates(): CachedRates {
    return { ...this.rates }
  }
}
