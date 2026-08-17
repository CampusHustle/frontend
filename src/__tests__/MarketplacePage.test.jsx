import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import MarketplaceScreen from '../screens/MarketplaceScreen.jsx'

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
  it('renders the marketplace and Post Material button', () => {
    setup()

    expect(screen.getByRole('heading', { name: 'Academic Marketplace' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Post Material' })).toBeInTheDocument()
  })

  it('navigates to the post-listing page when Post Material is clicked', async () => {
    const onNavigate = vi.fn()
    const { user } = setup(onNavigate)

    await user.click(screen.getByRole('button', { name: 'Post Material' }))

    expect(onNavigate).toHaveBeenCalledWith('post-listing')
  })
})
