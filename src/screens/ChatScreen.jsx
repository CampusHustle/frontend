import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import {
  IconSend,
  IconPaperclip,
  IconWifi,
  IconWifiOff,
  IconLoader2,
  IconAddressBook,
  IconMail,
  IconPhone,
  IconUser,
  IconArrowLeft,
  IconSearch,
  IconMessages,
  IconUserCheck,
  IconChevronRight,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import ConsentModal from '../components/ConsentModal.jsx'
import { useSocket } from '../hooks/useSocket.js'
import { getTutorById } from '../api/tutorApi.js'
import { getConversations, getConversationMessages } from '../api/chatApi.js'
import { MOCK_PEER, INITIAL_MESSAGES } from '../api/mockChatApi.js'
import { sanitizeMessage, sanitizeDisplayText, MAX_MESSAGE_LENGTH } from '../utils/sanitize.js'

const STATUS_CONFIG = {
  connecting: {
    label: 'Connecting…',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    Icon: IconLoader2,
    iconClass: 'animate-spin',
  },
  connected: {
    label: 'Online',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    Icon: IconWifi,
    iconClass: '',
  },
  disconnected: {
    label: 'Offline',
    badgeClass: 'bg-surface-container text-outline border border-outline-variant/30',
    Icon: IconWifiOff,
    iconClass: '',
  },
}

function ConnectionStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.disconnected
  const { Icon, label, badgeClass, iconClass } = cfg
  return (
    <span
      role="status"
      aria-label={`Socket status: ${label}`}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeClass}`}
    >
      <Icon size={12} aria-hidden="true" className={iconClass} />
      {label}
    </span>
  )
}

function PeerAvatar({ peer, size = 'md' }) {
  const dim = size === 'sm' ? 'size-8' : size === 'lg' ? 'size-11' : 'size-10'
  const text = size === 'sm' ? 'text-xs' : 'text-sm'
  const initials = (peer?.name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  if (peer?.profilePicUrl) {
    return (
      <img
        src={peer.profilePicUrl}
        alt={`${peer.name || 'User'} avatar`}
        className={`${dim} shrink-0 rounded-full border-2 border-surface object-cover shadow-sm`}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`${dim} shrink-0 rounded-full border-2 border-surface bg-primary-container ${text} font-bold text-on-primary-container flex items-center justify-center shadow-sm`}
    >
      {initials || <IconUser size={16} />}
    </div>
  )
}

function MessageBubble({ msg, peer, isMe }) {
  const timeStr = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className={`flex items-end gap-2.5 ${isMe ? 'flex-row-reverse self-end' : 'flex-row self-start'} max-w-[85%] sm:max-w-[75%]`}
    >
      {!isMe && <PeerAvatar peer={peer} size="sm" />}
      <div className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
        <div
          className={
            isMe
              ? 'rounded-2xl rounded-br-xs bg-primary px-4 py-2.5 text-sm leading-relaxed text-on-primary shadow-level-1'
              : 'rounded-2xl rounded-bl-xs border border-surface-variant bg-surface px-4 py-2.5 text-sm leading-relaxed text-on-surface shadow-level-1'
          }
        >
          {msg.content || msg.text}
        </div>
        <span className="px-1 text-[10px] font-medium text-outline">{timeStr}</span>
      </div>
    </div>
  )
}

function ContactCard({ contact, isMe }) {
  return (
    <div
      aria-label="Shared contact information"
      className={`flex max-w-[85%] sm:max-w-[75%] flex-col gap-1 ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
    >
      <div className="w-full rounded-2xl border border-secondary-container/40 bg-secondary-container/10 p-4 shadow-level-1 backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-2 border-b border-secondary-container/20 pb-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-secondary-container/30 text-secondary">
            <IconAddressBook size={18} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-secondary">
              Verified Contact Shared
            </p>
            <p className="text-[11px] text-on-surface-variant">
              {isMe ? 'You shared your contact details' : `${contact.name} shared their contact details`}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <IconUser size={15} aria-hidden="true" className="shrink-0 text-on-surface-variant" />
            <span className="text-sm font-semibold text-on-surface">{contact.name}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <IconMail size={15} aria-hidden="true" className="shrink-0 text-on-surface-variant" />
            <a
              href={`mailto:${contact.email}`}
              className="text-sm font-medium text-primary underline-offset-2 hover:underline"
            >
              {contact.email}
            </a>
          </div>
          {contact.phone && (
            <div className="flex items-center gap-2.5">
              <IconPhone size={15} aria-hidden="true" className="shrink-0 text-on-surface-variant" />
              <a
                href={`tel:${contact.phone}`}
                className="text-sm font-medium text-primary underline-offset-2 hover:underline"
              >
                {contact.phone}
              </a>
            </div>
          )}
        </div>
      </div>
      <span className="px-1 text-[10px] text-outline">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}

