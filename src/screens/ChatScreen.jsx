import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  IconSend,
  IconAddressBook,
  IconMail,
  IconPhone,
  IconUser,
  IconArrowLeft,
  IconSearch,
  IconMessages,
  IconUserCheck,
  IconCheck,
  IconChecks,
  IconInfoCircle,
  IconCalendarEvent,
  IconX,
  IconBook,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import ConsentModal from '../components/ConsentModal.jsx'
import { useSocket } from '../hooks/useSocket.js'
import {
  getMessagesWithUser,
  getConversations,
  markConversationAsRead,
  sendMessage as sendRestMessage,
} from '../api/chatApi.js'
import { getTutorById } from '../api/tutorApi.js'
import {
  sanitizeMessage,
  sanitizeDisplayText,
  MAX_MESSAGE_LENGTH,
} from '../utils/sanitize.js'
import { encodeContactCard, decodeContactCard } from '../utils/contactCard.js'

function mapMessage(m, myId) {
  const card = decodeContactCard(m.content)
  const isMe = m.senderId === myId || m.sender === 'me'
  const base = {
    id: m._id || m.id,
    _id: m._id || m.id,
    sender: isMe ? 'me' : 'peer',
    senderId: m.senderId,
    content: m.content,
    isRead: m.isRead,
    createdAt: m.createdAt || new Date().toISOString(),
    time: new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
  return card
    ? { ...base, type: 'contact', contact: card }
    : { ...base, text: m.content }
}

function PeerAvatar({ peer, size = 'md', showOnline = false, isOnline = true }) {
  const dim =
    size === 'xs'
      ? 'size-7'
      : size === 'sm'
      ? 'size-9'
      : size === 'lg'
      ? 'size-12'
      : size === 'xl'
      ? 'size-20'
      : 'size-11'

  const text =
    size === 'xs'
      ? 'text-[10px]'
      : size === 'sm'
      ? 'text-xs'
      : size === 'xl'
      ? 'text-2xl'
      : 'text-sm'

  const dotDim = size === 'xl' ? 'size-4 border-2' : 'size-3 border-2'

  const initials = (peer?.name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  return (
    <div className="relative shrink-0">
      {peer?.profilePicUrl ? (
        <img
          src={peer.profilePicUrl}
          alt={`${peer.name || 'User'} avatar`}
          className={`${dim} rounded-full border border-surface-variant object-cover shadow-2xs`}
        />
      ) : (
        <div
          aria-hidden="true"
          className={`${dim} rounded-full border border-surface-variant bg-gradient-to-br from-primary/80 to-primary ${text} font-bold text-on-primary flex items-center justify-center shadow-2xs`}
        >
          {initials || <IconUser size={16} />}
        </div>
      )}

      {showOnline && (
        <span
          className={`absolute bottom-0 right-0 ${dotDim} rounded-full border-surface ${
            isOnline ? 'bg-emerald-500' : 'bg-outline-variant'
          }`}
          title={isOnline ? 'Active Now' : 'Offline'}
        />
      )}
    </div>
  )
}

function ContactCard({ contact, isMe }) {
  return (
    <div
      aria-label="Shared contact information"
      className={`flex max-w-[85%] sm:max-w-[70%] flex-col gap-1 ${
        isMe ? 'self-end items-end' : 'self-start items-start'
      }`}
    >
      <div className="w-full rounded-2xl border border-secondary-container/50 bg-secondary-container/15 p-4 shadow-sm backdrop-blur-xs">
        <div className="mb-3 flex items-center gap-2.5 border-b border-secondary-container/20 pb-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-secondary-container/30 text-secondary">
            <IconAddressBook size={18} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-secondary">
              Verified Campus Contact
            </p>
            <p className="text-[11px] text-on-surface-variant">
              {isMe
                ? 'You shared your contact details'
                : `${contact.name} shared their contact details`}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 font-semibold text-on-surface">
            <IconUser size={14} className="text-outline shrink-0" />
            <span>{contact.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <IconMail size={14} className="text-outline shrink-0" />
            <a
              href={`mailto:${contact.email}`}
              className="text-primary hover:underline font-medium break-all"
            >
              {contact.email}
            </a>
          </div>

          {contact.phone && (
            <div className="flex items-center gap-2">
              <IconPhone size={14} className="text-outline shrink-0" />
              <a
                href={`tel:${contact.phone}`}
                className="text-primary hover:underline font-medium"
              >
                {contact.phone}
              </a>
            </div>
          )}
        </div>
      </div>
      <span className="px-1 text-[10px] text-outline font-medium">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}

function MessageBubble({ msg, isMe }) {
  const timeStr = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : msg.time ||
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className={`group flex flex-col gap-1 max-w-[80%] sm:max-w-[65%] ${
        isMe ? 'self-end items-end' : 'self-start items-start'
      }`}
    >
      <div
        className={`relative px-4 py-2.5 text-[13.5px] leading-relaxed shadow-2xs transition-all ${
          isMe
            ? 'rounded-2xl rounded-tr-xs bg-primary text-on-primary'
            : 'rounded-2xl rounded-tl-xs border border-surface-variant/60 bg-surface-lowest text-on-surface'
        }`}
      >
        <p className="break-words whitespace-pre-wrap">{msg.content || msg.text}</p>
      </div>

      <div className="flex items-center gap-1 px-1 text-[10px] text-outline font-medium">
        <span>{timeStr}</span>
        {isMe && (
          <span title={msg.isRead ? 'Seen' : 'Delivered'}>
            {msg.isRead ? (
              <IconChecks size={13} className="text-primary" />
            ) : (
              <IconCheck size={13} className="text-outline" />
            )}
          </span>
        )}
      </div>
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
      <div className="flex flex-1 min-h-0 flex-col items-center justify-center gap-4 p-8 text-center overflow-y-auto">
        <PeerAvatar peer={peer} size="xl" />
        <div>
          <h3 className="font-display text-base font-bold text-on-surface">
            {peer?.name || 'Peer Tutor'}
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {peer?.department || 'Academic Department'} · {peer?.university || 'University'}
          </p>
        </div>
        <div className="max-w-xs rounded-xl bg-surface-container/40 p-3 text-xs text-outline border border-surface-variant/40">
          Say hello or ask questions about courses, tutorial materials, and schedules!
        </div>
      </div>
    )
  }

  return (
    <div
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      aria-relevant="additions"
      className="flex flex-1 min-h-0 flex-col gap-3.5 overflow-y-auto p-4 sm:p-6"
    >
      <div className="my-2 flex justify-center shrink-0">
        <span className="rounded-full border border-surface-variant bg-surface-lowest/80 px-3 py-0.5 text-[11px] font-medium text-outline shadow-2xs backdrop-blur-xs">
          Direct Peer Conversation
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
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
    setDraft(el.value)
  }

  const remaining = MAX_MESSAGE_LENGTH - draft.length
  const nearLimit = remaining <= 100

  return (
    <div className="shrink-0 border-t border-surface-variant bg-surface-lowest p-3 sm:px-6 sm:py-3.5">
      <div className="mx-auto flex w-full max-w-4xl items-end gap-2">
        <button
          type="button"
          onClick={onShareContact}
          title="Share contact info"
          aria-label="Share contact info"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-surface-variant text-on-surface-variant transition-colors hover:bg-surface-low hover:text-primary active:scale-95 cursor-pointer"
        >
          <IconAddressBook size={18} aria-hidden="true" />
        </button>

        <form
          aria-label="Send a message"
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="relative flex flex-1 items-end rounded-3xl border border-surface-variant bg-surface-low px-3.5 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={draft}
            disabled={disabled}
            maxLength={MAX_MESSAGE_LENGTH}
            onChange={(e) => setDraft(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKey}
            placeholder={
              disabled ? 'Select a chat to start typing...' : 'Message…'
            }
            aria-label="Message input"
            className="max-h-28 w-full resize-none border-0 bg-transparent py-1.5 text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-0 leading-relaxed"
          />

          <button
            type="submit"
            aria-label="Send message"
            disabled={!draft.trim() || disabled}
            className="mb-0.5 ml-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xs transition-all hover:brightness-110 active:scale-90 disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-outline disabled:opacity-40 cursor-pointer"
          >
            <IconSend size={15} aria-hidden="true" />
          </button>
        </form>
      </div>

      {nearLimit && (
        <p className="mt-1 text-center text-[10px] font-medium text-error">
          {remaining} characters remaining
        </p>
      )}
    </div>
  )
}

function PeerInfoDrawer({ peer, isOpen, onClose, onNavigate }) {
  if (!isOpen || !peer) return null

  return (
    <aside className="w-72 lg:w-80 shrink-0 h-full border-l border-surface-variant bg-surface-lowest flex flex-col p-5 overflow-y-auto min-h-0 animate-fadeIn">
      <div className="flex items-center justify-between pb-4 border-b border-surface-variant shrink-0">
        <h3 className="font-display text-sm font-bold text-on-surface">Details</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="size-7 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-low hover:text-on-surface cursor-pointer"
        >
          <IconX size={16} />
        </button>
      </div>

      <div className="flex flex-col items-center text-center my-6 shrink-0">
        <PeerAvatar peer={peer} size="xl" showOnline isOnline />
        <h4 className="font-display font-bold text-base text-on-surface mt-3 flex items-center gap-1">
          <span>{peer.name}</span>
          <IconUserCheck size={16} className="text-primary" />
        </h4>
        <p className="text-xs text-on-surface-variant mt-0.5">{peer.department}</p>
        <p className="text-[11px] text-outline">{peer.university}</p>

        {typeof peer.hourlyRate === 'number' && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-secondary-container/20 px-3 py-0.5 text-xs font-bold text-secondary">
            {peer.hourlyRate} ETB / hr
          </span>
        )}
      </div>

      <div className="space-y-4 text-xs">
        <div className="rounded-xl bg-surface-low p-3 border border-surface-variant/50 space-y-2">
          <p className="text-[11px] uppercase font-bold text-outline tracking-wider">Quick Actions</p>
          <button
            type="button"
            onClick={() => onNavigate?.(`/tutor/${peer._id || peer.id}`)}
            className="w-full flex items-center justify-between rounded-lg bg-surface-lowest px-3 py-2 font-semibold text-on-surface hover:text-primary transition-colors border border-surface-variant/40 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <IconBook size={15} className="text-primary" />
              <span>View Notes & Bio</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.(`/tutor/${peer._id || peer.id}`)}
            className="w-full flex items-center justify-between rounded-lg bg-primary px-3 py-2 font-semibold text-on-primary hover:brightness-105 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <IconCalendarEvent size={15} />
              <span>Book Tutoring Session</span>
            </span>
          </button>
        </div>

        {peer.bio && (
          <div className="rounded-xl bg-surface-low p-3 border border-surface-variant/50">
            <p className="text-[11px] uppercase font-bold text-outline tracking-wider mb-1">About</p>
            <p className="text-on-surface-variant leading-relaxed">{peer.bio}</p>
          </div>
        )}

        <div className="p-2 text-center text-[10px] text-outline">
          Encrypted peer communication platform · Campus verified identity
        </div>
      </div>
    </aside>
  )
}

export default function ChatScreen({ user, onLogout, onNavigate }) {
  const { id: peerIdParam, id: routeId } = useParams()
  const activeId = peerIdParam || routeId
  const { getSocket } = useSocket()
  const [conversations, setConversations] = useState([])
  const [fetchedPeer, setFetchedPeer] = useState(null)
  const [messages, setMessages] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [consentOpen, setConsentOpen] = useState(false)
  const [showInfoDrawer, setShowInfoDrawer] = useState(false)

  const currentUserId = user?._id || user?.id || 'me'
  const userId = user?._id || user?.id

  // Derive active peer cleanly
  const activePeer = useMemo(() => {
    if (!activeId) return conversations[0]?.peer || null
    const matched = conversations.find((c) => c?.peer?._id === activeId)
    if (matched?.peer) return matched.peer
    if (fetchedPeer && fetchedPeer._id === activeId) return fetchedPeer
    return { _id: activeId, name: 'Campus Peer', department: 'Peer' }
  }, [activeId, conversations, fetchedPeer])

  // Load conversation inbox on mount
  useEffect(() => {
    let isMounted = true
    getConversations()
      .then((res) => {
        if (isMounted && Array.isArray(res?.conversations)) {
          setConversations(res.conversations)
        }
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [activeId])

  // Resolve peer profile if not in summaries
  useEffect(() => {
    if (!activeId) return
    const matched = conversations.find((c) => c?.peer?._id === activeId)
    if (!matched?.peer) {
      let isMounted = true
      getTutorById(activeId)
        .then((res) => {
          if (isMounted && res?.user) {
            setFetchedPeer(res.user)
          }
        })
        .catch(() => {})
      return () => {
        isMounted = false
      }
    }
  }, [activeId, conversations])

  // Fetch real conversation messages
  useEffect(() => {
    if (!activeId || !userId) return
    let isMounted = true

    getMessagesWithUser(activeId)
      .then((res) => {
        if (!isMounted) return
        const mapped = (res?.messages ?? []).map((m) => mapMessage(m, userId))
        setMessages(mapped)

        const conversationId = [userId, activeId].sort().join('_')
        markConversationAsRead(conversationId).catch(() => {})
      })
      .catch(() => {
        if (isMounted) setMessages([])
      })

    return () => {
      isMounted = false
    }
  }, [activeId, userId])

  // Real-time socket message handler
  useEffect(() => {
    if (!activeId || !userId) return
    const activeSocket = typeof getSocket === 'function' ? getSocket() : null
    if (!activeSocket) return

    const conversationId = [userId, activeId].sort().join('_')

    function onReceive(msg) {
      const msgConvId =
        msg.conversationId ||
        (msg.senderId === userId ? conversationId : [msg.senderId, userId].sort().join('_'))
      if (msgConvId === conversationId) {
        setMessages((prev) => {
          const alreadyExists = prev.some((m) => (m._id || m.id) === (msg._id || msg.id))
          if (alreadyExists) return prev
          return [...prev, mapMessage(msg, userId)]
        })

        if (msg.senderId !== userId) {
          markConversationAsRead(conversationId).catch(() => {})
        }
      }

      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.conversationId === msgConvId)
        if (idx >= 0) {
          const updated = [...prev]
          updated[idx] = {
            ...updated[idx],
            lastMessage: msg,
            unreadCount:
              msg.senderId === userId
                ? 0
                : msgConvId === conversationId
                ? 0
                : (updated[idx].unreadCount || 0) + 1,
          }
          return updated
        }
        return prev
      })
    }

    activeSocket.emit('join_conversation', { conversationId })
    activeSocket.on('message:receive', onReceive)

    return () => {
      activeSocket.emit('leave_conversation', { conversationId })
      activeSocket.off('message:receive', onReceive)
    }
  }, [activeId, userId, getSocket])

  const handleSendMessage = useCallback(
    async (text) => {
      if (!activeId || !userId) return
      const conversationId = [userId, activeId].sort().join('_')
      const activeSocket = typeof getSocket === 'function' ? getSocket() : null

      if (activeSocket && (activeSocket.connected || typeof activeSocket.emit === 'function')) {
        activeSocket.emit('message:send', { conversationId, content: text })
      } else {
        try {
          const res = await sendRestMessage({ conversationId, otherUserId: activeId, content: text })
          if (res?.message) {
            setMessages((prev) => {
              const alreadyExists = prev.some((m) => (m._id || m.id) === (res.message._id || res.message.id))
              if (alreadyExists) return prev
              return [...prev, mapMessage(res.message, userId)]
            })
          }
        } catch (err) {
          console.error('[REST send failed]', err)
        }
      }
    },
    [getSocket, activeId, userId]
  )

  const handleConsentConfirm = useCallback(async () => {
    setConsentOpen(false)
    if (!activeId || !userId) return
    const conversationId = [userId, activeId].sort().join('_')
    const content = encodeContactCard({
      name: sanitizeDisplayText(user?.name ?? ''),
      email: sanitizeDisplayText(user?.email ?? ''),
      phone: user?.phone ? sanitizeDisplayText(user.phone) : null,
    })

    const activeSocket = typeof getSocket === 'function' ? getSocket() : null
    if (activeSocket && (activeSocket.connected || typeof activeSocket.emit === 'function')) {
      activeSocket.emit('message:send', { conversationId, content })
    } else {
      try {
        await sendRestMessage({ conversationId, otherUserId: activeId, content })
      } catch (err) {
        console.error('[REST send contact failed]', err)
      }
    }
  }, [getSocket, activeId, userId, user])

  const filteredConversations = conversations.filter((c) =>
    (c?.peer?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen max-h-screen flex-col overflow-hidden bg-surface font-body text-on-surface antialiased">
      <AppNavbar
        user={user}
        activeView="chat"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex flex-1 overflow-hidden min-h-0 w-full">
        {/* ── Left Fixed Sidebar (Instagram / Messenger DM list) ─────────── */}
        <aside
          className={`w-full md:w-80 lg:w-[340px] shrink-0 h-full flex flex-col border-r border-surface-variant bg-surface-lowest overflow-hidden min-h-0 ${
            activePeer ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 pb-2 border-b border-surface-variant/60 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
                <span>Messages</span>
              </h1>
              <span className="text-[11px] font-medium text-outline">
                {conversations.length} {conversations.length === 1 ? 'chat' : 'chats'}
              </span>
            </div>

            {/* Search */}
            <div className="relative mb-2">
              <IconSearch
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search direct messages…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-surface-variant bg-surface-low pl-9 pr-3 py-1.5 text-xs text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Active Contacts Stories Bar (Instagram style) */}
          {conversations.length > 0 && (
            <div className="flex items-center gap-3 overflow-x-auto px-4 py-3 border-b border-surface-variant/40 shrink-0 no-scrollbar">
              {conversations.slice(0, 8).map((c) => {
                const isSelected = activePeer?._id === c.peer?._id
                return (
                  <button
                    key={`story-${c.conversationId}`}
                    type="button"
                    onClick={() => onNavigate?.(`/chat/${c.peer?._id}`)}
                    className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
                  >
                    <div
                      className={`p-0.5 rounded-full transition-all ${
                        isSelected
                          ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-lowest'
                          : 'group-hover:opacity-80'
                      }`}
                    >
                      <PeerAvatar peer={c.peer} size="sm" showOnline isOnline />
                    </div>
                    <span className="text-[10px] font-medium text-on-surface-variant truncate max-w-[52px]">
                      {c.peer?.name?.split(' ')[0]}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Conversations Thread List */}
          <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-surface-variant/20 p-2 space-y-1">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-outline gap-3">
                <div className="size-12 rounded-2xl bg-surface-low flex items-center justify-center text-outline">
                  <IconMessages size={24} />
                </div>
                <p className="text-xs">No active chats found</p>
                <button
                  type="button"
                  onClick={() => onNavigate?.('tutor')}
                  className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-on-primary hover:brightness-105 transition-all cursor-pointer"
                >
                  Explore Tutors
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
                      onNavigate?.(`/chat/${conv.peer?._id}`)
                    }}
                    className={`w-full p-2.5 rounded-2xl text-left flex items-center gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-surface-low shadow-2xs font-semibold'
                        : 'hover:bg-surface-low/70'
                    }`}
                  >
                    <PeerAvatar peer={conv.peer} size="md" showOnline isOnline />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-on-surface truncate">
                          {conv.peer?.name}
                        </span>
                        {conv.lastMessage?.createdAt && (
                          <span className="text-[10px] text-outline shrink-0 font-normal">
                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                        {conv.lastMessage?.content || 'Started a conversation'}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary shadow-xs">
                        {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </aside>

        {/* ── Main Chat Area (Instagram / Messenger Center Pane) ───────────── */}
        <section
          className={`flex-1 flex flex-col h-full overflow-hidden min-h-0 bg-surface-low/60 ${
            !activePeer ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activePeer ? (
            <>
              {/* Modern Messenger Header */}
              <header className="h-16 shrink-0 border-b border-surface-variant bg-surface-lowest px-4 sm:px-6 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    aria-label="Back to conversations"
                    onClick={() => onNavigate?.('/chat')}
                    className="md:hidden inline-flex size-8 items-center justify-center rounded-full border border-surface-variant text-on-surface-variant hover:text-primary cursor-pointer shrink-0"
                  >
                    <IconArrowLeft size={17} />
                  </button>

                  <PeerAvatar peer={activePeer} size="md" showOnline isOnline />

                  <div className="min-w-0">
                    <h2 className="font-display text-sm font-bold text-on-surface flex items-center gap-1 truncate">
                      <span className="truncate">{activePeer.name}</span>
                      <IconUserCheck size={15} className="text-primary shrink-0" />
                    </h2>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      {activePeer.department || activePeer.university || 'Active Now'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInfoDrawer((prev) => !prev)}
                    title="Conversation info"
                    aria-label="Conversation info"
                    className={`size-9 flex items-center justify-center rounded-full border transition-colors cursor-pointer ${
                      showInfoDrawer
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-surface-variant text-on-surface-variant hover:bg-surface-low hover:text-primary'
                    }`}
                  >
                    <IconInfoCircle size={18} />
                  </button>
                </div>
              </header>

              {/* Chat Thread */}
              <ChatThread
                messages={messages}
                peer={activePeer}
                currentUserId={currentUserId}
              />

              {/* Chat Input Bar */}
              <MessageInput
                onSend={handleSendMessage}
                onShareContact={() => setConsentOpen(true)}
              />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-2xs">
                <IconMessages size={32} />
              </div>
              <h2 className="font-display text-xl font-bold text-on-surface">Your Direct Messages</h2>
              <p className="max-w-sm text-xs text-on-surface-variant">
                Send private peer questions, request study notes, or connect with verified university tutors.
              </p>
              <button
                type="button"
                onClick={() => onNavigate?.('tutor')}
                className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-on-primary hover:brightness-105 transition-all shadow-sm cursor-pointer"
              >
                Find & Message Tutors
              </button>
            </div>
          )}
        </section>

        {/* ── Right Peer Profile Details Drawer (Instagram Web style) ──────── */}
        <PeerInfoDrawer
          peer={activePeer}
          isOpen={showInfoDrawer && !!activePeer}
          onClose={() => setShowInfoDrawer(false)}
          onNavigate={onNavigate}
        />
      </main>

      <ConsentModal
        isOpen={consentOpen}
        peerName={activePeer?.name || 'Tutor'}
        onCancel={() => setConsentOpen(false)}
        onConfirm={handleConsentConfirm}
      />
    </div>
  )
}
