import apiClient from './client.js'
import { API_ENDPOINTS } from '../config/env.js'

/**
 * Fetches available time slots for a specific tutor
 * @param {string} tutorId
 * @returns {Promise<{ success: boolean, count: number, slots?: Array, data?: Array }>}
 */
export async function getTutorAvailability(tutorId) {
  return apiClient.get(API_ENDPOINTS.AVAILABILITY.BY_TUTOR(tutorId))
}

/**
 * Fetches the currently authenticated tutor's availability slots
 * @returns {Promise<{ success: boolean, count: number, data?: Array }>}
 */
export async function getMyAvailability() {
  return apiClient.get(API_ENDPOINTS.AVAILABILITY.ME)
}

/**
 * Creates a new weekly availability slot for the current tutor
 * @param {{ dayOfWeek: string, startTime: string, endTime: string }} slotData
 * @returns {Promise<{ success: boolean, data?: Object }>}
 */
export async function createAvailabilitySlot(slotData) {
  return apiClient.post(API_ENDPOINTS.AVAILABILITY.CREATE, slotData)
}

/**
 * Deletes an availability slot
 * @param {string} slotId
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function deleteAvailabilitySlot(slotId) {
  return apiClient.delete(API_ENDPOINTS.AVAILABILITY.DELETE(slotId))
}

/**
 * Creates a new booking request for a tutoring session
 * @param {{ availabilityId?: string, tutorId?: string, dayOfWeek?: string, startTime?: string, endTime?: string, day?: string, time?: string, subject?: string, message?: string }} bookingData
 * @returns {Promise<{ success: boolean, message: string, data?: Object }>}
 */
export async function createBooking(bookingData) {
  return apiClient.post(API_ENDPOINTS.BOOKINGS.CREATE, bookingData)
}

/**
 * Retrieves all bookings for the logged-in user (as student or tutor)
 * @param {{ status?: string, role?: string }} [params]
 * @returns {Promise<{ success: boolean, count: number, data?: Array }>}
 */
export async function getUserBookings(params = {}) {
  return apiClient.get(API_ENDPOINTS.BOOKINGS.LIST, { params })
}

/**
 * Retrieves a single booking by ID
 * @param {string} bookingId
 * @returns {Promise<{ success: boolean, data?: Object }>}
 */
export async function getBookingById(bookingId) {
  return apiClient.get(API_ENDPOINTS.BOOKINGS.GET_BY_ID(bookingId))
}

/**
 * Updates a booking status (confirmed, declined, cancelled, completed)
 * @param {string} bookingId
 * @param {'confirmed' | 'declined' | 'cancelled' | 'completed'} status
 * @returns {Promise<{ success: boolean, message: string, data?: Object }>}
 */
export async function updateBookingStatus(bookingId, status) {
  return apiClient.patch(API_ENDPOINTS.BOOKINGS.UPDATE_STATUS(bookingId), { status })
}
