import apiClient from './client.js'
import { API_ENDPOINTS } from '../config/env.js'

/**
 * Retrieves all active conversations for the authenticated user
 * @returns {Promise<{ success: boolean, count: number, conversations: Array }>}
 */
export async function getConversations() {
  return apiClient.get(API_ENDPOINTS.MESSAGES.CONVERSATIONS)
}

/**
 * Retrieves conversation message history by conversationId
 * @param {string} conversationId
 * @param {{ page?: number, limit?: number }} [params]
 * @returns {Promise<{ success: boolean, count: number, messages: Array, total: number }>}
 */
export async function getConversationMessages(conversationId, params = {}) {
  return apiClient.get(API_ENDPOINTS.MESSAGES.BY_CONVERSATION(conversationId), { params })
}

export async function getMessagesWithUser(otherUserId, params = {}) {
  return apiClient.get(API_ENDPOINTS.MESSAGES.BY_USER(otherUserId), { params })
}

/**
 * Retrieves total unread message count for current user
 * @returns {Promise<{ success: boolean, count: number }>}
 */
export async function getUnreadMessageCount() {
  return apiClient.get(API_ENDPOINTS.MESSAGES.UNREAD_COUNT)
}

/**
 * Marks messages in a conversation as read
 * @param {string} conversationId
 * @returns {Promise<{ success: boolean, modifiedCount: number }>}
 */
export async function markConversationAsRead(conversationId) {
  return apiClient.patch(API_ENDPOINTS.MESSAGES.MARK_READ(conversationId))
}

/**
 * Sends a message via REST endpoint
 * @param {{ conversationId?: string, otherUserId?: string, content: string }} data
 * @returns {Promise<{ success: boolean, message: Object }>}
 */
export async function sendMessage(data) {
  return apiClient.post(API_ENDPOINTS.MESSAGES.SEND, data)
}
