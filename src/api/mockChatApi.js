export const MOCK_PEER = {
  id: 'u-sarah',
  name: 'Sarah Johnson',
  department: 'Computer Science',
  university: 'MIT',
  email: 'sarah.johnson@mit.edu.et',
  phone: '+1 (617) 555-0192',
  profilePicUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCslQHgyweBuz6L6u4U7sX-CkO1bMxzKN-rQBsnCRSw0NFuBiUREFnqXGN0EHWLOkQH1mlmYFM_kzXGdcCLDXWU3UU03opJjSut9wuF8XDFLPRDe8NFuHSJ-B8FqAjQsDO-rbuMLwiHmr95Tm8D6VO4w7tYehufIbdQ9QcKPRKHCO2b5bXu6L0mGSef840BdjwW4SQ89f8Qzci3hTGP3lpyuPZhFxS-HCmG73rtnFddDrZQelA_fc01Ew',
}

export const INITIAL_MESSAGES = [
  {
    id: 'init-1',
    sender: 'peer',
    text: 'Hi! I saw you booked the Calculus session. Let me know what specific topics you want to cover so I can prepare!',
    time: '9:01 AM',
  },
  {
    id: 'init-2',
    sender: 'me',
    text: "Hey Sarah! Thanks for reaching out. I'm struggling a bit with derivatives and the chain rule.",
    time: '9:04 AM',
  },
  {
    id: 'init-3',
    sender: 'peer',
    text: "Perfect, I have some great practice problems for the chain rule. We'll make sure you get it down.",
    time: '9:06 AM',
  },
]

const LIVE_INCOMING = [
  {
    delayMs: 2200,
    message: {
      id: 'live-1',
      sender: 'peer',
      text: "Also, what time zone are you in? I want to make sure the session time works for both of us.",
      time: '9:09 AM',
    },
  },
  {
    delayMs: 5500,
    message: {
      id: 'live-2',
      sender: 'peer',
      text: "I usually do sessions on Zoom — does that work for you? I'll send a link once we confirm.",
      time: '9:11 AM',
    },
  },
]

// Fires mock incoming messages on a timer. Replace with socket.on('chat:message', onMessage)
// when the real backend is ready — the callback signature is identical.
export function subscribeLiveMessages(onMessage) {
  const timers = LIVE_INCOMING.map(({ delayMs, message }) =>
    setTimeout(() => onMessage(message), delayMs),
  )
  return function unsubscribe() {
    timers.forEach(clearTimeout)
  }
}
