import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, X, Filter } from 'lucide-react'
import { FaGithub as Github } from 'react-icons/fa'
import { fetchProjects, updateProject, deleteProject } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import TiltCard from './ui/TiltCard'

const CATEGORIES = [
  { key: 'all', label: 'All Projects' },
  { key: 'web', label: 'Web Dev' },
  { key: 'fullstack', label: 'Full Stack' },
  { key: 'backend', label: 'Backend' },
  { key: 'ui', label: 'UI/UX' },
]

const fallbackProjects = [
  { id: 1, title: 'Anaikar Infotech', description: 'IT solutions company website with modern design.', tech_tags: ['HTML', 'CSS', 'JavaScript'], category: 'web', live_url: 'https://anaikarinfotech-fuzail.netlify.app/', github_url: 'https://github.com/mohammedfuzaila/ANAIKAR-INFOTECH', is_featured: true },
  { id: 2, title: 'Take a Break — Tourism', description: 'Tourism website with destination discovery features.', tech_tags: ['Bootstrap', 'HTML', 'CSS'], category: 'web', live_url: 'https://bootstrap-fuzailproject.netlify.app/', github_url: 'https://github.com/mohammedfuzaila/BOOTSTRAP-PROJECT', is_featured: true },
  { id: 3, title: 'PartyPulse Events', description: 'Professional event management company website.', tech_tags: ['WordPress', 'CSS'], category: 'web', live_url: 'https://partypulse-fuzailwordpress.netlify.app/', github_url: '', is_featured: true },
  { id: 4, title: 'ModWalk Footwears', description: 'Responsive footwear showcase with smooth navigation.', tech_tags: ['HTML', 'CSS', 'JavaScript'], category: 'web', live_url: 'https://modwalkfootwears.netlify.app/', github_url: 'https://github.com/mohammedfuzaila/mold-walk-footwear', is_featured: false },
  { id: 5, title: 'Pernambut Times', description: 'Local news and community information portal.', tech_tags: ['HTML', 'CSS', 'JavaScript'], category: 'web', live_url: 'https://pernambuttimes57.netlify.app/', github_url: 'https://github.com/mohammedfuzaila/pbt-time-single-file', is_featured: false },
  { id: 6, title: 'Dreamy Delight', description: 'Cake shop ordering platform with visual appeal.', tech_tags: ['HTML', 'CSS', 'JavaScript'], category: 'web', live_url: 'https://dreamydelight.netlify.app/', github_url: 'https://github.com/mohammedfuzaila/DREAMY-DELIGHT', is_featured: false },
]

const gradients = [
  'from-purple-400 via-primary-400 to-accent-400',
  'from-rose-400 via-pink-400 to-fuchsia-400',
  'from-emerald-400 via-teal-400 to-cyan-400',
  'from-amber-400 via-orange-400 to-red-400',
  'from-indigo-400 via-blue-400 to-primary-400',
  'from-violet-400 via-purple-400 to-fuchsia-400',
]

