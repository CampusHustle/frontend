import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  IconArrowLeft,
  IconCalendarEvent,
  IconCheck,
  IconChecks,
  IconChevronRight,
  IconCircleCheckFilled,
  IconFileText,
  IconInfoCircle,
  IconPaperclip,
  IconPhone,
  IconPhoto,
  IconSearch,
  IconSend,
  IconShieldCheck,
  IconThumbUp,
  IconVideo,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'

const MOCK_CONVERSATIONS = [
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    role: 'Senior, Chemistry & Calculus Tutor',
    university: 'Addis Ababa University',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOwJWmOo4wnikb1axjka0-v8R-36PRThsxPguoCaIV0CuU3MhOYfisMUFouccaprNJZCu-RIpfzSH_IC5Yhik4Kwpa62gUTeb8qUVvOOD48UyGsf1WWlOM6TSfKMiH3S_9aZ1gjoa6GoCPYywaQWXeD3BDR7FBanMILpkjsnGIqFqxwRLaeokfRIpgxu4pYWrfm2yPGE4S7dwna2tdkN8GupeByJP0dQleHAXMWVfYhVt_CP6uUwzlA',
    subject: 'Organic Chemistry & Calc 101',
    courseCode: 'CHEM 201',
    online: true,
    lastSeen: 'Active now',
    rating: 4.9,
    reviewsCount: 42,
    unreadCount: 1,
    booking: {
      status: 'Confirmed',
      dateTime: 'Today, 3:00 PM - 4:00 PM',
      rate: '150 ETB/hr',
      location: 'Online Live Room / AAU Science Library',
    },
    messages: [
      {
        id: 'm1',
        sender: 'sarah',
        text: 'Hi! I saw you booked our session and checked out the Orgo Reaction Mechanisms masterclass.',
        time: '2:14 PM',
        status: 'seen',
      },
      {
        id: 'm2',
        sender: 'sarah',
        text: 'Let me know what specific mechanism topics you want to cover today so I can have the practice keys ready!',
        time: '2:15 PM',
        status: 'seen',
      },
      {
        id: 'm3',
        sender: 'user',
        text: 'Hey Sarah! Thanks for reaching out. Im struggling a bit with nucleophilic addition and the acid-catalyzed hydration mechanism.',
        time: '2:18 PM',
        status: 'seen',
      },
      {
        id: 'm4',
        sender: 'sarah',
        text: 'Perfect! I have 3 concise practice problem sheets specifically for carbonyls and hydration. Attaching the summary diagram here:',
        time: '2:20 PM',
        attachment: {
          type: 'image',
          title: 'Reaction_Mechanism_Summary.png',
          size: '2.4 MB',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSq0rO8PGRYNgwRirJSUHaLSsluvB5AdFaGKr3unHqsBmUSW1AAVOjPpKf01tOVNC8z5_GJTK2NCK26gifDFEahJZIpQrMf5fEOXXFYqXpZHx-YR9cAz-NM2QtwoWuaamNhyDd--VjYR7e5NjQ97YKr-roz46ddA5YL2mSz2jVuqoAm4aGWBaJzOnu2qR0gFlAti4su92_4tc1BjghdPqvUs_3fCE4HJtQ7mYQCXRt-9ETsc8VUcjBlg',
        },
        status: 'seen',
      },
      {
        id: 'm5',
        sender: 'sarah',
        text: 'Review this before 3:00 PM and we will solve the handwritten exercises together step-by-step.',
        time: '2:21 PM',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'alex-johnson',
    name: 'Alex Johnson',
    role: 'Computer Science Tutor',
    university: 'Addis Ababa University',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAFaeKTzFM4YDER6x-18N_hPeswPK6Mqa0hODS9_M9Q3dHO5mwu5tTDx25XmzZsd2yumBTHd2RGCf7G8nffp4n--wFueDYH30HViox3CFvEchcz5tE8hKH16ueP_gyKkrrXvM1SmgcYwRRE7q95aIMmqZUCGjfdCc4dGuDIznG7C4L3sffv49hNsdjYRjS4hZUh0V3R9-UfJ1o6Sf27z3j_gG9AubO0SsIAGV7nPdyGVToYiAciTVdpxQ',
    subject: 'Data Structures & Algorithms',
    courseCode: 'CoSc-2011',
    online: false,
    lastSeen: 'Active 25m ago',
    rating: 4.8,
    reviewsCount: 38,
    unreadCount: 0,
    booking: {
      status: 'Completed',
      dateTime: 'Yesterday, 10:00 AM',
      rate: '150 ETB/hr',
      location: 'Online',
    },
    messages: [
      {
        id: 'a1',
        sender: 'alex',
        text: 'Great work on yesterday recursion assignment! Keep practicing binary search trees.',
        time: 'Yesterday',
        status: 'seen',
      },
    ],
  },
  {
    id: 'abel-tesfaye',
    name: 'Abel Tesfaye',
    role: 'Physics 101 Peer Tutor',
    university: 'AASTU',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    subject: 'Mechanics & Thermodynamics',
    courseCode: 'PHYS 101',
    online: true,
    lastSeen: 'Active now',
    rating: 4.9,
    reviewsCount: 19,
    unreadCount: 0,
    booking: {
      status: 'Confirmed',
      dateTime: 'Tomorrow, 4:00 PM',
      rate: '120 ETB/hr',
      location: 'AASTU Campus Library',
    },
    messages: [
      {
        id: 'ab1',
        sender: 'abel',
        text: 'Hey! Looking forward to our physics session tomorrow. Bring your previous midterm exam.',
        time: 'Oct 14',
        status: 'seen',
      },
    ],
  },
]

export default function ChatScreen({ user, onNavigate, onLogout }) {
  const { id } = useParams()
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const [selectedChatId, setSelectedChatId] = useState(id || 'sarah-jenkins')
  const [searchQuery, setSearchQuery] = useState('')
  const [inputText, setInputText] = useState('')
  const [showDetailsPane, setShowDetailsPane] = useState(false)
  const [hasSharedContact, setHasSharedContact] = useState(false)
  const [contactWarning, setContactWarning] = useState('')
  const messagesEndRef = useRef(null)

  const effectiveChatId = id || selectedChatId
  const activeConversation =
    conversations.find((c) => c.id === effectiveChatId) || conversations[0]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation.messages])

  // Messenger-style Send Message
  const handleSendMessage = (e) => {
    if (e) e.preventDefault()
    if (!inputText.trim()) return

    const textToSend = inputText.trim()

    // Safety Audit Check for Phone / Telegram
    const phoneRegex = /(?:\+?251|0)?9\d{8}/g
    const telegramRegex = /@[a-zA-Z0-9_]{4,}/g
    if ((phoneRegex.test(textToSend) || telegramRegex.test(textToSend)) && !hasSharedContact) {
      setContactWarning(
        'CampusHustle Safety: Off-platform contact info detected. Use the "Share Contact Info" consent button to protect your payment escrow.'
      )
      setTimeout(() => setContactWarning(''), 6000)
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            messages: [...c.messages, newMessage],
          }
        }
        return c
      })
    )

    setInputText('')

    // Simulated Tutor Reply (Messenger Experience)
    setTimeout(() => {
      const tutorReply = {
        id: `msg_reply_${Date.now()}`,
        sender: 'sarah',
        text: 'Got it! I am reviewing your question right now and setting up our live board.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
      }
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversation.id) {
            return {
              ...c,
              messages: [...c.messages, tutorReply],
            }
          }
          return c
        })
      )
    }, 1200)
  }

  const handleSendThumbsUp = () => {
    const thumbMessage = {
      id: `msg_thumb_${Date.now()}`,
      sender: 'user',
      text: '👍',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      isEmojiOnly: true,
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            messages: [...c.messages, thumbMessage],
          }
        }
        return c
      })
    )
  }

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen max-h-screen w-screen flex-col overflow-hidden bg-gray-50 font-poppins text-gray-900 antialiased">
      {/* Top Navbar */}
      <AppNavbar
        user={user}
        activeView="marketplace"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Main Messenger Workspace (Screen-Sized, No Scrolling on Outer Page) */}
      <div className="mx-auto flex h-[calc(100vh-64px)] w-full max-w-7xl flex-1 overflow-hidden p-2 sm:p-4 gap-3">
        {/* =============================================================== */}
        {/* 1. LEFT SIDEBAR: Messenger Inbox List                            */}
        {/* =============================================================== */}
        <aside className="flex w-full md:w-80 lg:w-88 flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden shrink-0">
          {/* Inbox Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#041534]">Chats</h1>
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-800">
                {conversations.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('tutor') : window.location.assign('/tutor')}
              className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Find New Tutor"
            >
              <IconCalendarEvent size={18} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Messenger..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#041534]"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 p-2 space-y-1">
            {filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversation.id
              const lastMsg = conv.messages[conv.messages.length - 1]

              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setSelectedChatId(conv.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-amber-500/10 border border-amber-500/30'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  {/* Avatar with Online Presence Dot */}
                  <div className="relative h-12 w-12 shrink-0 rounded-full border border-gray-200">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                        {conv.name}
                      </h2>
                      <span className="text-[10px] text-gray-400">
                        {lastMsg?.time || 'Today'}
                      </span>
                    </div>

                    <p className="text-[11px] text-amber-700 font-medium truncate">
                      {conv.subject}
                    </p>

                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {lastMsg?.text || 'No messages yet'}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-gray-950">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </aside>

        {/* =============================================================== */}
        {/* 2. CENTER: Messenger Chat Stage                                 */}
        {/* =============================================================== */}
        <section className="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden min-w-0">
          {/* Chat Top Header */}
          <div className="flex items-center justify-between border-b border-gray-100 p-3 sm:p-4 bg-white shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-amber-400">
                <img
                  src={activeConversation.avatar}
                  alt={activeConversation.name}
                  className="h-full w-full object-cover"
                />
                {activeConversation.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm sm:text-base font-bold text-[#041534] truncate">
                    {activeConversation.name}
                  </h2>
                  <IconCircleCheckFilled size={14} className="text-amber-500 shrink-0" />
                  <span className="rounded bg-[#1b2a4a] px-2 py-0.2 text-[10px] font-bold text-white shrink-0">
                    {activeConversation.courseCode}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 truncate">
                  {activeConversation.lastSeen} · {activeConversation.role}
                </p>
              </div>
            </div>

            {/* Action Buttons (Call, Video, Info Pane Toggle) */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                title="Start Voice Call"
              >
                <IconPhone size={18} />
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                title="Start Video Meeting Room"
              >
                <IconVideo size={18} />
              </button>
              <button
                type="button"
                onClick={() => setShowDetailsPane(!showDetailsPane)}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  showDetailsPane ? 'bg-amber-500 text-gray-950 font-bold' : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Conversation Details"
              >
                <IconInfoCircle size={19} />
              </button>
            </div>
          </div>

          {/* Booking / Safety Banner Strip (Stitch-Integrated) */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 bg-amber-50/70 px-4 py-2 text-xs shrink-0">
            <div className="flex items-center gap-2 text-amber-900">
              <span className="flex h-5 items-center gap-1 rounded-full bg-emerald-100 px-2.5 text-[11px] font-bold text-emerald-800 border border-emerald-300">
                <IconCircleCheckFilled size={12} />
                <span>{activeConversation.booking.status}</span>
              </span>
              <span className="font-semibold">{activeConversation.booking.dateTime}</span>
              <span className="text-gray-400">·</span>
              <span className="text-amber-800 font-bold">{activeConversation.booking.rate}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHasSharedContact(!hasSharedContact)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                  hasSharedContact
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'border border-amber-300 bg-white text-amber-900 hover:bg-amber-100'
                }`}
              >
                {hasSharedContact ? '✓ Contact Info Shared' : 'Share Contact Info'}
              </button>
            </div>
          </div>

          {/* Contact Info Filter Warning (if triggered) */}
          {contactWarning && (
            <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 text-[11px] font-medium text-rose-800 flex items-center justify-between shrink-0 animate-fadeIn">
              <span>{contactWarning}</span>
              <button
                type="button"
                onClick={() => setContactWarning('')}
                className="text-rose-600 font-bold ml-2 hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ============================================================= */}
          {/* Messages Feed (Messenger-Style Speech Bubbles)                */}
          {/* ============================================================= */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {/* Date Badge */}
            <div className="flex justify-center my-2">
              <span className="rounded-full bg-gray-200/70 px-3 py-0.5 text-[10px] font-semibold text-gray-600">
                Today
              </span>
            </div>

            {activeConversation.messages.map((msg) => {
              const isUser = msg.sender === 'user'

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Left Avatar for Received Messages */}
                  {!isUser && (
                    <img
                      src={activeConversation.avatar}
                      alt={activeConversation.name}
                      className="h-7 w-7 rounded-full object-cover shrink-0 mb-1"
                    />
                  )}

                  {/* Speech Bubble */}
                  <div
                    className={`max-w-[78%] sm:max-w-[68%] p-3 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#041534] text-white rounded-2xl rounded-br-xs shadow-xs'
                        : 'bg-white text-gray-900 border border-gray-200/80 rounded-2xl rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {/* Attached Image / PDF Card */}
                    {msg.attachment && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                        {msg.attachment.type === 'image' && (
                          <img
                            src={msg.attachment.url}
                            alt={msg.attachment.title}
                            className="h-44 w-full object-cover"
                          />
                        )}
                        <div className="p-2 text-[11px] bg-white text-gray-800 font-medium flex items-center justify-between">
                          <span className="truncate">{msg.attachment.title}</span>
                          <span className="text-gray-400 text-[10px] shrink-0">{msg.attachment.size}</span>
                        </div>
                      </div>
                    )}

                    <p className={msg.isEmojiOnly ? 'text-3xl' : ''}>{msg.text}</p>

                    {/* Timestamp & Seen Tick */}
                    <div
                      className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                        isUser ? 'text-gray-300' : 'text-gray-400'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {isUser && (
                        <span>
                          {msg.status === 'seen' ? (
                            <IconChecks size={13} className="text-amber-400" />
                          ) : (
                            <IconCheck size={13} />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* ============================================================= */}
          {/* Messenger Bottom Input Bar                                    */}
          {/* ============================================================= */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 border-t border-gray-100 bg-white p-3 shrink-0"
          >
            {/* Attachment Icons */}
            <div className="flex items-center gap-1 text-gray-500">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                title="Attach Photo"
              >
                <IconPhoto size={20} />
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                title="Attach Document"
              >
                <IconPaperclip size={20} />
              </button>
            </div>

            {/* Input Field */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeConversation.name.split(' ')[0]}...`}
                className="w-full rounded-full border border-gray-200 bg-gray-100 px-4 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#041534]"
              />
            </div>

            {/* Action Button: Thumbs-up or Send */}
            {inputText.trim().length > 0 ? (
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-gray-950 shadow hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all"
              >
                <IconSend size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendThumbsUp}
                aria-label="Send thumbs up"
                className="flex h-10 w-10 items-center justify-center rounded-full text-amber-500 hover:bg-amber-50 active:scale-95 transition-all"
              >
                <IconThumbUp size={22} />
              </button>
            )}
          </form>
        </section>

        {/* =============================================================== */}
        {/* 3. RIGHT SIDEBAR: Messenger Conversation & Booking Details Pane */}
        {/* =============================================================== */}
        {showDetailsPane && (
          <aside className="hidden lg:flex w-72 flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm overflow-y-auto space-y-4 shrink-0 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-[#041534]">Conversation Info</h3>
              <button
                type="button"
                onClick={() => setShowDetailsPane(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
              >
                <IconArrowLeft size={16} />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-2 h-16 w-16 overflow-hidden rounded-full border-2 border-amber-400 shadow-sm">
                <img
                  src={activeConversation.avatar}
                  alt={activeConversation.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h4 className="text-sm font-bold text-gray-900">{activeConversation.name}</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">{activeConversation.role}</p>
              <p className="text-[11px] text-gray-400">{activeConversation.university}</p>
            </div>

            {/* Booking Summary Box */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs space-y-2">
              <div className="flex items-center justify-between font-semibold text-gray-900">
                <span>Session Booking</span>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  {activeConversation.booking.status}
                </span>
              </div>
              <p className="text-gray-600">{activeConversation.booking.dateTime}</p>
              <p className="text-gray-600">{activeConversation.booking.location}</p>
              <p className="font-bold text-amber-800">{activeConversation.booking.rate}</p>
            </div>

            {/* Shared Media */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700">Shared Files</span>
              <div className="rounded-xl border border-gray-200 p-2.5 text-xs flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2 truncate">
                  <IconFileText size={16} className="text-amber-600 shrink-0" />
                  <span className="truncate text-gray-800 font-medium">Reaction_Summary.png</span>
                </div>
                <IconChevronRight size={14} className="text-gray-400 shrink-0" />
              </div>
            </div>

            {/* Privacy & Escrow Note */}
            <div className="rounded-xl bg-blue-50 p-3 text-[11px] text-blue-900 flex items-start gap-2 border border-blue-200">
              <IconShieldCheck size={16} className="text-blue-700 shrink-0 mt-0.5" />
              <span>All in-app messages and tutor payments are secured with CampusHustle Escrow Protection.</span>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
