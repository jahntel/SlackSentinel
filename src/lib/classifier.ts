export type Priority = 'critical' | 'high' | 'normal' | 'low'

export interface ClassificationResult {
  priority: Priority
  confidence: number
  reason: string
  matchedKeywords: string[]
}

export interface MessageContext {
  text: string
  senderId?: string
  senderName?: string
  channelId?: string
  channelName?: string
  isDM?: boolean
}

const CRITICAL_PATTERNS = [
  /prod(uction)?\s*(is\s*)?(down|crash(ed)?|fail(ing|ed))/i,
  /outage/i, /database\s*(down|crash|fail|erro)/i, /500\s*error/i,
  /server\s*(down|unresponsive)/i, /security\s*(breach|incident|vulnerability)/i,
  /urgent/i, /emergency/i, /critical\s*(bug|issue|error)/i,
]

const HIGH_PATTERNS = [
  /need\s*(your|some)?\s*(help|review|eyes)/i, /(need|want)\s*to\s*talk/i,
  /blocking\s*(me|you|team)/i, /deadline/i, /client\s*(call|meeting|review)/i, /asap/i,
]

const LOW_PATTERNS = [
  /donuts?\s*(in|at)/i, /lunch/i, /meme/i, /funny/i, /happy\s*(birthday|monday|friday)/i, /weekend/i,
]

export function classifyMessage(message: MessageContext): ClassificationResult {
  const text = message.text.toLowerCase()
  let priority: Priority = 'normal'
  let confidence = 0.5
  let reason = 'General message'
  const matchedKeywords: string[] = []

  for (const pattern of CRITICAL_PATTERNS) {
    if (pattern.test(text)) { priority = 'critical'; confidence = 0.9; reason = 'Critical system/production issue detected'; return { priority, confidence, reason, matchedKeywords } }
  }
  for (const pattern of HIGH_PATTERNS) {
    if (pattern.test(text)) { priority = 'high'; confidence = 0.8; reason = 'Work-related priority message'; return { priority, confidence, reason, matchedKeywords } }
  }
  for (const pattern of LOW_PATTERNS) {
    if (pattern.test(text)) { priority = 'low'; confidence = 0.7; reason = 'Social/casual message'; return { priority, confidence, reason, matchedKeywords } }
  }

  return { priority, confidence, reason: 'General message without specific priority indicators', matchedKeywords }
}
