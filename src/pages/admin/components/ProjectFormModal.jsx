import React, { useState, useEffect } from 'react'
import { createProject, updateProject } from '../../../api'
import AdminModal from './AdminModal'
import toast from 'react-hot-toast'

export default function ProjectFormModal({ isOpen, onClose, project, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    long_description: '',
    live_url: '',
    github_url: '',
    tech_tags: '',
    category: 'web',
    is_featured: false,
    order: 0,
    is_active: true
  })
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        long_description: project.long_description || '',
        live_url: project.live_url || '',
        github_url: project.github_url || '',
        tech_tags: Array.isArray(project.tech_tags) ? project.tech_tags.join(', ') : '',
        category: project.category || 'web',
        is_featured: !!project.is_featured,
        order: project.order || 0,
        is_active: project.is_active !== false
      })
      setImageFile(null)
    } else {
      setFormData({
        title: '',
        description: '',
        long_description: '',
        live_url: '',
        github_url: '',
        tech_tags: '',
        category: 'web',
        is_featured: false,
        order: 0,
        is_active: true
      })
      setImageFile(null)
    }
  }, [project, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('long_description', formData.long_description)
    data.append('live_url', formData.live_url)
    data.append('github_url', formData.github_url)
    
    // Parse tags to array of strings
    const tagsArray = formData.tech_tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
    data.append('tech_tags', JSON.stringify(tagsArray))
    
    data.append('category', formData.category)
    data.append('is_featured', formData.is_featured)
    data.append('order', formData.order)
    data.append('is_active', formData.is_active)

    if (imageFile) {
      data.append('image', imageFile)
    }

    try {
      if (project?.id) {
        await updateProject(project.id, data)
        toast.success('Project updated successfully')
      } else {
        await createProject(data)
        toast.success('Project created successfully')
      }
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data ? Object.values(err.response.data).join(', ') : 'Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={project ? 'Edit Project' : 'Add Project'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Project Title *</label>
            <input
              type="text"
              className="input-field text-sm"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
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
              <option value="web">Web Development</option>
              <option value="mobile">Mobile App</option>
              <option value="fullstack">Full Stack</option>
              <option value="backend">Backend</option>
              <option value="ui">UI/UX</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Short Description *</label>
          <input
            type="text"
            className="input-field text-sm"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Long Description (Markdown allowed)</label>
          <textarea
            className="input-field text-sm h-32 resize-none"
            value={formData.long_description}
            onChange={e => setFormData({ ...formData, long_description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Live URL</label>
            <input
              type="url"
              className="input-field text-sm"
              value={formData.live_url}
              onChange={e => setFormData({ ...formData, live_url: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">GitHub URL</label>
            <input
              type="url"
              className="input-field text-sm"
              value={formData.github_url}
              onChange={e => setFormData({ ...formData, github_url: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Tech Tags (comma separated)</label>
          <input
            type="text"
            className="input-field text-sm"
            placeholder="React, Tailwind, Node.js"
            value={formData.tech_tags}
            onChange={e => setFormData({ ...formData, tech_tags: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Project Image</label>
            {project?.image_url && !imageFile && (
              <div className="mb-2 text-xs text-slate-400">
                Current Image: <a href={project.image_url} target="_blank" rel="noreferrer" className="text-primary-400 underline">View current</a>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
              onChange={e => setImageFile(e.target.files[0])}
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

        <div className="flex gap-6 items-center pt-2">
          <label className="flex items-center gap-2 text-sm text-slate-300 font-medium cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary-600 focus:ring-primary-500 focus:ring-offset-slate-900"
              checked={formData.is_featured}
              onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
            />
            Featured Project
          </label>

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
            {loading ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </AdminModal>
  )
}
