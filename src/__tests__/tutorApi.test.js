import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  searchTutors,
  getSkillTags,
  getTutorById,
  blockUser,
  unblockUser,
} from '../api/tutorApi.js'

describe('tutorApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('searches tutors with formatted query params', async () => {
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
          tutors: [{ id: 't-1', name: 'Almaz Ayana', department: 'Computer Science' }],
        }),
      })
    })

    const result = await searchTutors({ q: 'python', department: 'Computer Science', maxPrice: 45 })

    expect(capturedUrl).toContain('/api/users/search')
    expect(capturedUrl).toContain('q=python')
    expect(capturedUrl).toContain('department=Computer+Science')
    expect(capturedUrl).toContain('maxPrice=45')
    expect(result.tutors).toHaveLength(1)
    expect(result.tutors[0].name).toBe('Almaz Ayana')
  })

  it('fetches skill tags list', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        tags: ['python', 'calculus', 'algorithms'],
      }),
    })

    const result = await getSkillTags()
    expect(result.tags).toEqual(['python', 'calculus', 'algorithms'])
  })

  it('retrieves public tutor profile by ID', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        user: { id: 't-99', name: 'Haile Gebrselassie', hourlyRate: 35 },
      }),
    })

    const result = await getTutorById('t-99')
    expect(result.user.name).toBe('Haile Gebrselassie')
    expect(result.user.hourlyRate).toBe(35)
  })

  it('blocks and unblocks peer user', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true }),
    })
    globalThis.fetch = fetchMock

    await blockUser('u-bad')
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/users/block/u-bad'),
      expect.objectContaining({ method: 'POST' })
    )

    await unblockUser('u-bad')
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/users/block/u-bad'),
      expect.objectContaining({ method: 'DELETE' })
    )
  })
})
