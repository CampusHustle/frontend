import apiClient from './client.js'

/**
 * Searches and browses notes across the platform
 * @param {{ q?: string, course?: string, minPrice?: number, maxPrice?: number, sortBy?: string, page?: number, limit?: number }} [params]
 * @returns {Promise<{ success: boolean, count: number, notes?: Array, data?: Array, total?: number }>}
 */
export async function searchNotes(params = {}) {
  return apiClient.get('/api/notes/search', { params })
}

/**
 * Retrieves a single note document by ID
 * @param {string} noteId
 * @returns {Promise<{ success: boolean, note?: Object, data?: Object }>}
 */
export async function getNoteById(noteId) {
  return apiClient.get(`/api/notes/${noteId}`)
}

/**
 * Retrieves notes uploaded by a specific tutor
 * @param {string} tutorId
 * @returns {Promise<{ success: boolean, count: number, notes?: Array, data?: Array }>}
 */
export async function getNotesByTutor(tutorId) {
  return apiClient.get(`/api/notes/tutor/${tutorId}`)
}

/**
 * Uploads a note file (PDF or Image for OCR) with metadata
 * @param {FormData} formData
 * @returns {Promise<{ success: boolean, message: string, note?: Object }>}
 */
export async function uploadNote(formData) {
  return apiClient.post('/api/notes', formData)
}

/**
 * Initiates purchase of a note by noteId
 * @param {string} noteId
 * @returns {Promise<{ success: boolean, message: string, purchase?: Object }>}
 */
export async function purchaseNote(noteId) {
  return apiClient.post(`/api/notes/${noteId}/purchase`, {})
}

/**
 * Retrieves the current user's purchased notes
 * @param {{ status?: string }} [params]
 * @returns {Promise<{ success: boolean, count: number, purchases?: Array }>}
 */
export async function getMyPurchases(params = {}) {
  return apiClient.get('/api/notes/purchases/me', { params })
}
