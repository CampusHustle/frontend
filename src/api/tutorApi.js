import apiClient from './client.js'

/**
 * Searches tutors with optional filters (query, subject, department, minPrice, maxPrice, minRating, sortBy, page, limit).
 * @param {Object} params
 * @returns {Promise<{ tutors: Array, total: number, page: number, totalPages: number }>}
 */
export async function searchTutors(params = {}) {
  return apiClient.get('/api/users/search', { params })
}

/**
 * Fetches the canonical list of approved skill tags (FR-3).
 * @returns {Promise<{ tags: string[] }>}
 */
export async function getSkillTags() {
  return apiClient.get('/api/users/skills')
}

/**
 * Retrieves a public tutor profile by ID.
 * @param {string} tutorId
 * @returns {Promise<{ user: Object }>}
 */
export async function getTutorById(tutorId) {
  return apiClient.get(`/api/users/${tutorId}`)
}

/**
 * Blocks a peer user (FR-13).
 * @param {string} targetUserId
 */
export async function blockUser(targetUserId) {
  return apiClient.post(`/api/users/block/${targetUserId}`)
}

/**
 * Unblocks a peer user.
 * @param {string} targetUserId
 */
export async function unblockUser(targetUserId) {
  return apiClient.delete(`/api/users/block/${targetUserId}`)
}
