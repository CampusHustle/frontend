import apiClient from './client.js'
import { API_ENDPOINTS } from '../config/env.js'

/**
 * Searches tutors with optional filters (query, subject, department, minPrice, maxPrice, minRating, sortBy, page, limit).
 * @param {Object} params
 * @returns {Promise<{ tutors: Array, total: number, page: number, totalPages: number }>}
 */
export async function searchTutors(params = {}) {
  return apiClient.get(API_ENDPOINTS.USERS.SEARCH, { params })
}

/**
 * Fetches the canonical list of approved skill tags (FR-3).
 * @returns {Promise<{ tags: string[] }>}
 */
export async function getSkillTags() {
  return apiClient.get(API_ENDPOINTS.USERS.SKILLS)
}

/**
 * Retrieves a public tutor profile by ID.
 * @param {string} tutorId
 * @returns {Promise<{ user: Object }>}
 */
export async function getTutorById(tutorId) {
  return apiClient.get(API_ENDPOINTS.USERS.GET_BY_ID(tutorId))
}

/**
 * Blocks a peer user (FR-13).
 * @param {string} targetUserId
 */
export async function blockUser(targetUserId) {
  return apiClient.post(API_ENDPOINTS.USERS.BLOCK(targetUserId))
}

/**
 * Unblocks a peer user.
 * @param {string} targetUserId
 */
export async function unblockUser(targetUserId) {
  return apiClient.delete(API_ENDPOINTS.USERS.UNBLOCK(targetUserId))
}
