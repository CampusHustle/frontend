import { useRef, useState } from 'react'
import {
  IconDots,
  IconFileDescription,
  IconPaperclip,
  IconRobot,
  IconSchool,
  IconSend,
  IconUser,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'

const CONTEXT_OPTIONS = [
  { id: 'general', label: 'General Assistant', icon: IconRobot },
  { id: 'tutor', label: 'Sarah J. (Tutor)', icon: IconSchool },
  { id: 'notes', label: 'ECON101 Notes', icon: IconFileDescription },
]

function getAssistantReply(message, contextLabel) {
  return `Here's a response to "${message}" from the ${contextLabel} context. The full AI engine is coming in the next milestone.`
}

function welcomeMessage() {
  return {
    id: 'welcome',
    role: 'ai',
    content:
      "Hello! I'm your CampusHustle AI Study Assistant. I'm currently in \"General\" mode. How can I help you with your studies today?",
  }
}

export default function AiAssistantScreen({ user, onLogout, onNavigate }) {
  const [activeContextId, setActiveContextId] = useState('general')
  const [messages, setMessages] = useState(() => [welcomeMessage()])
  const [draft, setDraft] = useState('')
  const textareaRef = useRef(null)
  const scrollRef = useRef(null)

  const activeContext =
    CONTEXT_OPTIONS.find((option) => option.id === activeContextId) ||
    CONTEXT_OPTIONS[0]

  const handleContextChange = (contextId) => {
    if (contextId === activeContextId) return
    setActiveContextId(contextId)
    const context = CONTEXT_OPTIONS.find((option) => option.id === contextId)
    setMessages((current) => [
      ...current,
      {
        id: `context-${contextId}-${Date.now()}`,
        role: 'ai',
        content: `Switched to the ${context.label} context. I can now answer with that scope in mind.`,
      },
    ])
  }

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
        content: getAssistantReply(trimmed, activeContext.label),
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
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface mesh-bg">
      <AppNavbar
        user={user}
        activeView="assistant"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            AI Study Assistant
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-base text-on-surface-variant">
            Get instant help, summarize notes, or practice with a virtual tutor
            powered by your academic context.
          </p>
        </div>

        <div className="glass-card mx-auto flex h-[600px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl shadow-lg">
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-surface-container-high bg-surface-container-lowest/80 p-4">
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
              <span className="mr-2 shrink-0 text-xs font-medium uppercase tracking-wider text-outline">
                Context:
              </span>
              {CONTEXT_OPTIONS.map((option) => {
                const Icon = option.icon
                const isActive = option.id === activeContextId
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleContextChange(option.id)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'border border-primary bg-primary text-on-primary shadow-sm'
                        : 'border border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <Icon size={15} aria-hidden="true" />
                    {option.label}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              aria-label="Context options"
              className="shrink-0 rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
            >
              <IconDots size={20} aria-hidden="true" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex flex-grow flex-col gap-4 overflow-y-auto bg-surface-container-lowest/30 p-4 sm:p-6"
          >
            <div className="my-2 flex justify-center">
              <span className="rounded-full bg-surface-container-low px-3 py-1 text-xs font-medium text-outline">
                Today
              </span>
            </div>

            {messages.map((message) =>
              message.role === 'user' ? (
                <div
                  key={message.id}
                  className="flex max-w-[85%] flex-row-reverse self-end gap-2"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary shadow-sm">
                    <IconUser size={18} className="text-on-primary" aria-hidden="true" />
                  </div>
                  <div className="rounded-2xl rounded-tr-none bg-primary p-4 text-on-primary shadow-sm">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div
                  key={message.id}
                  className="flex max-w-[85%] items-start self-start gap-2"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary-container shadow-sm">
                    <IconRobot
                      size={18}
                      className="text-on-secondary-container"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-2xl rounded-tl-none border border-secondary-fixed-dim/30 bg-surface-container-lowest p-4 shadow-sm">
                    <div
                      className="absolute bottom-0 left-0 top-0 w-1 bg-secondary-container"
                      aria-hidden="true"
                    ></div>
                    <p className="pl-2 text-sm leading-relaxed text-on-surface">
                      {message.content}
                    </p>
                  </div>
                </div>
              ),
            )}

            <div className="flex items-start self-start gap-2 opacity-50">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary-container shadow-sm">
                <IconRobot
                  size={18}
                  className="text-on-secondary-container"
                  aria-hidden="true"
                />
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-none border border-surface-container-high bg-surface-container-lowest px-4 py-3 shadow-sm">
                <div className="size-2 animate-bounce rounded-full bg-outline-variant"></div>
                <div
                  className="size-2 animate-bounce rounded-full bg-outline-variant"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="size-2 animate-bounce rounded-full bg-outline-variant"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t border-surface-container-high bg-surface-container-lowest/90 p-4"
          >
            <div className="flex items-end gap-2">
              <button
                type="button"
                aria-label="Add attachment"
                className="mb-1 shrink-0 rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
              >
                <IconPaperclip size={20} aria-hidden="true" />
              </button>
              <div className="flex-grow overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low shadow-inner transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
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
                  className="max-h-32 w-full resize-none border-0 bg-transparent px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-0 placeholder:text-outline"
                ></textarea>
              </div>
              <button
                type="submit"
                aria-label="Send message"
                className="mb-[2px] shrink-0 rounded-xl bg-secondary-container p-3 text-on-secondary-container shadow-sm transition-all hover:bg-secondary hover:text-on-secondary hover:shadow-lg"
              >
                <IconSend size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="mt-2 text-center">
              <p className="text-[10px] font-medium text-outline">
                AI can make mistakes. Verify important academic information.
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
