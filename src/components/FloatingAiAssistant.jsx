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
  IconBook,
} from '@tabler/icons-react'
import { askFelatAi } from '../api/aiApi.js'

function parseInlineMarkdown(text) {
  if (!text) return null

  // Tokenize bold (**text**), italic (*text*), inline code (`code`), and math ($formula$)
  const inlineRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\$.*?\$)/g
  const tokens = text.split(inlineRegex)

  return tokens.map((token, i) => {
    if (!token) return null
    if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      return (
        <strong key={i} className="font-bold text-primary dark:text-ink-950">
          {token.slice(2, -2)}
        </strong>
      )
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length >= 2) {
      return (
        <em key={i} className="italic text-on-surface dark:text-ink-900">
          {token.slice(1, -1)}
        </em>
      )
    }
    if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
      return (
        <code
          key={i}
          className="rounded-md bg-surface-container/70 dark:bg-ink-200/80 px-1.5 py-0.5 font-mono text-[11px] font-medium text-primary dark:text-ink-950 border border-surface-variant/40 dark:border-ink-300/40"
        >
          {token.slice(1, -1)}
        </code>
      )
    }
    if (token.startsWith('$') && token.endsWith('$') && token.length >= 2) {
      return (
        <span
          key={i}
          className="inline-block font-mono text-[11px] px-1.5 py-0.5 bg-secondary-container/20 text-secondary dark:text-secondary-fixed rounded font-medium"
        >
          {token.slice(1, -1)}
        </span>
      )
    }
    return token
  })
}

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false)

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="my-2.5 overflow-hidden rounded-xl border border-surface-variant/80 bg-surface-lowest dark:border-ink-300 dark:bg-ink-900 text-on-surface dark:text-white shadow-xs">
      <div className="flex items-center justify-between border-b border-surface-variant/50 bg-surface-low dark:border-ink-700/60 dark:bg-ink-800 px-3 py-1.5 text-[10px] font-medium text-outline dark:text-ink-400">
        <span className="font-mono uppercase tracking-wider">{lang || 'code'}</span>
        <button
          type="button"
          onClick={handleCopyCode}
          className="inline-flex items-center gap-1 hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <IconCheck size={12} className="text-emerald-500" />
              <span className="text-emerald-500 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <IconCopy size={12} />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function FormattedAiResponse({ content, isStreaming }) {
  if (!content) {
    return isStreaming ? (
      <span className="inline-block w-1.5 h-3.5 bg-secondary-container dark:bg-secondary-fixed ml-1 animate-pulse align-middle rounded-xs" />
    ) : null
  }

  const lines = content.split('\n')
  const blocks = []
  let currentCodeBlock = null
  let currentList = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Code block fences (```)
    if (line.trim().startsWith('```')) {
      if (currentCodeBlock) {
        blocks.push({
          type: 'code',
          lang: currentCodeBlock.lang,
          code: currentCodeBlock.lines.join('\n'),
        })
        currentCodeBlock = null
      } else {
        if (currentList) {
          blocks.push(currentList)
          currentList = null
        }
        const lang = line.trim().slice(3).trim() || 'text'
        currentCodeBlock = { lang, lines: [] }
      }
      continue
    }

    if (currentCodeBlock) {
      currentCodeBlock.lines.push(line)
      continue
    }

    // Headings (###, ##, #)
    if (line.startsWith('### ')) {
      if (currentList) {
        blocks.push(currentList)
        currentList = null
      }
      blocks.push({ type: 'h3', text: line.slice(4) })
      continue
    }
    if (line.startsWith('## ')) {
      if (currentList) {
        blocks.push(currentList)
        currentList = null
      }
      blocks.push({ type: 'h2', text: line.slice(3) })
      continue
    }
    if (line.startsWith('# ')) {
      if (currentList) {
        blocks.push(currentList)
        currentList = null
      }
      blocks.push({ type: 'h1', text: line.slice(2) })
      continue
    }

    // Blockquote (> )
    if (line.startsWith('> ')) {
      if (currentList) {
        blocks.push(currentList)
        currentList = null
      }
      blocks.push({ type: 'quote', text: line.slice(2) })
      continue
    }

    // Unordered bullet list (- or * or •)
    const bulletMatch = line.match(/^(\s*)[-*•]\s+(.*)$/)
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        if (currentList) blocks.push(currentList)
        currentList = { type: 'ul', items: [] }
      }
      currentList.items.push(bulletMatch[2])
      continue
    }

    // Ordered numbered list (1. , 2. )
    const numberedMatch = line.match(/^(\s*)\d+\.\s+(.*)$/)
    if (numberedMatch) {
      if (!currentList || currentList.type !== 'ol') {
        if (currentList) blocks.push(currentList)
        currentList = { type: 'ol', items: [] }
      }
      currentList.items.push(numberedMatch[2])
      continue
    }

    // Paragraph / Blank line
    if (currentList) {
      blocks.push(currentList)
      currentList = null
    }

    if (line.trim() === '') {
      blocks.push({ type: 'spacer' })
    } else {
      blocks.push({ type: 'p', text: line })
    }
  }

  if (currentCodeBlock) {
    blocks.push({
      type: 'code',
      lang: currentCodeBlock.lang,
      code: currentCodeBlock.lines.join('\n'),
    })
  }

  if (currentList) {
    blocks.push(currentList)
  }

  return (
    <div className="space-y-2 text-xs leading-relaxed break-words">
      {blocks.map((block, idx) => {
        if (block.type === 'code') {
          return <CodeBlock key={idx} lang={block.lang} code={block.code} />
        }
        if (block.type === 'h1') {
          return (
            <h4 key={idx} className="font-display text-sm font-bold text-primary dark:text-ink-950 mt-2 mb-1 border-b border-surface-variant/40 pb-1">
              {parseInlineMarkdown(block.text)}
            </h4>
          )
        }
        if (block.type === 'h2') {
          return (
            <h5 key={idx} className="font-display text-xs font-bold text-primary dark:text-ink-950 mt-2 mb-1">
              {parseInlineMarkdown(block.text)}
            </h5>
          )
        }
        if (block.type === 'h3') {
          return (
            <h6 key={idx} className="font-display text-xs font-semibold text-primary dark:text-ink-900 mt-1.5 mb-0.5">
              {parseInlineMarkdown(block.text)}
            </h6>
          )
        }
        if (block.type === 'quote') {
          return (
            <div key={idx} className="border-l-3 border-secondary-container bg-secondary-container/10 px-2.5 py-1.5 rounded-r-lg my-1 text-[11px] text-on-surface-variant dark:text-ink-700 italic">
              {parseInlineMarkdown(block.text)}
            </div>
          )
        }
        if (block.type === 'ul') {
          return (
            <ul key={idx} className="space-y-1 my-1.5 pl-1 list-none">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-on-surface dark:text-ink-950">
                  <span className="inline-block size-1.5 rounded-full bg-primary/70 dark:bg-ink-700 shrink-0 mt-1.5" />
                  <span className="flex-1">{parseInlineMarkdown(item)}</span>
                </li>
              ))}
            </ul>
          )
        }
        if (block.type === 'ol') {
          return (
            <ol key={idx} className="space-y-1 my-1.5 pl-1 list-none">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-on-surface dark:text-ink-950">
                  <span className="font-bold text-primary dark:text-ink-900 shrink-0 text-[11px] min-w-[16px]">
                    {i + 1}.
                  </span>
                  <span className="flex-1">{parseInlineMarkdown(item)}</span>
                </li>
              ))}
            </ol>
          )
        }
        if (block.type === 'spacer') {
          return <div key={idx} className="h-0.5" />
        }
        return (
          <p key={idx} className="text-on-surface dark:text-ink-950">
            {parseInlineMarkdown(block.text)}
            {idx === blocks.length - 1 && isStreaming && (
              <span className="inline-block w-1.5 h-3 bg-secondary-container dark:bg-secondary-fixed ml-1 animate-pulse align-middle rounded-xs" />
            )}
          </p>
        )
      })}
    </div>
  )
}

