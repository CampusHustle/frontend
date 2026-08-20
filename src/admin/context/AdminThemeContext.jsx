/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const AdminThemeContext = createContext({
  isDark: true,
  theme: 'dark',
  toggleTheme: () => {},
})

export function AdminThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('campushustle_admin_theme') || 'dark'
  })

  const isDark = theme === 'dark'

  useEffect(() => {
    localStorage.setItem('campushustle_admin_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <AdminThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      <div className={isDark ? 'admin-dark' : 'admin-light'}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  return useContext(AdminThemeContext)
}
