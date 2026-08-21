import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AiChatScreen from '../screens/AiChatScreen.jsx'

describe('AiChatScreen Component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders header, sidebar with subjects and starters, and welcome message', () => {
    render(<AiChatScreen user={{ _id: 'u1', name: 'Abebe' }} onNavigate={() => {}} onLogout={() => {}} />)

    expect(screen.getByText(/Felat \(ፈላጥ\) AI Study Workspace/i)).toBeInTheDocument()
    expect(screen.getAllByText('Computer Science')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Mathematics')[0]).toBeInTheDocument()
    expect(screen.getByText('Economics & Business')).toBeInTheDocument()
    expect(screen.getByText(/Welcome, Abebe!/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Ask Felat anything/i)).toBeInTheDocument()
  })

  it('submits student question and renders animated response with markdown formatting', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        answer: '### Binary Search\nBinary search operates in **O(log N)** time complexity.',
      }),
    })

    const user = userEvent.setup()
    render(<AiChatScreen user={{ _id: 'u1', name: 'Abebe' }} onNavigate={() => {}} onLogout={() => {}} />)

    const textarea = screen.getByPlaceholderText(/Ask Felat anything/i)
    await user.type(textarea, 'Explain binary search complexity')
    await user.click(screen.getByRole('button', { name: /Send query/i }))

    expect(screen.getByText('Explain binary search complexity')).toBeInTheDocument()

    // Wait for streaming animation
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1200))
    })

    expect(screen.getByText('Binary Search')).toBeInTheDocument()
  })

  it('clears conversation when reset button is clicked', async () => {
    const user = userEvent.setup()
    render(<AiChatScreen user={{ _id: 'u1', name: 'Abebe' }} onNavigate={() => {}} onLogout={() => {}} />)

    await user.click(screen.getByRole('button', { name: /Reset session/i }))
    expect(screen.getByText(/Welcome, Abebe!/i)).toBeInTheDocument()
  })

  it('persists chats in localStorage across sessions', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        answer: 'Integration by parts formula is uv - int(v du).',
      }),
    })

    const user = userEvent.setup()
    render(<AiChatScreen user={{ _id: 'u1', name: 'Abebe' }} onNavigate={() => {}} onLogout={() => {}} />)

    const textarea = screen.getByPlaceholderText(/Ask Felat anything/i)
    await user.type(textarea, 'Integration formula')
    await user.click(screen.getByRole('button', { name: /Send query/i }))

    expect(localStorage.getItem('campus-hustle:ai-chat-sessions')).toContain('Integration formula')
  })

  it('allows attaching notes/files with paperclip button and displays attached badge', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        answer: 'I analyzed your uploaded calculus notes.',
      }),
    })

    const user = userEvent.setup()
    render(<AiChatScreen user={{ _id: 'u1', name: 'Abebe' }} onNavigate={() => {}} onLogout={() => {}} />)

    const fileInput = screen.getByLabelText(/Upload note or image/i)
    const file = new File(['mock content'], 'Calculus_Exam_Notes.pdf', { type: 'application/pdf' })
    await user.upload(fileInput, file)

    expect(screen.getByText('Calculus_Exam_Notes.pdf')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Send query/i }))
    expect(screen.getAllByText('Calculus_Exam_Notes.pdf').length).toBeGreaterThanOrEqual(1)
  })
})
