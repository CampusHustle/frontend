const MAX_MESSAGE_LENGTH = 2000

export function sanitizeMessage(raw) {
  if (typeof raw !== 'string') return ''
  return raw
    .trim()
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .slice(0, MAX_MESSAGE_LENGTH)
}

export function sanitizeDisplayText(raw) {
  if (typeof raw !== 'string') return ''
  return raw
    .trim()
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .slice(0, 200)
}

export { MAX_MESSAGE_LENGTH }
