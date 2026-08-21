import apiClient from './client.js'
import { API_ENDPOINTS } from '../config/env.js'

/**
 * Asks the Felat (ፈላጥ) AI Study Assistant a question scoped to course or tutor notes,
 * or analyzes an attached document (PDF, Image, Text) via OCR and text extraction.
 * @param {{ question: string, tutorId?: string, file?: File }} payload
 * @returns {Promise<{ success: boolean, answer: string, grounded?: boolean, sources?: Array, matchedChunksCount?: number }>}
 */
export async function askFelatAi({ question, tutorId, file }) {
  if (file) {
    const formData = new FormData()
    formData.append('question', question || 'Please analyze this attached document.')
    if (tutorId) formData.append('tutorId', tutorId)
    formData.append('file', file)
    return apiClient.post(API_ENDPOINTS.AI.ASK, formData)
  }

  return apiClient.post(API_ENDPOINTS.AI.ASK, {
    question,
    ...(tutorId ? { tutorId } : {}),
  })
}
