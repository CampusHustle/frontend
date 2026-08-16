export const THEME_STORAGE_KEY = 'campus-hustle-theme'

export function getStoredTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  if (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark'
  }
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
