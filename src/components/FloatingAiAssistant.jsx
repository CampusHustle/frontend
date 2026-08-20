import { useState, useRef, useEffect } from 'react'
import {
  IconMessageChatbot,
  IconSparkles,
  IconX,
  IconSend,
  IconPaperclip,
  IconCopy,
  IconCheck,
  IconRefresh,
} from '@tabler/icons-react'
import { askFelatAi } from '../api/aiApi.js'

function welcomeMessage() {
  return {
    id: 'welcome',
    role: 'ai',
    content: "Selam! I'm Felat (ፈላጥ), your CampusHustle AI Assistant. Ask me anything about your university courses, concepts, or exam preparation!",
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

    setTimeout(async () => {
      let fullReply
      try {
        const res = await askFelatAi({ question: content || 'Help with my courses' })
        fullReply = res?.answer || "I'm Felat (ፈላጥ), your CampusHustle AI study assistant. How can I help you succeed today?"
      } catch (err) {
        fullReply = err.message || "Unable to reach Felat AI assistant. Please check your network connection and make sure you are logged in."
      }

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
          aria-label={isOpen ? 'Close Felat (ፈላጥ)' : 'Open Felat (ፈላጥ)'}
          title="Felat (ፈላጥ)"
          className="group relative flex size-14 items-center justify-center rounded-full bg-[#114161] text-white shadow-[0_8px_25px_rgba(17,65,97,0.45)] transition-all duration-300 hover:scale-105 hover:bg-[#0d344e] hover:shadow-[0_12px_32px_rgba(17,65,97,0.6)] active:scale-95 border-2 border-white/25 focus:outline-none focus:ring-4 focus:ring-[#114161]/30 cursor-pointer"
        >
          {isOpen ? (
            <IconX size={24} stroke={2.5} className="text-white transition-transform group-hover:rotate-90 duration-200" />
          ) : (
            <>
              <IconMessageChatbot size={28} stroke={2} className="text-white transition-transform duration-200 group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 flex size-3.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-hustle-400 opacity-75" />
                <span className="relative inline-flex size-3.5 rounded-full bg-hustle-400 border border-white/60" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* Floating Overlay Little Chat Screen */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Felat (ፈላጥ) AI Assistant chat"
          className="fixed bottom-24 right-4 sm:right-6 z-50 flex h-[530px] max-h-[calc(100vh-7.5rem)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-surface-variant/80 bg-surface-lowest shadow-level-3 backdrop-blur-xl transition-all dark:border-white/10 dark:bg-surface dark:text-ink-950"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-surface-variant/70 bg-surface-low px-4 py-3 dark:border-ink-200/60 dark:bg-ink-100">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-[#114161] text-white shadow-sm">
                <IconSparkles size={16} stroke={2.2} />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-bold text-primary dark:text-ink-950">
                  Felat (ፈላጥ)
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
                title="Close chat panel"
                aria-label="Close chat panel"
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
                placeholder="Ask Felat (ፈላጥ)... (Enter to send)"
                className="flex-1 bg-transparent py-1 text-xs text-on-surface outline-none placeholder:text-outline dark:text-ink-950 dark:placeholder:text-ink-400"
              />
              <button
                type="submit"
                disabled={!draft.trim() && !attachment}
                aria-label="Send message"
                className="inline-flex size-7 items-center justify-center rounded-lg bg-[#114161] text-white transition-all hover:bg-[#0d344e] disabled:opacity-40 cursor-pointer shadow-sm"
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
