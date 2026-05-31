import React, { useState, useEffect } from 'react'
import { createSkill, updateSkill } from '../../../api'
import AdminModal from './AdminModal'
import toast from 'react-hot-toast'

export default function SkillFormModal({ isOpen, onClose, skill, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend',
    icon: '',
    level: 80,
    color: '#6C63FF',
    order: 0,
    is_active: true
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || '',
        category: skill.category || 'frontend',
        icon: skill.icon || '',
        level: skill.level ?? 80,
        color: skill.color || '#6C63FF',
        order: skill.order || 0,
        is_active: skill.is_active !== false
      })
    } else {
      setFormData({
        name: '',
        category: 'frontend',
        icon: '',
        level: 80,
        color: '#6C63FF',
        order: 0,
        is_active: true
      })
    }
  }, [skill, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (skill?.id) {
        await updateSkill(skill.id, formData)
        toast.success('Skill updated successfully')
      } else {
        await createSkill(formData)
        toast.success('Skill created successfully')
      }
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save skill')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={skill ? 'Edit Skill' : 'Add Skill'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Skill Name *</label>
            <input
              type="text"
              className="input-field text-sm"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Category *</label>
            <select
              className="input-field text-sm bg-slate-900 text-white"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Database</option>
              <option value="devops">DevOps</option>
              <option value="tools">Tools</option>
              <option value="uiux">UI/UX</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Icon (CSS class / URL / Lucide Icon Name)</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="e.g. FaReact or react"
              value={formData.icon}
              onChange={e => setFormData({ ...formData, icon: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Skill Color (Hex)</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                className="w-10 h-10 border-0 bg-transparent rounded-lg cursor-pointer"
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
              />
              <input
                type="text"
                className="input-field text-sm flex-1"
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-slate-400">Level (0-100) *</label>
              <span className="text-white text-sm font-semibold">{formData.level}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full accent-primary-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
              value={formData.level}
              onChange={e => setFormData({ ...formData, level: parseInt(e.target.value) || 0 })}
              required
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
            {loading ? 'Saving...' : 'Save Skill'}
          </button>
        </div>
      </form>
    </AdminModal>
  )
}
