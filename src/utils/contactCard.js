const TAG = '[[CONTACT_CARD]]'

export function encodeContactCard({ name, email, phone }) {
  return TAG + JSON.stringify({ name, email, phone: phone || null })
}

export function decodeContactCard(content) {
  if (typeof content !== 'string' || !content.startsWith(TAG)) return null
  try {
    const data = JSON.parse(content.slice(TAG.length))
    if (!data.name || !data.email) return null
    return data
  } catch {
    return null
  }
}
