import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import apiClient, { ApiError } from '../api/client.js'
import {
  setAccessToken,
  setRefreshToken,
  getAccessToken,
} from '../utils/session.js'

describe('apiClient HTTP Service', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('performs a GET request with Authorization header if token exists', async () => {
    setAccessToken('mock-access-token-123')

    const mockResponseData = { success: true, notes: [{ id: 1, title: 'Calculus' }] }
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockResponseData,
    })

    const result = await apiClient.get('/api/notes')

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/notes'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-access-token-123',
        }),
      })
    )
    expect(result).toEqual(mockResponseData)
  })

  it('performs a POST request and correctly serializes JSON payload', async () => {
    const mockCreated = { id: 42, name: 'Abebe Bikila' }
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockCreated,
    })

    const payload = { name: 'Abebe Bikila', email: 'abebe@aau.edu.et' }
    const result = await apiClient.post('/api/users', payload)

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/users'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      })
    )
    expect(result).toEqual(mockCreated)
  })

  it('throws ApiError with status and custom message on HTTP error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ message: 'Invalid university email domain' }),
    })

    await expect(apiClient.post('/api/auth/register', {})).rejects.toThrow(ApiError)
    await expect(apiClient.post('/api/auth/register', {})).rejects.toMatchObject({
      status: 400,
      message: 'Invalid university email domain',
    })
  })

  it('handles 401 by refreshing token and retrying request', async () => {
    setAccessToken('expired-token')
    setRefreshToken('valid-refresh-token')

    let attempt = 0
    globalThis.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/auth/refresh')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            accessToken: 'fresh-new-token',
            refreshToken: 'fresh-refresh-token',
          }),
        })
      }

      attempt += 1
      if (attempt === 1) {
        return Promise.resolve({
          ok: false,
          status: 401,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ message: 'Token expired' }),
        })
      }

      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, secretData: 123 }),
      })
    })

    const result = await apiClient.get('/api/protected/data')

    expect(result).toEqual({ success: true, secretData: 123 })
    expect(getAccessToken()).toBe('fresh-new-token')
  })
})
