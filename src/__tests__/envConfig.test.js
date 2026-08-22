import { describe, it, expect } from 'vitest'
import { API_BASE_URL, SOCKET_URL, API_ENDPOINTS } from '../config/env.js'

describe('Centralized Environment Configuration (Single Source of Truth)', () => {
  it('exports valid non-empty API_BASE_URL and SOCKET_URL without trailing slashes', () => {
    expect(typeof API_BASE_URL).toBe('string')
    expect(API_BASE_URL.length).toBeGreaterThan(0)
    expect(API_BASE_URL.endsWith('/')).toBe(false)

    expect(typeof SOCKET_URL).toBe('string')
    expect(SOCKET_URL.length).toBeGreaterThan(0)
    expect(SOCKET_URL.endsWith('/')).toBe(false)
  })

  it('defines all required domain routes in API_ENDPOINTS', () => {
    expect(API_ENDPOINTS).toHaveProperty('AUTH')
    expect(API_ENDPOINTS).toHaveProperty('USERS')
    expect(API_ENDPOINTS).toHaveProperty('NOTES')
    expect(API_ENDPOINTS).toHaveProperty('AVAILABILITY')
    expect(API_ENDPOINTS).toHaveProperty('BOOKINGS')
    expect(API_ENDPOINTS).toHaveProperty('MESSAGES')
    expect(API_ENDPOINTS).toHaveProperty('NOTIFICATIONS')
    expect(API_ENDPOINTS).toHaveProperty('REVIEWS')
    expect(API_ENDPOINTS).toHaveProperty('AI')
  })

  it('correctly formats parametrized endpoint builder functions', () => {
    expect(API_ENDPOINTS.USERS.GET_BY_ID('u-123')).toBe('/api/users/u-123')
    expect(API_ENDPOINTS.NOTES.GET_BY_ID('n-456')).toBe('/api/notes/n-456')
    expect(API_ENDPOINTS.NOTES.BY_TUTOR('t-789')).toBe('/api/notes/tutor/t-789')
    expect(API_ENDPOINTS.BOOKINGS.GET_BY_ID('b-101')).toBe('/api/bookings/b-101')
    expect(API_ENDPOINTS.MESSAGES.BY_CONVERSATION('user1_user2')).toBe('/api/messages/user1_user2')
    expect(API_ENDPOINTS.MESSAGES.BY_USER('user2')).toBe('/api/messages/conversation/user2')
    expect(API_ENDPOINTS.NOTIFICATIONS.MARK_READ('notif-1')).toBe('/api/notifications/notif-1/read')
    expect(API_ENDPOINTS.REVIEWS.BY_USER('u-review')).toBe('/api/reviews/user/u-review')
  })
})