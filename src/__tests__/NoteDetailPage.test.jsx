import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoteDetailPage from '../pages/NoteDetailPage.jsx'
import NotePaymentPage from '../pages/NotePaymentPage.jsx'

vi.mock('../api/noteApi.js', () => ({
  getNoteById: vi.fn().mockRejectedValue(new Error('Network unavailable')),
}))

describe('NoteDetailPage & NotePaymentPage', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    })
  })

  it('renders the Stitch-designed note details, syllabus content, and buy button', async () => {
    const onNavigate = vi.fn()
    const user = userEvent.setup()
    render(<NoteDetailPage user={null} onNavigate={onNavigate} onLogout={vi.fn()} />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Reaction Mechanisms Masterclass/i })).toBeInTheDocument()
    })

    expect(screen.getByText(/150 ETB/)).toBeInTheDocument()
    expect(screen.getByText(/About these notes/i)).toBeInTheDocument()
    expect(screen.getByText(/Sarah Jenkins/i)).toBeInTheDocument()

    const buyButton = screen.getByRole('button', { name: /Buy Now \(Make Payment\)/i })
    expect(buyButton).toBeInTheDocument()

    // Click Buy Now
    await user.click(buyButton)
    expect(onNavigate).toHaveBeenCalledWith('/notes/note_123/payment')
  })

  it('renders payment accounts and handles copy account action in NotePaymentPage', async () => {
    const user = userEvent.setup()
    render(<NotePaymentPage user={{ name: 'Daniel Gidey' }} onNavigate={vi.fn()} onLogout={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Complete Your Payment' })).toBeInTheDocument()
    expect(screen.getByText('Telebirr')).toBeInTheDocument()
    expect(screen.getByText(/Commercial Bank of Ethiopia/i)).toBeInTheDocument()
    expect(screen.getByText(/Bank of Abyssinia/i)).toBeInTheDocument()

    // Copy action test
    const copyButton = screen.getByRole('button', { name: /Copy Number/i })
    expect(copyButton).toBeInTheDocument()
    await user.click(copyButton)
    expect(screen.getByText('Copied!')).toBeInTheDocument()
  })

  it('submits payment receipt proof and transitions to under-review verification state', async () => {
    const user = userEvent.setup()
    render(<NotePaymentPage user={{ name: 'Daniel Gidey' }} onNavigate={vi.fn()} onLogout={vi.fn()} />)

    const txnInput = screen.getByPlaceholderText(/e\.g\. TLBR-98726514/i)
    await user.type(txnInput, 'TLBR-99887766')

    // Mock file upload
    const file = new File(['dummy receipt content'], 'telebirr_receipt.png', { type: 'image/png' })
    const fileInput = document.querySelector('input[type="file"]')
    await user.upload(fileInput, file)

    const submitButton = screen.getByRole('button', { name: /Submit Receipt for Verification/i })
    await user.click(submitButton)

    // Verification state is displayed
    await waitFor(() => {
      expect(screen.getByTestId('verification-under-review')).toBeInTheDocument()
      expect(screen.getByText(/Payment Verification in Progress/i)).toBeInTheDocument()
      expect(screen.getByText('TLBR-99887766')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Browse Marketplace/i })).toBeInTheDocument()
    })
  })
})
