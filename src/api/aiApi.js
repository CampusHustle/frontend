import apiClient from './client.js'

/**
 * Asks the Felat (ፈላጥ) AI Study Assistant a question scoped to course or tutor notes
 * @param {{ question: string, tutorId?: string }} payload
 * @returns {Promise<{ success: boolean, answer: string, grounded?: boolean, sources?: Array, matchedChunksCount?: number }>}
 */
export async function askFelatAi({ question, tutorId }) {
  return apiClient.post('/api/ai/ask', {
    question,
    ...(tutorId ? { tutorId } : {}),
  })
}