function ProjectCard({ project, index, onClick }) {
  const gradient = gradients[index % gradients.length]

  return (
    <TiltCard>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
        className="glass-card rounded-2xl overflow-hidden cursor-pointer group shadow-card hover:shadow-card-hover transition-all duration-300 h-full backdrop-blur-none"
        onClick={() => onClick(project)}
      >
        {/* Project Image or Gradient placeholder */}
        <div className="relative h-48 overflow-hidden bg-slate-900">
          {project.image_url ? (
            <img 
              src={project.image_url} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <span className="font-display font-bold text-white text-2xl opacity-40 group-hover:opacity-60 transition-opacity">
                {project.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/10" />
          {project.is_featured && (
            <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
              ⭐ Featured
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-primary-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {(project.tech_tags || []).slice(0, 4).map((tag) => (
              <span key={tag} className="tech-badge text-xs">{tag}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </TiltCard>
  )
}

function ProjectModal({ project, onClose, isAdmin, onEdit }) {
  if (!project) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card max-w-2xl w-full rounded-3xl overflow-hidden shadow-glass-lg backdrop-blur-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-56 overflow-hidden bg-slate-950 relative">
          {project.image_url ? (
            <img 
              src={project.image_url} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
              <span className="font-display font-black text-white text-5xl opacity-30">
                {project.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/10" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <h2 className="font-display text-2xl font-bold text-white mb-2">{project.title}</h2>
          <p className="text-slate-300 mb-4 leading-relaxed">
            {project.long_description || project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {(project.tech_tags || []).map((tag) => (
              <span key={tag} className="tech-badge">{tag}</span>
            ))}
          </div>
          <div className="flex gap-3">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm px-6 py-3">
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm px-6 py-3">
                <Github className="w-4 h-4" /> Source Code
              </a>
            )}
            {isAdmin && (
              <div className="ml-auto flex items-center gap-2">
                <button onClick={() => onEdit(project)} className="text-sm px-4 py-2 rounded-xl bg-primary-600 text-white">Edit</button>
                <button onClick={() => { if (confirm('Delete this project?')) onEdit({ ...project, __delete: true }) }} className="text-sm px-4 py-2 rounded-xl bg-rose-600 text-white">Delete</button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProjectEditModal({ project, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: project.title || '',
    description: project.description || '',
    long_description: project.long_description || '',
    live_url: project.live_url || '',
    github_url: project.github_url || '',
    category: project.category || '',
    is_featured: project.is_featured || false,
    tech_tags: (project.tech_tags || []).join(', '),
  })

  const handleSave = (e) => {
    e.preventDefault()
    const values = {
      title: form.title,
      description: form.description,
      long_description: form.long_description,
      live_url: form.live_url,
      github_url: form.github_url,
      category: form.category,
      is_featured: form.is_featured,
      tech_tags: form.tech_tags.split(',').map((s) => s.trim()).filter(Boolean),
    }
    onSubmit(project.id, values)
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.form onSubmit={handleSave} className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Edit Project</h3>
          <button type="button" onClick={onClose} className="text-slate-400">Close</button>
        </div>

        <input className="w-full p-3 bg-slate-800 rounded-xl text-white" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" />
        <textarea className="w-full p-3 bg-slate-800 rounded-xl text-white" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" />
        <textarea className="w-full p-3 bg-slate-800 rounded-xl text-white" value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} placeholder="Long description" />
        <div className="grid grid-cols-2 gap-3">
          <input className="p-3 bg-slate-800 rounded-xl text-white" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} placeholder="Live URL" />
          <input className="p-3 bg-slate-800 rounded-xl text-white" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="GitHub URL" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className="p-3 bg-slate-800 rounded-xl text-white" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" />
          <input className="p-3 bg-slate-800 rounded-xl text-white" value={form.tech_tags} onChange={(e) => setForm({ ...form, tech_tags: e.target.value })} placeholder="Tech tags (comma separated)" />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
          <span className="text-sm text-slate-300">Featured</span>
        </label>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-700 text-white">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-xl bg-primary-600 text-white">Save</button>
        </div>
      </motion.form>
    </motion.div>
  )
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)
  const [editing, setEditing] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchProjects().then(({ data }) => {
      const items = data?.results || data
      if (Array.isArray(items)) setProjects(items)
    }).catch(() => { setProjects([]) })
  }, [])

  if (!projects || projects.length === 0) return null;

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  const isAdmin = false

  const handleDelete = async (id) => {
    try {
      await deleteProject(id)
      setProjects((p) => p.filter((x) => x.id !== id))
      toast.success('Project deleted')
    } catch (err) { toast.error('Delete failed') }
  }

  const handleUpdate = async (id, values) => {
    try {
      const fd = new FormData()
      Object.keys(values).forEach((k) => { if (values[k] !== undefined && values[k] !== null) fd.append(k, values[k]) })
      const { data } = await updateProject(id, fd)
      setProjects((list) => list.map((it) => it.id === id ? data : it))
      toast.success('Project updated')
      setEditing(null)
    } catch (err) { toast.error('Update failed') }
  }

  return (
    <section id="projects" className="section bg-transparent relative overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="tech-badge mb-4 inline-block">Portfolio</span>
          <h2 className="section-title">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            A showcase of my recent work and contributions
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat.key
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'glass-card text-slate-300 hover:text-primary-400'
              }`}
            >
              {cat.key === 'all' && <Filter className="w-3.5 h-3.5" />}
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} onClick={setSelectedProject} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            isAdmin={isAdmin}
            onEdit={(proj) => {
              // If __delete flag set, delete
              if (proj.__delete) { handleDelete(proj.id); setSelectedProject(null); return }
              setEditing(proj); setSelectedProject(null)
            }}
          />
        )}

        {editing && (
          <ProjectEditModal project={editing} onClose={() => setEditing(null)} onSubmit={handleUpdate} />
        )}
      </AnimatePresence>
    </section>
  )
}
