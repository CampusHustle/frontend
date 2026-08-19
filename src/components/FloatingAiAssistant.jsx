import { useState, useRef, useEffect } from 'react'
import {
  IconSparkles,
  IconX,
  IconSend,
  IconPaperclip,
  IconCopy,
  IconCheck,
  IconRefresh,
} from '@tabler/icons-react'

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
    content: "Hello! I'm your CampusHustle AI Assistant. How can I help you with your studies today?",
    isStreaming: false,
    timestamp: 'Just now',
  }
}

export default function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(() => [welcomeMessage()])
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [attachment, setAttachment] = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const idRef = useRef(1)
  const streamingTimerRef = useRef(null)

  // Listen for custom event to open assistant from other components (like FindTutorScreen "Try AI Assistant")
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
    }
    window.addEventListener('open-ai-assistant', handleOpen)
    return () => window.removeEventListener('open-ai-assistant', handleOpen)
  }, [])

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen && typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Handle keyboard Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Clean up streaming timer on unmount
  useEffect(() => {
    return () => {
      if (streamingTimerRef.current) clearInterval(streamingTimerRef.current)
    }
  }, [])

  const handleSendMessage = (textToSend) => {
    const content = (textToSend || draft).trim()
    if (!content && !attachment) return

    const userMsgId = `u-${idRef.current++}`
    const userMessage = {
      id: userMsgId,
      role: 'user',
      content: content || `[Attached: ${attachment?.name}]`,
      attachmentName: attachment?.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setDraft('')
    setAttachment(null)
    setIsTyping(true)

    // Initial brief thinking state before writing animation starts
    setTimeout(() => {
      const fullReply = getAssistantReply(content || 'Uploaded Document Analysis')
      const aiMsgId = `ai-${idRef.current++}`
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      // Create new AI message with empty text and isStreaming flag
      setMessages((prev) => [
        ...prev,
        { id: aiMsgId, role: 'ai', content: '', isStreaming: true, timestamp },
      ])
      setIsTyping(false)

      let charIndex = 0
      const chunkSize = 4 // Characters typed per frame for a smooth, natural writing animation
      if (streamingTimerRef.current) clearInterval(streamingTimerRef.current)

      streamingTimerRef.current = setInterval(() => {
        charIndex += chunkSize
        if (charIndex >= fullReply.length) {
          clearInterval(streamingTimerRef.current)
          streamingTimerRef.current = null
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, content: fullReply, isStreaming: false } : msg
            )
          )
        } else {
          const currentText = fullReply.slice(0, charIndex)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, content: currentText, isStreaming: true } : msg
            )
          )
        }
      }, 20)
    }, 300)
  }

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const handleResetChat = () => {
    if (streamingTimerRef.current) {
      clearInterval(streamingTimerRef.current)
      streamingTimerRef.current = null
    }
    setMessages([welcomeMessage()])
    setDraft('')
    setAttachment(null)
    setIsTyping(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachment(file)
    }
  }

  return (
    <>
      {/* Floating Action Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
          title="AI Assistant"
          className="group relative flex size-14 items-center justify-center rounded-full bg-primary text-secondary-container shadow-level-3 transition-all duration-300 hover:scale-105 hover:bg-primary-container active:scale-95 border-2 border-secondary-container/40 focus:outline-none focus:ring-4 focus:ring-secondary-container/30 cursor-pointer"
        >
          {isOpen ? (
            <IconX size={26} stroke={2.5} className="text-white transition-transform group-hover:rotate-90 duration-200" />
          ) : (
            <>
              <IconSparkles size={26} stroke={2.2} className="animate-pulse text-secondary-container" />
              <span className="absolute -top-1 -right-1 flex size-3.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary-container opacity-75" />
                <span className="relative inline-flex size-3.5 rounded-full bg-secondary-container" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* Floating Overlay Little Chat Screen */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="AI Assistant chat"
          className="fixed bottom-24 right-4 sm:right-6 z-50 flex h-[530px] max-h-[calc(100vh-7.5rem)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-surface-variant/80 bg-surface-lowest shadow-level-3 backdrop-blur-xl transition-all dark:border-white/10 dark:bg-surface dark:text-ink-950"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-surface-variant/70 bg-surface-low px-4 py-3 dark:border-ink-200/60 dark:bg-ink-100">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-secondary-container shadow-sm">
                <IconSparkles size={16} stroke={2.2} />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-bold text-primary dark:text-ink-950">
                  AI Assistant
                </h3>
                <span className="inline-block size-2 rounded-full bg-emerald-500" title="Online" />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Reset conversation"
                aria-label="Reset conversation"
                className="inline-flex size-7 items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-high hover:text-on-surface dark:hover:bg-ink-200 dark:hover:text-ink-900 cursor-pointer"
              >
                <IconRefresh size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close assistant"
                aria-label="Close assistant"
                className="inline-flex size-7 items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-high hover:text-on-surface dark:hover:bg-ink-200 dark:hover:text-ink-900 cursor-pointer"
              >
                <IconX size={17} />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`relative max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-on-primary rounded-br-xs'
                      : 'bg-surface-low border border-surface-variant/70 text-on-surface dark:border-ink-200 dark:bg-ink-100 dark:text-ink-950 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">
                    {msg.content}
                    {msg.isStreaming && (
                      <span className="inline-block w-1.5 h-3.5 bg-secondary-container dark:bg-secondary-fixed ml-1 animate-pulse align-middle rounded-xs" />
                    )}
                  </p>

                  {msg.role === 'ai' && !msg.isStreaming && (
                    <div className="mt-2 flex items-center justify-between pt-1 border-t border-surface-variant/40 dark:border-ink-200/40 text-[10px] text-outline dark:text-ink-400">
                      <span>{msg.timestamp}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        title="Copy message"
                        className="inline-flex items-center gap-1 text-[10px] font-medium text-outline hover:text-primary dark:hover:text-ink-950 transition-colors cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <IconCheck size={12} className="text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <IconCopy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 rounded-2xl bg-surface-low border border-surface-variant/70 px-3.5 py-2.5 w-fit dark:border-ink-200 dark:bg-ink-100">
                <span className="size-1.5 rounded-full bg-primary/70 dark:bg-ink-950 animate-bounce" />
                <span className="size-1.5 rounded-full bg-primary/70 dark:bg-ink-950 animate-bounce [animation-delay:0.2s]" />
                <span className="size-1.5 rounded-full bg-primary/70 dark:bg-ink-950 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Attachment Preview if any */}
          {attachment && (
            <div className="flex items-center justify-between border-t border-surface-variant/60 bg-surface-low px-3 py-1.5 text-xs dark:border-ink-200/60 dark:bg-ink-100">
              <span className="truncate text-on-surface-variant font-medium dark:text-ink-600">
                📎 {attachment.name}
              </span>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="text-outline hover:text-error transition-colors cursor-pointer"
              >
                <IconX size={14} />
              </button>
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="border-t border-surface-variant/70 bg-surface-lowest p-2.5 dark:border-ink-200/60 dark:bg-surface"
          >
            <div className="flex items-center gap-2 rounded-xl border border-surface-variant bg-surface-low px-3 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:border-ink-200 dark:bg-ink-100">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Add attachment"
                aria-label="Add attachment"
                className="text-outline hover:text-primary transition-colors dark:hover:text-ink-950 cursor-pointer"
              >
                <IconPaperclip size={18} />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask AI assistant... (Enter to send)"
                className="flex-1 bg-transparent py-1 text-xs text-on-surface outline-none placeholder:text-outline dark:text-ink-950 dark:placeholder:text-ink-400"
              />
              <button
                type="submit"
                disabled={!draft.trim() && !attachment}
                aria-label="Send message"
                className="inline-flex size-7 items-center justify-center rounded-lg bg-primary text-secondary-container transition-all hover:bg-primary-container disabled:opacity-40 disabled:hover:bg-primary cursor-pointer"
              >
                <IconSend size={14} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