function ChatThread({ messages, peer, currentUserId }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-container/40 text-primary">
          <IconMessages size={28} />
        </div>
        <h3 className="font-display text-lg font-bold text-on-surface">No messages yet</h3>
        <p className="max-w-xs text-xs text-on-surface-variant">
          Send a greeting or ask a question to start your peer study conversation!
        </p>
      </div>
    )
  }

  return (
    <div
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      aria-relevant="additions"
      className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-6"
    >
      <div className="flex justify-center my-2">
        <span className="rounded-full border border-surface-variant bg-surface px-3 py-0.5 text-[11px] font-medium text-outline shadow-sm">
          Encrypted Peer Session
        </span>
      </div>

      {messages.map((msg, index) => {
        const isMe = msg.senderId === currentUserId || msg.sender === 'me'
        if (msg.type === 'contact' || msg.contact) {
          return (
            <ContactCard
              key={msg._id || msg.id || index}
              contact={msg.contact}
              isMe={isMe}
            />
          )
        }
        return (
          <MessageBubble
            key={msg._id || msg.id || index}
            msg={msg}
            peer={peer}
            isMe={isMe}
          />
        )
      })}

      <div ref={bottomRef} />
    </div>
  )
}

function MessageInput({ onSend, onShareContact, disabled }) {
  const [draft, setDraft] = useState('')
  const textareaRef = useRef(null)

  function handleSend() {
    const text = sanitizeMessage(draft)
    if (!text || disabled) return
    onSend(text)
    setDraft('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput(e) {
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
    setDraft(el.value)
  }

  const remaining = MAX_MESSAGE_LENGTH - draft.length
  const nearLimit = remaining <= 100

  return (
    <div className="shrink-0 border-t border-surface-variant bg-surface-lowest p-3 sm:p-4">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-2.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onShareContact}
            className="inline-flex items-center gap-1.5 rounded-full border border-secondary-container/60 bg-secondary-container/10 px-3 py-1 text-xs font-semibold text-secondary transition-all hover:bg-secondary-container/20 active:scale-95 cursor-pointer"
          >
            <IconAddressBook size={14} aria-hidden="true" />
            Share contact info
          </button>
          <span className="text-[11px] text-outline font-medium">Press Enter ↵ to send</span>
        </div>

        <form
          aria-label="Send a message"
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="relative flex items-end gap-2 rounded-2xl border border-surface-variant bg-surface-low p-2 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        >
          <button
            type="button"
            aria-label="Add attachment"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary cursor-pointer"
          >
            <IconPaperclip size={18} aria-hidden="true" />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={draft}
            disabled={disabled}
            maxLength={MAX_MESSAGE_LENGTH}
            onInput={handleInput}
            onKeyDown={handleKey}
            placeholder={disabled ? 'Select a conversation to type...' : 'Type a message…'}
            aria-label="Message input"
            className="max-h-36 w-full resize-none border-0 bg-transparent px-2 py-2 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-0"
          />

          <button
            type="submit"
            aria-label="Send message"
            disabled={!draft.trim() || disabled}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-95 disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-outline disabled:opacity-50 cursor-pointer"
          >
            <IconSend size={16} aria-hidden="true" />
          </button>
        </form>

        {nearLimit && (
          <p className="mt-1 text-right text-[10px] text-error font-medium">
            {remaining} characters remaining
          </p>
        )}
      </div>
    </div>
  )
}

