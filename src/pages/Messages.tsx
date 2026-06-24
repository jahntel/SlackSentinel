import { motion } from 'framer-motion'
import { useState } from 'react'
import { BellAlertIcon, ChatBubbleLeftRightIcon, ArchiveBoxIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import MessageCard from '../components/MessageCard'

const demoMessages = [
  { id: '1', sender_name: 'Sarah Chen', sender_avatar: 'https://images.pexels.com/photo/7749094/photo-7749094.jpeg?w=80&h=80&crop=1', message_text: 'The production database migrations are failing with a 500 error. Need immediate help.', priority: 'critical' as const, channel_name: '#engineering', classification_reason: 'Critical system/production issue detected', created_at: new Date(Date.now() - 1000*60*5).toISOString() },
  { id: '2', sender_name: 'Mike Johnson', sender_avatar: 'https://images.pexels.com/photo/220453/photo-220453.jpeg?w=80&h=80&crop=1', message_text: 'Can you review the PR for the auth flow? Client demo is in 2 hours.', priority: 'high' as const, channel_name: '#dev-team', classification_reason: 'Deadline related with client impact', created_at: new Date(Date.now() - 1000*60*15).toISOString() },
  { id: '3', sender_name: 'Emma Wilson', sender_avatar: 'https://images.pexels.com/photo/1181686/photo-1181686.jpeg?w=80&h=80&crop=1', message_text: 'Hey everyone, there are donuts in the breakroom!', priority: 'low' as const, channel_name: '#general', classification_reason: 'Social/casual announcement', created_at: new Date(Date.now() - 1000*60*30).toISOString() },
  { id: '4', sender_name: 'David Park', sender_avatar: 'https://images.pexels.com/photo/2379005/photo-2379005.jpeg?w=80&h=80&crop=1', message_text: 'I need your eyes on this firewall audit before the client call.', priority: 'high' as const, channel_name: null, is_dm: true, classification_reason: 'Urgent request', created_at: new Date(Date.now() - 1000*60*45).toISOString() },
  { id: '5', sender_name: 'Lisa Zhang', sender_avatar: 'https://images.pexels.com/photo/1181686/photo-1181686.jpeg?w=80&h=80&crop=1', message_text: 'Check out this meme about sprint velocity!', priority: 'low' as const, channel_name: '#random', classification_reason: 'Casual/meme message', created_at: new Date(Date.now() - 1000*60*60).toISOString() },
]

export default function Messages() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'low'>('all')
  const [search, setSearch] = useState('')
  const filteredMessages = demoMessages.filter(m => filter === 'all' || m.priority === filter).filter(m => !search || m.message_text.toLowerCase().includes(search.toLowerCase()) || m.sender_name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Message Stream</h1>
        <p className="text-slate-600">View and manage your prioritized messages</p>
      </motion.div>

      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sentinel-500 outline-none" />
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'critical', 'high', 'low'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-sentinel-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: BellAlertIcon, label: 'Critical', count: demoMessages.filter(m => m.priority === 'critical').length, bg: 'bg-red-100', color: 'text-red-500' },
          { icon: BellAlertIcon, label: 'High Priority', count: demoMessages.filter(m => m.priority === 'high').length, bg: 'bg-amber-100', color: 'text-amber-500' },
          { icon: ArchiveBoxIcon, label: 'Low Priority', count: demoMessages.filter(m => m.priority === 'low').length, bg: 'bg-slate-100', color: 'text-slate-500' },
          { icon: ChatBubbleLeftRightIcon, label: 'Total', count: demoMessages.length, bg: 'bg-blue-100', color: 'text-blue-500' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }} className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
              <div><p className="text-lg font-bold text-slate-800">{stat.count}</p><p className="text-xs text-slate-500">{stat.label}</p></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        {filter === 'all' || filter === 'critical' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2"><BellAlertIcon className="w-4 h-4" />Critical Priority</h3>
            <div className="grid grid-cols-2 gap-4">{filteredMessages.filter(m => m.priority === 'critical').map((msg, i) => <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i*0.1 }}><MessageCard message={msg} /></motion.div>)}</div>
          </motion.div>
        ) : null}
        {filter === 'all' || filter === 'high' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <h3 className="text-sm font-semibold text-amber-600 mb-3 flex items-center gap-2"><BellAlertIcon className="w-4 h-4" />High Priority</h3>
            <div className="grid grid-cols-2 gap-4">{filteredMessages.filter(m => m.priority === 'high').map((msg, i) => <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i*0.1 }}><MessageCard message={msg} /></motion.div>)}</div>
          </motion.div>
        ) : null}
        {filter === 'all' || filter === 'low' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <h3 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2"><ArchiveBoxIcon className="w-4 h-4" />Low Priority (Digest)</h3>
            <div className="grid grid-cols-2 gap-4">{filteredMessages.filter(m => m.priority === 'low').map((msg, i) => <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i*0.1 }}><MessageCard message={msg} compact /></motion.div>)}</div>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}
