import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getTutorAvailability,
  getMyAvailability,
  createAvailabilitySlot,
  deleteAvailabilitySlot,
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
} from '../api/bookingApi.js'

describe('bookingApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches tutor availability slots by tutorId', async () => {
    let capturedUrl = ''
    globalThis.fetch = vi.fn().mockImplementation((url) => {
      capturedUrl = url
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: true,
          count: 2,
          data: [
            { dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00' },
            { dayOfWeek: 'Wednesday', startTime: '14:00', endTime: '15:00' },
          ],
        }),
      })
    })

    const result = await getTutorAvailability('tutor-123')
    expect(capturedUrl).toContain('/api/availability/tutor/tutor-123')
    expect(result.data).toHaveLength(2)
  })

  it('fetches current tutor availability with getMyAvailability', async () => {
    let capturedUrl = ''
    globalThis.fetch = vi.fn().mockImplementation((url) => {
      capturedUrl = url
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, count: 1, data: [{ dayOfWeek: 'Tuesday' }] }),
      })
    })

    const result = await getMyAvailability()
    expect(capturedUrl).toContain('/api/availability/me')
    expect(result.data).toHaveLength(1)
  })

  it('retrieves single booking by id with getBookingById', async () => {
    let capturedUrl = ''
    globalThis.fetch = vi.fn().mockImplementation((url) => {
      capturedUrl = url
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, data: { id: 'b-999', status: 'pending' } }),
      })
    })

    const result = await getBookingById('b-999')
    expect(capturedUrl).toContain('/api/bookings/b-999')
    expect(result.data.id).toBe('b-999')
  })

  it('creates an availability slot for current tutor', async () => {
    let capturedBody
    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      capturedBody = JSON.parse(options.body)
      return Promise.resolve({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, data: capturedBody }),
      })
    })

    const payload = { dayOfWeek: 'Friday', startTime: '09:00', endTime: '10:00' }
    const result = await createAvailabilitySlot(payload)

    expect(capturedBody).toEqual(payload)
    expect(result.success).toBe(true)
  })

  it('deletes an availability slot', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true, message: 'Slot deleted.' }),
    })
    globalThis.fetch = fetchMock

    const res = await deleteAvailabilitySlot('slot-456')
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/availability/slot-456'),
      expect.objectContaining({ method: 'DELETE' }),
    )
    expect(res.success).toBe(true)
  })

  it('creates a new booking request', async () => {
    let capturedBody
    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      capturedBody = JSON.parse(options.body)
      return Promise.resolve({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, message: 'Booking created', data: { id: 'b-1', ...capturedBody } }),
      })
    })

    const payload = { tutorId: 't-99', day: 'Monday', time: '9:00 AM' }
    const result = await createBooking(payload)

    expect(capturedBody).toEqual(payload)
    expect(result.data.id).toBe('b-1')
  })

  it('retrieves user bookings list with filter params', async () => {
    let capturedUrl = ''
    globalThis.fetch = vi.fn().mockImplementation((url) => {
      capturedUrl = url
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, count: 1, data: [{ id: 'b-100', status: 'confirmed' }] }),
      })
    })

    const result = await getUserBookings({ status: 'confirmed', role: 'student' })
    expect(capturedUrl).toContain('/api/bookings')
    expect(capturedUrl).toContain('status=confirmed')
    expect(capturedUrl).toContain('role=student')
    expect(result.data).toHaveLength(1)
  })

  it('updates booking status with PATCH', async () => {
    let capturedMethod = ''
    let capturedBody = null
    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      capturedMethod = options.method
      capturedBody = JSON.parse(options.body)
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, data: { id: 'b-1', status: capturedBody.status } }),
      })
    })

    const result = await updateBookingStatus('b-1', 'confirmed')
    expect(capturedMethod).toBe('PATCH')
    expect(capturedBody).toEqual({ status: 'confirmed' })
    expect(result.data.status).toBe('confirmed')
  })
})
