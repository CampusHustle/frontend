import { useState, useRef, useEffect, useCallback } from 'react'
import {
  IconSparkles,
  IconSend,
  IconCopy,
  IconCheck,
  IconRefresh,
  IconTrash,
  IconCode,
  IconBrain,
  IconCalculator,
  IconStethoscope,
  IconCoin,
  IconScale,
  IconAtom,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import { askFelatAi } from '../api/aiApi.js'

const SUBJECT_PRESETS = [
  { id: 'cs', name: 'Computer Science', icon: IconCode, color: 'text-sky-500 bg-sky-500/10' },
  { id: 'math', name: 'Mathematics', icon: IconCalculator, color: 'text-purple-500 bg-purple-500/10' },
  { id: 'med', name: 'Medicine & Health', icon: IconStethoscope, color: 'text-rose-500 bg-rose-500/10' },
  { id: 'econ', name: 'Economics & Business', icon: IconCoin, color: 'text-amber-500 bg-amber-500/10' },
  { id: 'phys', name: 'Physics & Engineering', icon: IconAtom, color: 'text-indigo-500 bg-indigo-500/10' },
  { id: 'law', name: 'Law & Social Studies', icon: IconScale, color: 'text-teal-500 bg-teal-500/10' },
]

const QUICK_PROMPTS = [
  {
    title: 'Algorithm Complexity',
    prompt: 'Explain Time Complexity vs Space Complexity with Big-O notation and real code examples.',
    subject: 'Computer Science',
  },
  {
    title: 'Calculus Integration',
    prompt: 'How do I solve Integration by Parts? Give me a step-by-step example with formulas.',
    subject: 'Mathematics',
  },
  {
    title: 'Macroeconomics GDP',
    prompt: 'Explain the difference between Nominal GDP and Real GDP with an Ethiopian market example.',
    subject: 'Economics',
  },
  {
    title: 'Exam Prep Strategy',
    prompt: 'Generate a 5-step active recall study plan for an upcoming university midterm exam.',
    subject: 'Study Strategy',
  },
]

function parseInlineMarkdown(text) {
  if (!text) return null

  const inlineRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\$.*?\$)/g
  const tokens = text.split(inlineRegex)

  return tokens.map((token, i) => {
    if (!token) return null
    if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      return (
        <strong key={i} className="font-bold text-primary font-display">
          {token.slice(2, -2)}
        </strong>
      )
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length >= 2) {
      return (
        <em key={i} className="italic text-on-surface">
          {token.slice(1, -1)}
        </em>
      )
    }
    if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
      return (
        <code
          key={i}
          className="rounded-md bg-surface-container px-1.5 py-0.5 font-mono text-[11px] font-medium text-amber-500 dark:text-amber-400 border border-surface-variant/60"
        >
          {token.slice(1, -1)}
        </code>
      )
    }
    if (token.startsWith('$') && token.endsWith('$') && token.length >= 2) {
      return (
        <span
          key={i}
          className="inline-block font-mono text-[11px] px-1.5 py-0.5 bg-secondary-container/15 text-amber-600 dark:text-amber-300 rounded font-medium border border-secondary-container/20"
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
    <div className="my-3 overflow-hidden rounded-xl border border-surface-variant bg-surface-lowest shadow-xs">
      <div className="flex items-center justify-between border-b border-surface-variant bg-surface-low px-4 py-2 text-[11px] font-medium text-outline">
        <span className="font-mono uppercase tracking-wider">{lang || 'code'}</span>
        <button
          type="button"
          onClick={handleCopyCode}
          className="inline-flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer text-xs"
        >
          {copied ? (
            <>
              <IconCheck size={13} className="text-emerald-500" />
              <span className="text-emerald-500 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <IconCopy size={13} />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-on-surface scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function FormattedAiResponse({ content, isStreaming }) {
  if (!content) {
    return isStreaming ? (
      <span className="inline-block w-2 h-4 bg-primary dark:bg-secondary-fixed ml-1 animate-pulse align-middle rounded-xs" />
    ) : null
  }

  const lines = content.split('\n')
  const blocks = []
  let currentCodeBlock = null
  let currentList = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

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

    if (line.startsWith('> ')) {
      if (currentList) {
        blocks.push(currentList)
        currentList = null
      }
      blocks.push({ type: 'quote', text: line.slice(2) })
      continue
    }

    const bulletMatch = line.match(/^(\s*)[-*•]\s+(.*)$/)
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        if (currentList) blocks.push(currentList)
        currentList = { type: 'ul', items: [] }
      }
      currentList.items.push(bulletMatch[2])
      continue
    }

    const numberedMatch = line.match(/^(\s*)\d+\.\s+(.*)$/)
    if (numberedMatch) {
      if (!currentList || currentList.type !== 'ol') {
        if (currentList) blocks.push(currentList)
        currentList = { type: 'ol', items: [] }
      }
      currentList.items.push(numberedMatch[2])
      continue
    }

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
    <div className="space-y-2.5 text-sm leading-relaxed break-words">
      {blocks.map((block, idx) => {
        if (block.type === 'code') {
          return <CodeBlock key={idx} lang={block.lang} code={block.code} />
        }
        if (block.type === 'h1') {
          return (
            <h3 key={idx} className="font-display text-lg font-bold text-primary mt-3 mb-2 border-b border-surface-variant pb-1.5">
              {parseInlineMarkdown(block.text)}
            </h3>
          )
        }
        if (block.type === 'h2') {
          return (
            <h4 key={idx} className="font-display text-base font-bold text-primary mt-2.5 mb-1.5">
              {parseInlineMarkdown(block.text)}
            </h4>
          )
        }
        if (block.type === 'h3') {
          return (
            <h5 key={idx} className="font-display text-sm font-bold text-primary mt-2 mb-1">
              {parseInlineMarkdown(block.text)}
            </h5>
          )
        }
        if (block.type === 'quote') {
          return (
            <div key={idx} className="border-l-4 border-secondary-container bg-secondary-container/10 px-3.5 py-2 rounded-r-xl my-2 text-xs text-on-surface-variant italic">
              {parseInlineMarkdown(block.text)}
            </div>
          )
        }
        if (block.type === 'ul') {
          return (
            <ul key={idx} className="space-y-1.5 my-2 pl-2 list-none">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-on-surface">
                  <span className="inline-block size-2 rounded-full bg-secondary-container shrink-0 mt-2" />
                  <span className="flex-1">{parseInlineMarkdown(item)}</span>
                </li>
              ))}
            </ul>
          )
        }
        if (block.type === 'ol') {
          return (
            <ol key={idx} className="space-y-1.5 my-2 pl-1 list-none">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-on-surface">
                  <span className="font-bold text-primary shrink-0 text-xs min-w-[18px]">
                    {i + 1}.
                  </span>
                  <span className="flex-1">{parseInlineMarkdown(item)}</span>
                </li>
              ))}
            </ol>
          )
        }
        if (block.type === 'spacer') {
          return <div key={idx} className="h-1" />
        }
        return (
          <p key={idx} className="text-on-surface leading-relaxed">
            {parseInlineMarkdown(block.text)}
            {idx === blocks.length - 1 && isStreaming && (
              <span className="inline-block w-2 h-4 bg-secondary-container ml-1 animate-pulse align-middle rounded-xs" />
            )}
          </p>
        )
      })}
    </div>
  )
}

