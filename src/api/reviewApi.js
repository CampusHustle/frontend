import apiClient from './client.js'

/**
 * Submits a review and star ratings for a completed booking
 * @param {{ bookingId: string, rating: { knowledge: number, communication: number, punctuality: number }, comment?: string }} reviewData
 * @returns {Promise<{ success: boolean, message: string, review: Object }>}
 */
export async function createReview(reviewData) {
  return apiClient.post('/api/reviews', reviewData)
}

/**
 * Retrieves all reviews for a user/tutor by userId
 * @param {string} userId
 * @param {{ page?: number, limit?: number }} [params]
 * @returns {Promise<{ success: boolean, count: number, reviews: Array, total: number }>}
 */
export async function getUserReviews(userId, params = {}) {
  return apiClient.get(`/api/reviews/user/${userId}`, { params })
}
