import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSentinelStore } from '../lib/store'
import { BellIcon, BoltIcon, CodeBracketIcon, DocumentTextIcon, PlusIcon, TrashIcon, InformationCircleIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function Settings() {
  const { settings, setSettings } = useSentinelStore()
  const [activeTab, setActiveTab] = useState<'keywords' | 'focus' | 'slack' | 'mcp'>('keywords')
  const [newKeyword, setNewKeyword] = useState('')
  const [keywordType, setKeywordType] = useState<'critical' | 'high' | 'low'>('critical')
  const [saving, setSaving] = useState(false)

  const handleAddKeyword = () => {
    if (!newKeyword.trim() || !settings) return
    const field = `keywords_${keywordType}` as const
    const currentKeywords = settings[field] || []
    if (currentKeywords.includes(newKeyword.trim())) return
    setSettings({ ...settings, [field]: [...currentKeywords, newKeyword.trim()] })
    setNewKeyword('')
  }

  const handleRemoveKeyword = (type: 'critical' | 'high' | 'low', keyword: string) => {
    if (!settings) return
    const field = `keywords_${type}` as const
    setSettings({ ...settings, [field]: settings[field].filter(k => k !== keyword) })
  }

  const handleSave = async () => { setSaving(true); await new Promise(r => setTimeout(r, 500)); setSaving(false) }

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings</h1>
        <p className="text-slate-600">Configure SlackSentinel</p>
      </motion.div>

      <div className="flex items-center gap-2 mb-8 bg-slate-100 p-1 rounded-xl w-fit">
        {(['keywords', 'focus', 'slack', 'mcp'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
            {tab === 'keywords' && 'Priority Keywords'}
            {tab === 'focus' && 'Focus Mode'}
            {tab === 'slack' && 'Slack Integration'}
            {tab === 'mcp' && 'MCP Server'}
          </button>
        ))}
      </div>

      {activeTab === 'keywords' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><BoltIcon className="w-5 h-5 text-purple-600" /></div>
                <div><h3 className="font-semibold text-slate-800">Priority Keywords</h3><p className="text-sm text-slate-500">Customize how Sentinel classifies messages</p></div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <select value={keywordType} onChange={e => setKeywordType(e.target.value as 'critical' | 'high' | 'low')} className="px-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-sentinel-500 outline-none">
                  <option value="critical">Critical</option><option value="high">High</option><option value="low">Low</option>
                </select>
                <input type="text" value={newKeyword} onChange={e => setNewKeyword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddKeyword()} placeholder="Add keyword..." className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-sentinel-500 outline-none" />
                <button onClick={handleAddKeyword} className="px-4 py-2 bg-sentinel-500 text-white rounded-lg text-sm font-medium hover:bg-sentinel-600 transition-colors flex items-center gap-1"><PlusIcon className="w-4 h-4" />Add</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-red-600 mb-2">Critical Keywords (Always interrupt)</label>
                <div className="flex flex-wrap gap-2">{settings?.keywords_critical?.map(keyword => <span key={keyword} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-1">{keyword}<button onClick={() => handleRemoveKeyword('critical', keyword)} className="ml-1 hover:text-red-900"><TrashIcon className="w-3.5 h-3.5" /></button></span>)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-600 mb-2">High Priority Keywords</label>
                <div className="flex flex-wrap gap-2">{settings?.keywords_high?.map(keyword => <span key={keyword} className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm flex items-center gap-1">{keyword}<button onClick={() => handleRemoveKeyword('high', keyword)} className="ml-1 hover:text-amber-900"><TrashIcon className="w-3.5 h-3.5" /></button></span>)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Low Priority Keywords (Send to digest)</label>
                <div className="flex flex-wrap gap-2">{settings?.keywords_low?.map(keyword => <span key={keyword} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm flex items-center gap-1">{keyword}<button onClick={() => handleRemoveKeyword('low', keyword)} className="ml-1 hover:text-slate-900"><TrashIcon className="w-3.5 h-3.5" /></button></span>)}</div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800"><p className="font-medium mb-1">How Keyword Classification Works</p><p className="text-blue-700">Sentinel uses pattern matching and keyword detection. Keywords you add take priority over built-in classification.</p></div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'focus' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><BellIcon className="w-5 h-5 text-purple-600" /></div>
              <div><h3 className="font-semibold text-slate-800">Focus Mode Defaults</h3><p className="text-sm text-slate-500">Default settings for deep work sessions</p></div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Default Session Duration</label>
                <select value={settings?.default_focus_duration_minutes || 120} onChange={e => { if (settings) setSettings({ ...settings, default_focus_duration_minutes: parseInt(e.target.value) }) }} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sentinel-500 outline-none">
                  <option value="30">30 minutes</option><option value="60">1 hour</option><option value="90">1.5 hours</option><option value="120">2 hours</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'slack' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6"><div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" /><span className="font-medium text-emerald-800">Connected to Demo Workspace</span></div></div>
            <div className="bg-slate-50 rounded-xl p-6">
              <h4 className="font-medium text-slate-800 mb-4">Setup Instructions</h4>
              <ol className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">1</span>Create a Slack App with scopes: channels:read, chat:write, users:read</li>
                <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">2</span>Enable Event Subscriptions for message.channels and message.im</li>
                <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">3</span>Set the Request URL to your Sentinel webhook endpoint</li>
              </ol>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'mcp' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6"><div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" /><span className="font-medium text-emerald-800">MCP Server Running</span></div></div>
            <h4 className="font-medium text-slate-700 mb-3">Connected Tools</h4>
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center"><CodeBracketIcon className="w-4 h-4 text-white" /></div><span className="font-medium text-slate-700">VS Code</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-xs text-emerald-600">Active</span></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-orange-600 flex items-center justify-center"><DocumentTextIcon className="w-4 h-4 text-white" /></div><span className="font-medium text-slate-700">Git Context</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-xs text-emerald-600">Active</span></div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 font-mono text-sm text-slate-200"><pre>{`{\n  "mcpServers": {\n    "slacksentinel": {\n      "command": "npx",\n      "args": ["slacksentinel-mcp"]\n    }\n  }\n}`}</pre></div>
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="fixed bottom-8 right-8">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-sentinel-500 text-white rounded-xl font-medium shadow-lg hover:bg-sentinel-600 transition-all disabled:opacity-50">
          <CheckIcon className="w-5 h-5" />{saving ? 'Saving...' : 'Save Settings'}
        </button>
      </motion.div>
    </div>
  )
}
