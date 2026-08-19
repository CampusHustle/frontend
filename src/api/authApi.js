import apiClient from './client.js'
import {
  saveAuthTokens,
  saveSessionUser,
  clearSession,
  getRefreshToken,
} from '../utils/session.js'

/**
 * Registers a new student or tutor user.
 * Returns { user, accessToken, refreshToken, verificationToken? }
 */
export async function registerUser(userData) {
  const data = await apiClient.post('/api/auth/register', userData)
  if (data?.accessToken) {
    saveAuthTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    })
  }
  if (data?.user) {
    saveSessionUser(data.user)
  }
  return data
}

/**
 * Logs in a user with university email (.edu.et) and password.
 * Returns { user, accessToken, refreshToken }
 */
export async function loginUser(credentials) {
  const data = await apiClient.post('/api/auth/login', credentials)
  if (data?.accessToken) {
    saveAuthTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    })
  }
  if (data?.user) {
    saveSessionUser(data.user)
  }
  return data
}

/**
 * Verifies email using verification token string.
 */
export async function verifyEmail(token) {
  return apiClient.post('/api/auth/verify-email', { token })
}

/**
 * Resends verification email.
 */
export async function resendVerification(email) {
  return apiClient.post('/api/auth/resend-verification', { email })
}

/**
 * Refreshes auth tokens manually if needed.
 */
export async function refreshAuthToken(refreshToken = getRefreshToken()) {
  if (!refreshToken) throw new Error('No refresh token found')
  const data = await apiClient.post('/api/auth/refresh', { refreshToken })
  if (data?.accessToken) {
    saveAuthTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || refreshToken,
    })
  }
  return data
}

/**
 * Logs out user on backend and clears local session.
 */
export async function logoutUser() {
  try {
    await apiClient.post('/api/auth/logout', {})
  } catch {
    // Ignore network/server logout errors and clean local session anyway
  } finally {
    clearSession()
  }
}

/**
 * Retrieves the current authenticated user's full profile.
 */
export async function getCurrentUserProfile() {
  const data = await apiClient.get('/api/users/me')
  if (data?.user) {
    saveSessionUser(data.user)
  }
  return data
}

/**
 * Updates current authenticated user's profile.
 */
export async function updateCurrentUserProfile(profileData) {
  const data = await apiClient.put('/api/users/me', profileData)
  if (data?.user) {
    saveSessionUser(data.user)
  }
  return data
}
