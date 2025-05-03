import { describe, it, expect, vi, beforeEach } from 'vitest'
import { YadioAPI } from '../src/class/yadio-api'

global.fetch = vi.fn()

describe('YadioAPI', () => {
  const api = new YadioAPI()

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should fetch exchange rates', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ARS: 900,
        EUR: 1.1,
      }),
    } as Response)

    const rates = await api.getExchangeRates('USD')
    expect(rates.ARS).toBe(900)
  })

  it('should fail when response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response)

    await expect(api.getExchangeRates('USD')).rejects.toThrow()
  })
})
