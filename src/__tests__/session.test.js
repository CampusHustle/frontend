import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadSessionUser,
  saveSessionUser,
  clearSession,
  loadSessionView,
  saveSessionView,
} from '../utils/session.js'

describe('session utils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads null when no session user is stored', () => {
    expect(loadSessionUser()).toBeNull()
  })

  it('saves and loads session user correctly', () => {
    const user = { id: 'u-1', email: 'test@campus.edu.et', name: 'Test User' }
    saveSessionUser(user)
    expect(loadSessionUser()).toEqual(user)
  })

  it('clears session user and session view on clearSession', () => {
    saveSessionUser({ id: 'u-1', name: 'Test' })
    saveSessionView('find-tutor')

    clearSession()

    expect(loadSessionUser()).toBeNull()
    expect(loadSessionView()).toBeNull()
  })

  it('saves and loads session view correctly', () => {
    saveSessionView('find-tutor')
    expect(loadSessionView()).toBe('find-tutor')

    saveSessionView(null)
    expect(loadSessionView()).toBeNull()
  })
})
