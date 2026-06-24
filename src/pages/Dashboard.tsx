import { motion } from 'framer-motion'
import { ShieldCheckIcon, ClockIcon, BellAlertIcon, ChatBubbleLeftRightIcon, PlayIcon, StopIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { useSentinelStore } from '../lib/store'
import { useState } from 'react'
import MessageCard from '../components/MessageCard'
import { differenceInMinutes } from 'date-fns'

const demoMessages = [
  { id: '1', sender_name: 'Sarah Chen', sender_avatar: 'https://images.pexels.com/photo/7749094/photo-7749094.jpeg?w=80&h=80&crop=1', message_text: 'The production database migrations are failing with a 500 error. Need immediate help.', priority: 'critical' as const, channel_name: '#engineering', classification_reason: 'Critical system/production issue detected', created_at: new Date(Date.now() - 1000*60*5).toISOString() },
  { id: '2', sender_name: 'Mike Johnson', sender_avatar: 'https://images.pexels.com/photo/220453/photo-220453.jpeg?w=80&h=80&crop=1', message_text: 'Can you review the PR for the auth flow? Client demo is in 2 hours.', priority: 'high' as const, channel_name: '#dev-team', classification_reason: 'Deadline related with client impact', created_at: new Date(Date.now() - 1000*60*15).toISOString() },
  { id: '3', sender_name: 'Emma Wilson', sender_avatar: 'https://images.pexels.com/photo/1181686/photo-1181686.jpeg?w=80&h=80&crop=1', message_text: 'Hey everyone, there are donuts in the breakroom!', priority: 'low' as const, channel_name: '#general', classification_reason: 'Social/casual announcement', created_at: new Date(Date.now() - 1000*60*30).toISOString() },
  { id: '4', sender_name: 'David Park', sender_avatar: 'https://images.pexels.com/photo/2379005/photo-2379005.jpeg?w=80&h=80&crop=1', message_text: 'I need your eyes on this firewall audit before the client call.', priority: 'high' as const, is_dm: true, channel_name: null, classification_reason: 'Urgent request with timeline', created_at: new Date(Date.now() - 1000*60*45).toISOString() },
  { id: '5', sender_name: 'Lisa Zhang', sender_avatar: 'https://images.pexels.com/photo/1181686/photo-1181686.jpeg?w=80&h=80&crop=1', message_text: 'Team standup notes are uploaded.', priority: 'normal' as const, channel_name: '#dev-team', classification_reason: 'General update', created_at: new Date(Date.now() - 1000*60*60).toISOString() },
]

export default function Dashboard() {
  const { focusSession, startFocusSession, endFocusSession, pendingMessages } = useSentinelStore()
  const [focusDuration, setFocusDuration] = useState(120)
  const [focusContext, setFocusContext] = useState('')
  const [showStartModal, setShowStartModal] = useState(false)
  const sessionRemaining = focusSession?.scheduled_end ? differenceInMinutes(new Date(focusSession.scheduled_end), new Date()) : 0

  const handleStartFocus = () => { startFocusSession(focusDuration, focusContext); setShowStartModal(false) }

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-600">Monitor your focus protection and message priorities</p>
      </motion.div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { icon: ShieldCheckIcon, label: 'Focus Status', value: focusSession?.is_active ? 'Protected' : 'Available', bg: focusSession?.is_active ? 'bg-purple-100' : 'bg-slate-100', color: focusSession?.is_active ? 'text-purple-600' : 'text-slate-400' },
          { icon: ExclamationTriangleIcon, label: 'Critical Messages', value: '2', bg: 'bg-red-50', color: 'text-red-500' },
          { icon: ClockIcon, label: 'Held Messages', value: pendingMessages.length, bg: 'bg-slate-100', color: 'text-slate-500' },
          { icon: ChartBarIcon, label: 'Focus Time Today', value: '3.5h', bg: 'bg-emerald-50', color: 'text-emerald-500' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1*i }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
              <div><p className="text-sm text-slate-500">{stat.label}</p><p className="text-xl font-bold text-slate-800">{stat.value}</p></div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gradient-to-r from-sentinel-500 to-sentinel-700 rounded-2xl p-8 mb-8 text-white shadow-lg shadow-sentinel-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm"><ShieldCheckIcon className="w-8 h-8" /></div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{focusSession?.is_active ? `${sessionRemaining} min remaining` : 'Deep Work Shield'}</h2>
              <p className="text-sentinel-100">{focusSession?.is_active ? focusSession.context_description || 'Focus session active' : 'Protect your focus time and intelligently filter interruptions'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {focusSession?.is_active ? (
              <>
                <button onClick={endFocusSession} className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all backdrop-blur-sm font-medium"><StopIcon className="w-5 h-5" />End Session</button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-sentinel-700 hover:bg-sentinel-50 rounded-xl transition-all font-medium">Catch Me Up</button>
              </>
            ) : (
              <button onClick={() => setShowStartModal(true)} className="flex items-center gap-2 px-6 py-3 bg-white text-sentinel-700 hover:bg-sentinel-50 rounded-xl transition-all font-medium shadow-lg"><PlayIcon className="w-5 h-5" />Start Focus Session</button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2"><BellAlertIcon className="w-5 h-5 text-red-500" />Focus Stream</h3>
            <span className="text-sm text-slate-500">Critical & High priority</span>
          </div>
          <div className="space-y-4">
            {demoMessages.filter(m => m.priority === 'critical' || m.priority === 'high').map((msg, i) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i*0.1 }}><MessageCard message={msg} /></motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2"><ChatBubbleLeftRightIcon className="w-5 h-5 text-slate-400" />Low Priority Queue</h3>
            <span className="text-sm text-slate-500">Can batch later</span>
          </div>
          <div className="space-y-4">
            {demoMessages.filter(m => m.priority === 'low' || m.priority === 'normal').map((msg, i) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i*0.1 }}><MessageCard message={msg} compact /></motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {showStartModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowStartModal(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Start Focus Session</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 60, 90, 120].map(mins => (
                    <button key={mins} onClick={() => setFocusDuration(mins)} className={`py-2 rounded-lg text-sm font-medium transition-all ${focusDuration === mins ? 'bg-sentinel-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{mins}m</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">What are you working on?</label>
                <input type="text" value={focusContext} onChange={e => setFocusContext(e.target.value)} placeholder="e.g., Security patch for auth module" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sentinel-500 focus:ring-2 focus:ring-sentinel-500/20 outline-none transition-all" />
              </div>
              <button onClick={handleStartFocus} className="w-full py-3 bg-gradient-to-r from-sentinel-500 to-sentinel-600 text-white rounded-xl font-medium">Begin Deep Work Session</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
