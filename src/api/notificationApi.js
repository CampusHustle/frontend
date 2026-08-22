import apiClient from './client.js'
import { API_ENDPOINTS } from '../config/env.js'

/**
 * Retrieves user notifications with pagination and unread filter
 * @param {{ page?: number, limit?: number, unreadOnly?: boolean }} [params]
 * @returns {Promise<{ success: boolean, count: number, notifications: Array, total: number, unreadCount: number }>}
 */
export async function getNotifications(params = {}) {
  return apiClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST, { params })
}

/**
 * Retrieves unread notification count
 * @returns {Promise<{ success: boolean, count: number }>}
 */
export async function getUnreadNotificationCount() {
  return apiClient.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT)
}

/**
 * Marks a single notification as read
 * @param {string} notificationId
 * @returns {Promise<{ success: boolean, message: string, notification?: Object }>}
 */
export async function markNotificationAsRead(notificationId) {
  return apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId), {})
}

/**
 * Marks all notifications as read
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function markAllNotificationsAsRead() {
  return apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {})
}
