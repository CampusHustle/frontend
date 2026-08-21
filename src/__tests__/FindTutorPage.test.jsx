import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FindTutorPage from '../pages/FindTutorPage.jsx'

const testTutors = [
  {
    id: 'u-sarah',
    name: 'Sarah Johnson',
    department: 'Computer Science',
    university: 'MIT',
    bio: 'CS senior who loves teaching Python.',
    skillsTeaching: ['Python', 'Data Structures'],
    rating: { knowledge: 4.9, count: 38 },
    hourlyRate: 45,
    isEmailVerified: true,
  },
  {
    id: 'u-david',
    name: 'David Miller',
    department: 'Mathematics',
    university: 'Stanford',
    bio: 'Math tutor focused on calculus.',
    skillsTeaching: ['Calculus'],
    rating: { knowledge: 4.7, count: 21 },
    hourlyRate: 35,
    isEmailVerified: true,
  },
  {
    id: 'u-elena',
    name: 'Elena Rodriguez',
    department: 'Physics',
    university: 'Caltech',
    bio: 'Physics tutor covering mechanics.',
    skillsTeaching: ['Physics'],
    rating: { knowledge: 5.0, count: 12 },
    hourlyRate: 55,
    isEmailVerified: true,
  },
]

vi.mock('../api/tutorApi.js', () => ({
  getSkillTags: vi.fn().mockResolvedValue({ tags: ['Python', 'Calculus', 'Physics'] }),
  searchTutors: vi.fn().mockImplementation(async (params) => {
    let list = [...testTutors]
    if (params?.q) {
      const q = params.q.toLowerCase()
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.skillsTeaching.some((s) => s.toLowerCase().includes(q)) ||
          t.department.toLowerCase().includes(q)
      )
    }
    return { success: true, count: list.length, tutors: list }
  }),
}))

const setup = (onNavigate) => {
  const user = userEvent.setup()
  const onLogout = vi.fn()
  render(<FindTutorPage user={testTutors[0]} onLogout={onLogout} onNavigate={onNavigate} />)
  return { user, onLogout, onNavigate }
}

describe('FindTutorPage', () => {
  it('renders the tutor grid excluding the current logged-in user', async () => {
    setup()

    expect(screen.getByRole('heading', { name: 'Find Tutors' })).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('David Miller')).toBeInTheDocument()
      expect(screen.getByText('Elena Rodriguez')).toBeInTheDocument()
      // Logged-in user (Sarah Johnson) must not be in the list
      expect(screen.queryByText('Sarah Johnson')).not.toBeInTheDocument()
    })
  })

  it('filters tutors by the search query', async () => {
    const { user } = setup()

    await user.type(screen.getByPlaceholderText('Search tutors, subjects...'), 'Physics')

    await waitFor(() => {
      expect(screen.getByText('Elena Rodriguez')).toBeInTheDocument()
      expect(screen.queryByText('David Miller')).not.toBeInTheDocument()
    })
  })

  it('shows an empty state when no tutors match', async () => {
    const { user } = setup()

    await user.type(screen.getByPlaceholderText('Search tutors, subjects...'), 'zzz-nonexistent')

    await waitFor(() => {
      expect(screen.getByText('No tutors found')).toBeInTheDocument()
    })
  })

  it('fires onLogout when the logout button is clicked', async () => {
    const { user, onLogout } = setup()

    await user.click(screen.getByRole('button', { name: 'Log out' }))

    expect(onLogout).toHaveBeenCalledTimes(1)
  })

  it('navigates to the AI Assistant when Try AI Assistant is clicked', async () => {
    const onNavigate = vi.fn()
    const { user } = setup(onNavigate)

    await user.click(screen.getByRole('button', { name: 'Try AI Assistant' }))

    expect(onNavigate).toHaveBeenCalledWith('assistant')
  })
})
