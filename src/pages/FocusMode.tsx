import { motion, AnimatePresence } from 'framer-motion'
import { useSentinelStore } from '../lib/store'
import { useState, useEffect } from 'react'
import { ShieldCheckIcon, PlayIcon, StopIcon, BoltIcon, CodeBracketIcon, DocumentTextIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { differenceInSeconds } from 'date-fns'

const contextPresets = [
  { id: 'security', label: 'Security Patch', icon: ShieldCheckIcon },
  { id: 'feature', label: 'Feature Dev', icon: CodeBracketIcon },
  { id: 'review', label: 'Code Review', icon: DocumentTextIcon },
  { id: 'debug', label: 'Debugging', icon: BoltIcon },
  { id: 'custom', label: 'Custom', icon: QuestionMarkCircleIcon },
]

export default function FocusMode() {
  const { focusSession, startFocusSession, endFocusSession, pendingMessages, interruptSession } = useSentinelStore()
  const [duration, setDuration] = useState(120)
  const [selectedPreset, setSelectedPreset] = useState(contextPresets[0])
  const [customContext, setCustomContext] = useState('')
  const [timeRemaining, setTimeRemaining] = useState({ minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!focusSession?.scheduled_end) return
    const interval = setInterval(() => {
      const totalSeconds = Math.max(0, differenceInSeconds(new Date(focusSession.scheduled_end!), new Date()))
      setTimeRemaining({ minutes: Math.floor(totalSeconds / 60), seconds: totalSeconds % 60 })
    }, 1000)
    return () => clearInterval(interval)
  }, [focusSession?.scheduled_end])

  const handleStart = () => { const context = selectedPreset.id === 'custom' ? customContext : selectedPreset.label; startFocusSession(duration, context) }
  const progress = focusSession?.scheduled_end ? Math.max(0, Math.min(100, (1 - differenceInSeconds(new Date(focusSession.scheduled_end), new Date()) / (duration * 60)) * 100)) : 0

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Focus Mode</h1>
        <p className="text-slate-600">Activate your deep work shield</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {focusSession?.is_active ? (
          <motion.div key="active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-8"><div className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse" /><span className="text-lg font-medium text-emerald-400">Deep Work Shield Active</span></div>
                  <div className="text-center mb-8">
                    <div className="text-7xl font-bold font-mono tracking-tight mb-2">{String(timeRemaining.minutes).padStart(2, '0')}:{String(timeRemaining.seconds).padStart(2, '0')}</div>
                    <p className="text-slate-400">remaining</p>
                  </div>
                  <div className="mb-8"><div className="h-2 bg-slate-700 rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-purple-500 to-blue-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} /></div></div>
                  <div className="bg-slate-800/50 rounded-2xl p-4 mb-6"><p className="text-sm text-slate-400 mb-1">Working on</p><p className="font-medium text-lg">{focusSession.context_description || 'Deep work session'}</p></div>
                  <div className="bg-slate-800/50 rounded-2xl p-4 mb-6"><div className="flex items-center justify-between mb-2"><p className="text-sm text-slate-400">Messages held</p><span className="text-2xl font-bold">{pendingMessages.length}</span></div><p className="text-xs text-slate-500">Messages will be delivered when session ends</p></div>
                  <div className="flex gap-3">
                    <button onClick={endFocusSession} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"><StopIcon className="w-5 h-5" />End Session</button>
                    <button onClick={interruptSession} className="flex-1 py-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"><BoltIcon className="w-5 h-5" />Allow Interruptions</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="setup" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 bg-gradient-to-r from-sentinel-500 to-sentinel-600 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm"><ShieldCheckIcon className="w-8 h-8" /></div>
                    <div><h2 className="text-2xl font-bold">Start Deep Work Session</h2><p className="text-sentinel-100">Configure your focus protection shield</p></div>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Session Duration</label>
                    <div className="grid grid-cols-8 gap-3">
                      {[30, 60, 90, 120, 150, 180, 240, 480].map(mins => (
                        <button key={mins} onClick={() => setDuration(mins)} className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${duration === mins ? 'bg-sentinel-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{mins >= 60 ? `${mins/60}h` : `${mins}m`}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">What are you working on?</label>
                    <div className="grid grid-cols-5 gap-3">
                      {contextPresets.map(preset => (
                        <button key={preset.id} onClick={() => setSelectedPreset(preset)} className={`py-4 px-3 rounded-xl flex flex-col items-center gap-2 transition-all ${selectedPreset.id === preset.id ? 'bg-sentinel-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                          <preset.icon className="w-6 h-6" /><span className="text-xs font-medium">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedPreset.id === 'custom' && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}><input type="text" value={customContext} onChange={e => setCustomContext(e.target.value)} placeholder="Describe what you're working on..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sentinel-500 outline-none" /></motion.div>}
                  <button onClick={handleStart} className="w-full py-4 bg-gradient-to-r from-sentinel-500 to-sentinel-600 text-white rounded-xl font-medium shadow-lg flex items-center justify-center gap-2"><PlayIcon className="w-5 h-5" />Activate Deep Work Shield</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
