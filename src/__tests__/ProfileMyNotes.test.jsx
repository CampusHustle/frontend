import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ProfilePage from '../pages/ProfilePage.jsx'

vi.mock('../api/noteApi.js', () => ({
  deleteNote: vi.fn(() => Promise.resolve({ success: true, message: 'Note deleted' })),
  getMyUploadedNotes: vi.fn(() => Promise.resolve({ success: true, notes: [] })),
}))

describe('ProfileScreen My Notes Section (View, Edit, Delete)', () => {
  const initialUser = {
    id: 'u-1',
    name: 'Daniel Gidey',
    email: 'daniel.gidey@aau.edu.et',
    university: 'Addis Ababa University',
    department: 'Software Engineering',
    year: 'junior',
    bio: 'Passionate coding tutor and student.',
    hourlyRate: 30,
    skillsTeaching: ['React', 'Node.js'],
    skillsLearning: ['Python'],
    rating: { knowledge: 4.8, communication: 4.9, punctuality: 5.0, count: 12 },
    verified: true,
  }

  const sampleNotes = [
    {
      id: 101,
      title: 'Operating Systems System Calls Guide',
      course: 'CS 310',
      department: 'Computer Science',
      contentType: 'PDF Notes',
      price: '180 ETB',
      numericPrice: 180,
      description: 'Comprehensive walkthrough of fork, exec, and POSIX threads.',
    },
    {
      id: 102,
      title: 'Calculus III Quick Formula Cheat Sheet',
      course: 'MATH 203',
      department: 'Mathematics',
      contentType: 'Cheat Sheet',
      price: 'Free',
      numericPrice: 0,
      description: 'Double integrals, Stokes theorem, and vector gradients summary.',
    },
  ]

  it('renders the My Notes section below peer ratings with uploaded notes count and cards', () => {
    render(
      <MemoryRouter>
        <ProfilePage user={initialUser} userNotes={sampleNotes} />
      </MemoryRouter>
    )

    // Heading exists
    expect(screen.getByRole('heading', { name: /My Notes/i })).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()

    // Note titles and details
    expect(screen.getByText('Operating Systems System Calls Guide')).toBeInTheDocument()
    expect(screen.getByText('CS 310')).toBeInTheDocument()
    expect(screen.getByText('180 ETB')).toBeInTheDocument()

    expect(screen.getByText('Calculus III Quick Formula Cheat Sheet')).toBeInTheDocument()
    expect(screen.getByText('MATH 203')).toBeInTheDocument()
    expect(screen.getByText('Free')).toBeInTheDocument()

    // Action buttons exist
    expect(screen.getByRole('button', { name: 'Edit Operating Systems System Calls Guide' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete Operating Systems System Calls Guide' })).toBeInTheDocument()
  })

  it('shows empty state when no notes have been uploaded', () => {
    render(
      <MemoryRouter>
        <ProfilePage user={initialUser} userNotes={[]} />
      </MemoryRouter>
    )

    expect(screen.getByText(/No notes uploaded yet/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Upload Your First Note/i })).toBeInTheDocument()
  })

  it('calls edit handler with note payload when Edit button is clicked', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()

    render(
      <MemoryRouter>
        <ProfilePage user={initialUser} userNotes={sampleNotes} onNavigate={onNavigate} />
      </MemoryRouter>
    )

    const editBtn = screen.getByRole('button', { name: 'Edit Operating Systems System Calls Guide' })
    await user.click(editBtn)

    expect(onNavigate).toHaveBeenCalledWith('post-listing', {
      note: sampleNotes[0],
    })
  })

  it('opens confirmation modal on clicking Delete button and cancels smoothly', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ProfilePage user={initialUser} userNotes={sampleNotes} />
      </MemoryRouter>
    )

    // Delete modal initially closed
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()

    // Click delete on first note
    await user.click(screen.getByRole('button', { name: 'Delete Operating Systems System Calls Guide' }))

    // Confirmation dialog opens
    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByText(/Delete Note Material\?/i)).toBeInTheDocument()
    expect(within(dialog).getByText(/"Operating Systems System Calls Guide"/i)).toBeInTheDocument()

    // Click Cancel
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

    // Dialog closes and note is preserved
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.getByText('Operating Systems System Calls Guide')).toBeInTheDocument()
  })

  it('confirms note deletion in modal, removes note from list, and displays feedback toast', async () => {
    const user = userEvent.setup()
    const onDeleteNote = vi.fn()

    render(
      <MemoryRouter>
        <ProfilePage user={initialUser} userNotes={sampleNotes} onDeleteNote={onDeleteNote} />
      </MemoryRouter>
    )

    // Click delete on first note
    await user.click(screen.getByRole('button', { name: 'Delete Operating Systems System Calls Guide' }))

    const dialog = screen.getByRole('alertdialog')
    // Click confirm delete
    await user.click(within(dialog).getByRole('button', { name: /Yes, Delete/i }))

    // Dialog closes
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()

    // Deleted note is removed from display
    expect(screen.queryByText('Operating Systems System Calls Guide')).not.toBeInTheDocument()

    // Other note remains
    expect(screen.getByText('Calculus III Quick Formula Cheat Sheet')).toBeInTheDocument()

    // Callback fired
    expect(onDeleteNote).toHaveBeenCalledWith(101)

    // Success toast shown
    expect(screen.getByText('Note material deleted successfully!')).toBeInTheDocument()
  })

  it('filters uploaded notes in real-time when typing in search bar', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ProfilePage user={initialUser} userNotes={sampleNotes} />
      </MemoryRouter>
    )

    const searchInput = screen.getByLabelText(/Search my notes/i)
    expect(screen.getByText('Operating Systems System Calls Guide')).toBeInTheDocument()
    expect(screen.getByText('Calculus III Quick Formula Cheat Sheet')).toBeInTheDocument()

    // Filter for "Calculus"
    await user.type(searchInput, 'Calculus')
    expect(screen.getByText('Calculus III Quick Formula Cheat Sheet')).toBeInTheDocument()
    expect(screen.queryByText('Operating Systems System Calls Guide')).not.toBeInTheDocument()

    // Filter with no match
    await user.clear(searchInput)
    await user.type(searchInput, 'NonExistentSubject')
    expect(screen.getByText(/No notes found matching "NonExistentSubject"/i)).toBeInTheDocument()
  })
})
