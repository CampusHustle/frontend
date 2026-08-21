/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

import { getStoredTheme, applyTheme } from '../../utils/theme.js'

const AdminThemeContext = createContext({
  isDark: false,
  theme: 'light',
  toggleTheme: () => {},
})

export function AdminThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => getStoredTheme())

  const isDark = theme === 'dark'

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      return next
    })
  }

  return (
    <AdminThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      <div className={isDark ? 'admin-dark dark' : 'admin-light'}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  return useContext(AdminThemeContext)
}
