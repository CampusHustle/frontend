const SESSION_KEY = 'campus-hustle:session'
const VIEW_KEY = 'campus-hustle:view'
const ACCESS_TOKEN_KEY = 'campus-hustle:access-token'
const REFRESH_TOKEN_KEY = 'campus-hustle:refresh-token'

export function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || null
  } catch {
    return null
  }
}

export function setAccessToken(token) {
  try {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token)
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
    }
  } catch {
    /* ignore quota / privacy-mode failures */
  }
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || null
  } catch {
    return null
  }
}

export function setRefreshToken(token) {
  try {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token)
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
  } catch {
    /* ignore quota / privacy-mode failures */
  }
}

export function saveAuthTokens({ accessToken, refreshToken }) {
  if (accessToken) setAccessToken(accessToken)
  if (refreshToken) setRefreshToken(refreshToken)
}

export function clearAuthTokens() {
  setAccessToken(null)
  setRefreshToken(null)
}

export function loadSessionUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveSessionUser(user) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } catch {
    /* ignore quota / privacy-mode failures */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(VIEW_KEY)
    clearAuthTokens()
  } catch {
    /* ignore quota / privacy-mode failures */
  }
}

export function loadSessionView() {
  try {
    return localStorage.getItem(VIEW_KEY) || null
  } catch {
    return null
  }
}

export function saveSessionView(view) {
  try {
    if (view) {
      localStorage.setItem(VIEW_KEY, view)
    } else {
      localStorage.removeItem(VIEW_KEY)
    }
  } catch {
    /* ignore quota / privacy-mode failures */
  }
}
