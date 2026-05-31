import React, { useState, useEffect } from 'react'
import { createBlog, updateBlog } from '../../../api'
import AdminModal from './AdminModal'
import toast from 'react-hot-toast'

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export default function BlogFormModal({ isOpen, onClose, blog, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'General',
    read_time: 5,
    tags: '',
    is_published: false
  })
  const [coverFile, setCoverFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        category: blog.category || 'General',
        read_time: blog.read_time ?? 5,
        tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
        is_published: !!blog.is_published
      })
      setCoverFile(null)
      setIsSlugManuallyEdited(true)
    } else {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'General',
        read_time: 5,
        tags: '',
        is_published: false
      })
      setCoverFile(null)
      setIsSlugManuallyEdited(false)
    }
  }, [blog, isOpen])

  const handleTitleChange = (e) => {
    const titleVal = e.target.value
    setFormData(prev => {
      const updated = { ...prev, title: titleVal }
      if (!isSlugManuallyEdited) {
        updated.slug = slugify(titleVal)
      }
      return updated
    })
  }

  const handleSlugChange = (e) => {
    setIsSlugManuallyEdited(true)
    setFormData({ ...formData, slug: slugify(e.target.value) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const data = new FormData()
    data.append('title', formData.title)
    data.append('slug', formData.slug)
    data.append('excerpt', formData.excerpt)
    data.append('content', formData.content)
    data.append('category', formData.category)
    data.append('read_time', formData.read_time)
    data.append('is_published', formData.is_published)

    // Parse tags to array of strings
    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
    data.append('tags', JSON.stringify(tagsArray))

    if (coverFile) {
      data.append('cover_image', coverFile)
    }

    try {
      if (blog?.id) {
        await updateBlog(blog.id, data)
        toast.success('Blog post updated successfully')
      } else {
        await createBlog(data)
        toast.success('Blog post created successfully')
      }
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join(', ') : 'Failed to save blog post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={blog ? 'Edit Blog Post' : 'New Blog Post'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Title *</label>
            <input
              type="text"
              className="input-field text-sm"
              value={formData.title}
              onChange={handleTitleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Slug *</label>
            <input
              type="text"
              className="input-field text-sm font-mono"
              placeholder="url-friendly-slug"
              value={formData.slug}
              onChange={handleSlugChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-1">Category *</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="e.g. Technology, React, Tutorial"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Read Time (minutes) *</label>
            <input
              type="number"
              className="input-field text-sm"
              value={formData.read_time}
              onChange={e => setFormData({ ...formData, read_time: parseInt(e.target.value) || 5 })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Excerpt / Summary *</label>
          <textarea
            className="input-field text-sm h-20 resize-none"
            placeholder="A short summary of the blog post to show in lists..."
            value={formData.excerpt}
            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Content (Markdown allowed) *</label>
          <textarea
            className="input-field text-sm h-64 font-mono"
            placeholder="Write your markdown post content here..."
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1 font-semibold">Cover Image</label>
            {blog?.cover_image_url && !coverFile && (
              <div className="mb-2 text-xs text-slate-400">
                Current: <a href={blog.cover_image_url} target="_blank" rel="noreferrer" className="text-primary-400 underline">View current</a>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
              onChange={e => setCoverFile(e.target.files[0])}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="webdev, javascript, tutorial"
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 text-sm text-slate-300 font-medium cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary-600 focus:ring-primary-500 focus:ring-offset-slate-900"
              checked={formData.is_published}
              onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
            />
            Publish immediately
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
            {loading ? 'Saving...' : 'Save Blog Post'}
          </button>
        </div>
      </form>
    </AdminModal>
  )
}
