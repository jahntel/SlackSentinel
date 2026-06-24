import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import FocusMode from './pages/FocusMode'
import Timeline from './pages/Timeline'
import Settings from './pages/Settings'
import Messages from './pages/Messages'
import { useSentinelStore } from './lib/store'
import { useEffect } from 'react'

function App() {
  const { user, setUser, setSettings } = useSentinelStore()

  useEffect(() => {
    if (!user) {
      setUser({ id: 'demo-user-001', slackUserId: 'U12345', displayName: 'Alex Developer', avatarUrl: 'https://images.pexels.com/photo/220453/photo-220453.jpeg?w=80&h=80&crop=1' })
      setSettings({
        id: 'settings-001', user_id: 'demo-user-001',
        keywords_critical: ['production', 'outage', 'security breach'],
        keywords_high: ['review', 'deadline', 'client'],
        keywords_low: ['donut', 'lunch', 'meme', 'birthday'],
        interrupt_keywords: ['urgent', 'emergency', 'down', 'outage', 'critical'],
        default_focus_duration_minutes: 120, focus_end_time: '16:00',
        auto_classify: true, auto_timeline_generate: true,
        deep_work_message: 'I am currently in deep work mode. If this is urgent, click the interrupt button.',
        created_at: new Date().toISOString(), updated_at: new Date().toISOString()
      })
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/focus" element={<FocusMode />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