export default function AiChatScreen({ user, onLogout, onNavigate }) {
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      role: 'ai',
      content:
        "Selam! I'm **Felat (ፈላጥ)**, your CampusHustle AI Study Assistant.\n\nI can help you breakdown complex university topics, prepare step-by-step exam solutions, explain course concepts, and write code snippets.\n\nChoose a topic below or type any question to begin!",
      timestamp: 'Just now',
    },
  ])
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const idRef = useRef(1)
  const streamingTimerRef = useRef(null)

  useEffect(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  useEffect(() => {
    return () => {
      if (streamingTimerRef.current) clearInterval(streamingTimerRef.current)
    }
  }, [])

  const handleSend = useCallback(
    async (textToSend) => {
      const content = (textToSend || draft).trim()
      if (!content || isTyping) return

      const userMsgId = `u-${idRef.current++}`
      const userMessage = {
        id: userMsgId,
        role: 'user',
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, userMessage])
      setDraft('')
      setIsTyping(true)

      let fullReply
      try {
        const questionPayload = selectedSubject
          ? `[Subject: ${selectedSubject}] ${content}`
          : content
        const res = await askFelatAi({ question: questionPayload })
        fullReply =
          res?.answer ||
          "I'm Felat (ፈላጥ), your AI study companion. How can I help you master this concept?"
      } catch (err) {
        fullReply =
          err.message ||
          'Unable to reach Felat AI assistant. Please check your connection and try again.'
      }

      const aiMsgId = `ai-${idRef.current++}`
      const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })

      setMessages((prev) => [
        ...prev,
        { id: aiMsgId, role: 'ai', content: '', isStreaming: true, timestamp },
      ])
      setIsTyping(false)

      let charIndex = 0
      const chunkSize = 5
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
      }, 15)
    },
    [draft, isTyping, selectedSubject]
  )

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const handleClearChat = () => {
    if (streamingTimerRef.current) {
      clearInterval(streamingTimerRef.current)
      streamingTimerRef.current = null
    }
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'ai',
        content:
          "Conversation reset! I'm ready for your next study topic or exam question.",
        timestamp: 'Just now',
      },
    ])
    setDraft('')
    setIsTyping(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <AppNavbar user={user} activeView="assistant" onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
        {/* ── Left Sidebar: Study Topics & Presets ── */}
        <aside className="hidden lg:flex w-80 flex-col border-r border-surface-variant bg-surface-lowest p-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-variant mb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm">
                <IconSparkles size={18} />
              </div>
              <div>
                <h2 className="font-display text-sm font-bold text-primary">Felat (ፈላጥ) AI</h2>
                <p className="text-[10px] text-outline">Ethiopia's Academic Assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearChat}
              title="Reset session"
              className="inline-flex size-8 items-center justify-center rounded-lg border border-surface-variant text-outline hover:text-error hover:border-error transition-colors cursor-pointer"
            >
              <IconTrash size={16} />
            </button>
          </div>

          {/* Subject Filter Tag Chips */}
          <div className="mb-4">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
              Subject Focus
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {SUBJECT_PRESETS.map((sub) => {
                const isSelected = selectedSubject === sub.name
                const Icon = sub.icon
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubject(isSelected ? null : sub.name)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'border border-surface-variant bg-surface-low text-on-surface hover:border-primary/50'
                    }`}
                  >
                    <Icon size={14} className={isSelected ? 'text-on-primary' : sub.color.split(' ')[0]} />
                    <span>{sub.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="flex-1 overflow-y-auto pr-1">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2.5">
              Recommended Starters
            </h3>
            <div className="space-y-2">
              {QUICK_PROMPTS.map((qp, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(qp.prompt)}
                  className="w-full text-left rounded-xl border border-surface-variant bg-surface-low p-3 hover:bg-surface-container hover:border-primary/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-primary group-hover:underline">
                      {qp.title}
                    </span>
                    <span className="text-[10px] text-outline px-1.5 py-0.5 rounded bg-surface border border-surface-variant/50">
                      {qp.subject}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2">
                    {qp.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-variant text-[11px] text-outline flex items-center justify-between">
            <span>Powered by Gemini 1.5</span>
            <span className="flex items-center gap-1 text-emerald-500 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
        </aside>

        {/* ── Main Chat Area ── */}
        <section className="flex-1 flex flex-col bg-surface-low overflow-hidden">
          {/* Header */}
          <header className="h-14 shrink-0 border-b border-surface-variant bg-surface-lowest px-4 sm:px-6 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-on-primary">
                <IconBrain size={18} />
              </div>
              <div>
                <h1 className="font-display text-sm sm:text-base font-bold text-on-surface flex items-center gap-2">
                  <span>Felat (ፈላጥ) AI Study Workspace</span>
                  {selectedSubject && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                      {selectedSubject}
                    </span>
                  )}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearChat}
                className="lg:hidden inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-surface-variant text-outline hover:text-error cursor-pointer"
              >
                <IconRefresh size={14} />
                <span>Reset</span>
              </button>
            </div>
          </header>

          {/* Conversation Thread */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4 max-w-4xl mx-auto w-full">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`relative max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-on-primary rounded-br-xs'
                      : 'bg-surface-lowest border border-surface-variant text-on-surface rounded-bl-xs'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  ) : (
                    <FormattedAiResponse content={msg.content} isStreaming={msg.isStreaming} />
                  )}

                  {msg.role === 'ai' && !msg.isStreaming && (
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-surface-variant/40 text-xs text-outline">
                      <span className="text-[11px]">{msg.timestamp}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-outline hover:text-primary transition-colors cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <IconCheck size={14} className="text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <IconCopy size={14} />
                            <span>Copy response</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 rounded-2xl bg-surface-lowest border border-surface-variant p-4 w-fit shadow-xs">
                <span className="size-2 rounded-full bg-primary animate-bounce" />
                <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-outline ml-1 font-medium">Felat is analyzing…</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Prompt Bar */}
          <div className="shrink-0 border-t border-surface-variant bg-surface-lowest p-3 sm:p-4">
            <div className="max-w-4xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="relative flex items-end gap-2 rounded-2xl border border-surface-variant bg-surface-low p-2 sm:p-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
              >
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Ask Felat anything about your courses, formulas, coding, or exams... (Enter to send)"
                  aria-label="Ask Felat AI"
                  className="max-h-40 w-full resize-none border-0 bg-transparent px-2 py-1.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-0"
                />

                <button
                  type="submit"
                  disabled={!draft.trim() || isTyping}
                  aria-label="Send query"
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-95 disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-outline disabled:opacity-50 cursor-pointer"
                >
                  <IconSend size={18} />
                </button>
              </form>
              <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-outline font-medium">
                <span>Press Enter ↵ to submit · Shift+Enter for new line</span>
                <span>CampusHustle AI Study Engine</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
