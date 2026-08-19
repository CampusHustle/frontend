import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  searchNotes,
  getNoteById,
  getNotesByTutor,
  uploadNote,
  purchaseNote,
  getMyPurchases,
} from '../api/noteApi.js'

describe('noteApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('searches notes with query parameters', async () => {
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
          notes: [{ id: 'n-1', title: 'Calculus II Notes', price: 15 }],
        }),
      })
    })

    const result = await searchNotes({ q: 'Calculus', maxPrice: 30 })
    expect(capturedUrl).toContain('/api/notes/search')
    expect(capturedUrl).toContain('q=Calculus')
    expect(capturedUrl).toContain('maxPrice=30')
    expect(result.notes).toHaveLength(1)
  })

  it('retrieves single note by ID with getNoteById', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        note: { id: 'n-123', title: 'Algorithms Cheat Sheet', price: 20 },
      }),
    })

    const result = await getNoteById('n-123')
    expect(result.note.title).toBe('Algorithms Cheat Sheet')
  })

  it('retrieves notes uploaded by a tutor with getNotesByTutor', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        count: 2,
        notes: [{ id: 'n-1' }, { id: 'n-2' }],
      }),
    })

    const result = await getNotesByTutor('tutor-456')
    expect(result.count).toBe(2)
  })

  it('uploads a note using FormData with uploadNote', async () => {
    let capturedBody
    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      capturedBody = options.body
      return Promise.resolve({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, message: 'Note uploaded successfully' }),
      })
    })

    const formData = new FormData()
    formData.append('title', 'Chemistry 101')
    formData.append('price', '25')

    const result = await uploadNote(formData)
    expect(capturedBody).toBe(formData)
    expect(result.success).toBe(true)
  })

  it('initiates note purchase with purchaseNote', async () => {
    let capturedUrl = ''
    globalThis.fetch = vi.fn().mockImplementation((url) => {
      capturedUrl = url
      return Promise.resolve({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, message: 'Note purchase initiated' }),
      })
    })

    const result = await purchaseNote('n-999')
    expect(capturedUrl).toContain('/api/notes/n-999/purchase')
    expect(result.success).toBe(true)
  })

  it('retrieves purchased notes list with getMyPurchases', async () => {
    let capturedUrl = ''
    globalThis.fetch = vi.fn().mockImplementation((url) => {
      capturedUrl = url
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, purchases: [{ id: 'p-1', noteId: 'n-1' }] }),
      })
    })

    const result = await getMyPurchases({ status: 'completed' })
    expect(capturedUrl).toContain('/api/notes/purchases/me')
    expect(capturedUrl).toContain('status=completed')
    expect(result.purchases).toHaveLength(1)
  })
})
