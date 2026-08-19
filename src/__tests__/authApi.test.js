import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerification,
  logoutUser,
  getCurrentUserProfile,
} from '../api/authApi.js'
import {
  getAccessToken,
  getRefreshToken,
  loadSessionUser,
} from '../utils/session.js'

describe('authApi Service', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('registers a user and saves tokens and session user in localStorage', async () => {
    const mockUser = {
      id: 'u-123',
      name: 'Selamawit',
      email: 'selamawit@aau.edu.et',
      role: 'student',
    }
    const mockResponse = {
      user: mockUser,
      accessToken: 'access-jwt-abc',
      refreshToken: 'refresh-jwt-xyz',
    }

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockResponse,
    })

    const result = await registerUser({
      name: 'Selamawit',
      email: 'selamawit@aau.edu.et',
      password: 'password123',
      university: 'Addis Ababa University',
    })

    expect(result).toEqual(mockResponse)
    expect(getAccessToken()).toBe('access-jwt-abc')
    expect(getRefreshToken()).toBe('refresh-jwt-xyz')
    expect(loadSessionUser()).toEqual(mockUser)
  })

  it('logs in a user and updates auth tokens in localStorage', async () => {
    const mockUser = { id: 'u-456', name: 'Dawit', email: 'dawit@aau.edu.et' }
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        user: mockUser,
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      }),
    })

    await loginUser({ email: 'dawit@aau.edu.et', password: 'secretpassword' })

    expect(getAccessToken()).toBe('new-access-token')
    expect(getRefreshToken()).toBe('new-refresh-token')
    expect(loadSessionUser()).toEqual(mockUser)
  })

  it('sends verifyEmail request with verification token', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true, message: 'Email verified successfully.' }),
    })

    const result = await verifyEmail('valid-token-string')
    expect(result).toEqual({ success: true, message: 'Email verified successfully.' })
  })

  it('sends resendVerification request with user email', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true, message: 'Verification email resent.' }),
    })

    const result = await resendVerification('student@aau.edu.et')
    expect(result).toEqual({ success: true, message: 'Verification email resent.' })
  })

  it('fetches current user profile and updates session user', async () => {
    const mockUser = { id: 'u-999', name: 'Almaz', email: 'almaz@aau.edu.et' }
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ user: mockUser }),
    })

    const result = await getCurrentUserProfile()
    expect(result).toEqual({ user: mockUser })
    expect(loadSessionUser()).toEqual(mockUser)
  })

  it('clears session on logout', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true }),
    })

    await logoutUser()
    expect(getAccessToken()).toBeNull()
    expect(loadSessionUser()).toBeNull()
  })
})
