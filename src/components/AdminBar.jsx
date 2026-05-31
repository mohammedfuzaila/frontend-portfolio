import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchSettings, updateSiteSettings } from '../api'
import toast from 'react-hot-toast'

export default function AdminBar() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    if (open) {
      fetchSettings().then(({ data }) => setSettings(data)).catch(() => toast.error('Failed to load settings'))
    }
  }, [open])

  if (!user) return null

  const toggleSetting = async (key) => {
    try {
      const newVal = !settings[key]
      await updateSiteSettings({ [key]: newVal })
      setSettings({ ...settings, [key]: newVal })
      toast.success('Setting updated')
    } catch {
      toast.error('Update failed')
    }
  }

  return (
    <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-3">
      <a href="/admin/dashboard" className="px-3 py-2 bg-primary-600 text-white rounded-xl shadow">Admin Dashboard</a>
      <button onClick={() => setOpen(true)} className="px-3 py-2 bg-slate-800 text-white rounded-xl shadow">Edit Site</button>

      {open && settings && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Site Settings</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400">Close</button>
            </div>
            <div className="space-y-2 max-h-72 overflow-auto">
              {Object.entries(settings).map(([k, v]) => (
                (k === 'id' || k === 'updated_at') ? null : (
                  <div key={k} className="flex items-center justify-between">
                    <div className="text-sm text-slate-300">{k.replace(/_/g, ' ')}</div>
                    <button onClick={() => toggleSetting(k)} className={`px-3 py-1 rounded ${v ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                      {v ? 'ON' : 'OFF'}
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
