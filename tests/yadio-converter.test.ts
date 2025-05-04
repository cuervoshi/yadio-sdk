import { describe, it, expect, beforeEach, vi } from 'vitest'
import { YadioConverter } from '../src/class/yadio-converter.js'

describe('YadioConverter', () => {
  let converter: YadioConverter

  beforeEach(() => {
    converter = new YadioConverter()
  })

  it('should convert between currencies using cached rates', async () => {
    const usdToEur = await converter.convertCurrency({ amount: 100, from: 'USD', to: 'EUR' })
    const eurToUsd = await converter.convertCurrency({ amount: 100, from: 'EUR', to: 'USD' })

    const rates = converter.getRates()
    const eurRate = rates['EUR']!

    const expectedUsdToEur = 100 * eurRate
    const expectedEurToUsd = 100 / eurRate

    expect(usdToEur).toBeCloseTo(expectedUsdToEur, 5)
    expect(eurToUsd).toBeCloseTo(expectedEurToUsd, 5)
  })
})
