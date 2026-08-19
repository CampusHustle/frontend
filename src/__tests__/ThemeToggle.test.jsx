import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AppNavbar from '../components/AppNavbar.jsx'
import { applyTheme, getStoredTheme, initTheme, THEME_STORAGE_KEY } from '../utils/theme.js'

const resetTheme = () => {
  localStorage.removeItem(THEME_STORAGE_KEY)
  document.documentElement.classList.remove('dark')
  document.documentElement.style.colorScheme = ''
}

beforeEach(resetTheme)
afterEach(resetTheme)

describe('theme util', () => {
  it('defaults to light when nothing is stored', () => {
    expect(getStoredTheme()).toBe('light')
  })

  it('reads the stored theme from localStorage', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    expect(getStoredTheme()).toBe('dark')
  })

  it('applyTheme toggles the dark class and persists the choice', () => {
    applyTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')

    applyTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('initTheme applies the stored theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    initTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})

describe('AppNavbar theme toggle', () => {
  it('renders the toggle button with a dark mode label in light mode', () => {
    render(<AppNavbar onNavigate={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument()
  })

  it('switches to dark mode on click and back to light on second click', async () => {
    const user = userEvent.setup()
    render(<AppNavbar onNavigate={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Switch to dark mode' }))

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Switch to light mode' }))

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument()
  })
})
