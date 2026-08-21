import {
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
  clearSession,
} from '../utils/session.js'
import { API_BASE_URL } from '../config/env.js'

export class ApiError extends Error {
  constructor(message, status = 500, code = 'API_ERROR', details = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

let refreshPromise = null

async function getRefreshedToken() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

function getUrl(endpoint, params) {
  let fullUrl = endpoint
  if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
    const base = API_BASE_URL
    fullUrl = `${base}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  }

  if (params && typeof params === 'object') {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString
    }
  }

  return fullUrl
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    clearSession()
    throw new ApiError('No refresh token available', 401, 'UNAUTHORIZED')
  }

  const url = getUrl('/api/auth/refresh')
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    clearSession()
    throw new ApiError('Session expired. Please log in again.', 401, 'SESSION_EXPIRED')
  }

  const data = await response.json()
  if (data?.accessToken) {
    saveAuthTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || refreshToken,
    })
    return data.accessToken
  }

  clearSession()
  throw new ApiError('Invalid refresh token response', 401, 'SESSION_EXPIRED')
}

export async function request(endpoint, options = {}) {
  const url = getUrl(endpoint, options.params)
  const headers = { ...options.headers }
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const token = getAccessToken()
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(url, {
      ...options,
      headers,
    })
  } catch (err) {
    throw new ApiError(
      err.message || 'Network error. Please check your connection.',
      0,
      'NETWORK_ERROR'
    )
  }

  // Handle 401 Unauthorized for token refresh (except on auth routes)
  if (
    response.status === 401 &&
    !endpoint.includes('/api/auth/login') &&
    !endpoint.includes('/api/auth/register') &&
    !endpoint.includes('/api/auth/refresh')
  ) {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        const newToken = await getRefreshedToken()
        if (newToken) {
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          }
          const retryResponse = await fetch(url, { ...options, headers: retryHeaders })
          return parseResponse(retryResponse)
        }
      } catch (err) {
        clearSession()
        throw err
      }
    }
  }

  return parseResponse(response)
}

function extractErrorMessage(data, status) {
  if (!data) return `Request failed with status ${status}`
  if (typeof data === 'string') return data
  if (typeof data === 'object') {
    if (typeof data.message === 'string') return data.message
    if (typeof data.error === 'string') return data.error
    if (data.error && typeof data.error === 'object' && typeof data.error.message === 'string') {
      return data.error.message
    }
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return typeof data.errors[0] === 'string'
        ? data.errors[0]
        : data.errors[0]?.message || 'Validation failed'
    }
  }
  return `Request failed with status ${status}`
}

function extractErrorCode(data) {
  if (data && typeof data === 'object') {
    if (data.code) return data.code
    if (data.errorCode) return data.errorCode
    if (data.error && typeof data.error === 'object' && data.error.code) {
      return data.error.code
    }
  }
  return 'REQUEST_FAILED'
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type')
  let data

  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json()
    } catch {
      data = null
    }
  } else {
    try {
      data = await response.text()
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    const message = extractErrorMessage(data, response.status)
    const code = extractErrorCode(data)
    throw new ApiError(message, response.status, code, data)
  }

  return data
}

export const apiClient = {
  get(endpoint, options = {}) {
    return request(endpoint, { method: 'GET', ...options })
  },
  post(endpoint, body, options = {}) {
    return request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    })
  },
  put(endpoint, body, options = {}) {
    return request(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    })
  },
  patch(endpoint, body, options = {}) {
    return request(endpoint, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    })
  },
  delete(endpoint, options = {}) {
    return request(endpoint, { method: 'DELETE', ...options })
  },
  upload(endpoint, formData, options = {}) {
    return request(endpoint, {
      method: 'POST',
      body: formData,
      ...options,
    })
  },
}

export default apiClient
