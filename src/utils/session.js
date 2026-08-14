const SESSION_KEY = 'campus-hustle:session'
const VIEW_KEY = 'campus-hustle:view'

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
