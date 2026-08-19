import apiClient from './client.js'

/**
 * Fetches available time slots for a specific tutor
 * @param {string} tutorId
 * @returns {Promise<{ success: boolean, count: number, slots?: Array, data?: Array }>}
 */
export async function getTutorAvailability(tutorId) {
  return apiClient.get(`/api/availability/tutor/${tutorId}`)
}

/**
 * Fetches the currently authenticated tutor's availability slots
 * @returns {Promise<{ success: boolean, count: number, data?: Array }>}
 */
export async function getMyAvailability() {
  return apiClient.get('/api/availability/me')
}

/**
 * Creates a new weekly availability slot for the current tutor
 * @param {{ dayOfWeek: string, startTime: string, endTime: string }} slotData
 * @returns {Promise<{ success: boolean, data?: Object }>}
 */
export async function createAvailabilitySlot(slotData) {
  return apiClient.post('/api/availability', slotData)
}

/**
 * Deletes an availability slot
 * @param {string} slotId
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function deleteAvailabilitySlot(slotId) {
  return apiClient.delete(`/api/availability/${slotId}`)
}

/**
 * Creates a new booking request for a tutoring session
 * @param {{ availabilityId?: string, tutorId?: string, dayOfWeek?: string, startTime?: string, endTime?: string, day?: string, time?: string, subject?: string, message?: string }} bookingData
 * @returns {Promise<{ success: boolean, message: string, data?: Object }>}
 */
export async function createBooking(bookingData) {
  return apiClient.post('/api/bookings', bookingData)
}

/**
 * Retrieves all bookings for the logged-in user (as student or tutor)
 * @param {{ status?: string, role?: string }} [params]
 * @returns {Promise<{ success: boolean, count: number, data?: Array }>}
 */
export async function getUserBookings(params = {}) {
  return apiClient.get('/api/bookings', { params })
}

/**
 * Retrieves a single booking by ID
 * @param {string} bookingId
 * @returns {Promise<{ success: boolean, data?: Object }>}
 */
export async function getBookingById(bookingId) {
  return apiClient.get(`/api/bookings/${bookingId}`)
}

/**
 * Updates a booking status (confirmed, declined, cancelled, completed)
 * @param {string} bookingId
 * @param {'confirmed' | 'declined' | 'cancelled' | 'completed'} status
 * @returns {Promise<{ success: boolean, message: string, data?: Object }>}
 */
export async function updateBookingStatus(bookingId, status) {
  return apiClient.patch(`/api/bookings/${bookingId}/status`, { status })
}
