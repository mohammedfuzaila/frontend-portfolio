import React, { useState, useEffect } from 'react'
import {
  fetchSettings, updateSiteSettings,
  fetchHero, updateHero,
  fetchAbout, updateAbout,
  fetchSeo, updateSeo,
  fetchServices, deleteService
} from '../../../api'
import ServiceFormModal from './ServiceFormModal'
import { ToggleLeft, ToggleRight, PlusCircle, Edit3, Trash2, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState('toggles')

  // 1. Site Toggles state
  const [siteSettings, setSiteSettings] = useState({
    show_hero: true, show_about: true, show_skills: true, show_projects: true,
    show_experience: true, show_services: true, show_certificates: true,
    show_testimonials: true, show_blog: true, show_contact: true, maintenance_mode: false,
  })

  // 2. Hero Section state
  const [heroForm, setHeroForm] = useState({
    name: '', tagline: '', subtitle: '',
    cta_primary_text: 'View Projects', cta_secondary_text: 'Download Resume',
    show_open_to_work: true, is_active: true
  })
  const [heroImage, setHeroImage] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [currentHeroImg, setCurrentHeroImg] = useState('')
  const [currentResumeUrl, setCurrentResumeUrl] = useState('')

  // 3. About Section state
  const [aboutForm, setAboutForm] = useState({
    bio_1: '', bio_2: '', bio_3: '',
    projects_count: 15, clients_count: 10, years_experience: 2, satisfaction_rate: 99,
    is_active: true
  })
  const [aboutImage, setAboutImage] = useState(null)
  const [currentAboutImg, setCurrentAboutImg] = useState('')

  // 4. Services state
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)

  // 5. SEO Settings state
  const [seoForm, setSeoForm] = useState({
    meta_title: '', meta_description: '', keywords: ''
  })
  const [seoImage, setSeoImage] = useState(null)
  const [currentSeoImg, setCurrentSeoImg] = useState('')

  const [loading, setLoading] = useState(false)

  const loadServices = () => {
    fetchServices().then(({ data }) => setServices(data?.results || data || [])).catch(() => {})
  }

  // Load appropriate data based on active tab
  useEffect(() => {
    if (activeTab === 'toggles') {
      fetchSettings().then(({ data }) => { if (data && Object.keys(data).length > 0) setSiteSettings(data) }).catch(() => {})
    } else if (activeTab === 'hero') {
      fetchHero().then(({ data }) => {
        if (data) {
          setHeroForm({
            name: data.name || '',
            tagline: data.tagline || '',
            subtitle: data.subtitle || '',
            cta_primary_text: data.cta_primary_text || 'View Projects',
            cta_secondary_text: data.cta_secondary_text || 'Download Resume',
            show_open_to_work: data.show_open_to_work !== false,
            is_active: data.is_active !== false
          })
          setCurrentHeroImg(data.profile_image_url || '')
          setCurrentResumeUrl(data.resume_file_url || '')
        }
      }).catch(() => {})
    } else if (activeTab === 'about') {
      fetchAbout().then(({ data }) => {
        if (data) {
          setAboutForm({
            bio_1: data.bio_1 || '',
            bio_2: data.bio_2 || '',
            bio_3: data.bio_3 || '',
            projects_count: data.projects_count ?? 15,
            clients_count: data.clients_count ?? 10,
            years_experience: data.years_experience ?? 2,
            satisfaction_rate: data.satisfaction_rate ?? 99,
            show_open_to_work: data.show_open_to_work !== false,
            is_active: data.is_active !== false
          })
          setCurrentAboutImg(data.profile_image_url || '')
        }
      }).catch(() => {})
    } else if (activeTab === 'services') {
      loadServices()
    } else if (activeTab === 'seo') {
      fetchSeo().then(({ data }) => {
        if (data) {
          setSeoForm({
            meta_title: data.meta_title || '',
            meta_description: data.meta_description || '',
            keywords: data.keywords || ''
          })
          setCurrentSeoImg(data.og_image_url || '')
        }
      }).catch(() => {})
    }
  }, [activeTab])


  // Toggles Toggle Function
  const toggleSetting = async (key) => {
    const newVal = !siteSettings[key]
    const updated = { ...siteSettings, [key]: newVal }
    setSiteSettings(updated)
    try {
      await updateSiteSettings({ [key]: newVal })
      toast.success('Setting updated')
    } catch {
      toast.error('Failed to update setting')
      setSiteSettings(siteSettings)
    }
  }

  // Save Hero Section
  const handleHeroSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = new FormData()
    Object.entries(heroForm).forEach(([k, v]) => {
      // Explicitly convert booleans so FormData sends 'true'/'false' strings
      data.append(k, typeof v === 'boolean' ? String(v) : v)
    })
    if (heroImage) data.append('profile_image', heroImage)
    if (resumeFile) data.append('resume_file', resumeFile)

    try {
      const res = await updateHero(data)
      toast.success('Hero section updated')
      if (res.data?.profile_image_url) setCurrentHeroImg(res.data.profile_image_url)
      if (res.data?.resume_file_url) setCurrentResumeUrl(res.data.resume_file_url)
    } catch {
      toast.error('Failed to save Hero details')
    } finally {
      setLoading(false)
    }
  }

  // Save About Section
  const handleAboutSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = new FormData()
    Object.entries(aboutForm).forEach(([k, v]) => {
      // Explicitly convert booleans so FormData sends 'true'/'false' strings
      data.append(k, typeof v === 'boolean' ? String(v) : v)
    })
    if (aboutImage) data.append('profile_image', aboutImage)

    try {
      const res = await updateAbout(data)
      toast.success('About section updated')
      if (res.data?.profile_image_url) setCurrentAboutImg(res.data.profile_image_url)
    } catch {
      toast.error('Failed to save About details')
    } finally {
      setLoading(false)
    }
  }

  // Save SEO Settings
  const handleSeoSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = new FormData()
    Object.entries(seoForm).forEach(([k, v]) => data.append(k, v))
    if (seoImage) data.append('og_image', seoImage)

    try {
      const res = await updateSeo(data)
      toast.success('SEO settings updated')
      if (res.data?.og_image_url) setCurrentSeoImg(res.data.og_image_url)
    } catch {
      toast.error('Failed to save SEO settings')
    } finally {
      setLoading(false)
    }
  }

  // Service CRUD handlers
  const handleServiceDelete = async (id) => {
    if (!confirm('Delete this service?')) return
    try {
      await deleteService(id)
      toast.success('Service deleted')
      loadServices()
    } catch {
      toast.error('Failed to delete service')
    }
  }

  return (
    <div className="space-y-6">
      {/* Sub-tabs header */}
      <div 
        className="flex border-b border-slate-800 overflow-x-auto gap-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {[
          { key: 'toggles', label: 'Site Toggles' },
          { key: 'hero', label: 'Hero Section' },
          { key: 'about', label: 'About Section' },
          { key: 'services', label: 'Services' },
          { key: 'seo', label: 'SEO Settings' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-3 px-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-primary-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Site Toggles ─── */}
      {activeTab === 'toggles' && (
        <div className="admin-card space-y-4">
          <h3 className="text-white font-bold text-lg mb-4">Display Toggles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(siteSettings).map(([key, val]) => {
              if (key === 'id' || key === 'updated_at') return null
              const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
              return (
                <div key={key} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <span className="text-slate-300 text-sm font-medium">{label}</span>
                  <button
                    onClick={() => toggleSetting(key)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${val ? 'text-green-400' : 'text-slate-500'}`}
                  >
                    {val ? <ToggleRight className="w-6 h-6 flex-shrink-0" /> : <ToggleLeft className="w-6 h-6 flex-shrink-0" />}
                    <span className="text-xs font-semibold">{val ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── Hero Section Form ─── */}
      {activeTab === 'hero' && (
        <form onSubmit={handleHeroSubmit} className="admin-card space-y-4">
          <h3 className="text-white font-bold text-lg mb-4">Edit Hero Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                className="input-field text-sm"
                value={heroForm.name}
                onChange={e => setHeroForm({ ...heroForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Tagline</label>
              <input
                type="text"
                className="input-field text-sm"
                value={heroForm.tagline}
                onChange={e => setHeroForm({ ...heroForm, tagline: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Hero Subtitle</label>
            <textarea
              className="input-field text-sm h-24 resize-none"
              value={heroForm.subtitle}
              onChange={e => setHeroForm({ ...heroForm, subtitle: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Resume (PDF)</label>
              {currentResumeUrl && (
                <div className="mb-2 text-xs text-slate-400">
                  Current resume uploaded. <a href={currentResumeUrl} target="_blank" rel="noreferrer" className="text-primary-400 underline">View PDF</a>
                </div>
              )}
              <input
                type="file"
                accept=".pdf"
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
                onChange={e => setResumeFile(e.target.files[0])}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Profile Image</label>
              {currentHeroImg && (
                <div className="mb-2 text-xs text-slate-400">
                  Current image exists. <a href={currentHeroImg} target="_blank" rel="noreferrer" className="text-primary-400 underline">View image</a>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
                onChange={e => setHeroImage(e.target.files[0])}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Primary CTA Text</label>
              <input
                type="text"
                className="input-field text-sm"
                value={heroForm.cta_primary_text}
                onChange={e => setHeroForm({ ...heroForm, cta_primary_text: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Secondary CTA Text</label>
              <input
                type="text"
                className="input-field text-sm"
                value={heroForm.cta_secondary_text}
                onChange={e => setHeroForm({ ...heroForm, cta_secondary_text: e.target.value })}
              />
            </div>
          </div>

          {/* Open to Work Toggle — saves instantly */}
          <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 flex items-center justify-between gap-4">
            <div>
              <p className="text-white font-semibold text-sm">"Open to Work" Badge</p>
              <p className="text-slate-400 text-xs mt-0.5">Show the glowing green badge on the Hero section</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                const newVal = !heroForm.show_open_to_work
                setHeroForm(f => ({ ...f, show_open_to_work: newVal }))
                try {
                  const fd = new FormData()
                  fd.append('show_open_to_work', String(newVal))
                  await updateHero(fd)
                  toast.success(newVal ? 'Badge shown on Hero' : 'Badge hidden on Hero')
                } catch {
                  setHeroForm(f => ({ ...f, show_open_to_work: !newVal }))
                  toast.error('Failed to update badge visibility')
                }
              }}
              className={`flex items-center gap-1.5 text-sm transition-colors flex-shrink-0 ${heroForm.show_open_to_work ? 'text-green-400' : 'text-slate-500'}`}
            >
              {heroForm.show_open_to_work ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
              <span className="text-xs font-bold">{heroForm.show_open_to_work ? 'SHOW' : 'HIDDEN'}</span>
            </button>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary-600 focus:ring-primary-500 focus:ring-offset-slate-900"
                checked={heroForm.is_active}
                onChange={e => setHeroForm({ ...heroForm, is_active: e.target.checked })}
              />
              Section Active
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Hero Details'}
            </button>
          </div>
        </form>
      )}

      {/* ─── About Section Form ─── */}
      {activeTab === 'about' && (
        <form onSubmit={handleAboutSubmit} className="admin-card space-y-4">
          <h3 className="text-white font-bold text-lg mb-4">Edit About Section</h3>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Bio Paragraph 1 *</label>
            <textarea
              className="input-field text-sm h-24 resize-none"
              value={aboutForm.bio_1}
              onChange={e => setAboutForm({ ...aboutForm, bio_1: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Bio Paragraph 2</label>
            <textarea
              className="input-field text-sm h-24 resize-none"
              value={aboutForm.bio_2}
              onChange={e => setAboutForm({ ...aboutForm, bio_2: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Bio Paragraph 3</label>
            <textarea
              className="input-field text-sm h-24 resize-none"
              value={aboutForm.bio_3}
              onChange={e => setAboutForm({ ...aboutForm, bio_3: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Projects Count</label>
              <input
                type="number"
                className="input-field text-sm"
                value={aboutForm.projects_count}
                onChange={e => setAboutForm({ ...aboutForm, projects_count: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Clients Count</label>
              <input
                type="number"
                className="input-field text-sm"
                value={aboutForm.clients_count}
                onChange={e => setAboutForm({ ...aboutForm, clients_count: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Experience Years</label>
              <input
                type="number"
                className="input-field text-sm"
                value={aboutForm.years_experience}
                onChange={e => setAboutForm({ ...aboutForm, years_experience: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Satisfaction %</label>
              <input
                type="number"
                className="input-field text-sm"
                value={aboutForm.satisfaction_rate}
                onChange={e => setAboutForm({ ...aboutForm, satisfaction_rate: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Profile Image</label>
            {currentAboutImg && (
              <div className="text-xs text-slate-400 mb-2">
                Current image: <a href={currentAboutImg} target="_blank" rel="noreferrer" className="text-primary-400 underline">View image</a>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="input-field text-sm"
              onChange={e => setAboutImage(e.target.files[0])}
            />
          </div>

          {/* Open to Work Toggle — saves instantly */}
          <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 flex items-center justify-between gap-4">
            <div>
              <p className="text-white font-semibold text-sm">"Open to Work" Badge</p>
              <p className="text-slate-400 text-xs mt-0.5">Show the floating green badge on the About section card</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                const newVal = !aboutForm.show_open_to_work
                setAboutForm(f => ({ ...f, show_open_to_work: newVal }))
                try {
                  const fd = new FormData()
                  fd.append('show_open_to_work', String(newVal))
                  await updateAbout(fd)
                  toast.success(newVal ? 'Badge shown on About' : 'Badge hidden on About')
                } catch {
                  setAboutForm(f => ({ ...f, show_open_to_work: !newVal }))
                  toast.error('Failed to update badge visibility')
                }
              }}
              className={`flex items-center gap-1.5 text-sm transition-colors flex-shrink-0 ${aboutForm.show_open_to_work ? 'text-green-400' : 'text-slate-500'}`}
            >
              {aboutForm.show_open_to_work ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
              <span className="text-xs font-bold">{aboutForm.show_open_to_work ? 'SHOW' : 'HIDDEN'}</span>
            </button>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary-600 focus:ring-primary-500 focus:ring-offset-slate-900"
                checked={aboutForm.is_active}
                onChange={e => setAboutForm({ ...aboutForm, is_active: e.target.checked })}
              />
              Section Active
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save About Details'}
            </button>
          </div>
        </form>
      )}

      {/* ─── Services CRUD ─── */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-white font-bold text-lg">Manage Services</h3>
            <button
              onClick={() => { setSelectedService(null); setIsServiceModalOpen(true) }}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Add Service
            </button>
          </div>
          <div className="admin-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4 hidden md:table-cell">Icon</th>
                  <th className="text-left py-3 px-4 hidden lg:table-cell">Order</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {services.map(s => (
                  <tr key={s.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{s.title}</div>
                      <div className="text-slate-400 text-xs line-clamp-1">{s.description}</div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-slate-300 font-mono">{s.icon}</td>
                    <td className="py-3 px-4 hidden lg:table-cell text-slate-400">{s.order}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => { setSelectedService(s); setIsServiceModalOpen(true) }}
                          className="text-slate-400 hover:text-primary-400 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleServiceDelete(s.id)}
                          className="text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {services.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No services found.</p>}
          </div>

          <ServiceFormModal
            isOpen={isServiceModalOpen}
            onClose={() => setIsServiceModalOpen(false)}
            service={selectedService}
            onSuccess={loadServices}
          />
        </div>
      )}

      {/* ─── SEO Settings Form ─── */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSeoSubmit} className="admin-card space-y-4">
          <h3 className="text-white font-bold text-lg mb-4">Edit SEO Metadata</h3>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Meta Title</label>
            <input
              type="text"
              className="input-field text-sm"
              value={seoForm.meta_title}
              onChange={e => setSeoForm({ ...seoForm, meta_title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Meta Description</label>
            <textarea
              className="input-field text-sm h-24 resize-none"
              value={seoForm.meta_description}
              onChange={e => setSeoForm({ ...seoForm, meta_description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">SEO Keywords (comma separated)</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="portfolio, fullstack, python, react"
              value={seoForm.keywords}
              onChange={e => setSeoForm({ ...seoForm, keywords: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1 font-semibold">OG (Open Graph) Share Image</label>
            {currentSeoImg && (
              <div className="mb-2 text-xs text-slate-400">
                Current OG Image: <a href={currentSeoImg} target="_blank" rel="noreferrer" className="text-primary-400 underline">View current</a>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
              onChange={e => setSeoImage(e.target.files[0])}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save SEO settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
