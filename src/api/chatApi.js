import apiClient from './client.js'

/**
 * Retrieves all active conversations for the authenticated user
 * @returns {Promise<{ success: boolean, count: number, conversations: Array }>}
 */
export async function getConversations() {
  return apiClient.get('/api/messages/conversations')
}

/**
 * Retrieves conversation message history by conversationId
 * @param {string} conversationId
 * @param {{ page?: number, limit?: number }} [params]
 * @returns {Promise<{ success: boolean, count: number, messages: Array, total: number }>}
 */
export async function getConversationMessages(conversationId, params = {}) {
  return apiClient.get(`/api/messages/${conversationId}`, { params })
}

/**
 * Retrieves conversation message history with a specific user
 * @param {string} otherUserId
 * @param {{ page?: number, limit?: number }} [params]
 * @returns {Promise<{ success: boolean, count: number, messages: Array, total: number }>}
 */
export async function getMessagesWithUser(otherUserId, params = {}) {
  return apiClient.get(`/api/messages/conversation/${otherUserId}`, { params })
}
