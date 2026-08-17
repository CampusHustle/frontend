import { useState, useRef, useEffect } from 'react'
import {
  IconPaperclip,
  IconRobot,
  IconSend,
  IconRefresh,
  IconCopy,
  IconCheck,
  IconArrowDown,
  IconX,
  IconNotes,
  IconBulb,
  IconBrain,
  IconSchool,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'

function getAssistantReply(message) {
  const lower = message.toLowerCase()
  let detailedTip = "I'm your CampusHustle study assistant — ask me anything about your courses, lecture notes, or exam preparation."

  if (lower.includes('opportunity cost')) {
    detailedTip =
      "Opportunity cost represents the potential benefits an individual, investor, or business misses out on when choosing one alternative over another. For example, if you spend 2 hours studying for Economics instead of working a part-time shift that pays $40, the opportunity cost of studying is the $40 you could have earned.\n\nKey Takeaways:\n• It measures the cost of forgone opportunities.\n• Essential for evaluating trade-offs in decision making.\n• Relevant in economics, finance, and everyday college choices."
  } else if (lower.includes('summarize') || lower.includes('note')) {
    detailedTip =
      "Here is a structured summary strategy for your notes:\n1. Core Concepts & Definitions\n2. Key Formulas or Models\n3. High-Yield Exam Topics\n4. Real-world Examples & Practice Problems"
  } else if (lower.includes('quiz') || lower.includes('exam')) {
    detailedTip =
      "Here's a quick practice review checklist:\n• Test your active recall without looking at notes.\n• Focus on questions with high difficulty ratings.\n• Practice past exam patterns.\n• Need tutor help? Check the CampusHustle Tutors tab anytime!"
  }

  return `Here's my answer for "${message}". ${detailedTip}`
}

function welcomeMessage() {
  return {
    id: 'welcome',
    role: 'ai',
    content:
      "Hello! I'm your CampusHustle AI Study Assistant. How can I help you with your studies today?",
    timestamp: 'Just now',
  }
}

const STARTER_PROMPTS = [
  {
    icon: IconNotes,
    title: 'Summarize Lecture Notes',
    prompt: 'Summarize the key takeaways and core concepts from my latest lecture in bullet points.',
  },
  {
    icon: IconBulb,
    title: 'Explain Difficult Concepts',
    prompt: 'Explain a complex academic topic using simple, intuitive real-world analogies.',
  },
  {
    icon: IconBrain,
    title: 'Generate Practice Quiz',
    prompt: 'Create 5 challenging multiple choice questions with explanations on my course topic.',
  },
  {
    icon: IconSchool,
    title: 'Exam Prep & Tutoring Advice',
    prompt: 'Give me high-yield exam preparation strategies and time management tips for midterms.',
  },
]

export default function AiAssistantScreen({ user, onLogout, onNavigate }) {
  const [messages, setMessages] = useState(() => [welcomeMessage()])
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [attachment, setAttachment] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [showScrollBottom, setShowScrollBottom] = useState(false)

  const textareaRef = useRef(null)
  const scrollRef = useRef(null)
  const fileInputRef = useRef(null)
  const idRef = useRef(0)

  const isStarterState = messages.length <= 1

  const scrollToBottom = (behavior = 'smooth') => {
    if (!scrollRef.current) return
    if (typeof scrollRef.current.scrollTo === 'function') {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      })
    } else {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom('smooth')
  }, [messages, isTyping])

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    const distanceToBottom = scrollHeight - scrollTop - clientHeight
    setShowScrollBottom(distanceToBottom > 120)
  }

  const handleSend = (textToSend) => {
    const content = (textToSend || draft).trim()
    if (!content && !attachment) return

    const userMessageId = `user-${idRef.current++}`
    const aiMessageId = `ai-${idRef.current++}`

    const userMsg = {
      id: userMessageId,
      role: 'user',
      content: content || `[Attached: ${attachment?.name}]`,
      attachment: attachment ? attachment.name : null,
      timestamp: 'Just now',
    }

    const aiMsg = {
      id: aiMessageId,
      role: 'ai',
      content: getAssistantReply(content || 'Uploaded Document Analysis'),
      timestamp: 'Just now',
    }

    setMessages((prev) => [...prev, userMsg, aiMsg])
    setDraft('')
    setAttachment(null)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    window.setTimeout(() => {
      scrollToBottom('smooth')
    }, 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSend()
  }

  const handleTextareaInput = (e) => {
    setDraft(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText?.(text)
    setCopiedId(id)
    window.setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr))
    }, 2000)
  }

  const handleRegenerate = (msgIndex) => {
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        const userPrompt = messages[i].content
        setIsTyping(true)
        window.setTimeout(() => {
          setMessages((prev) => {
            const updated = [...prev]
            updated[msgIndex] = {
              ...updated[msgIndex],
              content: getAssistantReply(userPrompt),
              timestamp: 'Regenerated just now',
            }
            return updated
          })
          setIsTyping(false)
        }, 400)
        break
      }
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachment({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
      })
    }
    e.target.value = ''
  }

  return (
    <div className="mesh-bg flex min-h-screen flex-col bg-surface font-body text-on-surface selection:bg-hustle-500 selection:text-ink-contrast">
      {/* Sticky App Navbar */}
      <AppNavbar
        user={user}
        activeView="assistant"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Main Full-Height ChatGPT Workspace */}
      <div className="relative flex h-[calc(100dvh-64px)] w-full shrink-0 flex-col overflow-hidden">
        {/* Scrollable Messages Area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col space-y-6">
            {/* ChatGPT Welcome Hero when starter state */}
            {isStarterState && (
              <div className="my-auto flex flex-col items-center py-6 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-container text-secondary-container shadow-level-2 ring-4 ring-secondary-container/15">
                  <IconRobot size={30} aria-hidden="true" />
                </div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                  AI Study Assistant
                </h1>
                <p className="mt-2 max-w-md text-sm text-on-surface-variant">
                  Your 24/7 academic copilot. Ask questions, clarify tough lecture topics,
                  summarize notes, or prep for upcoming exams.
                </p>

                {/* Prompt Suggestion Cards Grid */}
                <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                  {STARTER_PROMPTS.map((item) => {
                    const IconComponent = item.icon
                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => handleSend(item.prompt)}
                        className="group flex flex-col items-start gap-1 rounded-xl border border-surface-variant bg-surface-lowest/80 p-3.5 text-left shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary-container/60 hover:bg-surface-lowest hover:shadow-level-1 active:scale-[0.99]"
                      >
                        <div className="flex w-full items-center justify-between text-xs font-semibold text-primary">
                          <span className="flex items-center gap-1.5">
                            <IconComponent
                              size={16}
                              className="text-secondary-container transition-transform group-hover:scale-110"
                            />
                            {item.title}
                          </span>
                          <span className="text-[11px] text-outline opacity-0 transition-opacity group-hover:opacity-100">
                            Send ↗
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-on-surface-variant line-clamp-2">
                          {item.prompt}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            {messages.map((message, index) => {
              const isUser = message.role === 'user'

              return (
                <div
                  key={message.id}
                  className={`flex w-full flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  {isUser ? (
                    /* User Message Row */
                    <div className="flex max-w-[88%] flex-col items-end sm:max-w-[75%]">
                      {message.attachment && (
                        <div className="mb-1.5 flex items-center gap-1.5 rounded-lg border border-surface-variant bg-surface-lowest px-3 py-1 text-xs text-primary shadow-2xs">
                          <IconPaperclip size={13} className="text-secondary-container" />
                          <span className="max-w-48 truncate">{message.attachment}</span>
                        </div>
                      )}
                      <div className="rounded-2xl rounded-tr-xs bg-primary px-4 py-3 text-sm leading-relaxed text-on-primary shadow-level-1">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <span className="mt-1 text-[11px] text-outline">{message.timestamp || 'Just now'}</span>
                    </div>
                  ) : (
                    /* AI Message Row (ChatGPT style) */
                    <div className="group flex w-full max-w-full items-start gap-3 sm:gap-4">
                      {/* AI Avatar */}
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container text-secondary-container shadow-2xs">
                        <IconRobot size={18} aria-hidden="true" />
                      </div>

                      {/* Content Body */}
                      <div className="flex flex-1 flex-col overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-primary">CampusHustle AI</span>
                          <span className="text-[11px] text-outline">{message.timestamp || 'Just now'}</span>
                        </div>

                        <div className="prose prose-sm mt-1 max-w-none text-sm leading-relaxed text-on-surface">
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>

                        {/* Message Action Bar */}
                        <div className="mt-2.5 flex items-center gap-1 text-on-surface-variant">
                          <button
                            type="button"
                            onClick={() => handleCopy(message.id, message.content)}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary active:scale-95"
                            title="Copy response"
                          >
                            {copiedId === message.id ? (
                              <>
                                <IconCheck size={14} className="text-emerald-600" />
                                <span className="text-[11px] text-emerald-600 font-medium">Copied!</span>
                              </>
                            ) : (
                              <>
                                <IconCopy size={14} />
                                <span className="hidden text-[11px] sm:inline">Copy</span>
                              </>
                            )}
                          </button>

                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRegenerate(index)}
                              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary active:scale-95"
                              title="Regenerate response"
                            >
                              <IconRefresh size={14} />
                              <span className="hidden text-[11px] sm:inline">Regenerate</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container text-secondary-container shadow-2xs">
                  <IconRobot size={18} aria-hidden="true" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl bg-surface-lowest px-4 py-3 text-sm shadow-2xs">
                  <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                  <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                  <span className="size-2 animate-bounce rounded-full bg-primary" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Jump To Bottom Button */}
        {showScrollBottom && (
          <button
            type="button"
            onClick={() => scrollToBottom('smooth')}
            aria-label="Scroll to bottom"
            className="absolute bottom-24 right-6 z-20 flex size-9 items-center justify-center rounded-full border border-surface-variant bg-surface-lowest text-primary shadow-level-2 transition-all hover:bg-surface-low hover:scale-105 active:scale-95"
          >
            <IconArrowDown size={18} />
          </button>
        )}

        {/* ChatGPT Bottom Floating Prompt Input Bar */}
        <div className="shrink-0 bg-gradient-to-t from-surface via-surface/95 to-transparent px-4 pb-4 pt-2 sm:px-6">
          <div className="mx-auto w-full max-w-3xl">
            {/* Attachment Preview Badge */}
            {attachment && (
              <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-surface-variant bg-surface-lowest px-3 py-1.5 text-xs text-primary shadow-2xs">
                <IconPaperclip size={14} className="text-secondary-container" />
                <span className="font-medium">{attachment.name}</span>
                <span className="text-outline">({attachment.size})</span>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="rounded p-0.5 text-on-surface-variant hover:text-error"
                >
                  <IconX size={13} />
                </button>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="glass-card relative flex items-end gap-2 rounded-3xl border border-outline-variant/60 bg-surface-lowest/95 p-2 shadow-level-2 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
            >
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Attachment Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Add attachment"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary active:scale-95"
                title="Attach notes or documents"
              >
                <IconPaperclip size={19} aria-hidden="true" />
              </button>

              {/* Auto-expanding Textarea */}
              <textarea
                ref={textareaRef}
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onInput={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder="Message AI Assistant... (Press Enter to send)"
                className="max-h-44 w-full resize-none border-0 bg-transparent px-2 py-2 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-0"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!draft.trim() && !attachment}
                aria-label="Send message"
                className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-90 ${
                  draft.trim() || attachment
                    ? 'bg-secondary-container text-on-secondary-container shadow-level-1 hover:brightness-105 hover:shadow-level-2'
                    : 'cursor-not-allowed bg-surface-container text-outline opacity-60'
                }`}
              >
                <IconSend size={18} aria-hidden="true" />
              </button>
            </form>

            <p className="mt-2 text-center text-[11px] text-outline">
              AI can make mistakes. Verify important academic information.
            </p>
          </div>
        </div>
      </div>

      {/* Website Footer (Positioned below the full-height chat window) */}
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
