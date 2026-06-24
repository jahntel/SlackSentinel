import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface MessageCardProps {
  message: { id: string; sender_name: string; sender_avatar: string; message_text: string; priority: 'critical' | 'high' | 'normal' | 'low'; channel_name: string | null; is_dm?: boolean; classification_reason?: string; created_at: string }
  onProcess?: () => void
  compact?: boolean
}

const priorityStyles = {
  critical: { badge: 'bg-red-100 text-red-700 border-red-200', indicator: 'bg-red-500', label: 'Critical' },
  high: { badge: 'bg-amber-100 text-amber-700 border-amber-200', indicator: 'bg-amber-500', label: 'High' },
  normal: { badge: 'bg-blue-100 text-blue-700 border-blue-200', indicator: 'bg-blue-500', label: 'Normal' },
  low: { badge: 'bg-slate-100 text-slate-600 border-slate-200', indicator: 'bg-slate-400', label: 'Low' },
}

export default function MessageCard({ message, onProcess, compact = false }: MessageCardProps) {
  const style = priorityStyles[message.priority]

  return (
    <motion.div layout className={`bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden ${message.priority === 'critical' ? 'ring-2 ring-red-500/30' : ''}`}>
      {message.priority === 'critical' && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-100 flex items-center gap-2">
          <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
          <span className="text-xs font-medium text-red-700">Immediate attention required</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img src={message.sender_avatar} alt={message.sender_name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-slate-800 text-sm">{message.sender_name}</span>
              <span className="text-xs text-slate-400">{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${style.badge}`}>{style.label}</span>
            </div>
            {message.channel_name && <p className="text-xs text-slate-500 mb-1">{message.channel_name}</p>}
            {message.is_dm && <p className="text-xs text-purple-600 mb-1">Direct Message</p>}
            <p className="text-sm text-slate-700 line-clamp-2">{message.message_text}</p>
            {message.classification_reason && !compact && <p className="text-xs text-slate-500 mt-2 italic">{message.classification_reason}</p>}
          </div>
          <div className={`w-2 h-full min-h-[40px] rounded-full ${style.indicator}`} />
        </div>
        {!compact && onProcess && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
            <button onClick={onProcess} className="flex items-center justify-center gap-1 py-2 px-4 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
              <CheckIcon className="w-4 h-4" /> Mark Done
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
