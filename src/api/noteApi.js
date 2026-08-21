import apiClient from './client.js'
import { API_ENDPOINTS } from '../config/env.js'

/**
 * Searches and browses notes across the platform
 * @param {{ q?: string, course?: string, minPrice?: number, maxPrice?: number, sortBy?: string, page?: number, limit?: number }} [params]
 * @returns {Promise<{ success: boolean, count: number, notes?: Array, data?: Array, total?: number }>}
 */
export async function searchNotes(params = {}) {
  return apiClient.get(API_ENDPOINTS.NOTES.SEARCH, { params })
}

/**
 * Retrieves a single note document by ID
 * @param {string} noteId
 * @returns {Promise<{ success: boolean, note?: Object, data?: Object }>}
 */
export async function getNoteById(noteId) {
  return apiClient.get(API_ENDPOINTS.NOTES.GET_BY_ID(noteId))
}

/**
 * Retrieves notes uploaded by a specific tutor
 * @param {string} tutorId
 * @returns {Promise<{ success: boolean, count: number, notes?: Array, data?: Array }>}
 */
export async function getNotesByTutor(tutorId) {
  return apiClient.get(API_ENDPOINTS.NOTES.BY_TUTOR(tutorId))
}

/**
 * Uploads a note file (PDF or Image for OCR) with metadata
 * @param {FormData} formData
 * @returns {Promise<{ success: boolean, message: string, note?: Object }>}
 */
export async function uploadNote(formData) {
  return apiClient.post(API_ENDPOINTS.NOTES.CREATE, formData)
}

/**
 * Initiates purchase of a note by noteId
 * @param {string} noteId
 * @returns {Promise<{ success: boolean, message: string, purchase?: Object }>}
 */
export async function purchaseNote(noteId) {
  return apiClient.post(API_ENDPOINTS.NOTES.PURCHASE(noteId), {})
}

/**
 * Retrieves the current user's purchased notes
 * @param {{ status?: string }} [params]
 * @returns {Promise<{ success: boolean, count: number, purchases?: Array }>}
 */
export async function getMyPurchases(params = {}) {
  return apiClient.get(API_ENDPOINTS.NOTES.MY_PURCHASES, { params })
}

/**
 * Updates a note by ID
 * @param {string} noteId
 * @param {FormData|Object} data
 * @returns {Promise<{ success: boolean, message: string, note?: Object }>}
 */
export async function updateNote(noteId, data) {
  return apiClient.put(API_ENDPOINTS.NOTES.UPDATE(noteId), data)
}

/**
 * Deletes a note by ID
 * @param {string} noteId
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function deleteNote(noteId) {
  return apiClient.delete(API_ENDPOINTS.NOTES.DELETE(noteId))
}

/**
 * Retrieves notes uploaded by the authenticated user
 * @param {string} [userId]
 * @returns {Promise<{ success: boolean, notes?: Array, data?: Array }>}
 */
export async function getMyUploadedNotes(userId) {
  if (userId) {
    return apiClient.get(API_ENDPOINTS.NOTES.BY_TUTOR(userId))
  }
  return apiClient.get(API_ENDPOINTS.NOTES.MY_NOTES)
}

