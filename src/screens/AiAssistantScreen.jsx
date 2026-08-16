import { useRef, useState } from 'react'
import { IconPaperclip, IconRobot, IconSend } from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'

function getAssistantReply(message) {
  return `Here's my answer for "${message}". I'm your CampusHustle study assistant — ask me anything about your courses.`
}

function welcomeMessage() {
  return {
    id: 'welcome',
    role: 'ai',
    content:
      "Hello! I'm your CampusHustle AI Study Assistant. How can I help you with your studies today?",
  }
}

export default function AiAssistantScreen({ user, onLogout, onNavigate }) {
  const [messages, setMessages] = useState(() => [welcomeMessage()])
  const [draft, setDraft] = useState('')
  const textareaRef = useRef(null)
  const scrollRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: 'user', content: trimmed },
      {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: getAssistantReply(trimmed),
      },
    ])
    setDraft('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    window.setTimeout(() => {
      scrollRef.current?.scrollTo?.({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, 0)
  }

  const handleTextareaInput = (e) => {
    setDraft(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  return (
    <div className="mesh-bg flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <AppNavbar
        user={user}
        activeView="assistant"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:px-6">
        <div className="mb-6 flex shrink-0 flex-col items-center text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-secondary-container shadow-sm">
            <IconRobot size={24} className="text-on-secondary-container" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-bold text-primary sm:text-3xl">
            AI Study Assistant
          </h1>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto pb-6">
          {messages.map((message) =>
            message.role === 'user' ? (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-sm leading-relaxed text-on-primary shadow-sm sm:max-w-[70%]">
                  {message.content}
                </div>
              </div>
            ) : (
              <div key={message.id} className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary-container shadow-sm">
                  <IconRobot
                    size={18}
                    className="text-on-secondary-container"
                    aria-hidden="true"
                  />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-surface-variant bg-surface-container-lowest px-4 py-3 text-sm leading-relaxed text-on-surface shadow-sm sm:max-w-[70%]">
                  {message.content}
                </div>
              </div>
            ),
          )}
        </div>

        <form onSubmit={handleSubmit} className="shrink-0 pb-2">
          <div className="flex items-end gap-2 rounded-2xl border border-surface-variant bg-surface-container-lowest p-2 shadow-level-2 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
            <button
              type="button"
              aria-label="Add attachment"
              className="rounded-xl p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
            >
              <IconPaperclip size={20} aria-hidden="true" />
            </button>
            <textarea
              ref={textareaRef}
              rows="1"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onInput={handleTextareaInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  e.currentTarget.form?.requestSubmit()
                }
              }}
              placeholder="Message AI Assistant... (Press Enter to send)"
              className="max-h-40 w-full resize-none border-0 bg-transparent px-2 py-2 text-sm text-on-surface focus:outline-none focus:ring-0 placeholder:text-outline"
            ></textarea>
            <button
              type="submit"
              aria-label="Send message"
              className="rounded-xl bg-primary p-2.5 text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-95"
            >
              <IconSend size={18} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-outline">
            AI can make mistakes. Verify important academic information.
          </p>
        </form>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
