export const THEME_STORAGE_KEY = 'campus-hustle-theme'

export function getStoredTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  // Default to light theme regardless of system preference
  return 'light'
}

export function applyTheme(theme) {
  const isDark = theme === 'dark'
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  return theme
}

export function initTheme() {
  return applyTheme(getStoredTheme())
}
