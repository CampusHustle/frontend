import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import MarketplaceScreen from '../screens/MarketplaceScreen.jsx'
import * as noteApi from '../api/noteApi.js'

vi.mock('../api/noteApi.js', () => ({
  searchNotes: vi.fn(),
  getNotesByTutor: vi.fn(),
}))

const mockDbNotes = [
  {
    _id: 'note-db-1',
    title: 'Computer Architecture High-Yield Guide',
    course: 'CS 220',
    department: 'Computer Science',
    price: 150,
    fileUrl: 'https://example.com/arch.pdf',
    tutorId: {
      name: 'Daniel Gidey',
      department: 'Computer Science',
      university: 'Mekelle University',
      profilePicUrl: null,
    },
  },
]

const setup = (onNavigate) => {
  const user = userEvent.setup()
  const onLogout = vi.fn()
  render(
    <MemoryRouter>
      <MarketplaceScreen user={null} onLogout={onLogout} onNavigate={onNavigate} />
    </MemoryRouter>
  )
  return { user, onNavigate }
}

describe('MarketplaceScreen', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    noteApi.searchNotes.mockResolvedValue({
      success: true,
      count: 1,
      notes: mockDbNotes,
    })
  })

  it('renders the marketplace and loads DB notes', async () => {
    setup()

    expect(screen.getByRole('heading', { name: 'Academic Marketplace' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Post Material' })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Computer Architecture High-Yield Guide')).toBeInTheDocument()
      expect(screen.getByText('150 ETB')).toBeInTheDocument()
    })
  })

  it('navigates to the post-listing page when Post Material is clicked', async () => {
    const onNavigate = vi.fn()
    const { user } = setup(onNavigate)

    await user.click(screen.getByRole('button', { name: 'Post Material' }))

    expect(onNavigate).toHaveBeenCalledWith('post-listing')
  })
})
