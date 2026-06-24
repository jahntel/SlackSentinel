import { motion } from 'framer-motion'
import { format, isToday, isYesterday } from 'date-fns'
import { BoltIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, ExclamationTriangleIcon, FlagIcon, TrophyIcon } from '@heroicons/react/24/outline'
import { useSentinelStore } from '../lib/store'

const eventIcons = { issue: ExclamationTriangleIcon, discussion: ChatBubbleLeftRightIcon, resolution: CheckCircleIcon, milestone: TrophyIcon, decision: FlagIcon }
const eventColors = { issue: 'bg-red-100 text-red-600 border-red-200', discussion: 'bg-blue-100 text-blue-600 border-blue-200', resolution: 'bg-emerald-100 text-emerald-600 border-emerald-200', milestone: 'bg-pink-100 text-pink-600 border-pink-200', decision: 'bg-purple-100 text-purple-600 border-purple-200' }

const demoTimeline = [
  { id: '1', event_type: 'issue' as const, title: 'API Container Crashing', summary: 'Alex noted that the API container was crashing under heavy payload sizes. Initial investigation pointed to memory leaks.', channel_name: '#engineering', involved_users: [{ name: 'Alex Chen', avatar: 'https://images.pexels.com/photo/2379005/photo-2379005.jpeg?w=40&h=40&crop=1' }], occurred_at: new Date(Date.now() - 1000*60*60*24*2).toISOString() },
  { id: '2', event_type: 'discussion' as const, title: 'Fix Strategy Debate', summary: 'The team debated between optimizing database queries or scaling the cluster. They chose to optimize indexing first.', channel_name: '#dev-team', involved_users: [{ name: 'Sarah', avatar: 'https://images.pexels.com/photo/7749094/photo-7749094.jpeg?w=40&h=40&crop=1' }, { name: 'Mike', avatar: 'https://images.pexels.com/photo/220453/photo-220453.jpeg?w=40&h=40&crop=1' }], occurred_at: new Date(Date.now() - 1000*60*60*24).toISOString() },
  { id: '3', event_type: 'resolution' as const, title: 'Hotfix Deployed', summary: 'Sarah pushed a hotfix resolving the memory leak. Code is deployed and stable.', channel_name: '#engineering', involved_users: [{ name: 'Sarah', avatar: 'https://images.pexels.com/photo/7749094/photo-7749094.jpeg?w=40&h=40&crop=1' }], occurred_at: new Date(Date.now() - 1000*60*60*12).toISOString() },
  { id: '4', event_type: 'milestone' as const, title: 'Sprint Goals Met', summary: 'Team successfully completed all sprint objectives ahead of schedule.', channel_name: '#general', involved_users: [], occurred_at: new Date(Date.now() - 1000*60*60*6).toISOString() },
]

export default function Timeline() {
  const { focusSession } = useSentinelStore()

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Catch-Me-Up Timeline</h1>
        <p className="text-slate-600">AI-generated summary of important events</p>
      </motion.div>

      {focusSession?.is_active && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div><h3 className="text-lg font-semibold mb-1">Generate Catch-Me-Up Summary</h3><p className="text-emerald-100 text-sm">Get an AI-curated timeline of what happened during your focus session</p></div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 rounded-xl font-medium hover:bg-emerald-50 transition-all"><BoltIcon className="w-5 h-5" />Generate Timeline</button>
          </div>
        </motion.div>
      )}

      <div className="max-w-3xl mx-auto">
        {demoTimeline.map((event, index) => {
          const Icon = eventIcons[event.event_type]
          const date = new Date(event.occurred_at)
          const dateLabel = isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'EEEE, MMMM d')

          return (
            <motion.div key={event.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index*0.1 }} className="relative pl-8 pb-8 last:pb-0">
              {index < demoTimeline.length - 1 && <div className="absolute left-[14px] top-10 bottom-0 w-0.5 bg-slate-200" />}
              <div className="relative">
                <div className={`absolute -left-8 top-1 w-7 h-7 rounded-full border-2 flex items-center justify-center ${eventColors[event.event_type]}`}><Icon className="w-3.5 h-3.5" /></div>
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 ml-2">
                  <div className="flex items-center justify-between mb-2"><span className="text-xs text-slate-500 font-medium">{dateLabel}</span><span className="text-xs text-slate-400">{format(date, 'h:mm a')}</span></div>
                  <h4 className="font-semibold text-slate-800 mb-2">{event.title}</h4>
                  <p className="text-sm text-slate-600 mb-3">{event.summary}</p>
                  <div className="flex items-center justify-between">
                    {event.channel_name && <span className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">{event.channel_name}</span>}
                    {event.involved_users.length > 0 && (
                      <div className="flex items-center gap-1">
                        {event.involved_users.slice(0, 3).map((user, i) => <img key={i} src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full border-2 border-white -ml-1 first:ml-0" title={user.name} />)}
                        {event.involved_users.length > 3 && <span className="text-xs text-slate-500 ml-1">+{event.involved_users.length - 3}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