function welcomeMessage() {
  return {
    id: 'welcome',
    role: 'ai',
    content: "Selam! I'm Felat (ፈላጥ), your CampusHustle AI Assistant. Ask me anything about your university courses, concepts, or exam preparation!",
    isStreaming: false,
    timestamp: 'Just now',
  }
}

export default function FloatingAiAssistant({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(() => [welcomeMessage()])
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [attachment, setAttachment] = useState(null)
  const [activeTutorId, setActiveTutorId] = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const idRef = useRef(1)
  const streamingTimerRef = useRef(null)

  useEffect(() => {
    const handleOpen = (e) => {
      const detail = e?.detail
      if (detail?.tutorId) {
        setActiveTutorId(detail.tutorId)
      }
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
      let fullReply = ''
      let grounded = false
      let sources = []
      try {
        const res = await askFelatAi({ question: content || 'Help with my courses', tutorId: activeTutorId || undefined })
        fullReply = res?.answer || "I'm Felat (ፈላጥ), your CampusHustle AI study assistant. How can I help you succeed today?"
        grounded = res?.grounded === true
        sources = res?.sources || []
      } catch (err) {
        fullReply = err.message || "Unable to reach Felat AI assistant. Please check your network connection and make sure you are logged in."
      }

      const aiMsgId = `ai-${idRef.current++}`
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      setMessages((prev) => [
        ...prev,
        { id: aiMsgId, role: 'ai', content: '', isStreaming: true, timestamp, grounded, sources },
      ])
      setIsTyping(false)

      let charIndex = 0
      const chunkSize = 4
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
    setActiveTutorId(null)
    setIsTyping(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachment(file)
    }
  }

  if (!user && !isOpen && !activeTutorId) return null

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
            {activeTutorId && (
              <div className="flex items-center gap-1.5 rounded-lg border border-dashed border-[#114161]/30 bg-[#114161]/5 px-3 py-1.5 text-[10px] text-[#114161] dark:border-[#114161]/20 dark:bg-[#114161]/5">
                <IconBook size={12} />
                <span>Questions scoped to this tutor's notes</span>
              </div>
            )}
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
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <FormattedAiResponse
                      content={msg.content}
                      isStreaming={msg.isStreaming}
                    />
                  )}

                  {msg.role === 'ai' && !msg.isStreaming && (
                    <>
                      {msg.grounded !== undefined && (
                        <div className="mt-1.5 flex items-center gap-1 text-[10px]">
                          <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium ${msg.grounded ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-ink-200 dark:text-ink-400'}`}>
                            {msg.grounded ? '📚 From notes' : '💬 General'}
                          </span>
                        </div>
                      )}

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 space-y-1 border-t border-surface-variant/40 pt-2 dark:border-ink-200/40">
                          <p className="text-[10px] font-semibold text-outline dark:text-ink-500">Sources:</p>
                          {msg.sources.map((src, i) => (
                            <div key={i} className="flex items-center gap-1 text-[10px] text-outline dark:text-ink-400">
                              <IconBook size={10} />
                              <span>Page {src.pageNumber}{src.similarityScore ? ` · ${Math.round(src.similarityScore * 100)}% match` : ''}</span>
                            </div>
                          ))}
                        </div>
                      )}

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
                    </>
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
