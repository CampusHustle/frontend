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
  IconPhone as IconPhoneCall,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'
import ConsentModal from '../components/ConsentModal.jsx'
import { useSocket } from '../hooks/useSocket.js'
import {
  MOCK_PEER,
  INITIAL_MESSAGES,
  subscribeLiveMessages,
} from '../api/mockChatApi.js'
import { tutors } from '../api/mockUsers.js'
import { getTutorById } from '../api/tutorApi.js'
import { sanitizeMessage, sanitizeDisplayText, MAX_MESSAGE_LENGTH } from '../utils/sanitize.js'

const STATUS_CONFIG = {
  connecting: {
    label: 'Connecting…',
    badgeClass: 'bg-yellow-400/20 border-yellow-400/40 text-yellow-300',
    Icon: IconLoader2,
    iconClass: 'text-yellow-300 animate-spin',
  },
  connected: {
    label: 'online',
    badgeClass: 'bg-transparent border-transparent text-green-400',
    Icon: IconWifi,
    iconClass: 'text-green-400',
  },
  disconnected: {
    label: 'offline',
    badgeClass: 'bg-transparent border-transparent text-on-primary/50',
    Icon: IconWifiOff,
    iconClass: 'text-on-primary/50',
  },
}

function ConnectionStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.disconnected
  const { Icon, label, badgeClass, iconClass } = cfg
  return (
    <span
      role="status"
      aria-label={`Socket connection status: ${label}`}
      data-connection-status={status}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass}`}
    >
      <Icon size={13} aria-hidden="true" className={iconClass} />
      {label}
    </span>
  )
}

function PeerAvatar({ peer, size = 'md' }) {
  const dim = size === 'sm' ? 'size-8' : size === 'lg' ? 'size-11' : 'size-10'
  const text = size === 'sm' ? 'text-xs' : 'text-sm'
  const initials = (peer.name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  if (peer.profilePicUrl) {
    return (
      <img
        src={peer.profilePicUrl}
        alt={`${peer.name} avatar`}
        className={`${dim} shrink-0 rounded-full border-2 border-surface object-cover shadow-sm`}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`${dim} shrink-0 rounded-full border-2 border-surface bg-primary-fixed ${text} font-bold text-primary flex items-center justify-center shadow-sm`}
    >
      {initials}
    </div>
  )
}

function MessageBubble({ msg, peer }) {
  const isMe = msg.sender === 'me'
  return (
    <div
      className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse self-end' : 'flex-row self-start'} max-w-[80%]`}
    >
      {!isMe && <PeerAvatar peer={peer} size="sm" />}
      <div className={`flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
        <div
          className={
            isMe
              ? 'rounded-2xl rounded-br-sm bg-secondary-container/90 px-4 py-2.5 text-sm leading-relaxed text-on-secondary-container shadow-sm'
              : 'rounded-2xl rounded-bl-sm border border-white/50 bg-white/70 px-4 py-2.5 text-sm leading-relaxed text-on-surface shadow-sm backdrop-blur-md'
          }
        >
          {msg.text}
        </div>
        <span className="px-1 text-[11px] text-outline">{msg.time}</span>
      </div>
    </div>
  )
}

function ContactCard({ contact, isMe }) {
  return (
    <div
      aria-label="Shared contact information"
      className={`flex max-w-[80%] flex-col gap-1 ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
    >
      <div className="w-full rounded-2xl border border-secondary-container/30 bg-secondary-container/10 p-4 shadow-level-1 backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-2 border-b border-secondary-container/20 pb-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-secondary-container/30 text-secondary">
            <IconAddressBook size={17} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
              Contact info shared
            </p>
            <p className="text-xs text-on-surface-variant">
              {isMe ? 'You shared your contact info' : `${contact.name} shared their contact info`}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <IconUser size={14} aria-hidden="true" className="shrink-0 text-on-surface-variant" />
            <span className="text-sm font-semibold text-on-surface">{contact.name}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <IconMail size={14} aria-hidden="true" className="shrink-0 text-on-surface-variant" />
            <a
              href={`mailto:${contact.email}`}
              className="text-sm text-primary underline-offset-2 hover:underline"
            >
              {contact.email}
            </a>
          </div>
          {contact.phone && (
            <div className="flex items-center gap-2.5">
              <IconPhone size={14} aria-hidden="true" className="shrink-0 text-on-surface-variant" />
              <a
                href={`tel:${contact.phone}`}
                className="text-sm text-primary underline-offset-2 hover:underline"
              >
                {contact.phone}
              </a>
            </div>
          )}
        </div>
      </div>
      <span className="px-1 text-[11px] text-outline">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}

function ChatThread({ messages, peer }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
        <p className="text-sm text-on-surface-variant">No messages yet. Say hello!</p>
      </div>
    )
  }

  return (
    <div
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      aria-relevant="additions"
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-6"
    >
      <div className="flex justify-center">
        <span className="rounded-full border border-white/40 bg-surface-container/50 px-4 py-1 text-xs font-medium text-on-surface-variant backdrop-blur-sm">
          Today
        </span>
      </div>

      {messages.map((msg) =>
        msg.type === 'contact' ? (
          <ContactCard key={msg.id} contact={msg.contact} isMe={msg.sender === 'me'} />
        ) : (
          <MessageBubble key={msg.id} msg={msg} peer={peer} />
        ),
      )}

      <div ref={bottomRef} />
    </div>
  )
}

