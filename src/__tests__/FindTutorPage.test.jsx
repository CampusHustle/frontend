import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FindTutorPage from '../pages/FindTutorPage.jsx'
import { tutors } from '../api/mockUsers.js'

const setup = () => {
  const user = userEvent.setup()
  const onLogout = vi.fn()
  render(<FindTutorPage user={tutors[1]} onLogout={onLogout} />)
  return { user, onLogout }
}

describe('FindTutorPage', () => {
  it('renders the tutor grid with mock tutors', () => {
    setup()

    expect(screen.getByRole('heading', { name: 'Find Tutors' })).toBeInTheDocument()
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
    expect(screen.getByText('David Miller')).toBeInTheDocument()
  })

  it('paginates results with the Load More button', async () => {
    const { user } = setup()

    expect(screen.queryByText('Daniel Kim')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Load More Tutors/i }))

    expect(screen.getByText('Daniel Kim')).toBeInTheDocument()
  })

  it('filters tutors by the search query', async () => {
    const { user } = setup()

    await user.type(screen.getByPlaceholderText('Search tutors, subjects...'), 'Physics')

    expect(screen.getByText('Elena Rodriguez')).toBeInTheDocument()
    expect(screen.queryByText('Sarah Johnson')).not.toBeInTheDocument()
  })

  it('shows an empty state when no tutors match', async () => {
    const { user } = setup()

    await user.type(screen.getByPlaceholderText('Search tutors, subjects...'), 'zzz-nonexistent')

    expect(screen.getByText('No tutors found')).toBeInTheDocument()
  })

  it('fires onLogout when the logout button is clicked', async () => {
    const { user, onLogout } = setup()

    await user.click(screen.getByRole('button', { name: 'Log out' }))

    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