export default function ChatScreen({ user, onLogout, onNavigate }) {
  const { id: peerIdParam } = useParams()
  const { socket, status } = useSocket()
  const [conversations, setConversations] = useState([])
  const [activePeer, setActivePeer] = useState(() => ({
    _id: peerIdParam || MOCK_PEER?.id || 'u-sarah',
    name: MOCK_PEER?.name || 'Sarah Johnson',
    department: MOCK_PEER?.department || 'Computer Science',
  }))
  const [messages, setMessages] = useState(() => (Array.isArray(INITIAL_MESSAGES) ? INITIAL_MESSAGES : []))
  const [searchQuery, setSearchQuery] = useState('')
  const [consentOpen, setConsentOpen] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)

  const currentUserId = user?._id || user?.id || 'me'

  // Load conversation inbox on mount
  useEffect(() => {
    let isMounted = true
    getConversations()
      .then((res) => {
        if (isMounted && Array.isArray(res?.conversations)) {
          setConversations(res.conversations)
          if (!peerIdParam && res.conversations.length > 0 && res.conversations[0].peer) {
            setActivePeer(res.conversations[0].peer)
          }
        }
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [peerIdParam])

  // If peerIdParam is provided in URL, load that peer and set active
  useEffect(() => {
    if (!peerIdParam) return
    let isMounted = true

    getTutorById(peerIdParam)
      .then((res) => {
        if (isMounted && res?.user) {
          const loadedPeer = {
            ...res.user,
            _id: res.user._id || res.user.id || peerIdParam,
          }
          setActivePeer(loadedPeer)
        }
      })
      .catch(() => {
        if (isMounted) {
          setActivePeer({
            _id: peerIdParam,
            name: 'Peer Student',
            department: 'Academic Contact',
          })
        }
      })
      .catch(() => { })

    return () => {
      isMounted = false
    }
  }, [peerIdParam])

  // Derive conversation ID between current user and active peer
  const activeConversationId =
    currentUserId && activePeer?._id
      ? [currentUserId, activePeer._id].sort().join('_')
      : 'conversation-default'

  useEffect(() => {
    if (!activeConversationId) return
    let isMounted = true

    if (socket && socket.connected) {
      socket.emit('join_conversation', { conversationId: activeConversationId })
    }

    async function loadMessages() {
      try {
        const res = await getConversationMessages(activeConversationId)
        if (isMounted && Array.isArray(res?.messages) && res.messages.length > 0) {
          setMessages(res.messages)
        }
      } catch {
        // Keep existing messages
      } finally {
        if (isMounted) {
          setIsLoadingMessages(false)
        }
      }
    }

    loadMessages()

    return () => {
      isMounted = false
    }
  }, [activeConversationId, socket])

  useEffect(() => {
    if (!socket) return

    function onIncomingMessage(payload) {
      if (payload.conversationId === activeConversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === payload._id)) return prev
          return [...prev, payload]
        })
      }

      setConversations((prev) => {
        const found = prev.find((c) => c.conversationId === payload.conversationId)
        if (found) {
          return prev.map((c) =>
            c.conversationId === payload.conversationId ? { ...c, lastMessage: payload } : c
          )
        }
        return prev
      })
    }

    socket.on('message:receive', onIncomingMessage)
    return () => {
      socket.off('message:receive', onIncomingMessage)
    }
  }, [socket, activeConversationId])

  const handleSendMessage = useCallback(
    (text) => {
      if (!activeConversationId) return

      const optimisticMsg = {
        _id: `temp-${Date.now()}`,
        conversationId: activeConversationId,
        senderId: currentUserId,
        sender: 'me',
        content: text,
        createdAt: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, optimisticMsg])

      if (socket && socket.connected) {
        socket.emit('message:send', {
          conversationId: activeConversationId,
          content: text,
        })
      }
    },
    [activeConversationId, currentUserId, socket]
  )

  const handleConsentConfirm = useCallback(() => {
    setConsentOpen(false)
    const contact = {
      name: sanitizeDisplayText(user?.name ?? 'Campus Student'),
      email: sanitizeDisplayText(user?.email ?? 'student@office.mu.edu.et'),
      phone: user?.phone ? sanitizeDisplayText(user.phone) : null,
    }

    const contactMsg = {
      _id: `contact-${Date.now()}`,
      type: 'contact',
      sender: 'me',
      senderId: currentUserId,
      contact,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, contactMsg])

    if (socket && socket.connected && activeConversationId) {
      socket.emit('message:send', {
        conversationId: activeConversationId,
        content: `Contact Info: Name: ${contact.name} | Email: ${contact.email}${contact.phone ? ` | Phone: ${contact.phone}` : ''}`,
      })
    }
  }, [activeConversationId, currentUserId, socket, user])

  const filteredConversations = conversations.filter((c) => {
    const peerName = c.peer?.name || ''
    return peerName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <AppNavbar user={user} activeView="chat" onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
        <aside
          className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-surface-variant bg-surface-lowest ${
            activePeer ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-surface-variant">
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-display text-xl font-bold text-primary flex items-center gap-2">
                <IconMessages size={22} />
                <span>Messages</span>
              </h1>
              <ConnectionStatusBadge status={status} />
            </div>

            <div className="relative">
              <IconSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search conversations…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-surface-variant bg-surface-low pl-9 pr-3 py-2 text-xs text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-surface-variant/40">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-outline gap-3">
                <IconMessages size={36} className="opacity-40" />
                <p className="text-xs">No conversations yet.</p>
                <button
                  type="button"
                  onClick={() => onNavigate?.('tutor')}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary hover:bg-primary-container transition-colors cursor-pointer"
                >
                  Browse Tutors
                </button>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activePeer?._id === conv.peer?._id
                return (
                  <button
                    key={conv.conversationId}
                    type="button"
                    onClick={() => {
                      setActivePeer(conv.peer)
                      onNavigate?.(`/chat/${conv.peer?._id}`)
                    }}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors hover:bg-surface-low cursor-pointer ${
                      isSelected ? 'bg-surface-container-low border-l-4 border-primary' : ''
                    }`}
                  >
                    <PeerAvatar peer={conv.peer} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-on-surface truncate">
                          {conv.peer?.name}
                        </span>
                        {conv.lastMessage?.createdAt && (
                          <span className="text-[10px] text-outline shrink-0 ml-1">
                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-outline truncate mt-0.5">
                        {conv.lastMessage?.content || 'Started a conversation'}
                      </p>
                    </div>
                    <IconChevronRight size={16} className="text-outline/50 shrink-0 self-center" />
                  </button>
                )
              })
            )}
          </div>
        </aside>

        <section
          className={`flex-1 flex flex-col bg-surface-low ${
            !activePeer ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activePeer ? (
            <>
              <header className="h-16 shrink-0 border-b border-surface-variant bg-surface-lowest px-4 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Back to conversations"
                    onClick={() => setActivePeer(null)}
                    className="md:hidden inline-flex size-8 items-center justify-center rounded-lg border border-surface-variant text-on-surface-variant hover:text-primary cursor-pointer"
                  >
                    <IconArrowLeft size={18} />
                  </button>

                  <PeerAvatar peer={activePeer} size="md" />

                  <div>
                    <h2 className="font-display text-sm sm:text-base font-bold text-on-surface flex items-center gap-1.5">
                      <span>{activePeer.name}</span>
                      <IconUserCheck size={16} className="text-primary" />
                    </h2>
                    <p className="text-[11px] text-outline">
                      {activePeer.department || activePeer.university || 'Verified Peer'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ConnectionStatusBadge status={status} />
                </div>
              </header>

              {isLoadingMessages ? (
                <div className="flex flex-1 items-center justify-center">
                  <IconLoader2 size={32} className="animate-spin text-primary" />
                </div>
              ) : (
                <ChatThread
                  messages={messages}
                  peer={activePeer}
                  currentUserId={currentUserId}
                />
              )}

              <MessageInput
                onSend={handleSendMessage}
                onShareContact={() => setConsentOpen(true)}
              />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-primary-container/30 text-primary shadow-sm">
                <IconMessages size={32} />
              </div>
              <h2 className="font-display text-xl font-bold text-primary">Your Direct Messages</h2>
              <p className="max-w-sm text-xs text-on-surface-variant">
                Select a conversation from the left or search for tutors to start messaging.
              </p>
              <button
                type="button"
                onClick={() => onNavigate?.('tutor')}
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-on-primary hover:bg-primary-container transition-all shadow-level-1 cursor-pointer"
              >
                Find & Message Tutors
              </button>
            </div>
          </div>

        </header>

        <div className="flex flex-1 flex-col overflow-hidden bg-white/20 backdrop-blur-sm">
          <ChatThread messages={messages} peer={peer} />
        </div>

        <MessageInput
          onSend={handleSend}
          onShareContact={() => setConsentOpen(true)}
        />
      </div>

      <Footer onNavigate={onNavigate} user={user} />

      <ConsentModal
        isOpen={consentOpen}
        peerName={peer.name}
          )}
        </section>
      </main>

      <ConsentModal
        isOpen={consentOpen}
        peerName={activePeer?.name || 'Peer Student'}
        onCancel={() => setConsentOpen(false)}
        onConfirm={handleConsentConfirm}
      />
    </div>
  )
}
