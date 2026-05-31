import React, { useState, useEffect } from 'react'
import { createCertificate, updateCertificate } from '../../../api'
import AdminModal from './AdminModal'
import toast from 'react-hot-toast'

export default function CertificateFormModal({ isOpen, onClose, certificate, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    verify_url: '',
    order: 0,
    is_active: true
  })
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (certificate) {
      setFormData({
        title: certificate.title || '',
        issuer: certificate.issuer || '',
        date: certificate.date || '',
        verify_url: certificate.verify_url || '',
        order: certificate.order || 0,
        is_active: certificate.is_active !== false
      })
      setImageFile(null)
    } else {
      setFormData({
        title: '',
        issuer: '',
        date: '',
        verify_url: '',
        order: 0,
        is_active: true
      })
      setImageFile(null)
    }
  }, [certificate, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const data = new FormData()
    data.append('title', formData.title)
    data.append('issuer', formData.issuer)
    data.append('date', formData.date)
    data.append('verify_url', formData.verify_url)
    data.append('order', formData.order)
    data.append('is_active', formData.is_active)

    if (imageFile) {
      data.append('image', imageFile)
    }

    try {
      if (certificate?.id) {
        await updateCertificate(certificate.id, data)
        toast.success('Certificate updated successfully')
      } else {
        await createCertificate(data)
        toast.success('Certificate created successfully')
      }
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save certificate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={certificate ? 'Edit Certificate' : 'Add Certificate'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Certificate Title *</label>
            <input
              type="text"
              className="input-field text-sm"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Issuer *</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="e.g. Coursera, AWS, Google"
              value={formData.issuer}
              onChange={e => setFormData({ ...formData, issuer: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Issue Date *</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="e.g. October 2024 or 2023"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Verification URL</label>
            <input
              type="url"
              className="input-field text-sm"
              placeholder="e.g. https://coursera.org/verify/..."
              value={formData.verify_url}
              onChange={e => setFormData({ ...formData, verify_url: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Certificate Image / PDF Thumbnail</label>
            {certificate?.image_url && !imageFile && (
              <div className="mb-2 text-xs text-slate-400">
                Current: <a href={certificate.image_url} target="_blank" rel="noreferrer" className="text-primary-400 underline">View current</a>
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
            {loading ? 'Saving...' : 'Save Certificate'}
          </button>
        </div>
      </form>
    </AdminModal>
  )
}
