import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
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
} from "@tabler/icons-react";
import AppNavbar from "../components/AppNavbar.jsx";
import ConsentModal from "../components/ConsentModal.jsx";
import { useSocket } from "../hooks/useSocket.js";
import { MOCK_PEER } from "../api/mockChatApi.js";
import { getMessagesWithUser } from "../api/chatApi.js";
import { tutors } from "../api/mockUsers.js";
import { getTutorById } from "../api/tutorApi.js";
import { getConversations, getConversationMessages } from "../api/chatApi.js";
import { INITIAL_MESSAGES } from "../api/mockChatApi.js";
import {
  sanitizeMessage,
  sanitizeDisplayText,
  MAX_MESSAGE_LENGTH,
} from "../utils/sanitize.js";
import { encodeContactCard, decodeContactCard } from "../utils/contactCard.js";

function mapMessage(m, myId) {
  const card = decodeContactCard(m.content);
  const base = {
    id: m._id || m.id,
    sender: m.senderId === myId ? "me" : "peer",
    time: new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
  return card
    ? { ...base, type: "contact", contact: card }
    : { ...base, text: m.content };
}

const STATUS_CONFIG = {
  connecting: {
    label: "Connecting…",
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    Icon: IconLoader2,
    iconClass: "animate-spin",
  },
  connected: {
    label: "Online",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    Icon: IconWifi,
    iconClass: "",
  },
  disconnected: {
    label: "Offline",
    badgeClass:
      "bg-surface-container text-outline border border-outline-variant/30",
    Icon: IconWifiOff,
    iconClass: "",
  },
};

function ConnectionStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.disconnected;
  const { Icon, label, badgeClass, iconClass } = cfg;
  return (
    <span
      role="status"
      aria-label={`Socket status: ${label}`}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeClass}`}
    >
      <Icon size={12} aria-hidden="true" className={iconClass} />
      {label}
    </span>
  );
}

function PeerAvatar({ peer, size = "md" }) {
  const dim = size === "sm" ? "size-8" : size === "lg" ? "size-11" : "size-10";
  const text = size === "sm" ? "text-xs" : "text-sm";
  const initials = (peer?.name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  if (peer?.profilePicUrl) {
    return (
      <img
        src={peer.profilePicUrl}
        alt={`${peer.name || "User"} avatar`}
        className={`${dim} shrink-0 rounded-full border-2 border-surface object-cover shadow-sm`}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={`${dim} shrink-0 rounded-full border-2 border-surface bg-primary-container ${text} font-bold text-on-primary-container flex items-center justify-center shadow-sm`}
    >
      {initials || <IconUser size={16} />}
    </div>
  );
}

function MessageBubble({ msg, peer, isMe }) {
  const timeStr = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : msg.time ||
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className={`flex items-end gap-2.5 ${isMe ? "flex-row-reverse self-end" : "flex-row self-start"} max-w-[85%] sm:max-w-[75%]`}
    >
      {!isMe && <PeerAvatar peer={peer} size="sm" />}
      <div
        className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}
      >
        <div
          className={
            isMe
              ? "rounded-2xl rounded-br-xs bg-primary px-4 py-2.5 text-sm leading-relaxed text-on-primary shadow-level-1"
              : "rounded-2xl rounded-bl-xs border border-surface-variant bg-surface px-4 py-2.5 text-sm leading-relaxed text-on-surface shadow-level-1"
          }
        >
          {msg.content || msg.text}
        </div>
        <span className="px-1 text-[10px] font-medium text-outline">
          {timeStr}
        </span>
      </div>
    </div>
  );
}

function ContactCard({ contact, isMe }) {
  return (
    <div
      aria-label="Shared contact information"
      className={`flex max-w-[85%] sm:max-w-[75%] flex-col gap-1 ${isMe ? "self-end items-end" : "self-start items-start"}`}
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
              {isMe
                ? "You shared your contact details"
                : `${contact.name} shared their contact details`}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <IconUser
              size={15}
              aria-hidden="true"
              className="shrink-0 text-on-surface-variant"
            />
            <span className="text-sm font-semibold text-on-surface">
              {contact.name}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <IconMail
              size={15}
              aria-hidden="true"
              className="shrink-0 text-on-surface-variant"
            />
            <a
              href={`mailto:${contact.email}`}
              className="text-sm font-medium text-primary underline-offset-2 hover:underline"
            >
              {contact.email}
            </a>
          </div>
          {contact.phone && (
            <div className="flex items-center gap-2.5">
              <IconPhone
                size={15}
                aria-hidden="true"
                className="shrink-0 text-on-surface-variant"
              />
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
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}

function ChatThread({ messages, peer, currentUserId }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-container/40 text-primary">
          <IconMessages size={28} />
        </div>
        <h3 className="font-display text-lg font-bold text-on-surface">
          No messages yet
        </h3>
        <p className="max-w-xs text-xs text-on-surface-variant">
          Send a greeting or ask a question to start your peer study
          conversation!
        </p>
      </div>
    );
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
        const isMe = msg.senderId === currentUserId || msg.sender === "me";
        if (msg.type === "contact" || msg.contact) {
          return (
            <ContactCard
              key={msg._id || msg.id || index}
              contact={msg.contact}
              isMe={isMe}
            />
          );
        }
        return (
          <MessageBubble
            key={msg._id || msg.id || index}
            msg={msg}
            peer={peer}
            isMe={isMe}
          />
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}

function MessageInput({ onSend, onShareContact, disabled }) {
  const [draft, setDraft] = useState("");
  const textareaRef = useRef(null);

  function handleSend() {
    const text = sanitizeMessage(draft);
    if (!text || disabled) return;
    onSend(text);
    setDraft("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput(e) {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
    setDraft(el.value);
  }

  const remaining = MAX_MESSAGE_LENGTH - draft.length;
  const nearLimit = remaining <= 100;

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
          <span className="text-[11px] text-outline font-medium">
            Press Enter ↵ to send
          </span>
        </div>

        <form
          aria-label="Send a message"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
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
            placeholder={
              disabled ? "Select a conversation to type..." : "Type a message…"
            }
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
  );
}

export default function ChatScreen({ user, onLogout, onNavigate }) {
  const { id } = useParams();
  const { status, getSocket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [consentOpen, setConsentOpen] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const currentUserId = user?._id || user?.id || "me";
  const userId = user?._id;
  const peer = tutors.find((t) => (t._id || t.id) === id) || MOCK_PEER;

  useEffect(() => {
    if (!id || !userId) return;
    let isMounted = true;
    getMessagesWithUser(id)
      .then((res) => {
        if (!isMounted) return;
        const mapped = (res.messages ?? [])
          .slice()
          .reverse()
          .map((m) => mapMessage(m, userId));
        setMessages(mapped);
      })
      .catch(() => setMessages([]));
    return () => {
      isMounted = false;
    };
  }, [id, userId]);

  useEffect(() => {
    if (!id || !userId) return;
    const socket = getSocket();
    if (!socket) return;

    const conversationId = [userId, id].sort().join("_");

    function onReceive(msg) {
      setMessages((prev) => [...prev, mapMessage(msg, userId)]);
    }

    function onError(err) {
      console.error("[chat socket error]", err);
    }

    socket.emit("join_conversation", { conversationId });
    socket.on("message:receive", onReceive);
    socket.on("error", onError);

    return () => {
      socket.off("message:receive", onReceive);
      socket.off("error", onError);
    };
  }, [id, userId, status, getSocket]);

  const handleSend = useCallback(
    (text) => {
      const socket = getSocket();
      if (!socket || !id || !userId) return;
      const conversationId = [userId, id].sort().join("_");
      socket.emit("message:send", { conversationId, content: text });
    },
    [getSocket, id, userId],
  );

  const handleConsentConfirm = useCallback(() => {
    setConsentOpen(false);
    const socket = getSocket();
    if (!socket || !id || !user?._id) return;

    const conversationId = [user._id, id].sort().join("_");
    const content = encodeContactCard({
      name: sanitizeDisplayText(user?.name ?? ""),
      email: sanitizeDisplayText(user?.email ?? ""),
      phone: user?.phone ? sanitizeDisplayText(user.phone) : null,
    });

    socket.emit("message:send", { conversationId, content });
  }, [getSocket, id, user]);

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <AppNavbar
        user={user}
        activeView="chat"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
        <div className="flex flex-1 flex-col overflow-hidden bg-white/20 backdrop-blur-sm">
          <ChatThread
            messages={messages}
            peer={peer}
            currentUserId={currentUserId}
          />
        </div>
      </main>

      <ConsentModal
        isOpen={consentOpen}
        peerName={peer?.name || "Tutor"}
        onCancel={() => setConsentOpen(false)}
        onConfirm={handleConsentConfirm}
      />
    </div>
  );
}
