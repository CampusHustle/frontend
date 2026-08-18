import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoteDetailPage from '../pages/NoteDetailPage.jsx'
import PurchaseCard from '../components/PurchaseCard.jsx'

describe('NoteDetailPage & PurchaseCard', () => {
  const sampleNote = {
    id: 'note_test_1',
    title: 'Thermodynamics Final Exam Comprehensive Guide',
    course: 'ME302',
    tutorName: 'Daniel Gidey',
    description: 'Detailed solutions and formulas for closed/open systems.',
    price: 24.50,
    purchaseCount: 38,
    previewPages: [
      'https://example.com/p1.png',
      'https://example.com/p2.png'
    ]
  }

  it('renders the note details and displays the accurate price per note', async () => {
    render(<NoteDetailPage user={null} onNavigate={vi.fn()} onLogout={vi.fn()} />)

    // Wait for the note to load
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Complete Study Guide/i })).toBeInTheDocument()
    })

    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.getByText('$15.00')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Purchase Document/i })).toBeInTheDocument()
  })

  it('displays accurate price on PurchaseCard and triggers purchase stub with result state', async () => {
    const user = userEvent.setup()
    const onPurchaseSuccess = vi.fn()

    render(
      <PurchaseCard note={sampleNote} onPurchaseSuccess={onPurchaseSuccess} />
    )

    // Accurate price check
    expect(screen.getByText('$24.50')).toBeInTheDocument()
    expect(screen.getByText('ME302')).toBeInTheDocument()
    expect(screen.getByText(/By Daniel Gidey/i)).toBeInTheDocument()

    const purchaseButton = screen.getByRole('button', { name: /Purchase Document/i })
    expect(purchaseButton).toBeInTheDocument()

    // Click purchase button
    await user.click(purchaseButton)

    // Verify result state is displayed
    await waitFor(() => {
      expect(screen.getByTestId('purchase-result-success')).toBeInTheDocument()
      expect(screen.getByText('Purchase Successful!')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Download Full Document/i })).toBeInTheDocument()
    })

    expect(onPurchaseSuccess).toHaveBeenCalledWith(sampleNote)
  })

  it('renders already-purchased result state when initialPurchased is true', () => {
    render(
      <PurchaseCard note={sampleNote} initialPurchased={true} />
    )

    expect(screen.getByTestId('purchase-result-success')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Download Full Document/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Purchase Document/i })).not.toBeInTheDocument()
  })
})
