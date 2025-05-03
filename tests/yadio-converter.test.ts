import { describe, it, expect, beforeEach, vi } from 'vitest'
import { YadioConverter } from '../src/class/yadio-converter.js'
import { YadioAPI } from '../src/class/yadio-api.js'

vi.useFakeTimers()

describe('YadioConverter', () => {
  let converter: YadioConverter
  let mockApi: YadioAPI

  beforeEach(() => {
    mockApi = new YadioAPI()
    converter = new YadioConverter(mockApi, 60_000)

    mockApi.getExchangeRates = vi.fn().mockResolvedValue({
      USD: {
        USD: 1,
        EUR: 0.9,
      },
      BTC: 96000,
      base: 'USD',
      timestamp: Date.now(),
    })
  })

  it('should convert between currencies using cached rates', async () => {
    converter.start()

    await vi.advanceTimersByTimeAsync(60_000)

    const usdToEur = converter.convertCurrency(100, 'USD', 'EUR')
    const eurToUsd = converter.convertCurrency(100, 'EUR', 'USD')

    expect(usdToEur).toBeCloseTo(90, 2)
    expect(eurToUsd).toBeCloseTo(111.11, 2)
  })
})
