import React, { useState, useEffect } from 'react'
import { createSocialLink, updateSocialLink } from '../../../api'
import AdminModal from './AdminModal'
import toast from 'react-hot-toast'

export default function SocialFormModal({ isOpen, onClose, social, onSuccess }) {
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    icon: '',
    order: 0,
    is_active: true
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (social) {
      setFormData({
        platform: social.platform || '',
        url: social.url || '',
        icon: social.icon || '',
        order: social.order || 0,
        is_active: social.is_active !== false
      })
    } else {
      setFormData({
        platform: '',
        url: '',
        icon: '',
        order: 0,
        is_active: true
      })
    }
  }, [social, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (social?.id) {
        await updateSocialLink(social.id, formData)
        toast.success('Social link updated successfully')
      } else {
        await createSocialLink(formData)
        toast.success('Social link created successfully')
      }
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save social link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={social ? 'Edit Social Link' : 'Add Social Link'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Platform Name *</label>
          <input
            type="text"
            className="input-field text-sm"
            placeholder="e.g. GitHub, LinkedIn, Twitter"
            value={formData.platform}
            onChange={e => setFormData({ ...formData, platform: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            {formData.platform.toLowerCase() === 'phone' ? 'Mobile Number *' : 'Profile / Link URL *'}
          </label>
          <input
            type={formData.platform.toLowerCase() === 'phone' ? 'tel' : 'url'}
            className="input-field text-sm"
            placeholder={formData.platform.toLowerCase() === 'phone' ? 'e.g. +91 8870539407' : 'https://github.com/username'}
            value={formData.url}
            onChange={e => setFormData({ ...formData, url: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Icon Name (optional)</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="e.g. github, linkedin, twitter"
              value={formData.icon}
              onChange={e => setFormData({ ...formData, icon: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Order</label>
            <input
              type="number"
              className="input-field text-sm"
              value={formData.order}
              onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            />
          </div>
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
            {loading ? 'Saving...' : 'Save Social Link'}
          </button>
        </div>
      </form>
    </AdminModal>
  )
}
