import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../api/notificationApi.js'
import { createReview, getUserReviews } from '../api/reviewApi.js'

describe('notificationApi and reviewApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches unread notification count with getUnreadNotificationCount', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true, count: 3 }),
    })

    const result = await getUnreadNotificationCount()
    expect(result.count).toBe(3)
  })

  it('fetches notifications with getNotifications', async () => {
    let capturedUrl = ''
    globalThis.fetch = vi.fn().mockImplementation((url) => {
      capturedUrl = url
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: true,
          count: 1,
          notifications: [{ _id: 'notif-1', title: 'New Booking' }],
        }),
      })
    })

    const result = await getNotifications({ limit: 10, unreadOnly: true })
    expect(capturedUrl).toContain('/api/notifications')
    expect(capturedUrl).toContain('limit=10')
    expect(capturedUrl).toContain('unreadOnly=true')
    expect(result.notifications).toHaveLength(1)
  })

  it('marks a single notification as read', async () => {
    let capturedMethod = ''
    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      capturedMethod = options.method
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, message: 'Notification marked as read' }),
      })
    })

    const result = await markNotificationAsRead('n-123')
    expect(capturedMethod).toBe('PATCH')
    expect(result.success).toBe(true)
  })

  it('marks all notifications as read with markAllNotificationsAsRead', async () => {
    let capturedUrl = ''
    globalThis.fetch = vi.fn().mockImplementation((url) => {
      capturedUrl = url
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, message: 'All notifications marked as read' }),
      })
    })

    const result = await markAllNotificationsAsRead()
    expect(capturedUrl).toContain('/api/notifications/read-all')
    expect(result.success).toBe(true)
  })

  it('submits a review for a completed booking with createReview', async () => {
    let capturedBody
    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      capturedBody = JSON.parse(options.body)
      return Promise.resolve({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: true,
          message: 'Review submitted successfully',
          review: capturedBody,
        }),
      })
    })

    const payload = {
      bookingId: 'bk-100',
      rating: { knowledge: 5, communication: 5, punctuality: 4.8 },
      comment: 'Super helpful tutor!',
    }
    const result = await createReview(payload)

    expect(capturedBody).toEqual(payload)
    expect(result.review.comment).toBe('Super helpful tutor!')
  })

  it('retrieves user reviews with getUserReviews', async () => {
    let capturedUrl = ''
    globalThis.fetch = vi.fn().mockImplementation((url) => {
      capturedUrl = url
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: true,
          count: 1,
          reviews: [{ id: 'rev-1', comment: 'Great session!' }],
        }),
      })
    })

    const result = await getUserReviews('tutor-777', { page: 1, limit: 10 })
    expect(capturedUrl).toContain('/api/reviews/user/tutor-777')
    expect(capturedUrl).toContain('page=1')
    expect(capturedUrl).toContain('limit=10')
    expect(result.reviews).toHaveLength(1)
  })
})
