import apiClient from './client.js'
import { API_ENDPOINTS } from '../config/env.js'

/**
 * Submits a review and star ratings for a completed booking
 * @param {{ bookingId: string, rating: { knowledge: number, communication: number, punctuality: number }, comment?: string }} reviewData
 * @returns {Promise<{ success: boolean, message: string, review: Object }>}
 */
export async function createReview(reviewData) {
  return apiClient.post(API_ENDPOINTS.REVIEWS.CREATE, reviewData)
}

/**
 * Retrieves all reviews for a user/tutor by userId
 * @param {string} userId
 * @param {{ page?: number, limit?: number }} [params]
 * @returns {Promise<{ success: boolean, count: number, reviews: Array, total: number }>}
 */
export async function getUserReviews(userId, params = {}) {
  return apiClient.get(API_ENDPOINTS.REVIEWS.BY_USER(userId), { params })
}
