import React, { useState, useEffect } from 'react'
import { createExperience, updateExperience } from '../../../api'
import AdminModal from './AdminModal'
import toast from 'react-hot-toast'

export default function ExperienceFormModal({ isOpen, onClose, experience, onSuccess }) {
  const [formData, setFormData] = useState({
    type: 'work',
    role: '',
    company: '',
    duration: '',
    location: '',
    description: '',
    achievements: '',
    order: 0,
    is_active: true
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (experience) {
      setFormData({
        type: experience.type || 'work',
        role: experience.role || '',
        company: experience.company || '',
        duration: experience.duration || '',
        location: experience.location || '',
        description: experience.description || '',
        achievements: Array.isArray(experience.achievements) ? experience.achievements.join('\n') : '',
        order: experience.order || 0,
        is_active: experience.is_active !== false
      })
    } else {
      setFormData({
        type: 'work',
        role: '',
        company: '',
        duration: '',
        location: '',
        description: '',
        achievements: '',
        order: 0,
        is_active: true
      })
    }
  }, [experience, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Parse achievements lines to array
    const achievementsArray = formData.achievements
      .split('\n')
      .map(a => a.trim())
      .filter(a => a.length > 0)

    const submissionData = {
      ...formData,
      achievements: achievementsArray
    }

    try {
      if (experience?.id) {
        await updateExperience(experience.id, submissionData)
        toast.success('Experience updated successfully')
      } else {
        await createExperience(submissionData)
        toast.success('Experience created successfully')
      }
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save experience')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={experience ? 'Edit Experience' : 'Add Experience'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Type *</label>
            <select
              className="input-field text-sm bg-slate-900 text-white"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="work">Work Experience</option>
              <option value="education">Education</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Role / Degree Title *</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="e.g. Senior Frontend Developer or B.Sc Computer Science"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Company / Institution *</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="e.g. Google or University of Madras"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Duration *</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="e.g. Jan 2023 - Present or 2019 - 2022"
              value={formData.duration}
              onChange={e => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="e.g. Remote or Chennai, India"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
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
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Short Description *</label>
          <textarea
            className="input-field text-sm h-24 resize-none"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Achievements / Key Takeaways (One per line)</label>
          <textarea
            className="input-field text-sm h-32 resize-none font-mono"
            placeholder="Developed a scalable dashboard application&#10;Optimized website performance by 40%&#10;Collaborated with design team"
            value={formData.achievements}
            onChange={e => setFormData({ ...formData, achievements: e.target.value })}
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
            {loading ? 'Saving...' : 'Save Experience'}
          </button>
        </div>
      </form>
    </AdminModal>
  )
}
