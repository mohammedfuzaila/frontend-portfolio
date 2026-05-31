import React, { useState, useEffect } from 'react'
import { createService, updateService } from '../../../api'
import AdminModal from './AdminModal'
import toast from 'react-hot-toast'

export default function ServiceFormModal({ isOpen, onClose, service, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'code',
    features: '',
    order: 0,
    is_active: true
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || '',
        description: service.description || '',
        icon: service.icon || 'code',
        features: Array.isArray(service.features) ? service.features.join('\n') : '',
        order: service.order || 0,
        is_active: service.is_active !== false
      })
    } else {
      setFormData({
        title: '',
        description: '',
        icon: 'code',
        features: '',
        order: 0,
        is_active: true
      })
    }
  }, [service, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Parse features lines to array
    const featuresArray = formData.features
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0)

    const submissionData = {
      ...formData,
      features: featuresArray
    }

    try {
      if (service?.id) {
        await updateService(service.id, submissionData)
        toast.success('Service updated successfully')
      } else {
        await createService(submissionData)
        toast.success('Service created successfully')
      }
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save service')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={service ? 'Edit Service' : 'Add Service'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Service Title *</label>
            <input
              type="text"
              className="input-field text-sm"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Icon Name *</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="e.g. code, layout, server, database"
              value={formData.icon}
              onChange={e => setFormData({ ...formData, icon: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Description *</label>
          <textarea
            className="input-field text-sm h-24 resize-none"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Service Features / Bullet Points (One per line)</label>
          <textarea
            className="input-field text-sm h-32 resize-none font-mono"
            placeholder="Custom UI Design&#10;Mobile Responsiveness&#10;API Integration"
            value={formData.features}
            onChange={e => setFormData({ ...formData, features: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Display Order</label>
          <input
            type="number"
            className="input-field text-sm"
            value={formData.order}
            onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 text-sm text-slate-300 font-medium cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary-600 focus:ring-primary-500 focus:ring-offset-slate-900"
              checked={formData.is_active}
              onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
            />
            Active (Show on Site)
          </label>
        </div>

        <div className="border-t border-slate-800 pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </form>
    </AdminModal>
  )
}
