import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HomeIcon, ShieldCheckIcon, ClockIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useSentinelStore } from '../lib/store'

const navItems = [
  { path: '/', icon: HomeIcon, label: 'Dashboard' },
  { path: '/focus', icon: ShieldCheckIcon, label: 'Focus Mode' },
  { path: '/messages', icon: ChatBubbleLeftRightIcon, label: 'Messages' },
  { path: '/timeline', icon: ClockIcon, label: 'Timeline' },
  { path: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
]

export default function Sidebar() {
  const { user, focusSession } = useSentinelStore()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 flex flex-col z-50">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sentinel-500 to-sentinel-700 flex items-center justify-center shadow-lg shadow-sentinel-500/30">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div><h1 className="font-bold text-lg text-slate-800">SlackSentinel</h1><p className="text-xs text-slate-500">Focus Protection</p></div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-sentinel-500 text-white shadow-lg shadow-sentinel-500/30' : 'text-slate-600 hover:bg-slate-100'}`}>
            <item.icon className="w-5 h-5" /><span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      {focusSession?.is_active && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-4 mb-4 p-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-white animate-pulse" /><span className="text-sm font-medium">Deep Work Active</span></div>
          <p className="text-xs opacity-80">Shield engaged</p>
        </motion.div>
      )}
      {user && (
        <div className="p-4 border-t border-slate-200/50">
          <div className="flex items-center gap-3">
            <img src={user.avatarUrl} alt={user.displayName} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1 min-w-0"><p className="font-medium text-slate-800 truncate">{user.displayName}</p><p className="text-xs text-slate-500">Connected to Slack</p></div>
          </div>
        </div>
      )}
    </aside>
  )
}
