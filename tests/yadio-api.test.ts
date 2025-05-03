import { describe, it, expect, vi, beforeEach } from 'vitest'
import { YadioAPI } from '../src/class/yadio-api'

global.fetch = vi.fn()

describe('YadioAPI', () => {
  let api: YadioAPI

  beforeEach(() => {
    vi.resetAllMocks()
    api = new YadioAPI()
  })

  it('should fetch exchange rates with valid shape', async () => {
    const mockResponse = {
      ARS: 900,
      EUR: 1.1,
      BTC: 0.00001,
    }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const rates = await api.getExchangeRates('USD')

    expect(rates).toMatchObject(mockResponse)
    expect(typeof rates.ARS).toBe('number')
    expect(typeof rates.EUR).toBe('number')
  })

  it('should throw an error when response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response)

    await expect(api.getExchangeRates('USD')).rejects.toThrow('Failed to fetch')
  })
})
