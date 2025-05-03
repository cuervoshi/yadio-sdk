import { describe, it, expect, beforeEach, vi } from 'vitest'
import { YadioConverter } from '../src/class/yadio-converter.js'

describe('YadioConverter', () => {
  let converter: YadioConverter

  beforeEach(() => {
    converter = new YadioConverter()
  })

  it('should convert between currencies using cached rates', async () => {
    const usdToEur = await converter.convertCurrency(100, 'USD', 'EUR')
    const eurToUsd = await converter.convertCurrency(100, 'EUR', 'USD')

    const eurRate = converter.getCachedRate('EUR')!
    const expectedUsdToEur = 100 * eurRate
    const expectedEurToUsd = 100 / eurRate

    expect(usdToEur).toBeCloseTo(expectedUsdToEur, 5)
    expect(eurToUsd).toBeCloseTo(expectedEurToUsd, 5)
  })
})
