/**
 * ChatScreen.jsx
 *
 * Day 5 — Chat UI shell.
 *
 * Renders the full chat page layout following the project's existing
 * screen conventions (mesh-bg wrapper, AppNavbar, Footer, glass-card inputs).
 *
 * This iteration includes:
 *   - Chat header with peer info
 *   - Connection status indicator (Connecting / Connected / Disconnected)
 *   - Scrollable message area placeholder
 *   - Message input + Send button (UI only — no live sending yet)
 *
 * Live message sending/receiving is out of scope for Day 5.
 */

import { useRef } from 'react'
import {
  IconMessageCircle,
  IconSend,
  IconPaperclip,
  IconWifi,
  IconWifiOff,
  IconLoader2,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'
import { useSocket } from '../hooks/useSocket.js'

// ── Connection status badge ───────────────────────────────────────────────────

/**
 * Visual config for each connection state.
 * Distinct colour, icon, and label for each of the three states.
 */
const STATUS_CONFIG = {
  connecting: {
    label: 'Connecting…',
    dotClass: 'text-[#f59f00]',
    badgeClass: 'bg-[#fff8e1] border-[#ffe082] text-[#7c5e00]',
    Icon: IconLoader2,
    iconClass: 'text-[#f59f00] animate-spin',
  },
  connected: {
    label: 'Connected',
    dotClass: 'text-[#2e7d32]',
    badgeClass: 'bg-[#e8f5e9] border-[#c8e6c9] text-[#1b5e20]',
    Icon: IconWifi,
    iconClass: 'text-[#2e7d32]',
  },
  disconnected: {
    label: 'Disconnected',
    dotClass: 'text-[#c62828]',
    badgeClass: 'bg-[#fce4ec] border-[#f8bbd0] text-[#880e4f]',
    Icon: IconWifiOff,
    iconClass: 'text-[#c62828]',
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

// ── Empty message area placeholder ───────────────────────────────────────────

function MessageAreaPlaceholder() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-container text-secondary-container shadow-level-2 ring-4 ring-secondary-container/15">
        <IconMessageCircle size={28} aria-hidden="true" />
      </div>
      <h2 className="font-display text-lg font-bold text-primary">
        No messages yet
      </h2>
      <p className="max-w-xs text-sm text-on-surface-variant">
        Messages will appear here once the connection is established and the
        conversation begins.
      </p>
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function ChatScreen({ user, onLogout, onNavigate }) {
  const { status } = useSocket()
  const inputRef = useRef(null)

  return (
    <div className="mesh-bg flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <AppNavbar
        user={user}
        activeView="chat"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Full-height chat workspace (mirrors AiAssistantScreen layout) */}
      <div className="relative flex h-[calc(100dvh-64px)] w-full shrink-0 flex-col overflow-hidden">

        {/* ── Chat header ─────────────────────────────────────────────────── */}
        <header className="shrink-0 border-b border-surface-variant bg-surface-lowest px-4 py-3 shadow-level-1 sm:px-6">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Peer avatar placeholder */}
              <div
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-sm font-bold text-primary shadow-sm"
              >
                CH
              </div>
              <div>
                <p className="text-sm font-semibold text-primary leading-tight">
                  CampusHustle Chat
                </p>
                <p className="text-xs text-on-surface-variant leading-tight mt-0.5">
                  Peer-to-peer messaging
                </p>
              </div>
            </div>

            {/* Connection status indicator */}
            <ConnectionStatusBadge status={status} />
          </div>
        </header>

        {/* ── Scrollable message area ──────────────────────────────────────── */}
        <div
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
          className="flex flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
            <MessageAreaPlaceholder />
          </div>
        </div>

        {/* ── Message input bar ────────────────────────────────────────────── */}
        <div className="shrink-0 bg-gradient-to-t from-surface via-surface/95 to-transparent px-4 pb-4 pt-2 sm:px-6">
          <div className="mx-auto w-full max-w-3xl">
            <form
              aria-label="Send a message"
              onSubmit={(e) => {
                // Live sending is not implemented yet (Day 5 scope)
                e.preventDefault()
              }}
              className="glass-card relative flex items-end gap-2 rounded-3xl border border-outline-variant/60 bg-surface-lowest/95 p-2 shadow-level-2 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
            >
              {/* Attachment button (UI only) */}
              <button
                type="button"
                aria-label="Add attachment"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary active:scale-95"
              >
                <IconPaperclip size={19} aria-hidden="true" />
              </button>

              {/* Message textarea */}
              <textarea
                ref={inputRef}
                rows={1}
                placeholder="Type a message… (sending not enabled yet)"
                aria-label="Message input"
                className="max-h-44 w-full resize-none border-0 bg-transparent px-2 py-2 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-0"
                onKeyDown={(e) => {
                  // Prevent accidental submission while live sending is not wired
                  if (e.key === 'Enter' && !e.shiftKey) e.preventDefault()
                }}
              />

              {/* Send button (UI only — disabled until live sending is wired) */}
              <button
                type="submit"
                aria-label="Send message"
                disabled
                className="flex size-9 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-surface-container text-outline opacity-60 transition-all duration-200"
              >
                <IconSend size={18} aria-hidden="true" />
              </button>
            </form>

            <p className="mt-2 text-center text-[11px] text-outline">
              Live messaging will be enabled in a future update.
            </p>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
