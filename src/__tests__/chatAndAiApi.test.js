import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getConversationMessages,
  getMessagesWithUser,
  getUnreadMessageCount,
  markConversationAsRead,
  sendMessage
} from '../api/chatApi.js'
import { askFelatAi } from '../api/aiApi.js'
import { encodeContactCard, decodeContactCard } from '../utils/contactCard.js'

describe('chatApi and aiApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('retrieves unread message count and marks messages as read', async () => {
    let capturedUrl = ''
    let capturedMethod = ''
    globalThis.fetch = vi.fn().mockImplementation((url, options) => {
      capturedUrl = url
      capturedMethod = options?.method || 'GET'
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, count: 3, modifiedCount: 2 }),
      })
    })

    const countRes = await getUnreadMessageCount()
    expect(capturedUrl).toContain('/api/messages/unread-count')
    expect(countRes.count).toBe(3)

    const readRes = await markConversationAsRead('conv_123')
    expect(capturedUrl).toContain('/api/messages/conv_123/read')
    expect(capturedMethod).toBe('PATCH')
    expect(readRes.modifiedCount).toBe(2)
  })

  it('sends message via REST with sendMessage', async () => {
    let capturedBody = null
    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      capturedBody = JSON.parse(options.body)
      return Promise.resolve({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, message: { _id: 'm-new', content: capturedBody.content } }),
      })
    })

    const res = await sendMessage({ conversationId: 'conv_123', content: 'Testing REST send' })
    expect(capturedBody.content).toBe('Testing REST send')
    expect(res.message.content).toBe('Testing REST send')
  })

  it('retrieves conversation messages by conversationId', async () => {
    let capturedUrl = ''
    globalThis.fetch = vi.fn().mockImplementation((url) => {
      capturedUrl = url
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: true,
          count: 1,
          messages: [{ id: 'm-1', text: 'Hello!' }],
        }),
      })
    })

    const result = await getConversationMessages('conv-123', { page: 1, limit: 20 })
    expect(capturedUrl).toContain('/api/messages/conv-123')
    expect(capturedUrl).toContain('page=1')
    expect(capturedUrl).toContain('limit=20')
    expect(result.messages).toHaveLength(1)
  })

  it('retrieves messages by user ID', async () => {
    let capturedUrl = ''
    globalThis.fetch = vi.fn().mockImplementation((url) => {
      capturedUrl = url
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: true,
          count: 1,
          messages: [{ id: 'm-2', text: 'Hey there!' }],
        }),
      })
    })

    const result = await getMessagesWithUser('user-456')
    expect(capturedUrl).toContain('/api/messages/conversation/user-456')
    expect(result.messages[0].text).toBe('Hey there!')
  })

  it('queries Felat AI Study Assistant with askFelatAi', async () => {
    let capturedBody
    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      capturedBody = JSON.parse(options.body)
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: true,
          answer: 'Opportunity cost is the next best alternative given up.',
          grounded: true,
          sources: [{ noteId: 'note-1', pageNumber: 3 }],
        }),
      })
    })

    const result = await askFelatAi({ question: 'Explain opportunity cost', tutorId: 't-10' })
    expect(capturedBody.question).toBe('Explain opportunity cost')
    expect(capturedBody.tutorId).toBe('t-10')
    expect(result.grounded).toBe(true)
    expect(result.answer).toContain('Opportunity cost')
  })
})

describe('contactCard encoding/decoding', () => {
  it('encodes and decodes contact info properly', () => {
    const original = { name: 'Abebe Bikila', email: 'abebe@campus.edu.et', phone: '+251911223344' }
    const encoded = encodeContactCard(original)
    expect(encoded.startsWith('[[CONTACT_CARD]]')).toBe(true)

    const decoded = decodeContactCard(encoded)
    expect(decoded).toEqual(original)
  })

  it('returns null when decoding plain text or invalid JSON', () => {
    expect(decodeContactCard('Hello there!')).toBeNull()
    expect(decodeContactCard('[[CONTACT_CARD]]invalid_json')).toBeNull()
    expect(decodeContactCard('[[CONTACT_CARD]]{"foo":"bar"}')).toBeNull()
  })
})
