import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SentinelState {
  user: { id: string; slackUserId: string; displayName: string; avatarUrl: string } | null
  settings: { id: string; user_id: string; keywords_critical: string[]; keywords_high: string[]; keywords_low: string[]; interrupt_keywords: string[]; default_focus_duration_minutes: number; focus_end_time: string; auto_classify: boolean; auto_timeline_generate: boolean; deep_work_message: string; created_at: string; updated_at: string } | null
  focusSession: { id: string; user_id: string; started_at: string; scheduled_end: string; mode: string; context_description: string | null; is_active: boolean; ended_at: string | null } | null
  pendingMessages: unknown[]
  isLoading: boolean
  setUser: (user: SentinelState['user']) => void
  setSettings: (settings: SentinelState['settings']) => void
  setFocusSession: (session: SentinelState['focusSession']) => void
  setLoading: (loading: boolean) => void
  interruptSession: () => void
  startFocusSession: (duration?: number, context?: string) => void
  endFocusSession: () => void
}

export const useSentinelStore = create<SentinelState>()(
  persist(
    (set, get) => ({
      user: null, settings: null, focusSession: null, pendingMessages: [], isLoading: false,
      setUser: (user) => set({ user }),
      setSettings: (settings) => set({ settings }),
      setFocusSession: (session) => set({ focusSession: session }),
      setLoading: (loading) => set({ isLoading: loading }),
      interruptSession: () => { const { pendingMessages } = get() as SentinelState; set({ pendingMessages: [] }) },
      startFocusSession: (duration = 120, context) => {
        const now = new Date()
        const scheduledEnd = new Date(now.getTime() + duration * 60000)
        set({
          focusSession: {
            id: crypto.randomUUID(), user_id: get().user?.id || '',
            started_at: now.toISOString(), scheduled_end: scheduledEnd.toISOString(),
            mode: 'deep_work', context_description: context || null, is_active: true, ended_at: null
          }
        })
      },
      endFocusSession: () => {
        const { focusSession } = get() as SentinelState
        if (focusSession) set({ focusSession: { ...focusSession, is_active: false, ended_at: new Date().toISOString() } })
      }
    }),
    { name: 'sentinel-storage', partialize: (state) => ({ user: state.user, settings: state.settings }) }
  )
)
