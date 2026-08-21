import { useState, useRef, useEffect, useCallback } from 'react'
import {
  IconSparkles,
  IconArrowUp,
  IconPlus,
  IconLayoutSidebar,
  IconMessage,
  IconCopy,
  IconCheck,
  IconRefresh,
  IconTrash,
  IconThumbUp,
  IconThumbDown,
  IconCode,
  IconCalculator,
  IconStethoscope,
  IconCoin,
  IconScale,
  IconAtom,
  IconPaperclip,
  IconPlayerStopFilled,
  IconFileText,
  IconX,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import { askFelatAi } from '../api/aiApi.js'
import { getCurrentUserProfile } from '../api/authApi.js'
import { loadSessionUser } from '../utils/session.js'

const SESSIONS_STORAGE_KEY = 'campus-hustle:ai-chat-sessions'
const MESSAGES_STORAGE_KEY_PREFIX = 'campus-hustle:ai-chat-messages:'

function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function loadStoredSessions() {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveStoredSessions(sessions) {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions))
  } catch {
    /* ignore quota errors */
  }
}

function loadStoredMessages(sessionId) {
  if (!sessionId) return []
  try {
    const raw = localStorage.getItem(`${MESSAGES_STORAGE_KEY_PREFIX}${sessionId}`)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveStoredMessages(sessionId, messages) {
  if (!sessionId) return
  try {
    const cleanMessages = messages.map((m) => ({
      ...m,
      isStreaming: false,
    }))
    localStorage.setItem(
      `${MESSAGES_STORAGE_KEY_PREFIX}${sessionId}`,
      JSON.stringify(cleanMessages)
    )
  } catch {
    /* ignore quota errors */
  }
}

function removeStoredSession(sessionId) {
  if (!sessionId) return
  try {
    localStorage.removeItem(`${MESSAGES_STORAGE_KEY_PREFIX}${sessionId}`)
  } catch {
    /* ignore quota errors */
  }
}

const SUBJECT_PRESETS = [
  { id: 'cs', name: 'Computer Science', icon: IconCode, color: 'text-sky-500 bg-sky-500/10' },
  { id: 'math', name: 'Mathematics', icon: IconCalculator, color: 'text-purple-500 bg-purple-500/10' },
  { id: 'med', name: 'Medicine & Health', icon: IconStethoscope, color: 'text-rose-500 bg-rose-500/10' },
  { id: 'econ', name: 'Economics & Business', icon: IconCoin, color: 'text-amber-500 bg-amber-500/10' },
  { id: 'phys', name: 'Physics & Engineering', icon: IconAtom, color: 'text-indigo-500 bg-indigo-500/10' },
  { id: 'law', name: 'Law & Social Studies', icon: IconScale, color: 'text-teal-500 bg-teal-500/10' },
]

function parseInlineMarkdown(text) {
  if (!text) return null

  const inlineRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\$.*?\$)/g
  const tokens = text.split(inlineRegex)

  return tokens.map((token, i) => {
    if (!token) return null
    if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      return (
        <strong key={i} className="font-bold text-on-surface">
          {token.slice(2, -2)}
        </strong>
      )
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length >= 2) {
      return (
        <em key={i} className="italic text-on-surface-variant">
          {token.slice(1, -1)}
        </em>
      )
    }
    if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
      return (
        <code
          key={i}
          className="rounded-md bg-surface-container px-1.5 py-0.5 font-mono text-[12px] font-medium text-amber-500 dark:text-amber-400 border border-surface-variant/60"
        >
          {token.slice(1, -1)}
        </code>
      )
    }
    if (token.startsWith('$') && token.endsWith('$') && token.length >= 2) {
      return (
        <span
          key={i}
          className="inline-block font-mono text-[12px] px-1.5 py-0.5 bg-secondary-container/15 text-amber-600 dark:text-amber-300 rounded font-medium border border-secondary-container/20"
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
    <div className="my-3.5 overflow-hidden rounded-xl border border-surface-variant bg-surface-lowest shadow-xs">
      <div className="flex items-center justify-between border-b border-surface-variant bg-surface-low px-4 py-1.5 text-[11px] font-mono text-outline">
        <span className="uppercase tracking-wider font-semibold">{lang || 'code'}</span>
        <button
          type="button"
          onClick={handleCopyCode}
          className="inline-flex items-center gap-1.5 hover:text-on-surface transition-colors cursor-pointer text-xs"
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
      <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse align-middle rounded-xs" />
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
    <div className="space-y-3 text-[14.5px] leading-relaxed break-words text-on-surface">
      {blocks.map((block, idx) => {
        if (block.type === 'code') {
          return <CodeBlock key={idx} lang={block.lang} code={block.code} />
        }
        if (block.type === 'h1') {
          return (
            <h3 key={idx} className="font-display text-lg font-bold text-primary mt-4 mb-2 border-b border-surface-variant/50 pb-1.5">
              {parseInlineMarkdown(block.text)}
            </h3>
          )
        }
        if (block.type === 'h2') {
          return (
            <h4 key={idx} className="font-display text-base font-bold text-primary mt-3.5 mb-1.5">
              {parseInlineMarkdown(block.text)}
            </h4>
          )
        }
        if (block.type === 'h3') {
          return (
            <h5 key={idx} className="font-display text-sm font-bold text-primary mt-2.5 mb-1">
              {parseInlineMarkdown(block.text)}
            </h5>
          )
        }
        if (block.type === 'quote') {
          return (
            <div key={idx} className="border-l-3 border-emerald-500 bg-emerald-500/10 px-3.5 py-2 rounded-r-xl my-2 text-xs text-on-surface-variant italic">
              {parseInlineMarkdown(block.text)}
            </div>
          )
        }
        if (block.type === 'ul') {
          return (
            <ul key={idx} className="space-y-1.5 my-2 pl-2 list-none">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="inline-block size-1.5 rounded-full bg-primary/80 shrink-0 mt-2" />
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
                <li key={i} className="flex items-start gap-2">
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
          <p key={idx} className="text-on-surface">
            {parseInlineMarkdown(block.text)}
            {idx === blocks.length - 1 && isStreaming && (
              <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse align-middle rounded-xs" />
            )}
          </p>
        )
      })}
    </div>
  )
}

export default function AiChatScreen({ user, onLogout, onNavigate }) {
  const [profile, setProfile] = useState(() => user || loadSessionUser())
  const [sessions, setSessions] = useState(() => loadStoredSessions())
  const [activeSessionId, setActiveSessionId] = useState(() => {
    const stored = loadStoredSessions()
    return stored.length > 0 ? stored[0].id : null
  })
  const [messages, setMessages] = useState(() => {
    const stored = loadStoredSessions()
    return stored.length > 0 ? loadStoredMessages(stored[0].id) : []
  })

  const [draft, setDraft] = useState('')
  const [attachedFile, setAttachedFile] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [likedMap, setLikedMap] = useState({})
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const streamingTimerRef = useRef(null)
  const currentAiMsgIdRef = useRef(null)
  const currentSessionIdRef = useRef(null)

  // Ensure real user from database is loaded into profile if not already available
  useEffect(() => {
    if (!user?.name && !profile?.name) {
      let isMounted = true
      getCurrentUserProfile()
        .then((res) => {
          if (isMounted && res?.user) {
            setProfile(res.user)
          }
        })
        .catch(() => {})
      return () => {
        isMounted = false
      }
    }
  }, [user, profile])

  // Sync sessions to localStorage
  useEffect(() => {
    saveStoredSessions(sessions)
  }, [sessions])

  // Sync active messages to localStorage
  useEffect(() => {
    if (activeSessionId && messages.length > 0) {
      saveStoredMessages(activeSessionId, messages)
    }
  }, [activeSessionId, messages])

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

  const handleSelectSession = (sessId) => {
    if (streamingTimerRef.current) {
      clearInterval(streamingTimerRef.current)
      streamingTimerRef.current = null
    }
    setActiveSessionId(sessId)
    setMessages(loadStoredMessages(sessId))
    setDraft('')
    setAttachedFile(null)
    setIsTyping(false)
  }

  const handleDeleteSession = (e, sessId) => {
    e?.stopPropagation?.()
    removeStoredSession(sessId)
    const remaining = sessions.filter((s) => s.id !== sessId)
    setSessions(remaining)
    saveStoredSessions(remaining)

    if (activeSessionId === sessId) {
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id)
        setMessages(loadStoredMessages(remaining[0].id))
      } else {
        setActiveSessionId(null)
        setMessages([])
      }
    }
  }

  const handleClearAllSessions = () => {
    if (streamingTimerRef.current) {
      clearInterval(streamingTimerRef.current)
      streamingTimerRef.current = null
    }
    sessions.forEach((s) => removeStoredSession(s.id))
    setSessions([])
    saveStoredSessions([])
    setActiveSessionId(null)
    setMessages([])
    setDraft('')
    setAttachedFile(null)
    setIsTyping(false)
  }

  const handleStopGenerating = () => {
    if (streamingTimerRef.current) {
      clearInterval(streamingTimerRef.current)
      streamingTimerRef.current = null
    }
    setIsTyping(false)

    setMessages((prev) => {
      const updated = prev.map((msg) =>
        msg.isStreaming ? { ...msg, isStreaming: false } : msg
      )
      if (currentSessionIdRef.current) {
        saveStoredMessages(currentSessionIdRef.current, updated)
      }
      return updated
    })
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    let previewUrl = null
    if (file.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(file)
    }

    setAttachedFile({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      previewUrl,
    })

    e.target.value = ''
  }

  const handleRemoveAttachment = () => {
    setAttachedFile(null)
  }

  const handleSend = useCallback(
    async (textToSend) => {
      const content = (textToSend || draft).trim()
      const currentAttachment = attachedFile
      if ((!content && !currentAttachment) || isTyping) return

      const finalPromptText = content || (currentAttachment ? `Analyze attached document: ${currentAttachment.name}` : '')

      let currentSessionId = activeSessionId

      // Create new session if none is active or current is empty
      if (!currentSessionId || messages.length === 0) {
        currentSessionId = `sess-${Date.now()}`
        const titleSnippet = finalPromptText.slice(0, 28) + (finalPromptText.length > 28 ? '...' : '')
        const newSess = {
          id: currentSessionId,
          title: titleSnippet,
          date: 'Today',
          createdAt: Date.now(),
        }
        setSessions((prev) => [newSess, ...prev.filter((s) => s.id !== currentSessionId)])
        setActiveSessionId(currentSessionId)
      }

      currentSessionIdRef.current = currentSessionId

      const userMsgId = `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const userMessage = {
        id: userMsgId,
        role: 'user',
        content: finalPromptText,
        attachment: currentAttachment
          ? {
              name: currentAttachment.name,
              size: formatFileSize(currentAttachment.size),
              type: currentAttachment.type,
              previewUrl: currentAttachment.previewUrl,
            }
          : null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      const updatedMessagesWithUser = [...messages, userMessage]
      setMessages(updatedMessagesWithUser)
      saveStoredMessages(currentSessionId, updatedMessagesWithUser)
      setDraft('')
      setAttachedFile(null)
      setIsTyping(true)

      let fullReply
      try {
        const questionPayload = selectedSubject
          ? `[Subject: ${selectedSubject}] ${finalPromptText}`
          : finalPromptText

        const res = await askFelatAi({
          question: questionPayload,
          file: currentAttachment?.file,
        })
        fullReply =
          res?.answer ||
          "I'm Felat (ፈላጥ), your AI study companion. How can I help you master this concept?"
      } catch (err) {
        fullReply =
          err.message ||
          'Unable to reach Felat AI assistant. Please check your connection and try again.'
      }

      const aiMsgId = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      currentAiMsgIdRef.current = aiMsgId

      const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })

      const streamingAiMessage = {
        id: aiMsgId,
        role: 'ai',
        content: '',
        isStreaming: true,
        timestamp,
      }

      setMessages((prev) => [...prev, streamingAiMessage])

      let charIndex = 0
      const chunkSize = 6
      if (streamingTimerRef.current) clearInterval(streamingTimerRef.current)

      streamingTimerRef.current = setInterval(() => {
        charIndex += chunkSize
        if (charIndex >= fullReply.length) {
          clearInterval(streamingTimerRef.current)
          streamingTimerRef.current = null
          setIsTyping(false)
          setMessages((prev) => {
            const final = prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, content: fullReply, isStreaming: false } : msg
            )
            saveStoredMessages(currentSessionId, final)
            return final
          })
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
    [draft, attachedFile, isTyping, selectedSubject, messages, activeSessionId]
  )

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const handleToggleLike = (id, type) => {
    setLikedMap((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }))
  }

  const handleNewChat = () => {
    if (streamingTimerRef.current) {
      clearInterval(streamingTimerRef.current)
      streamingTimerRef.current = null
    }
    setActiveSessionId(null)
    setMessages([])
    setDraft('')
    setAttachedFile(null)
    setIsTyping(false)
  }

  const hasMessages = messages.length > 0
  const isGenerating = isTyping || messages.some((m) => m.isStreaming)
  const displayName = profile?.name || user?.name || 'Student'
  const userInitial = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex h-screen max-h-screen w-screen overflow-hidden flex-col bg-surface font-body text-on-surface">
      <div className="shrink-0 z-50">
        <AppNavbar user={user || profile} activeView="assistant" onNavigate={onNavigate} onLogout={onLogout} />
      </div>

      <div className="relative flex flex-1 min-h-0 w-full overflow-hidden">
        {/* ── Mobile Sidebar Backdrop (Smooth Fade) ── */}
        <div
          className={`absolute inset-0 z-30 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out md:hidden ${
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />

        {/* ── Responsive Collapsible ChatGPT-Style Sidebar ── */}
        <aside
          className={`absolute md:relative inset-y-0 left-0 z-40 md:z-20 h-full flex flex-col border-r border-surface-variant bg-surface-lowest overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:transition-[width,transform] ${
            sidebarOpen
              ? 'w-[85vw] max-w-[320px] md:w-64 lg:w-72 translate-x-0 shadow-2xl md:shadow-none'
              : 'w-[85vw] max-w-[320px] md:w-0 -translate-x-full md:-translate-x-full md:border-r-0'
          }`}
        >
          {/* Inner fixed-width wrapper to prevent any reflow / uncoordinated jitter during sliding */}
          <div className="w-[85vw] max-w-[320px] md:w-64 lg:w-72 h-full flex flex-col shrink-0 select-none">
            {/* New Chat Button & Mobile Close Header */}
            <div className="p-3 shrink-0 border-b border-surface-variant/60 flex items-center gap-2 bg-surface-lowest">
              <button
                type="button"
                onClick={() => {
                  handleNewChat()
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    setSidebarOpen(false)
                  }
                }}
                className="flex-1 flex items-center justify-between gap-2 rounded-xl border border-surface-variant bg-surface-low px-3.5 py-2.5 text-xs font-semibold text-on-surface hover:bg-surface-high hover:border-primary/50 transition-all cursor-pointer shadow-xs group"
              >
                <div className="flex items-center gap-2">
                  <IconPlus size={16} className="text-primary group-hover:scale-110 transition-transform" />
                  <span>New study chat</span>
                </div>
                <span className="text-[10px] font-mono text-outline bg-surface-container px-1.5 py-0.5 rounded border border-surface-variant/50">
                  ⌘K
                </span>
              </button>

              {/* Mobile-Only Close Sidebar Button */}
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className="md:hidden inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-surface-variant bg-surface-low text-outline hover:text-on-surface hover:bg-surface-high transition-colors cursor-pointer"
              >
                <IconX size={17} />
              </button>
            </div>

            {/* Subject Focus Badges */}
            <div className="p-3 shrink-0 border-b border-surface-variant/50">
              <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">
                Academic Focus
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUBJECT_PRESETS.map((sub) => {
                  const isSelected = selectedSubject === sub.name
                  const Icon = sub.icon
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        setSelectedSubject(isSelected ? null : sub.name)
                        if (typeof window !== 'undefined' && window.innerWidth < 768) {
                          setSidebarOpen(false)
                        }
                      }}
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'border border-surface-variant/70 bg-surface-low text-on-surface hover:border-primary/50 hover:bg-surface-high'
                      }`}
                    >
                      <Icon size={12} className={isSelected ? 'text-on-primary' : sub.color.split(' ')[0]} />
                      <span>{sub.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Chat History List (Only this section scrolls within sidebar) */}
            <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1 scrollbar-thin">
              <div className="flex items-center justify-between px-2 pt-2 pb-1">
                <p className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  Recent Chats
                </p>
                {sessions.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllSessions}
                    className="text-[10px] text-outline hover:text-error transition-colors cursor-pointer"
                    title="Clear all recorded chats"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {sessions.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-outline">
                  No recent chats yet. Ask a question to start.
                </div>
              ) : (
                sessions.map((sess) => (
                  <div
                    key={sess.id}
                    onClick={() => {
                      handleSelectSession(sess.id)
                      if (typeof window !== 'undefined' && window.innerWidth < 768) {
                        setSidebarOpen(false)
                      }
                    }}
                    className={`w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs text-left transition-colors cursor-pointer group ${
                      activeSessionId === sess.id
                        ? 'bg-surface-high font-semibold text-primary'
                        : 'text-on-surface-variant hover:bg-surface-low hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                      <IconMessage size={14} className="shrink-0 text-outline" />
                      <span className="truncate">{sess.title}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(e, sess.id)}
                      title="Delete chat"
                      className="opacity-0 group-hover:opacity-100 size-5 inline-flex items-center justify-center rounded hover:bg-surface-high hover:text-error transition-all cursor-pointer text-outline"
                    >
                      <IconTrash size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Fixed User Profile Footer */}
            <div className="p-3 shrink-0 border-t border-surface-variant/60 flex items-center justify-between bg-surface-lowest">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {userInitial}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-on-surface truncate">
                    {displayName}
                  </p>
                  <p className="text-[10px] text-outline flex items-center gap-1">
                    <IconSparkles size={10} className="text-emerald-500" />
                    <span>Felat Plus • Free</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleNewChat()
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    setSidebarOpen(false)
                  }
                }}
                title="New study chat"
                className="inline-flex size-7 items-center justify-center rounded-lg text-outline hover:text-primary hover:bg-surface-high transition-colors cursor-pointer"
              >
                <IconPlus size={14} />
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main Fixed Workspace Area ── */}
        <section className="flex-1 min-w-0 min-h-0 flex flex-col bg-surface-lowest overflow-hidden relative">
          {/* Fixed Top Floating Model Header */}
          <header className="h-14 shrink-0 border-b border-surface-variant/50 px-3 sm:px-4 flex items-center justify-between bg-surface-lowest/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors cursor-pointer border ${
                  sidebarOpen
                    ? 'border-primary/40 bg-surface-high text-primary'
                    : 'border-surface-variant/70 text-outline hover:bg-surface-high hover:text-on-surface'
                }`}
              >
                <IconLayoutSidebar size={18} />
              </button>

              {/* Model Switcher Pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-surface-low text-xs font-bold text-on-surface shadow-xs border border-surface-variant/60 cursor-default truncate">
                <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="hidden sm:inline">Felat (ፈላጥ) AI Study Workspace</span>
                <span className="sm:hidden">Felat (ፈላጥ) AI</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-mono shrink-0">
                  4o
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {selectedSubject && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-container text-on-primary-container">
                  <span>{selectedSubject}</span>
                </span>
              )}
              <button
                type="button"
                onClick={handleNewChat}
                aria-label="Reset session"
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-lg border border-surface-variant text-outline hover:text-primary hover:border-primary transition-colors cursor-pointer"
              >
                <IconRefresh size={13} />
                <span>New</span>
              </button>
            </div>
          </header>

          {/* Conversation Stream (Only this central area scrolls when text grows) */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-3xl mx-auto w-full flex flex-col scrollbar-thin">
            {/* Minimalist ChatGPT Hero Greeting */}
            {!hasMessages && (
              <div className="my-auto py-16 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-emerald-600 text-white shadow-lg mb-4">
                  <IconSparkles size={28} />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
                  Welcome, {displayName}!
                </h2>
                <p className="mt-2 text-sm text-outline">
                  What would you like to study today?
                </p>
              </div>
            )}

            {/* Render Chat Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* AI Avatar on left */}
                {msg.role === 'ai' && (
                  <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <IconSparkles size={16} />
                  </div>
                )}

                <div
                  className={`relative ${
                    msg.role === 'user'
                      ? 'max-w-[85%] sm:max-w-[75%] rounded-3xl bg-surface-high px-5 py-3 text-on-surface shadow-xs'
                      : 'flex-1 max-w-full'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <div>
                      {msg.attachment && (
                        <div className="mb-2.5 flex items-center gap-2.5 rounded-2xl bg-surface-lowest/90 p-2.5 border border-surface-variant/70 w-fit max-w-full">
                          {msg.attachment.previewUrl && msg.attachment.type?.startsWith('image/') ? (
                            <img
                              src={msg.attachment.previewUrl}
                              alt={msg.attachment.name}
                              className="size-11 rounded-xl object-cover border border-surface-variant shrink-0"
                            />
                          ) : (
                            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                              <IconFileText size={18} />
                            </div>
                          )}
                          <div className="flex flex-col min-w-0 pr-1">
                            <span className="text-xs font-semibold text-on-surface truncate max-w-[180px] sm:max-w-[240px]">
                              {msg.attachment.name}
                            </span>
                            {msg.attachment.size && (
                              <span className="text-[10px] text-outline">
                                {msg.attachment.size}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  ) : (
                    <div>
                      <FormattedAiResponse content={msg.content} isStreaming={msg.isStreaming} />

                      {/* ChatGPT Style Bottom Action Bar */}
                      {!msg.isStreaming && (
                        <div className="mt-3 flex items-center gap-1 text-outline">
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.content)}
                            title="Copy response"
                            className="inline-flex size-7 items-center justify-center rounded-md hover:bg-surface-low hover:text-on-surface transition-colors cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <IconCheck size={14} className="text-emerald-500" />
                            ) : (
                              <IconCopy size={14} />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleLike(msg.id, 'up')}
                            title="Good response"
                            className={`inline-flex size-7 items-center justify-center rounded-md transition-colors cursor-pointer ${
                              likedMap[msg.id] === 'up'
                                ? 'text-emerald-500'
                                : 'hover:bg-surface-low hover:text-on-surface'
                            }`}
                          >
                            <IconThumbUp size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleLike(msg.id, 'down')}
                            title="Bad response"
                            className={`inline-flex size-7 items-center justify-center rounded-md transition-colors cursor-pointer ${
                              likedMap[msg.id] === 'down'
                                ? 'text-rose-500'
                                : 'hover:bg-surface-low hover:text-on-surface'
                            }`}
                          >
                            <IconThumbDown size={14} />
                          </button>

                          <span className="text-[10px] ml-2 text-outline/60 font-mono">
                            {msg.timestamp}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Avatar on right */}
                {msg.role === 'user' && (
                  <div className="size-8 rounded-full bg-surface-high text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-xs border border-surface-variant/50">
                    {userInitial}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <IconSparkles size={16} />
                </div>
                <div className="flex items-center gap-1.5 py-2">
                  <span className="size-2 rounded-full bg-primary/80 animate-bounce" />
                  <span className="size-2 rounded-full bg-primary/80 animate-bounce [animation-delay:0.2s]" />
                  <span className="size-2 rounded-full bg-primary/80 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Fixed Bottom Prompt Bar with Dynamic Stop Button & Attachment ── */}
          <div className="shrink-0 p-4 sm:pb-6 bg-gradient-to-t from-surface-lowest via-surface-lowest to-transparent z-10">
            <div className="max-w-3xl mx-auto">
              {/* Hidden file input for attachment */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf,text/plain,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Upload note or image"
              />

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="relative flex flex-col rounded-3xl border border-surface-variant/80 bg-surface-low p-2 sm:p-2.5 shadow-level-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
              >
                {/* Active Attached File Pill */}
                {attachedFile && (
                  <div className="mb-2 ml-1 flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-surface-lowest border border-surface-variant/80 w-fit max-w-full animate-in fade-in zoom-in-95 duration-150">
                    {attachedFile.previewUrl && attachedFile.type?.startsWith('image/') ? (
                      <img
                        src={attachedFile.previewUrl}
                        alt={attachedFile.name}
                        className="size-9 rounded-xl object-cover border border-surface-variant shrink-0"
                      />
                    ) : (
                      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                        <IconFileText size={18} />
                      </div>
                    )}
                    <div className="flex flex-col min-w-0 pr-1">
                      <span className="text-xs font-semibold text-on-surface truncate max-w-[180px] sm:max-w-[260px]">
                        {attachedFile.name}
                      </span>
                      <span className="text-[10px] text-outline">
                        {formatFileSize(attachedFile.size)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveAttachment}
                      aria-label="Remove attached file"
                      title="Remove attached file"
                      className="size-6 inline-flex items-center justify-center rounded-full text-outline hover:text-error hover:bg-surface-high transition-colors cursor-pointer ml-1"
                    >
                      <IconX size={14} />
                    </button>
                  </div>
                )}

                <div className="flex items-end gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach course note or image"
                    aria-label="Attach course note or image"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-outline hover:text-on-surface hover:bg-surface-high transition-colors cursor-pointer"
                  >
                    <IconPaperclip size={18} />
                  </button>

                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        if (!isGenerating) {
                          handleSend()
                        }
                      }
                    }}
                    placeholder="Ask Felat anything about your courses, formulas, coding, or exams..."
                    aria-label="Ask Felat anything"
                    className="max-h-48 w-full resize-none border-0 bg-transparent px-2 py-2 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-0"
                  />

                  {isGenerating ? (
                    <button
                      type="button"
                      onClick={handleStopGenerating}
                      aria-label="Stop generating"
                      title="Stop generating"
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                    >
                      <IconPlayerStopFilled size={14} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!draft.trim() && !attachedFile}
                      aria-label="Send query"
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm hover:bg-primary-container active:scale-95 disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-outline disabled:opacity-40 cursor-pointer transition-all"
                    >
                      <IconArrowUp size={18} stroke={2.5} />
                    </button>
                  )}
                </div>
              </form>

              <p className="mt-2 text-center text-[11px] text-outline">
                Felat can make mistakes. Verify critical academic facts with your course syllabus and instructor.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
