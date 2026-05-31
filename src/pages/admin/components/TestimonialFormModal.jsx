import React, { useState, useEffect } from 'react'
import { createTestimonial, updateTestimonial } from '../../../api'
import AdminModal from './AdminModal'
import toast from 'react-hot-toast'

export default function TestimonialFormModal({ isOpen, onClose, testimonial, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    message: '',
    rating: 5,
    order: 0,
    is_active: true
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name || '',
        role: testimonial.role || '',
        company: testimonial.company || '',
        message: testimonial.message || '',
        rating: testimonial.rating || 5,
        order: testimonial.order || 0,
        is_active: testimonial.is_active !== false
      })
      setAvatarFile(null)
    } else {
      setFormData({
        name: '',
        role: '',
        company: '',
        message: '',
        rating: 5,
        order: 0,
        is_active: true
      })
      setAvatarFile(null)
    }
  }, [testimonial, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const data = new FormData()
    data.append('name', formData.name)
    data.append('role', formData.role)
    data.append('company', formData.company)
    data.append('message', formData.message)
    data.append('rating', formData.rating)
    data.append('order', formData.order)
    data.append('is_active', formData.is_active)

    if (avatarFile) {
      data.append('avatar', avatarFile)
    }

    try {
      if (testimonial?.id) {
        await updateTestimonial(testimonial.id, data)
        toast.success('Testimonial updated successfully')
      } else {
        await createTestimonial(data)
        toast.success('Testimonial created successfully')
      }
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save testimonial')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={testimonial ? 'Edit Testimonial' : 'Add Testimonial'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Client Name *</label>
            <input
              type="text"
              className="input-field text-sm"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Role *</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="e.g. Founder & CEO"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Company</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="e.g. Acme Corp"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Rating (1-5) *</label>
            <select
              className="input-field text-sm bg-slate-900 text-white"
              value={formData.rating}
              onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
            >
              <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
              <option value="3">⭐⭐⭐ (3 Stars)</option>
              <option value="2">⭐⭐ (2 Stars)</option>
              <option value="1">⭐ (1 Star)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Feedback / Message *</label>
          <textarea
            className="input-field text-sm h-32 resize-none"
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Avatar Image</label>
            {testimonial?.avatar_url && !avatarFile && (
              <div className="mb-2 text-xs text-slate-400">
                Current: <a href={testimonial.avatar_url} target="_blank" rel="noreferrer" className="text-primary-400 underline">View current</a>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
              onChange={e => setAvatarFile(e.target.files[0])}
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
            {loading ? 'Saving...' : 'Save Testimonial'}
          </button>
        </div>
      </form>
    </AdminModal>
  )
}
