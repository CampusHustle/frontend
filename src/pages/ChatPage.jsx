import ChatScreen from '../screens/ChatScreen.jsx'

export default function ChatPage({ user, onNavigate, onLogout }) {
  return <ChatScreen user={user} onNavigate={onNavigate} onLogout={onLogout} />
}
