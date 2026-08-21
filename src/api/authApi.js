import apiClient from './client.js'
import { API_ENDPOINTS } from '../config/env.js'
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
  const data = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData)
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
  const data = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
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
  return apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
}

/**
 * Resends verification email.
 */
export async function resendVerification(email) {
  return apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email })
}

/**
 * Refreshes auth tokens manually if needed.
 */
export async function refreshAuthToken(refreshToken = getRefreshToken()) {
  if (!refreshToken) throw new Error('No refresh token found')
  const data = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })
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
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {})
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
  const data = await apiClient.get(API_ENDPOINTS.USERS.ME)
  if (data?.user) {
    saveSessionUser(data.user)
  }
  return data
}

/**
 * Updates current authenticated user's profile.
 */
export async function updateCurrentUserProfile(profileData) {
  const data = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_ME, profileData)
  if (data?.user) {
    saveSessionUser(data.user)
  }
  return data
}

/**
 * Switches authenticated user's role (student <-> tutor).
 */
export async function switchUserRole(newRole) {
  const data = await apiClient.patch('/api/users/me/role', { role: newRole })
  if (data?.user) {
    saveSessionUser(data.user)
  }
  return data
}