function MessageInput({ onSend, onShareContact }) {
  const [draft, setDraft] = useState('')
  const textareaRef = useRef(null)

  function handleSend() {
    const text = sanitizeMessage(draft)
    if (!text) return
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
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    setDraft(el.value)
  }

  const remaining = MAX_MESSAGE_LENGTH - draft.length
  const nearLimit = remaining <= 100

  return (
    <div className="shrink-0 bg-gradient-to-t from-surface via-surface/95 to-transparent px-4 pb-4 pt-2 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={onShareContact}
            className="inline-flex items-center gap-1.5 rounded-full border border-secondary-container/50 bg-secondary-container/10 px-3.5 py-1.5 text-xs font-semibold text-secondary transition-all hover:bg-secondary-container/20 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <IconAddressBook size={13} aria-hidden="true" />
            Share contact info
          </button>
        </div>

        <form
          aria-label="Send a message"
          onSubmit={(e) => { e.preventDefault(); handleSend() }}
          className="glass-card relative flex items-end gap-2 rounded-3xl border border-outline-variant/60 bg-surface-lowest/95 p-2 shadow-level-2 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        >
          <button
            type="button"
            aria-label="Add attachment"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary active:scale-95"
          >
            <IconPaperclip size={19} aria-hidden="true" />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={draft}
            maxLength={MAX_MESSAGE_LENGTH}
            onInput={handleInput}
            onKeyDown={handleKey}
            placeholder="Type a message…"
            aria-label="Message input"
            aria-describedby={nearLimit ? 'msg-char-count' : undefined}
            className="max-h-44 w-full resize-none border-0 bg-transparent px-2 py-2 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-0"
          />

          <button
            type="submit"
            aria-label="Send message"
            disabled={!draft.trim()}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary shadow-level-1 transition-all hover:bg-primary-container active:scale-95 disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-outline disabled:opacity-60 disabled:shadow-none"
          >
            <IconSend size={18} aria-hidden="true" />
          </button>
        </form>

        {nearLimit && (
          <p
            id="msg-char-count"
            className={`mt-1 text-right text-[11px] ${remaining <= 0 ? 'text-error' : 'text-outline'}`}
          >
            {remaining} characters remaining
          </p>
        )}
      </div>
    </div>
  )
}

export default function ChatScreen({ user, onLogout, onNavigate }) {
  const { id } = useParams()
  const { status } = useSocket()
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [consentOpen, setConsentOpen] = useState(false)
  const [peer, setPeer] = useState(() => {
    if (id) {
      const found = tutors.find((t) => t.id === id || t._id === id)
      if (found) return found
    }
    return MOCK_PEER
  })

  useEffect(() => {
    if (!id) return
    let isMounted = true
    getTutorById(id)
      .then((res) => {
        if (isMounted && res?.user) {
          setPeer({
            ...res.user,
            id: res.user._id || res.user.id || id,
          })
        }
      })
      .catch(() => { })
    return () => {
      isMounted = false
    }
  }, [id])

  // Wire up the mock live-message subscription. Swap subscribeLiveMessages
  // for socket.on('chat:message', onIncoming) when the real backend is ready.
  useEffect(() => {
    function onIncoming(msg) {
      setMessages((prev) => [...prev, msg])
    }
    const unsubscribe = subscribeLiveMessages(onIncoming)
    return unsubscribe
  }, [])

  const handleSend = useCallback((text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'me',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }, [])

  function handleConsentConfirm() {
    setConsentOpen(false)
    const contact = {
      name: sanitizeDisplayText(user?.name ?? 'Demo Student'),
      email: sanitizeDisplayText(user?.email ?? 'student@campus.edu.et'),
      phone: user?.phone ? sanitizeDisplayText(user.phone) : null,
    }
    setMessages((prev) => [
      ...prev,
      {
        id: `contact-${Date.now()}`,
        type: 'contact',
        sender: 'me',
        contact,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  return (
    <div className="mesh-bg flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <AppNavbar user={user} activeView="chat" onNavigate={onNavigate} onLogout={onLogout} />

      <div className="relative flex h-[calc(100dvh-64px)] w-full shrink-0 flex-col overflow-hidden">
        {/* ── Chat header ── */}
        <header className="shrink-0 bg-primary shadow-level-2">
          {/* Top row: back · avatar + name/status · search · call */}
          <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-3 py-2.5 sm:px-5">
            {/* Back button */}
            <button
              type="button"
              aria-label="Go back"
              onClick={() => onNavigate('tutor')}
              className="relative flex size-9 shrink-0 items-center justify-center rounded-full text-on-primary/70 transition-colors hover:bg-white/10 hover:text-on-primary active:scale-95"
            >
              <IconArrowLeft size={20} aria-hidden="true" />
              {/* Unread badge — static indicator matching the reference */}
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-secondary-container text-[9px] font-bold text-on-secondary-container">
                24
              </span>
            </button>

            {/* Avatar + online dot */}
            <div className="relative shrink-0">
              <PeerAvatar peer={peer} size="lg" />
              <span
                aria-label="Online"
                className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-primary bg-green-400"
              />
            </div>

            {/* Name + online label */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight text-on-primary">
                {peer.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <ConnectionStatusBadge status={status} />
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                aria-label="Search messages"
                className="flex size-9 items-center justify-center rounded-full text-on-primary/70 transition-colors hover:bg-white/10 hover:text-on-primary active:scale-95"
              >
                <IconSearch size={19} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Call"
                className="flex size-9 items-center justify-center rounded-full text-on-primary/70 transition-colors hover:bg-white/10 hover:text-on-primary active:scale-95"
              >
                <IconPhoneCall size={19} aria-hidden="true" />
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
        onCancel={() => setConsentOpen(false)}
        onConfirm={handleConsentConfirm}
      />
    </div>
  )
}
